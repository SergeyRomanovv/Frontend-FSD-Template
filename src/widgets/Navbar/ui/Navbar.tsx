import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { classNames } from '@/shared/lib/classNames/classNames';
import { getUserAuthData, UserRole, userActions } from '@/entities/User';
import { HStack } from '@/shared/ui/Stack';
import cls from './Navbar.module.scss';
import { Button } from '@/shared/ui/Button';
import {
    getRouteAbout,
    getRouteAdmin,
    getRouteMain,
} from '@/shared/const/router';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';

interface NavbarProps {
    className?: string;
}

export const Navbar = memo(({ className }: NavbarProps) => {
    const { t } = useTranslation();
    const authData = useSelector(getUserAuthData);
    const dispatch = useAppDispatch();

    return (
        <header className={classNames(cls.Navbar, {}, [className])}>
            <HStack gap="16" className={cls.links}>
                <Link to={getRouteMain()}>{t('Главная')}</Link>
                <Link to={getRouteAbout()}>{t('О сайте')}</Link>
                <Link to={getRouteAdmin()}>{t('Админ панель')}</Link>
            </HStack>
            <HStack gap="16" className={cls.actions}>
                {!authData && (
                    <>
                        <Button
                            variant="outline"
                            onClick={() =>
                                dispatch(
                                    userActions.setAuthData({
                                        id: '1',
                                        username: 'user',
                                        roles: [UserRole.USER],
                                    }),
                                )
                            }
                        >
                            {t('Войти как user')}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                dispatch(
                                    userActions.setAuthData({
                                        id: '2',
                                        username: 'admin',
                                        roles: [UserRole.ADMIN],
                                    }),
                                )
                            }
                        >
                            {t('Войти как admin')}
                        </Button>
                    </>
                )}
                {authData && (
                    <Button
                        variant="outline"
                        onClick={() => dispatch(userActions.logout())}
                    >
                        {t('Выйти')}
                    </Button>
                )}
            </HStack>
        </header>
    );
});
