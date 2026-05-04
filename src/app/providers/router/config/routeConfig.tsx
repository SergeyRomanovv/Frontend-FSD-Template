import App from '@/app/App';
import { ForbiddenPage } from '@/pages/ForbiddenPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ErrorPage } from '@/widgets/ErrorPage';
import { UserRole } from '@/entities/User';
import {
    getRouteAbout,
    getRouteAdmin,
    getRouteForbidden,
    getRouteMain,
} from '@/shared/const/router';
import { AppRouteObject } from '@/shared/types/router';

export const routeConfig: AppRouteObject[] = [
    {
        element: <App />,
        errorElement: <ErrorPage />,
        HydrateFallback: () => null,
        children: [
            {
                path: getRouteMain(),
                lazy: async () => {
                    const { default: Component } =
                        await import('@/pages/MainPage/ui/MainPage');
                    return { Component };
                },
            },
            {
                path: getRouteAbout(),
                lazy: async () => {
                    const { default: Component } =
                        await import('@/pages/AboutPage/ui/AboutPage');
                    return { Component };
                },
            },
            {
                path: getRouteAdmin(),
                roles: [UserRole.MANAGER, UserRole.ADMIN],
                lazy: async () => {
                    const { default: Component } =
                        await import('@/pages/AdminPanelPage/ui/AdminPanelPage');
                    return { Component };
                },
            },
            {
                path: getRouteForbidden(),
                element: <ForbiddenPage />,
            },
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
];
