import MainIcon from '@/shared/assets/icons/home.svg';
import AboutIcon from '@/shared/assets/icons/Info.svg';
import AdminIcon from '@/shared/assets/icons/profile-20-20.svg';

import { SidebarItemType } from '../types/sidebar';
import {
    getRouteAbout,
    getRouteAdmin,
    getRouteMain,
} from '@/shared/const/router';

export const useSidebarItems = () => {
    const sidebarItemsList: SidebarItemType[] = [
        {
            path: getRouteMain(),
            Icon: MainIcon,
            text: 'Главная',
        },
        {
            path: getRouteAbout(),
            Icon: AboutIcon,
            text: 'О сайте',
        },
        {
            path: getRouteAdmin(),
            Icon: AdminIcon,
            text: 'Админ панель',
        },
    ];

    return sidebarItemsList;
};
