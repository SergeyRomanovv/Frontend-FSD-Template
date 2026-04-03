import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import i18nextPlugin from 'eslint-plugin-i18next';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

export default [
    {
        ignores: [
            'node_modules/**',
            'build/**',
            'coverage/**',
            '.fttemplates/**',
        ],
    },
    js.configs.recommended,
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                __IS_DEV__: 'readonly',
                __API__: 'readonly',
                __PROJECT__: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'jsx-a11y': jsxA11yPlugin,
            import: importPlugin,
            i18next: i18nextPlugin,
            'unused-imports': unusedImportsPlugin,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            'unused-imports/no-unused-imports': 'error',
            'react/jsx-filename-extension': [
                2,
                {
                    extensions: ['.js', '.jsx', '.tsx'],
                },
            ],
            'import/no-unresolved': 'off',
            'import/prefer-default-export': 'off',
            'no-unused-vars': 'off',
            'react/require-default-props': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/jsx-props-no-spreading': 'warn',
            'react/function-component-definition': 'off',
            'no-shadow': 'off',
            'import/extensions': 'off',
            'import/no-extraneous-dependencies': 'off',
            'no-underscore-dangle': 'off',
            'i18next/no-literal-string': [
                'error',
                {
                    markupOnly: true,
                    ignoreAttribute: [
                        'data-testid',
                        'to',
                        'target',
                        'justify',
                        'align',
                        'direction',
                        'gap',
                        'role',
                        'as',
                        'border',
                        'feature',
                        'color',
                        'variant',
                        'size',
                        'wrap',
                    ],
                },
            ],
            'max-len': [
                'error',
                {
                    ignoreComments: true,
                    code: 125,
                },
            ],
            'jsx-a11y/no-static-element-interactions': 'off',
            'jsx-a11y/click-events-have-key-events': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'error',
            'no-param-reassign': 'off',
            'no-undef': 'off',
            'react/no-array-index-key': 'off',
            'arrow-body-style': 'off',
            'react/jsx-max-props-per-line': ['error', { maximum: 4 }],
            'react/no-unstable-nested-components': 'warn',
        },
    },
    {
        files: ['**/src/**/*.{test,stories}.{ts,tsx}'],
        rules: {
            'i18next/no-literal-string': 'off',
            'max-len': 'off',
        },
    },
];
