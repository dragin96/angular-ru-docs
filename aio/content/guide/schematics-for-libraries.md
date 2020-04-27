{@a schematics-for-libraries}
# Схемы для библиотек

Когда вы создаете библиотеку Angular, вы можете предоставить и упаковать ее со схемами, которые интегрируют ее с Angular CLI.
С вашими схемами ваши пользователи могут использовать `ng add` для установки начальной версии вашей библиотеки
 `ng generate` для создания артефактов, определенных в вашей библиотеке, и `ng update` чтобы приспособить их проект для новой версии вашей библиотеки, которая вносит критические изменения.

Все три типа схем могут быть частью коллекции, которую вы упаковываете в свою библиотеку.

Загрузите <live-example downloadOnly>проект схемы библиотеки </live-example>для законченного примера шагов ниже.

{@a creating-a-schematics-collection}
## Создание коллекции схем

Чтобы начать сбор, вам нужно создать файлы схемы.
Следующие шаги показывают, как добавить начальную поддержку без изменения каких-либо файлов проекта.

1. В корневой папке вашей библиотеки создайте `schematics/` папка.

1. в `schematics/` папку, создайте `ng-add/` Папка для вашей первой схемы.

1. На корневом уровне `schematics/` папку, создайте `collection.json` файл.

1. Изменить `collection.json` файл чтобы определить начальную схему для вашей коллекции.

<code-example header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="schematics-for-libraries/projects/my-lib/schematics/collection.1.json">
</code-example>

  * `$schema` Путь к относится к схеме коллекции Angular Devkit.
  * `schematics` объект описывает именованные схемы, которые являются частью этой коллекции.
  * Первая запись для схемы с именем `ng-add` . Он содержит описание и указывает на заводскую функцию, которая вызывается при выполнении вашей схемы.

1. В вашей библиотеке проекта `package.json` файл добавьте запись "schematics" с указанием пути к файлу схемы.
   Angular CLI использует эту запись для поиска именованных схем в вашей коллекции при запуске команд.

<code-example header="projects/my-lib/package.json (Schematics Collection Reference)" path="schematics-for-libraries/projects/my-lib/package.json" region="collection">
</code-example>

Первоначальная схема, которую вы создали, сообщает CLI, где найти схему, которая поддерживает `ng add` команду.
Теперь вы готовы создать эту схему.

{@a providing-installation-support}
## Обеспечение поддержки при установке

Схема для `ng add` Команда может улучшить начальный процесс установки для ваших пользователей.
Следующие шаги будут определять этот тип схемы.

1. Перейдите в <lib-root>папку / schematics / ng-add /.

1. Создать основной файл, `index.ts`.

1. открыто `index.ts` и добавьте исходный код для функции фабрики схемы.

<code-example header="projects/my-lib/schematics/ng-add/index.ts (ng-add Rule Factory)" path="schematics-for-libraries/projects/my-lib/schematics/ng-add/index.ts">
</code-example>

Единственный шаг, необходимый для обеспечения начальной `ng add` support - запуск задачи установки с использованием `SchematicContext`.
Задача использует предпочитаемый пользователем менеджер пакетов для добавления библиотеки в проект. `package.json` файл конфигурации и установите его в проект `node_modules` каталог.

В этом примере функция получает текущий `Tree` и возвращает его без каких-либо изменений.
Если вам нужно, вы можете выполнить дополнительную настройку при установке пакета, такую ​​как создание файлов, обновление конфигурации или любые другие начальные настройки, необходимые вашей библиотеке.

{@a building-your-schematics}
## Построение вашей схемы

Чтобы связать ваши схемы вместе с вашей библиотекой, вы должны сконфигурировать библиотеку для построения схем отдельно, а затем добавить их в пакет.
Вы должны построить свои схемы *после* создания библиотеки, чтобы они были помещены в правильный каталог.

* Ваша библиотека нуждается в пользовательском файле конфигурации Typescript с инструкциями о том, как скомпилировать ваши схемы в вашу распределенную библиотеку.

* Чтобы добавить схемы в комплект библиотеки, добавьте сценарии в библиотеку. `package.json` файл.

