module.exports = {
  'env': {
    'browser': true,
    'es2021': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'overrides': [
    {
      'env': {
        'node': true
      },
      'files': [
        '.eslintrc.{js,cjs}'
      ],
      'parserOptions': {
        'sourceType': 'script'
      }
    }
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'plugins': [
    'react'
  ],
  'rules': {
    'react/prop-types': 0,
    'react-hooks/exhaustive-deps': 0,
    'no-console': 'error',
    'no-inline-comments': 'error',
    'react/jsx-filename-extension': [
      1,
      {
        'extensions': [
          '.js',
          '.jsx'
        ]
      }
    ],
    'react/jsx-props-no-spreading': [
      'error',
      {
        'custom': 'ignore'
      }
    ],
    'max-len': [
      'error',
      {
        'code': 280
      }
    ],
    'no-trailing-spaces': 'error',
    'arrow-body-style': [
      'error',
      'as-needed'
    ],
    'complexity': [
      'error',
      10
    ],
    'semi': [
      'error',
      'always'
    ],
    'curly': [
      'error',
      'all'
    ],
    'brace-style': [
      2,
      '1tbs'
    ],
    'prefer-destructuring': [
      'error',
      {
        'object': true,
        'array': false
      }
    ],
    'arrow-parens': [
      'error',
      'as-needed'
    ],
    'comma-dangle': [
      'error',
      'never'
    ],
    'quotes': [
      'error',
      'single',
      {
        'allowTemplateLiterals': true,
        'avoidEscape': true
      }
    ],
    'eol-last': 'error',
    'no-prototype-builtins': 'off'
  }
};
