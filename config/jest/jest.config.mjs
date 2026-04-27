import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('jest').Config} */
const config = {
    // === Глобальные переменные приложения в тестовом окружении ===
    globals: {
        __IS_DEV__: true,
        __API__: '',
        __PROJECT__: 'jest',
    },

    // === Базовое поведение раннера ===
    clearMocks: true,
    testEnvironment: '<rootDir>/config/jest/jsdomEnvironment.js',
    rootDir: '../../',

    // === Поиск тестов ===
    // Единый паттерн для .test/.spec в ts/tsx/js/jsx
    testMatch: ['<rootDir>src/**/*(*.)@(spec|test).[tj]s?(x)'],
    coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],

    // === Резолв модулей ===
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
    moduleDirectories: ['node_modules'],
    modulePaths: ['<rootDir>src'],
    moduleNameMapper: {
        // CSS/SCSS модули заменяем прокси-объектом (className всегда = имени класса)
        '\\.s?css$': 'identity-obj-proxy',
        // SVG-иконки заменяем пустым React-компонентом
        '\\.svg': path.resolve(__dirname, 'jestEmptyComponent.tsx'),
        // Алиасы @/ -> src/
        '^@/(.*)$': '<rootDir>/src/$1',
    },

    // === Инициализация фреймворка перед каждым тестом ===
    setupFilesAfterEnv: ['<rootDir>config/jest/setupTests.ts'],

    // === Репортеры ===
    reporters: [
        'default',
        [
            'jest-html-reporters',
            {
                publicPath: '<rootDir>/reports/unit',
                filename: 'report.html',
                openReport: false,
                inlineSource: true,
            },
        ],
    ],
};

export default config;