Предположим, у вас есть проект библиотеки `my-lib` в вашем угловом рабочем пространстве.
Чтобы рассказать библиотеке, как строить схемы, добавьте `tsconfig.schematics.json` Файл рядом с созданным `tsconfig.lib.json` Файл который настраивает сборку библиотеки.

1. Изменить `tsconfig.schematics.json` Файл для добавления следующего содержимого.

<code-example header="projects/my-lib/tsconfig.schematics.json (TypeScript Config)" path="schematics-for-libraries/projects/my-lib/tsconfig.schematics.json">
</code-example>

  * `rootDir` указывает, что ваш `schematics/` Папка содержит входные файлы для компиляции.

  * `outDir` сопоставляет выходную папку библиотеки. По умолчанию это `dist/my-lib` в корне вашего рабочего пространства.

1. Чтобы убедиться, что исходные файлы схемы скомпилированы в комплект библиотеки, добавьте следующие сценарии в `package.json` файл в корневой папке проекта вашей библиотеки (`projects/my-lib`).

<code-example header="projects/my-lib/package.json (Build Scripts)" path="schematics-for-libraries/projects/my-lib/package.json">
</code-example>

  * `build` скрипт компилирует вашу схему используя пользовательский `tsconfig.schematics.json` Файл.
  * `copy:*` операторы копируют скомпилированные файлы схемы в соответствующие места в выходной папке библиотеки, чтобы сохранить структуру файла.
  * `postbuild` скрипт копирует файлы схемы после `build` Сценарий завершен.

{@a providing-generation-support}
## Обеспечение поддержки поколений

Вы можете добавить именованную схему в свою коллекцию, которая позволит пользователям использовать `ng generate` Команда для создания артефакта, определенного в вашей библиотеке.

Мы предполагаем, что ваша библиотека определяет сервис, `my-service`, которая требует некоторой настройки. Вы хотите, чтобы ваши пользователи могли генерировать его с помощью следующей команды CLI.

<code-example language="bash">
ng generate my-lib:my-service
</code-example>

Для начала создайте новую подпапку, `my-service`, в `schematics` папка.

{@a configure-the-new-schematic}
### Настройте новую схему

Когда вы добавляете схему в коллекцию, вы должны указать на нее в схеме коллекции и предоставить файлы конфигурации для определения параметров, которые пользователь может передать команде.

1. Изменить `schematics/collection.json` Файл указывает на новую подпапку схемы и включает указатель на файл схемы, который будет указывать входные данные для новой схемы.

<code-example header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="schematics-for-libraries/projects/my-lib/schematics/collection.json">
</code-example>

1. Перейти к `<lib-root>/schematics/my-service/`.

1. Создать `schema.json` файл и определите доступные параметры для схемы.

<code-example header="projects/my-lib/schematics/my-service/schema.json (Schematic JSON Schema)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/schema.json">
</code-example>

  * *id* : уникальный идентификатор для схемы в коллекции.
  * *title* : удобочитаемое описание схемы.
  * *Тип* : дескриптор для типа, предоставляемого свойствами.
  * *свойства* : объект, который определяет доступные параметры для схемы.

  Каждый параметр связывает ключ с типом, описанием и необязательным псевдонимом.
  Тип определяет форму ожидаемого значения, и описание отображается, когда пользователь запрашивает справку по использованию для вашей схемы.

  См. Схему рабочей области для дополнительных настроек параметров схемы.

1. Создать `schema.ts` файл и определите интерфейс, в котором хранятся значения параметров, определенных в `schema.json` файл.

<code-example header="projects/my-lib/schematics/my-service/schema.ts (Schematic Interface)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/schema.ts">
</code-example>

  * *name* : имя, которое вы хотите предоставить для созданного сервиса.
  * *путь* : переопределяет путь, предоставленный к схеме. Значение пути по умолчанию основано на текущем рабочем каталоге.
  * *проект* : Предоставляет конкретный проект для запуска схемы. На схеме вы можете указать значение по умолчанию, если опция не предоставлена ​​пользователем.

{@a add-template-files}
### Добавьте файлы шаблона

Чтобы добавить артефакты в проект, вашей схеме нужны собственные файлы шаблонов.
Шаблоны схем поддерживают специальный синтаксис для выполнения кода и подстановки переменных.

