import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // 'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'no-unused-vars': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // File cấu hình (vite.config.js…) chạy trên Node, không phải trình duyệt → có `process`
  {
    files: ['*.config.js'],
    languageOptions: { globals: globals.node },
  },
  // Context export kèm hook (useAuth…) là chủ ý; quy tắc này chỉ ảnh hưởng hot-reload lúc dev
  {
    files: ['src/contexts/**/*.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
]
