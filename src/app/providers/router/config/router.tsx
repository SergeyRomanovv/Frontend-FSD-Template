import { createBrowserRouter, Outlet, RouteObject } from 'react-router-dom';
import { RequireAuth } from '../ui/RequireAuth';
import { AppRouteObject } from '@/shared/types/router';
import { routeConfig } from './routeConfig';

// Преобразует AppRouteObject[] в RouteObject[] для createBrowserRouter.
// Маршруты с roles автоматически оборачиваются в структуру:
//   родительский route (RequireAuth + Outlet) → дочерний index-route (lazy).
// Это гарантирует, что чанк страницы скачивается только после проверки роли.
export function buildRouteObjects(routes: AppRouteObject[]): RouteObject[] {
    return routes.map(({ roles, children, lazy, ...rest }) => {
        if (roles?.length && lazy) {
            // rest.index имеет тип false | undefined (благодаря NonIndexRouteObject),
            // поэтому комбинация children + rest корректна для TypeScript
            return {
                ...rest,
                element: (
                    <RequireAuth roles={roles}>
                        <Outlet />
                    </RequireAuth>
                ),
                children: [{ index: true as const, lazy }],
            };
        }

        return {
            ...rest,
            ...(lazy && { lazy }),
            children: children ? buildRouteObjects(children) : undefined,
        };
    });
}

export const router = createBrowserRouter(buildRouteObjects(routeConfig));
