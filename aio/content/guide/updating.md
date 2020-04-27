{@a keeping-your-angular-projects-up-to-date}
# Поддержание ваших Angular проектов в актуальном состоянии

Angular, как и Интернет, и вся веб-экосистема, постоянно совершенствуется. Angular балансировка непрерывного улучшения с упором на стабильность и упрощение обновлений. Поддержание актуальности вашего приложения Angular позволяет использовать новейшие функции, а также оптимизации и исправления ошибок.

Этот документ содержит информацию и ресурсы, которые помогут вам поддерживать актуальность ваших приложений и библиотек Angular.

Для получения информации о нашей политике и практиках управления версиями, в том числе
методы поддержки и устаревания, а также расписание выпуска - см. [Версионное управление версиями и выпуски](guide/releases "Angular versioning and releases"),


<div class="alert is-helpful">

Если вы в настоящее время используете AngularJS, см. [Обновление с AngularJS](guide/upgrade "Upgrading from Angular JS"). _AngularJS_ - имя для всех v 1.x версий Angular.

</div>


{@a announce}
{@a getting-notified-of-new-releases}
## Получение уведомлений о новых выпусках

Чтобы получать уведомления о появлении новых выпусков, за [следите @angular](https://twitter.com/angular "@angular on Twitter") в Twitter или подписывайтесь на [Angular блог](https://blog.angular.io "Angular blog").

{@a learn}
{@a learning-about-new-features}
## Узнав о новых возможностях

Какие новости? Что изменилось? Мы делимся самыми важными вещами, которые вы должны знать в блоге Angular [объявления о выпуске]( https://blog.angular.io/tagged/release%20notes "Angular blog - release announcements").

Чтобы просмотреть полный список изменений, упорядоченных по версии, см. [Angular журнал изменений](https://github.com/angular/angular/blob/master/CHANGELOG.md "Angular change log").


{@a checking-version-app}
{@a checking-your-version-of-angular}
## Проверка вашей версии Angular

Чтобы проверить версию Angular для вашего приложения: в каталоге вашего проекта используйте `ng version` команды.


{@a checking-version-angular}
{@a finding-the-current-version-of-angular}
## Нахождение текущей версии Angular

Самая последняя стабильная версия Angular представлена ​​в [Angular документации](https://angular.io/docs "Angular documentation") в нижней части левой боковой панели. Например, `stable (v5.2.9)`.

Вы также можете найти самую версию Angular с помощью команды CLI [последнюю `ng update` ](cli/update). По умолчанию [ `ng update` ](cli/update)(без дополнительных аргументов) перечисляет доступные вам обновления.


{@a updating}
{@a updating-your-environment-and-apps}
## Обновление вашей среды и приложений

Чтобы упростить обновление, мы предоставляем полные инструкции в интерактивном [руководстве Angular Update Guide](https://update.angular.io/ "Angular Update Guide").

Angular руководство по обновлению содержит настраиваемые инструкции по обновлению на основе текущей и целевой версий, которые вы укажете. Он включает базовые и расширенные пути обновления, соответствующие сложности ваших приложений. Он также включает информацию об устранении неполадок и любые рекомендуемые изменения вручную, чтобы помочь вам получить максимальную отдачу от новой версии.

Для простых обновлений это команда CLI [ `ng update` ](cli/update)все, что вам нужно - . Без дополнительных аргументов [ `ng update` ](cli/update)перечисляет доступные вам обновления и предлагает рекомендуемые шаги для обновления вашего приложения до самой последней версии.

[Angular управление версиями и релизы](guide/releases#versioning "Angular Release Practices, Versioning") описывает уровень изменений, который вы можете ожидать на основе номера версии выпуска. Также описаны поддерживаемые пути обновления.


{@a resources}
{@a resource-summary}
## Резюме ресурса

* Анонсы релизов: [Angular blog - анонсы релизов](https://blog.angular.io/tagged/release%20notes "Angular blog announcements about recent releases")

* Объявления о выпуске (более старые): [Angular блог - объявления о выпусках до августа 2017 года](https://blog.angularjs.org/search?q=available&by-date=true "Angular blog announcements about releases prior to August 2017")

* Детали выпуска: [Angular журнал изменений](https://github.com/angular/angular/blob/master/CHANGELOG.md "Angular change log")

* Инструкция по обновлению: [Angular Update Guide](https://update.angular.io/ "Angular Update Guide")

* Обновить ссылку на команду: [Angular CLI `ng update` ссылка на команду](cli/update)

* Методы, поддержкой и устареванием [управления версиями, выпусками Angular управление версиями и выпуски](guide/releases "Angular versioning and releases")
