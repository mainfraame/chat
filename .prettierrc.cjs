module.exports = {
  arrowParens: 'avoid',
  bracketSpacing: true,
  bracketSameLine: true,
  embeddedLanguageFormatting: 'auto',
  endOfLine: 'auto',
  htmlWhitespaceSensitivity: 'strict',
  importOrder: [
    '^@(.*)/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^[./]'
  ],
  importOrderCaseInsensitive: true,
  importOrderParserPlugins: ['decorators-legacy', 'jsx', 'tsx', 'typescript'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  insertPragma: false,
  jsxSingleQuote: true,
  quoteProps: 'as-needed',
  requirePragma: false,
  proseWrap: 'preserve',
  semi: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false
};
