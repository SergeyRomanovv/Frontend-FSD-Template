import { useTranslation } from 'react-i18next';
import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '@/shared/lib/classNames/classNames';
import { AppLink } from '@/shared/ui/AppLink';
import { Button } from '@/shared/ui/Button';
import { userActions } from '@/entities/User';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { getRouteMain } from '@/shared/const/router';
import cls from './Navbar.module.scss';
import { navbarLinks } from '../model/navbarLinks';

interface NavbarProps {
    className?: string;
}

export const Navbar = memo(({ className }: NavbarProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const onLogout = useCallback(() => {
        dispatch(userActions.logout());
    }, [dispatch]);

    return (
        <header className={classNames(cls.Navbar, {}, [className])}>
            <div className={cls.left}>
                <Link to={getRouteMain()} className={cls.logo}>
                    {'App'}
                </Link>
                <span className={cls.divider} />
                <nav className={cls.links}>
                    {navbarLinks.map(({ path, labelKey, end }) => (
                        <AppLink
                            key={path}
                            to={path}
                            activeClassName={cls.activeLink}
                            end={end}
                        >
                            {t(labelKey)}
                        </AppLink>
                    ))}
                </nav>
            </div>
            <Button variant="outline" onClick={onLogout}>
                {t('Выйти')}
            </Button>
        </header>
    );
});
