import { RouteObject } from 'react-router-dom';
import { UserRole } from '@/entities/User';

// RouteObject — это union IndexRouteObject | NonIndexRouteObject.
// Исключаем index-маршруты (index: true), чтобы поле index
// имело тип false | undefined, а не boolean — иначе TypeScript
// запрещает комбинацию children + index на маршрутах с дочерними роутами.
type NonIndexRouteObject = Exclude<RouteObject, { index: true }>;

export interface AppRouteObject extends Omit<NonIndexRouteObject, 'children'> {
    // Роли для защиты маршрута — при наличии buildRouteObjects
    // автоматически оборачивает в RequireAuth + Outlet → lazy-дочерний роут
    roles?: UserRole[];
    children?: AppRouteObject[];
}
