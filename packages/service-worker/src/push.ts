/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable} from '@angular/core';
import {merge, NEVER, Observable, Subject} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';

import {ERR_SW_NOT_SUPPORTED, NgswCommChannel, PushEvent} from './low_level';


/**
 * Подпишись и послушай
 *  [Веб-толчок.Уведомления](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices)через
 * Angular Сервисный работник.
 *
 *  @usageNotes
 *
 * Вы можете внедрить `SwPush` экземплярв любой компонент или сервис
 * как зависимость.
 *
 *  <code-example path="service-worker/push/module.ts" region="inject-sw-push"
 *  header="app.component.ts"></code-example>
 *
 * Чтобы подписаться, вызовите `SwPush.requestSubscription()` , которая запрашивает у пользователя разрешение.
 * Вызов возвращает `Promise` с новым
 *  [ `PushSubscription` ](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)
 * пример.
 *
 *  <code-example path="service-worker/push/module.ts" region="subscribe-to-push"
 *  header="app.component.ts"></code-example>
 *
 * Запрос отклоняется, если пользователь отказывает в разрешении или если браузер
 * блокирует или не поддерживает Push API или ServiceWorkers.
 * Проверьте `SwPush.isEnabled` для подтверждения статуса.
 *
 * Вызовите push-уведомления, отправив сообщение со следующей полезной нагрузкой.
 *
 *  ```ts
 *  {
 *    "notification": {
 *      "actions": NotificationAction[],
 *      "badge": USVString
 *      "body": DOMString,
 *      "data": any,
 *      "dir": "auto"|"ltr"|"rtl",
 *      "icon": USVString,
 *      "image": USVString,
 *      "lang": DOMString,
 *      "renotify": boolean,
 *      "requireInteraction": boolean,
 *      "silent": boolean,
 *      "tag": DOMString,
 *      "timestamp": DOMTimeStamp,
 *      "title": DOMString,
 *      "vibrate": number[]
 *    }
 *  }
 *  ```
 *
 * только `title` . Смотрите `Notification`
 *  [экземпляр.свойства](https://developer.mozilla.org/en-US/docs/Web/API/Notification#Instance_properties).
 *
 * Пока подписка активна, Service Worker прослушивает
 *  [PushEvent](https://developer.mozilla.org/en-US/docs/Web/API/PushEvent)
 * вхождения и творит
 *  [Уведомление](https://developer.mozilla.org/en-US/docs/Web/API/Notification)
 * экземпляры в ответ.
 *
 * подписку с помощью `SwPush.unsubscribe()``SwPush.unsubscribe()`.
 *
 * Приложение может подписаться на `SwPush.notificationClicks` наблюдать, когда пользователь получает уведомление
 * нажимает на уведомление.Например:.
 *
 *  <code-example path="service-worker/push/module.ts" region="subscribe-to-notification-clicks"
 *  header="app.component.ts"></code-example>
 *
 *  @see [Push-уведомления](https://developers.google.com/web/fundamentals/codelabs/push-notifications/)
 *  @see [(Angular Pushуведомление).](https://blog.angular-university.io/angular-push-notifications/)
 *  @see [MDN: Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
 *  @see [MDN: API уведомлений](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
 *  @see [MDN: лучшие практики Web Push API Notification](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices)
 *
 * @publicApi
 */
@Injectable()
export class SwPush {
  /**
   * Emits the payloads of the received push notification messages.
   */
  readonly messages: Observable<object>;

  /**
   * Emits the payloads of the received push notification messages as well as the action the user
   * interacted with. If no action was used the `action` property contains an empty string `''`.
   *
   * Note that the `notification` property does **not** contain a
   * [Notification][Mozilla Notification] object but rather a
   * [NotificationOptions](https://notifications.spec.whatwg.org/#dictdef-notificationoptions)
   * object that also includes the `title` of the [Notification][Mozilla Notification] object.
   *
   * [Mozilla Notification]: https://developer.mozilla.org/en-US/docs/Web/API/Notification
   */
  readonly notificationClicks: Observable<{
    action: string; notification: NotificationOptions &
        {
          title: string
        }
  }>;

  /**
   * Emits the currently active
   * [PushSubscription](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)
   * associated to the Service Worker registration or `null` if there is no subscription.
   */
  readonly subscription: Observable<PushSubscription|null>;

  /**
   * True if the Service Worker is enabled (supported by the browser and enabled via
   * `ServiceWorkerModule`).
   */
  get isEnabled(): boolean {
    return this.sw.isEnabled;
  }

  // TODO(issue/24571): remove '!'.
  private pushManager!: Observable<PushManager>;
  private subscriptionChanges = new Subject<PushSubscription|null>();

  constructor(private sw: NgswCommChannel) {
    if (!sw.isEnabled) {
      this.messages = NEVER;
      this.notificationClicks = NEVER;
      this.subscription = NEVER;
      return;
    }

    this.messages = this.sw.eventsOfType<PushEvent>('PUSH').pipe(map(message => message.data));

    this.notificationClicks =
        this.sw.eventsOfType('NOTIFICATION_CLICK').pipe(map((message: any) => message.data));

    this.pushManager = this.sw.registration.pipe(map(registration => registration.pushManager));

    const workerDrivenSubscriptions = this.pushManager.pipe(switchMap(pm => pm.getSubscription()));
    this.subscription = merge(workerDrivenSubscriptions, this.subscriptionChanges);
  }

  /**
   * Subscribes to Web Push Notifications,
   * after requesting and receiving user permission.
   *
   * @param options An object containing the `serverPublicKey` string.
   * @returns A Promise that resolves to the new subscription object.
   */
  requestSubscription(options: {serverPublicKey: string}): Promise<PushSubscription> {
    if (!this.sw.isEnabled) {
      return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
    }
    const pushOptions: PushSubscriptionOptionsInit = {userVisibleOnly: true};
    let key = this.decodeBase64(options.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+'));
    let applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
    for (let i = 0; i < key.length; i++) {
      applicationServerKey[i] = key.charCodeAt(i);
    }
    pushOptions.applicationServerKey = applicationServerKey;

    return this.pushManager.pipe(switchMap(pm => pm.subscribe(pushOptions)), take(1))
        .toPromise()
        .then(sub => {
          this.subscriptionChanges.next(sub);
          return sub;
        });
  }

  /**
   * Unsubscribes from Service Worker push notifications.
   *
   * @returns A Promise that is resolved when the operation succeeds, or is rejected if there is no
   *          active subscription or the unsubscribe operation fails.
   */
  unsubscribe(): Promise<void> {
    if (!this.sw.isEnabled) {
      return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
    }

    const doUnsubscribe = (sub: PushSubscription|null) => {
      if (sub === null) {
        throw new Error('Not subscribed to push notifications.');
      }

      return sub.unsubscribe().then(success => {
        if (!success) {
          throw new Error('Unsubscribe failed!');
        }

        this.subscriptionChanges.next(null);
      });
    };

    return this.subscription.pipe(take(1), switchMap(doUnsubscribe)).toPromise();
  }

  private decodeBase64(input: string): string {
    return atob(input);
  }
}
