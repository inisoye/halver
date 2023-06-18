module.exports = {
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  pluginSearchDirs: false,
  arrowParens: 'avoid',
  embeddedLanguageFormatting: 'auto',
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  jsxBracketSameLine: false,
  printWidth: 88,
  proseWrap: 'always',
  quoteProps: 'as-needed',
  requirePragma: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  importOrder: ['^@/(.*)$', '^[./]'],
  importOrderBuiltinModulesToTop: true,
  importOrderCaseInsensitive: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
