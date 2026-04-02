import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Navbar.module.scss';
import { getRouteAbout, getRouteMain } from '@/shared/const/router';

interface NavbarProps {
    className?: string;
}

export const Navbar = memo(({ className }: NavbarProps) => {
    const { t } = useTranslation();

    return (
        <header className={classNames(cls.Navbar, {}, [className])}>
            <nav className={cls.links}>
                <Link to={getRouteMain()}>{t('Главная')}</Link>
                <Link to={getRouteAbout()}>{t('О сайте')}</Link>
            </nav>
        </header>
    );
});
