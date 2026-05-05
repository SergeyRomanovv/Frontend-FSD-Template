import {
    getRouteAbout,
    getRouteAdmin,
    getRouteMain,
} from '@/shared/const/router';

export interface NavbarLinkType {
    path: string;
    labelKey: string;
    end?: boolean;
}

export const navbarLinks: NavbarLinkType[] = [
    { path: getRouteMain(), labelKey: 'Главная', end: true },
    { path: getRouteAbout(), labelKey: 'О сайте' },
    { path: getRouteAdmin(), labelKey: 'Админ панель' },
];
