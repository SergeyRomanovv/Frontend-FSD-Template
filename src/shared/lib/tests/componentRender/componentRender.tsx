import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import {
    createMemoryRouter,
    MemoryRouter,
    RouterProvider,
} from 'react-router-dom';
import i18nForTests from '@/shared/config/i18n/i18nForTests';
import {
    StorePreloadedState,
    StoreProvider,
} from '@/app/providers/StoreProvider';
import { Theme } from '@/shared/const/theme';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { buildRouteObjects } from '@/app/providers/router/config/router';
import { routeConfig } from '@/app/providers/router/config/routeConfig';
import '@/app/styles/index.scss';

export interface componentRenderOptions {
    route?: string;
    initialState?: StorePreloadedState;
    theme?: Theme;
}

export interface routerRenderOptions {
    initialState?: StorePreloadedState;
}

// Общий базовый слой провайдеров без роутера — используется внутри обоих хелперов
function TestProviders({
    children,
    initialState,
    theme = Theme.LIGHT,
}: {
    children: ReactNode;
    initialState?: StorePreloadedState;
    theme?: Theme;
}) {
    return (
        <StoreProvider initialState={initialState}>
            <I18nextProvider i18n={i18nForTests}>
                <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
            </I18nextProvider>
        </StoreProvider>
    );
}

interface TestProviderProps {
    children: ReactNode;
    options?: componentRenderOptions;
}

// Для unit-тестов компонентов: даёт router-контекст, рендерит переданный children
export function TestProvider(props: TestProviderProps) {
    const { children, options = {} } = props;
    const { route = '/', initialState, theme = Theme.LIGHT } = options;

    return (
        <MemoryRouter initialEntries={[route]}>
            <TestProviders initialState={initialState} theme={theme}>
                <div className={`app ${theme}`}>{children}</div>
            </TestProviders>
        </MemoryRouter>
    );
}

export function componentRender(
    component: ReactNode,
    options: componentRenderOptions = {},
) {
    return render(<TestProvider options={options}>{component}</TestProvider>);
}

// Для интеграционных тестов роутинга: рендерит реальный routeConfig, тестирует URL → страница
export function routerRender(route: string, options: routerRenderOptions = {}) {
    const { initialState } = options;

    const testRouter = createMemoryRouter(buildRouteObjects(routeConfig), {
        initialEntries: [route],
        hydrationData: {},
    });

    return render(
        <TestProviders initialState={initialState}>
            <RouterProvider router={testRouter} />
        </TestProviders>,
    );
}
