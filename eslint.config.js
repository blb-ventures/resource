const path = require('path');
const confusingBrowserGlobals = require('confusing-browser-globals');
const tsconfigPath = path.resolve(__dirname, './configs/tsconfig.esm.json');
// const reactPlugin = require('eslint-plugin-react');
// const reactHooksPlugin = require('eslint-plugin-react-hooks');
const importPlugin = require('eslint-plugin-import');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const prettierPlugin = require('eslint-plugin-prettier');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptRecommended = require('@typescript-eslint/eslint-plugin/dist/configs/recommended');
const typescriptRecommendedType = require('@typescript-eslint/eslint-plugin/dist/configs/recommended-requiring-type-checking');
const typescriptStrict = require('@typescript-eslint/eslint-plugin/dist/configs/strict');
// const reactRecommended = require('eslint-plugin-react/configs/recommended');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = {
  plugins: {
    '@typescript-eslint': typescriptPlugin,
    // 'react': reactPlugin,
    // 'react-hooks': reactHooksPlugin,
    'import': importPlugin,
    'jsx-a11y': jsxA11yPlugin,
    'prettier': prettierPlugin,
  },
  files: ['**/*.{ts,tsx}'],
  ignores: ['node_modules', 'lib'],
  languageOptions: {
    // ...reactRecommended.languageOptions,
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: typescriptParser,
    parserOptions: { project: tsconfigPath },
  },
  settings: {
    'import/extensions': ['.ts', '.tsx', 'd.ts'],
    'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
  },
  rules: {
    ...typescriptRecommended.rules,
    ...typescriptRecommendedType.rules,
    ...typescriptStrict.rules,
    // ...reactRecommended.rules,
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/consistent-type-assertions': 'error',
    // '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    '@typescript-eslint/triple-slash-reference': [
      'error',
      { path: 'always', types: 'prefer-import', lib: 'always' },
    ],
    '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
    '@typescript-eslint/unified-signatures': 'error',
    '@typescript-eslint/no-explicit-any': 'off',

    // Custom rules
    'arrow-parens': ['warn', 'as-needed'],
    'complexity': ['error', 24],
    'id-blacklist': [
      'error',
      'any',
      'Number',
      //   'number',
      'String',
      'string',
      'Boolean',
      'boolean',
      'Undefined',
      'undefined',
    ],
    'max-len': [
      'error',
      { code: 100, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreRegExpLiterals: true },
    ],

    // Airbnb Typescript
    '@typescript-eslint/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allowSingleOrDouble',
      },
      { selector: 'function', format: ['camelCase', 'PascalCase'] },
      { selector: 'typeLike', format: ['PascalCase'] },
    ],
    '@typescript-eslint/comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
        enums: 'always-multiline',
        generics: 'always-multiline',
        tuples: 'always-multiline',
      },
    ],
    '@typescript-eslint/comma-spacing': ['error', { before: false, after: true }],
    '@typescript-eslint/dot-notation': ['error', { allowKeywords: true }],
    '@typescript-eslint/func-call-spacing': ['error', 'never'],
    // FIXME: Some typescript type unions use more indentation when there is multiple lines
    '@typescript-eslint/indent': [
      'off',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
        CallExpression: {
          arguments: 1,
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
        ignoredNodes: [
          'JSXElement',
          'JSXElement > *',
          'JSXAttribute',
          'JSXIdentifier',
          'JSXNamespacedName',
          'JSXMemberExpression',
          'JSXSpreadAttribute',
          'JSXExpressionContainer',
          'JSXOpeningElement',
          'JSXClosingElement',
          'JSXFragment',
          'JSXOpeningFragment',
          'JSXClosingFragment',
          'JSXText',
          'JSXEmptyExpression',
          'JSXSpreadChild',
        ],
        ignoreComments: false,
      },
    ],
    '@typescript-eslint/keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
        overrides: {
          return: { after: true },
          throw: { after: true },
          case: { after: true },
        },
      },
    ],
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: false },
    ],
    '@typescript-eslint/no-extra-parens': [
      'off',
      'all',
      {
        conditionalAssign: true,
        nestedBinaryExpressions: false,
        returnAssign: false,
        ignoreJSX: 'all', // delegate to eslint-plugin-react
        enforceForArrowConditionals: false,
      },
    ],
    '@typescript-eslint/no-loop-func': 'error',
    '@typescript-eslint/no-magic-numbers': [
      'off',
      {
        ignore: [-1, 0, 1],
        ignoreArrayIndexes: true,
        enforceConst: true,
        detectObjects: false,
        ignoreDefaultValues: true,
      },
    ],
    '@typescript-eslint/no-redeclare': 'error',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-throw-literal': 'error',
    '@typescript-eslint/no-unused-expressions': [
      'off',
      { allowShortCircuit: false, allowTernary: false, allowTaggedTemplates: false },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-use-before-define': [
      'off',
      { functions: true, classes: true, variables: true },
    ],
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/space-before-function-paren': [
      'error',
      { anonymous: 'always', named: 'never', asyncArrow: 'always' },
    ],
    '@typescript-eslint/return-await': 'error',
    '@typescript-eslint/space-infix-ops': ['error', { int32Hint: false }],
    '@typescript-eslint/object-curly-spacing': 'off',

    // Best Practices
    'array-callback-return': ['error', { allowImplicit: true }],
    'block-scoped-var': 'error',
    'class-methods-use-this': ['error', { exceptMethods: [] }],
    'consistent-return': 'error',
    'curly': ['error', 'multi-line'], // multiline
    'default-case': ['error', { commentPattern: '^no default$' }],
    'default-case-last': 'error',
    'default-param-last': 'error',
    'dot-location': ['error', 'property'],
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'grouped-accessor-pairs': 'error',
    'guard-for-in': 'error',
    'max-classes-per-file': ['error', 1],
    'no-alert': 'warn',
    'no-caller': 'error',
    'no-constructor-return': 'error',
    'no-else-return': ['error', { allowElseIf: false }],
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-floating-decimal': 'error',
    'no-native-reassign': 'error',
    'no-implicit-coercion': ['error', { boolean: true, number: true, string: true, allow: [] }],
    'no-implicit-globals': 'error',
    'no-invalid-this': 'error',
    'no-iterator': 'error',
    'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
    'no-lone-blocks': 'error',
    'no-multi-spaces': ['error', { ignoreEOLComments: false }],
    'no-multi-str': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'acc', // for reduce accumulators
          'accumulator', // for reduce accumulators
          'e', // for e.return value
          'ctx', // for Koa routing
          'context', // for Koa routing
          'req', // for Express requests
          'request', // for Express requests
          'res', // for Express responses
          'response', // for Express responses
          '$scope', // for Angular 1 scopes
          'staticContext', // for ReactRouter context
        ],
      },
    ],
    'no-proto': 'error',
    'no-restricted-properties': [
      'error',
      { object: 'arguments', property: 'callee', message: 'arguments.callee is deprecated' },
      { object: 'global', property: 'isFinite', message: 'Please use Number.isFinite instead' },
      { object: 'self', property: 'isFinite', message: 'Please use Number.isFinite instead' },
      { object: 'window', property: 'isFinite', message: 'Please use Number.isFinite instead' },
      { object: 'global', property: 'isNaN', message: 'Please use Number.isNaN instead' },
      { object: 'self', property: 'isNaN', message: 'Please use Number.isNaN instead' },
      { object: 'window', property: 'isNaN', message: 'Please use Number.isNaN instead' },
      { property: '__defineGetter__', message: 'Please use Object.defineProperty instead.' },
      { property: '__defineSetter__', message: 'Please use Object.defineProperty instead.' },
      { object: 'Math', property: 'pow', message: 'Use the exponentiation operator (**) instead.' },
    ],
    'no-return-assign': ['error', 'always'],
    'no-script-url': 'error',
    'no-self-assign': ['error', { props: true }],
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-unused-labels': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'no-void': 'error',
    'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],
    'prefer-regex-literals': 'error',
    'radix': 'error',
    'vars-on-top': 'error',
    'wrap-iife': ['error', 'outside', { functionPrototypeMethods: false }],
    'yoda': 'error',

    // Errors
    'no-await-in-loop': 'error',
    'no-cond-assign': ['error', 'always'],
    'no-console': 'warn',
    'no-constant-condition': 'warn',
    'no-promise-executor-return': 'error',
    'no-template-curly-in-string': 'error',
    'no-unreachable-loop': 'error',
    'no-unsafe-optional-chaining': ['error', { disallowArithmeticOperators: true }],
    'no-negated-in-lhs': 'error',

    // ES6
    'arrow-spacing': ['error', { before: true, after: true }],
    'generator-star-spacing': ['error', { before: false, after: true }],
    'no-restricted-exports': [
      'error',
      {
        restrictedNamedExports: [
          'default', // use `export default` to provide a default export
          'then', // this will cause tons of confusion when your module is dynamically `import()`ed
        ],
      },
    ],
    'no-useless-computed-key': 'error',
    'no-useless-rename': [
      'error',
      { ignoreDestructuring: false, ignoreImport: false, ignoreExport: false },
    ],
    'object-shorthand': ['error', 'always', { ignoreConstructors: false, avoidQuotes: true }],
    'prefer-arrow-callback': ['error', { allowNamedFunctions: false, allowUnboundThis: true }],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: { array: false, object: true },
        AssignmentExpression: { array: true, object: false },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'prefer-numeric-literals': 'error',
    'prefer-template': 'error',
    'rest-spread-spacing': ['error', 'never'],
    'symbol-description': 'error',
    'template-curly-spacing': 'error',
    'yield-star-spacing': ['error', 'after'],

    // Import
    'import/named': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'import/no-deprecated': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-amd': 'error',
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/order': ['error', { groups: [['builtin', 'external', 'internal']] }],
    'import/newline-after-import': 'error',
    'import/max-dependencies': ['warn', { max: 40 }],
    'import/no-absolute-path': 'error',
    'import/no-dynamic-require': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'test/**', // tape, common npm pattern
          'tests/**', // also common npm pattern
          'spec/**', // mocha, rspec-like pattern
          '**/__tests__/**', // jest pattern
          '**/__mocks__/**', // jest pattern
          'test.{js,jsx,ts,tsx}', // repos with a single test file
          'test-*.{js,jsx,ts,tsx}', // repos with multiple top-level test files
          '**/*{.,_}{test,spec}.{js,jsx,ts,tsx}', // tests where the extension or filename suffix denotes that it is a test
          '**/webpack.config.ts', // webpack config
          '**/webpack.config.*.ts', // webpack config
          '**/.eslintrc.js', // eslint config
          '**/.eslintrc.ts', // eslint config
          '**/*.stories.{ts,tsx,mdx}', // eslint config
        ],
        optionalDependencies: false,
      },
    ],
    'import/no-webpack-loader-syntax': 'error',
    'import/no-unassigned-import': [
      'error',
      {
        allow: ['react-datasheet/lib/react-datasheet.css', '@web/styles/global.css'],
      },
    ],
    'import/no-named-default': 'error',
    'import/no-self-import': 'error',
    'import/no-cycle': ['error', { maxDepth: '∞' }],
    'import/no-useless-path-segments': ['error', { commonjs: true }],
    // Disabled because of stories and pages files
    'import/no-unused-modules': 'error',
    'import/no-relative-packages': 'error',

    // Style
    'array-bracket-spacing': ['error', 'never'],
    'block-spacing': ['error', 'always'],
    'capitalized-comments': [
      'error',
      'never',
      {
        line: { ignorePattern: '.*', ignoreInlineComments: true, ignoreConsecutiveComments: true },
        block: { ignorePattern: '.*', ignoreInlineComments: true, ignoreConsecutiveComments: true },
      },
    ],
    'comma-style': [
      'error',
      'last',
      {
        exceptions: {
          ArrayExpression: false,
          ArrayPattern: false,
          ArrowFunctionExpression: false,
          CallExpression: false,
          FunctionDeclaration: false,
          FunctionExpression: false,
          ImportDeclaration: false,
          ObjectExpression: false,
          ObjectPattern: false,
          VariableDeclaration: false,
          NewExpression: false,
        },
      },
    ],
    'computed-property-spacing': ['error', 'never'],
    'eol-last': ['error', 'always'],
    'function-call-argument-newline': ['error', 'consistent'],
    'func-names': 'warn',
    'func-style': ['error', 'expression'],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'linebreak-style': ['error', 'unix'],
    'lines-around-directive': ['error', { before: 'always', after: 'always' }],
    'max-depth': ['warn', 12],
    'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
    'max-params': ['warn', 4],
    'max-statements': ['warn', 30],
    'new-cap': [
      'error',
      {
        newIsCap: true,
        newIsCapExceptions: [],
        capIsNew: false,
        capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List'],
      },
    ],
    'new-parens': 'error',
    'no-bitwise': 'error',
    'no-continue': 'error',
    'no-lonely-if': 'error',
    'no-mixed-operators': [
      'error',
      {
        // the list of arithmetic groups disallows mixing `%` and `**`
        // with other arithmetic operators.
        groups: [
          ['%', '**'],
          ['%', '+'],
          ['%', '-'],
          ['%', '*'],
          ['%', '/'],
          ['/', '*'],
          ['&', '|', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!=='],
          ['&&', '||'],
        ],
        allowSamePrecedence: false,
      },
    ],
    'no-multi-assign': ['error'],
    'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
    'no-nested-ternary': 'off',
    'no-new-object': 'error',
    'no-plusplus': 'error',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'no-spaced-func': 'error',
    'no-tabs': 'error',
    'no-trailing-spaces': ['error', { skipBlankLines: false, ignoreComments: false }],
    'no-unneeded-ternary': ['error', { defaultAssignment: false }],
    'no-whitespace-before-property': 'error',
    'nonblock-statement-body-position': ['error', 'beside', { overrides: {} }],
    'one-var': ['error', 'never'],
    'one-var-declaration-per-line': ['error', 'always'],
    'operator-assignment': ['error', 'always'],
    'padded-blocks': [
      'error',
      { blocks: 'never', classes: 'never', switches: 'never' },
      { allowSingleLineBlocks: true },
    ],
    'prefer-exponentiation-operator': 'error',
    'prefer-object-spread': 'error',
    'quote-props': [
      'error',
      'consistent-as-needed',
      { keywords: false, unnecessary: true, numbers: false },
    ],
    'semi-spacing': ['error', { before: false, after: true }],
    'semi-style': ['error', 'last'],
    'sort-vars': 'off',
    'space-before-blocks': 'error',
    'space-in-parens': ['error', 'never'],
    'space-unary-ops': ['error', { words: true, nonwords: false, overrides: {} }],
    'spaced-comment': [
      'error',
      'always',
      {
        line: {
          exceptions: ['-', '+'],
          markers: ['=', '!', '/'], // space here to support sprockets directives, slash for TS /// comments
        },
        block: {
          exceptions: ['-', '+'],
          markers: ['=', '!', ':', '::'], // space here to support sprockets directives and flow comment types
          balanced: true,
        },
      },
    ],
    'switch-colon-spacing': ['error', { after: true, before: false }],
    'template-tag-spacing': ['error', 'never'],
    'unicode-bom': ['error', 'never'],

    // Variables
    'no-catch-shadow': 'error',
    'no-label-var': 'error',
    'no-restricted-globals': [
      'error',
      {
        name: 'isFinite',
        message:
          'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite',
      },
      {
        name: 'isNaN',
        message:
          'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan',
      },
    ].concat(confusingBrowserGlobals),
    'no-undef-init': 'error',

    // React A11Y
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
    'jsx-a11y/aria-role': ['error', { ignoreNonDOM: false }],
    'jsx-a11y/control-has-associated-label': [
      'error',
      {
        labelAttributes: ['label'],
        controlComponents: [],
        ignoreElements: ['audio', 'canvas', 'embed', 'input', 'textarea', 'tr', 'video'],
        ignoreRoles: [
          'grid',
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'row',
          'tablist',
          'toolbar',
          'tree',
          'treegrid',
        ],
        depth: 5,
      },
    ],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelComponents: [],
        labelAttributes: [],
        controlComponents: [],
        assert: 'both',
        depth: 25,
      },
    ],
    'jsx-a11y/lang': 'error',
    'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],

    // React hooks
    // 'react-hooks/rules-of-hooks': 'error',
    // 'react-hooks/exhaustive-deps': 'warn',

    // React
    // 'no-underscore-dangle': [
    //   'error',
    //   {
    //     allow: ['__typename'],
    //     allowAfterThis: false,
    //     allowAfterSuper: false,
    //     enforceInMethodNames: true,
    //   },
    // ],
    // 'jsx-quotes': ['error', 'prefer-double'],
    // 'class-methods-use-this': [
    //   'error',
    //   {
    //     exceptMethods: [
    //       'render',
    //       'getInitialState',
    //       'getDefaultProps',
    //       'getChildContext',
    //       'componentWillMount',
    //       'UNSAFE_componentWillMount',
    //       'componentDidMount',
    //       'componentWillReceiveProps',
    //       'UNSAFE_componentWillReceiveProps',
    //       'shouldComponentUpdate',
    //       'componentWillUpdate',
    //       'UNSAFE_componentWillUpdate',
    //       'componentDidUpdate',
    //       'componentWillUnmount',
    //       'componentDidCatch',
    //       'getSnapshotBeforeUpdate',
    //     ],
    //   },
    // ],
    // 'react/jsx-boolean-value': ['error', 'never', { always: [] }],
    // 'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
    // 'react/jsx-closing-tag-location': 'error',
    // 'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    // 'react/jsx-handler-names': [
    //   'error',
    //   { eventHandlerPrefix: 'handle', eventHandlerPropPrefix: 'on' },
    // ],
    // 'react/jsx-indent-props': ['error', 2],
    // 'react/jsx-max-props-per-line': ['error', { maximum: 5, when: 'multiline' }],
    // 'react/jsx-no-bind': [
    //   'error',
    //   {
    //     ignoreRefs: true,
    //     allowArrowFunctions: true,
    //     allowFunctions: false,
    //     allowBind: false,
    //     ignoreDOMComponents: true,
    //   },
    // ],
    // 'react/jsx-pascal-case': ['error', { allowAllCaps: true, ignore: [] }],
    // 'react/jsx-sort-props': [
    //   'error',
    //   {
    //     ignoreCase: true,
    //     callbacksLast: false,
    //     shorthandFirst: false,
    //     shorthandLast: false,
    //     noSortAlphabetically: false,
    //     reservedFirst: true,
    //   },
    // ],
    // 'react/no-danger': 'warn',
    // 'react/no-did-mount-set-state': 'error',
    // 'react/no-did-update-set-state': 'error',
    // 'react/no-will-update-set-state': 'error',
    // 'react/no-multi-comp': ['error', { ignoreStateless: true }],
    // 'react/prefer-es6-class': ['error', 'always'],
    // 'react/prefer-stateless-function': ['error', { ignorePureComponents: true }],
    // 'react/self-closing-comp': 'error',
    // 'react/sort-comp': [
    //   'error',
    //   {
    //     order: [
    //       'static-variables',
    //       'static-methods',
    //       'instance-variables',
    //       'lifecycle',
    //       '/^handle.+$/',
    //       '/^on.+$/',
    //       'getters',
    //       'setters',
    //       '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
    //       'instance-methods',
    //       'everything-else',
    //       'rendering',
    //     ],
    //     groups: {
    //       lifecycle: [
    //         'displayName',
    //         'propTypes',
    //         'contextTypes',
    //         'childContextTypes',
    //         'mixins',
    //         'statics',
    //         'defaultProps',
    //         'constructor',
    //         'getDefaultProps',
    //         'getInitialState',
    //         'state',
    //         'getChildContext',
    //         'getDerivedStateFromProps',
    //         'componentWillMount',
    //         'UNSAFE_componentWillMount',
    //         'componentDidMount',
    //         'componentWillReceiveProps',
    //         'UNSAFE_componentWillReceiveProps',
    //         'shouldComponentUpdate',
    //         'componentWillUpdate',
    //         'UNSAFE_componentWillUpdate',
    //         'getSnapshotBeforeUpdate',
    //         'componentDidUpdate',
    //         'componentDidCatch',
    //         'componentWillUnmount',
    //       ],
    //       rendering: ['/^render.+$/', 'render'],
    //     },
    //   },
    // ],
    // 'react/jsx-wrap-multilines': [
    //   'off',
    //   {
    //     declaration: 'parens-new-line',
    //     assignment: 'parens-new-line',
    //     return: 'parens-new-line',
    //     arrow: 'parens-new-line',
    //     condition: 'parens-new-line',
    //     logical: 'parens-new-line',
    //     prop: 'parens-new-line',
    //   },
    // ],
    // 'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
    // 'react/jsx-equals-spacing': ['error', 'never'],
    // 'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    // 'react/forbid-component-props': ['error', { forbid: ['style'] }],
    // 'react/no-unused-prop-types': [
    //   'error',
    //   {
    //     customValidators: [],
    //     skipShapeProps: true,
    //   },
    // ],
    // 'react/style-prop-object': 'error',
    // 'react/jsx-tag-spacing': [
    //   'error',
    //   {
    //     closingSlash: 'never',
    //     beforeSelfClosing: 'always',
    //     afterOpening: 'never',
    //     beforeClosing: 'never',
    //   },
    // ],
    // 'react/no-array-index-key': 'warn',
    // 'react/require-default-props': [
    //   'off',
    //   {
    //     forbidDefaultForRequired: true,
    //   },
    // ],
    // 'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],
    // 'react/void-dom-elements-no-children': 'error',
    // 'react/default-props-match-prop-types': ['error', { allowRequiredDefaults: false }],
    // 'react/no-redundant-should-component-update': 'error',
    // 'react/no-unused-state': 'error',
    // 'react/boolean-prop-naming': [
    //   'warn',
    //   {
    //     propTypeNames: ['bool', 'mutuallyExclusiveTrueProps'],
    //     rule: '^(is|has|should|can)[A-Z]([A-Za-z0-9]?)+',
    //     message: 'Bool flags must start with either is, has, should or can',
    //   },
    // ],
    // 'react/no-typos': 'error',
    // 'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    // 'react/destructuring-assignment': ['error', 'always'],
    // 'react/no-access-state-in-setstate': 'error',
    // 'react/button-has-type': ['error', { button: true, submit: true, reset: false }],
    // 'react/jsx-child-element-spacing': 'error',
    // 'react/no-this-in-sfc': 'error',
    // 'react/jsx-max-depth': ['error', { max: 20 }],
    // 'react/jsx-props-no-multi-spaces': 'error',
    // 'react/no-unsafe': 'error',
    // 'react/jsx-fragments': ['error', 'syntax'],
    // 'react/jsx-curly-newline': ['error', { multiline: 'consistent', singleline: 'consistent' }],
    // 'react/state-in-constructor': ['error', 'always'],
    // 'react/static-property-placement': ['error', 'property assignment'],
    // 'react/jsx-no-script-url': ['error', [{ name: 'Link', props: ['to'] }]],
    // 'react/jsx-no-useless-fragment': 'error',
    // 'react/no-adjacent-inline-elements': 'error',
    // 'react/jsx-newline': ['error', { prevent: true }],
    // 'react/jsx-no-constructed-context-values': 'error',
    // 'react/no-unstable-nested-components': 'error',

    // Disabled Rules
    '@typescript-eslint/explicit-member-accessibility': 'off',
    'array-bracket-newline': ['off', 'consistent'],
    'array-element-newline': ['off', { multiline: true, minItems: 5 }],
    'consistent-this': 'off',
    'func-name-matching': 'off',
    'function-paren-newline': ['off', 'consistent'],
    'id-denylist': 'off',
    'id-length': 'off',
    'id-match': 'off',
    'implicit-arrow-linebreak': ['off', 'beside'],
    'jsx-quotes': ['off', 'prefer-double'],
    'init-declarations': 'off',
    'lines-around-comment': 'off',
    'line-comment-position': [
      'off',
      { position: 'above', ignorePattern: '', applyDefaultPatterns: true },
    ],
    // Set off because of page function components
    'max-lines-per-function': [
      'off',
      { max: 50, skipBlankLines: true, skipComments: true, IIFEs: true },
    ],
    'max-nested-callbacks': 'off',
    'max-statements-per-line': ['off', { max: 1 }],
    'multiline-comment-style': ['off', 'starred-block'],
    'multiline-ternary': ['off', 'never'],
    // Our usage doesn't make it confusing
    'no-confusing-arrow': ['off', { allowParens: true }],
    // Disabled because there is a equal rule in the import plugin
    'no-duplicate-imports': 'off',
    'no-eq-null': 'off',
    'no-inline-comments': 'off',
    'no-negated-condition': 'off',
    'no-restricted-imports': 'off',
    'no-ternary': 'off',
    'no-undefined': 'off',
    'object-curly-newline': 'off',
    'object-property-newline': 'off',
    'operator-linebreak': ['off', 'before', { overrides: { '=': 'none' } }],
    'padding-line-between-statements': 'off',
    'prefer-reflect': 'off',
    'require-atomic-updates': 'off',
    'require-unicode-regexp': 'off',
    'sort-imports': 'off',
    'wrap-regex': 'off',

    // These import rules are either not relevant or covered by the Typescript compiler
    'import/group-exports': 'off',
    // Deprecated
    'import/dynamic-import-chunkname': 'off',
    'import/exports-last': 'off',
    'import/imports-first': 'off',
    'import/namespace': 'off',
    'import/no-namespace': 'off',
    'import/no-commonjs': 'off',
    'import/no-default-export': 'off',
    'import/no-import-module-exports': ['off', { exceptions: [] }],
    'import/no-internal-modules': ['off', { allow: [] }],
    'import/no-named-export': 'off',
    'import/no-nodejs-modules': 'off',
    'import/no-relative-parent-imports': 'off',
    'import/no-restricted-paths': 'off',
    'import/prefer-default-export': 'off',
    'import/unambiguous': 'off',

    // These should be considered in the future
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-onchange': 'off',

    // 'react/display-name': 'off', // Not relevant
    // 'react/jsx-indent': ['off', 2], // Duplicate rule
    // 'react/jsx-no-literals': ['off', { noStrings: true }],
    // 'react/jsx-props-no-spreading': 'off',
    // 'react/jsx-no-undef': 'off',
    // 'react/jsx-one-expression-per-line': 'off',
    // 'react/jsx-sort-default-props': ['off', { ignoreCase: true }], // Duplicated rule
    // 'react/jsx-sort-prop-types': 'off', // Deprecated in favor of react/jsx-sort-props
    // 'react/jsx-space-before-closing': ['off', 'always'], // Deprecated
    // 'react/no-set-state': 'off',
    // 'react/prefer-read-only-props': 'off',
    // 'react/require-optimization': ['off', { allowDecorators: [] }], // Not relevant

    // Typescript eslint disable
    'brace-style': 'off',
    'camelcase': 'off',
    'comma-dangle': 'off',
    'comma-spacing': 'off',
    'dot-notation': 'off',
    'func-call-spacing': 'off',
    'indent': 'off',
    'keyword-spacing': 'off',
    'lines-between-class-members': 'off',
    'no-extra-parens': 'off',
    'no-new-func': 'off',
    'no-loop-func': 'off',
    'no-magic-numbers': 'off',
    'no-shadow': 'off',
    'no-throw-literal': 'off',
    'no-unused-expressions': 'off',
    'no-use-before-define': 'off',
    'no-useless-constructor': 'off',
    'quotes': 'off',
    'semi': 'off',
    'space-before-function-paren': 'off',
    'no-return-await': 'off',
    'space-infix-ops': 'off',
    'object-curly-spacing': 'off',
  },
};
