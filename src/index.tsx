import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { StoreProvider } from '@/app/providers/StoreProvider';
import { router } from '@/app/providers/router';
import '@/app/styles/index.scss';
import './shared/config/i18n/i18n';
import { ErrorBoundary } from './app/providers/ErrorBoundary';

const container = document.getElementById('root');

if (!container) {
    throw new Error(
        'Контейнер root не найден. НЕ удалось вмонтировать реакт приложение',
    );
}

const root = createRoot(container);

root.render(
    <StoreProvider>
        <ErrorBoundary>
            <ThemeProvider>
                <RouterProvider router={router} />
            </ThemeProvider>
        </ErrorBoundary>
    </StoreProvider>,
);
export { Theme } from '@/shared/const/theme';
