/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CompileDirectiveMetadata, CompileDirectiveSummary, CompilePipeSummary, CssSelector, NgAnalyzedModules, Node as HtmlAst, ParseError, Parser, StaticSymbol, TemplateAst} from '@angular/compiler';
import * as ts from 'typescript';

import {Span, Symbol, SymbolQuery, SymbolTable} from './symbols';

export {StaticSymbol} from '@angular/compiler';
export {BuiltinType, Definition, PipeInfo, Pipes, Signature, Span, Symbol, SymbolDeclaration, SymbolQuery, SymbolTable} from './symbols';

/**
 * Информация `LanguageService` требуется `LanguageServiceHost` для описания содержимого
 * шаблон и языковой контекст, в котором находится шаблон
 *
 * Интерфейс хоста; смотрите `LanguageServiceHost`.
 *
 * @publicApi
 */
export interface TemplateSource {
  /**
   * The source of the template.
   */
  readonly source: string;

  /**
   * The span of the template within the source file.
   */
  readonly span: Span;

  /**
   * A static symbol for the template's component.
   */
  readonly type: StaticSymbol;

  /**
   * The `SymbolTable` for the members of the component.
   */
  readonly members: SymbolTable;

  /**
   * A `SymbolQuery` for the context of the template.
   */
  readonly query: SymbolQuery;

  /**
   * Name of the file that contains the template. Could be `.html` or `.ts`.
   */
  readonly fileName: string;
}

/**
 * Найдена информация об ошибке при получении информации об объявлении
 *
 * Тип хоста; смотрите `LanguageServiceHost`.
 *
 * @publicApi
 */
export interface DeclarationError {
  /**
   * The span of the error in the declaration's module.
   */
  readonly span: Span;

  /**
   * The message to display describing the error or a chain
   * of messages.
   */
  readonly message: string|DiagnosticMessageChain;
}

/**
 * Информация о декларациях компонентов.
 *
 * Файл может содержать объявление без шаблона, потому что файл содержит только
 * ссылки на templateUrl Однако объявление компонента может содержать ошибки, которые
 * необходимо сообщить, например, отсутствует строка шаблона или нет компонента
 * объявлено в модуле. Эти ошибки должны быть указаны в декларации, а не в
 * шаблон.
 *
 * Тип хоста; смотрите `LanguageServiceHost`.
 *
 * @publicApi
 */
export interface Declaration {
  /**
   * The static symbol of the compponent being declared.
   */
  readonly type: StaticSymbol;

  /**
   * The span of the declaration annotation reference (e.g. the 'Component' or 'Directive'
   * reference).
   */
  readonly declarationSpan: Span;

  /**
   * Reference to the compiler directive metadata for the declaration.
   */
  readonly metadata: CompileDirectiveMetadata;

  /**
   * Error reported trying to get the metadata.
   */
  readonly errors: DeclarationError[];
}

/**
 * Хост для `LanguageService` . Это обеспечивает все, что `LanguageService` требует для ответа
 * на `LanguageService` запросы.
 *
 * Этот интерфейс описывает требования `LanguageService` на его хосте.
 *
 * Интерфейс хоста не зависит от языка хоста.
 *
 * Добавление необязательного члена к этому интерфейсу или любому интерфейсу, который описывается как
 *  `LanguageServiceHost`Интерфейсне считается серьезным изменением, как определено SemVer.
 * Удаление метода или изменение члена с обязательного на необязательный также не будет считаться
 * переломное изменение.
 *
 * Если участник устарел, он будет заменен на необязательный в младшем выпуске, прежде чем это так
 * удалено в основной версии.
 *
 * Добавление обязательного члена или изменение параметров метода считается критическим изменением и
 * будет сделано только тогда, когда разрешены критические изменения. По возможности новый необязательный участник будет
 * будет добавлен и старый член будет признан устаревшим. Новый член будет затем обязательным в
 * и старый член будет удален только тогда, когда разрешены критические изменения.
 *
 * Хотя интерфейс помечен как экспериментальный, возможны критические изменения между второстепенными
 * релизы. После того, как интерфейс помечен как стабильный, изменения будут разрешены только между
 * основные релизы. Разрешающие изменения не допускаются между выпусками патча.
 *
 * @publicApi
 */