1. Создать `files/` папка внутри `schematics/my-service/` Папка.

1. Создайте файл с именем `__name@dasherize__.service.ts.template` который определяет шаблон, который вы можете использовать для генерации файлов. Этот шаблон будет генерировать сервис, который уже имеет Angular `HttpClient` внедряется в его конструктор.

<code-example lang="ts" header="projects/my-lib/schematics/my-service/files/__name@dasherize__.service.ts.template (Schematic Template)">

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class <%= classify(name) %>Service {
  constructor(private http: HttpClient) { }
}

</code-example>

* `classify ` и ` dasherize` Методы - это служебные функции, которые ваша схема будет использовать для преобразования исходного шаблона и имени файла.

* `name` предоставляется как свойство из фабричной функции. Это то же самое `name` вы определили в схеме.

{@a add-the-factory-function}
### Добавьте заводскую функцию

Теперь, когда у вас есть инфраструктура, вы можете определить основную функцию, которая выполняет необходимые вам модификации в проекте пользователя.

Платформа Schematics предоставляет систему шаблонов файлов, которая поддерживает шаблоны путей и содержимого.
Система работает с заполнителями, определенными в файлах или путях, которые загружены во входные данные. `Tree`.
Он заполняет их, используя значения, переданные в `Rule`.

Более подробную информацию о них структуры данных и синтаксиса см [схемные README](https://github.com/angular/angular-cli/blob/master/packages/angular_devkit/schematics/README.md).


1. Создать основной файл, `index.ts` и добавьте исходный код для функции фабрики схемы.

1. Сначала импортируйте определения схем, которые вам понадобятся. Платформа Schematics предлагает множество служебных функций для создания и использования правил при запуске схемы.

<code-example header="projects/my-lib/schematics/my-service/index.ts (Imports)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="schematics-imports">
</code-example>

1. Импортируйте определенный интерфейс схемы, который предоставляет информацию о типе для параметров вашей схемы.

<code-example header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="schema-imports">
</code-example>

1. Чтобы создать схему генерации, начните с пустой фабрики правил.

<code-example header="projects/my-lib/schematics/my-service/index.ts (Initial Rule)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.1.ts" region="factory">
</code-example>

Эта простая фабрика правил возвращает дерево без изменений.
Параметры - это значения параметров, передаваемые из `ng generate` команду.

{@a define-a-generation-rule}
## Определите правило генерации

Теперь у нас есть инфраструктура для создания кода, который фактически изменяет приложение пользователя, чтобы настроить его для службы, определенной в вашей библиотеке.

Рабочая область Angular, в которой пользователь установил вашу библиотеку, содержит несколько проектов (приложений и библиотек).
Пользователь может указать проект в командной строке или разрешить его по умолчанию.
В любом случае ваш код должен идентифицировать конкретный проект, к которому применяется эта схема, чтобы вы могли получить информацию из конфигурации проекта.

Вы можете сделать это с помощью `Tree` Объект который передается фабричной функции.
 `Tree` Методы дают вам доступ к полному дереву файлов в вашем рабочем пространстве, позволяя вам читать и записывать файлы во время выполнения схемы.

{@a get-the-project-configuration}
### Получить конфигурацию проекта

1. Чтобы определить целевой проект, используйте `Tree.read()` для чтения содержимого файла конфигурации рабочей области, `angular.json`, в корне рабочей области.
   Добавьте следующий код к вашей заводской функции.

<code-example header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="workspace">
</code-example>

  * Не забудьте проверить, что контекст существует, и выдать соответствующую ошибку.

  * После считывания содержимого в строку проанализируйте конфигурацию в объект JSON, набрав `WorkspaceSchema`.

1. `WorkspaceSchema` содержит все свойства конфигурации рабочей области, включая `defaultProject` Значение для определения, какой проект использовать, если не указан.
   Мы будем использовать это значение в качестве запасного варианта, если в `ng generate` команду.

<code-example header="projects/my-lib/schematics/my-service/index.ts (Default Project)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="project-fallback">
</code-example>

1. Теперь, когда у вас есть имя проекта, используйте его для получения информации о конфигурации конкретного проекта.

<code-example header="projects/my-lib/schematics/my-service/index.ts (Project)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="project-info">
</code-example>

 `workspace projects` Объект содержит всю информацию о конфигурации проекта.

1. `options.path` определяет, куда перемещаются файлы шаблона схемы после применения схемы.

 `path` в схеме схемы по умолчанию заменяется текущим рабочим каталогом.
   Если `path` не определен, используйте `sourceRoot` из конфигурации проекта вместе с `projectType`.

<code-example header="projects/my-lib/schematics/my-service/index.ts (Project Info)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="path">
</code-example>

{@a define-the-rule}
### Определите правило

 `Rule` может использовать внешние файлы шаблона, преобразовывать их и возвращать другое `Rule` объекта с преобразованным шаблоном. Вы можете использовать шаблоны для создания любых пользовательских файлов, необходимых для вашей схемы.

1. Добавьте следующий код к вашей заводской функции.

<code-example header="projects/my-lib/schematics/my-service/index.ts (Template transform)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="template">
</code-example>

  * `apply()` Метод применяет несколько правил к источнику и возвращает преобразованный источник. Требуется 2 аргумента, источник и массив правил.
  * `url()` Метод считывает исходные файлы из вашей файловой системы относительно схемы.
  * `applyTemplates()` получает аргумент методов и свойств, которые вы хотите сделать доступными для шаблона схемы и имен файлов схемы. Возвращает `Rule` . Здесь вы определяете `classify()` и `dasherize()` и `name` собственности.
  * `classify()` Метод принимает значение и возвращает значение в случае заголовка. Например, если указано имя `my service`, он возвращается как `MyService` 
  * `dasherize()` принимает значение и возвращает значение в виде пунктира и строчных букв. Например, если предоставлено имя MyService, оно возвращается как `my-service`.
  * `move` Метод перемещает предоставленные исходные файлы к месту назначения при применении схемы.

1. Наконец, фабрика правил должна возвращать правило.

<code-example header="projects/my-lib/schematics/my-service/index.ts (Chain Rule)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="chain">
</code-example>

 `chain()` Метод позволяет объединить несколько правил в одно правило, чтобы можно было выполнять несколько операций в одной схеме.
  Здесь вы только объединяете правила шаблона с любым кодом, выполняемым схемой.

Смотрите полный пример функции правила схемы.

<code-example header="projects/my-lib/schematics/my-service/index.ts" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts">
</code-example>

Для получения дополнительной информации о правилах и служебных методах см. [Предоставленные правила](https://github.com/angular/angular-cli/tree/master/packages/angular_devkit/schematics#provided-rules).

{@a running-your-library-schematic}
## Запуск вашей библиотеки схемы

После того, как вы соберете свою библиотеку и схемы, вы можете установить коллекцию схем для работы с вашим проектом. Шаги ниже показывают, как создать сервис, используя схему, которую вы создали выше.


{@a build-your-library-and-schematics}
### Создайте свою библиотеку и схемы

В корне вашего рабочего пространства запустите `ng build` Команда для вашей библиотеки.

<code-example language="bash">

  ng build my-lib

</code-example>

Затем вы переходите в каталог библиотеки, чтобы построить схему

<code-example language="bash">

  cd projects/my-lib
  npm run build

</code-example>

{@a link-the-library}
### Ссылка на библиотеку

Ваша библиотека и схемы упакованы и помещены в `dist/my-lib` в корне вашего рабочего пространства. Для запуска схемы необходимо связать библиотеку с `node_modules` папка . В корне вашего рабочего пространства запустите `npm link` Команда с путем к вашей распространяемой библиотеке.

<code-example language="bash">

npm link dist/my-lib

</code-example>

{@a run-the-schematic}
### Запустите схему

Теперь, когда ваша библиотека установлена, вы можете запустить схему, используя `ng generate` команду.

<code-example language="bash">

ng generate my-lib:my-service --name my-data

</code-example>

В консоли вы увидите, что схема была запущена и `my-data.service.ts` Файл был создан в папке вашего приложения.

<code-example language="bash" hideCopy="true">

CREATE src/app/my-data.service.ts (208 bytes)

</code-example>