export interface LanguageServiceHost {
  /**
   * Return the template source information for all templates in `fileName` or for `fileName` if
   * it is a template file.
   */
  getTemplates(fileName: string): TemplateSource[];

  /**
   * Returns the Angular declarations in the given file.
   */
  getDeclarations(fileName: string): Declaration[];

  /**
   * Return a summary of all Angular modules in the project.
   */
  getAnalyzedModules(): NgAnalyzedModules;

  /**
   * Return the AST for both HTML and template for the contextFile.
   */
  getTemplateAst(template: TemplateSource): AstResult|undefined;

  /**
   * Return the template AST for the node that corresponds to the position.
   */
  getTemplateAstAtPosition(fileName: string, position: number): AstResult|undefined;
}

/**
 * The type of Angular directive. Used for QuickInfo in template.
 */
export enum DirectiveKind {
  COMPONENT = 'component',
  DIRECTIVE = 'directive',
  EVENT = 'event',
}

/**
 * ScriptElementKind for completion.
 */
export enum CompletionKind {
  ANGULAR_ELEMENT = 'angular element',
  ATTRIBUTE = 'attribute',
  COMPONENT = 'component',
  ELEMENT = 'element',
  ENTITY = 'entity',
  HTML_ATTRIBUTE = 'html attribute',
  HTML_ELEMENT = 'html element',
  KEY = 'key',
  METHOD = 'method',
  PIPE = 'pipe',
  PROPERTY = 'property',
  REFERENCE = 'reference',
  TYPE = 'type',
  VARIABLE = 'variable',
}

export type CompletionEntry = Omit<ts.CompletionEntry, 'kind'>&{
  kind: CompletionKind,
};

/**
 * Шаблон диагностической цепочки сообщений. Это похоже на TypeScript
 * DiagnosticMessageChain. Сообщения предназначены для форматирования как отдельные
 * фрагменты предложения и отступ.
 *
 * Для совместимости с предыдущей реализацией значения должны быть переопределены
 * toString () для возврата отформатированного сообщения.
 *
 * @publicApi
 */
export interface DiagnosticMessageChain {
  /**
   * The text of the diagnostic message to display.
   */
  message: string;

  /**
   * The next message in the chain.
   */
  next?: DiagnosticMessageChain[];
}

/**
 * Шаблон диагностического сообщения для отображения.
 *
 * @publicApi
 */
export interface Diagnostic {
  /**
   * The kind of diagnostic message
   */
  kind: ts.DiagnosticCategory;

  /**
   * The source span that should be highlighted.
   */
  span: Span;

  /**
   * The text of the diagnostic message to display or a chain of messages.
   */
  message: string|DiagnosticMessageChain;
}

/**
 * Экземпляр языковой службы Angular, созданный методом `createLanguageService()`.
 *
 * Языковая служба Angular реализует подмножество методов, определенных в
 * Языковая служба Angular реализует подмножество методов, определенных
 * языковая служба TypeScript.
 *
 * @publicApi
 */
export type LanguageService = Pick<
    ts.LanguageService,
    'getCompletionsAtPosition'|'getDefinitionAndBoundSpan'|'getQuickInfoAtPosition'|
    'getSemanticDiagnostics'>;

/** Information about an Angular template AST. */
export interface AstResult {
  htmlAst: HtmlAst[];
  templateAst: TemplateAst[];
  directive: CompileDirectiveMetadata;
  directives: CompileDirectiveSummary[];
  pipes: CompilePipeSummary[];
  parseErrors?: ParseError[];
  expressionParser: Parser;
  template: TemplateSource;
}

/** Information about a directive's selectors. */
export type SelectorInfo = {
  selectors: CssSelector[],
  map: Map<CssSelector, CompileDirectiveSummary>
};

export interface SymbolInfo {
  symbol: Symbol;
  span: ts.TextSpan;
  staticSymbol?: StaticSymbol;
}

/** TODO: this should probably be merged with AstResult */
export interface DiagnosticTemplateInfo {
  fileName?: string;
  offset: number;
  query: SymbolQuery;
  members: SymbolTable;
  htmlAst: HtmlAst[];
  templateAst: TemplateAst[];
  source: string;
}
