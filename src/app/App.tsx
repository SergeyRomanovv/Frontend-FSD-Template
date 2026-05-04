import { memo, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { classNames } from '@/shared/lib/classNames/classNames';
import { getUserInited, initAuthData } from '@/entities/User';
import { Navbar } from '@/widgets/Navbar';
import { useTheme } from '@/shared/lib/hooks/useTheme/useTheme';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { MainLayout } from '@/shared/layouts/MainLayout';
import { AppLoaderLayout } from '@/shared/layouts/AppLoaderLayout';
import { Sidebar } from '@/widgets/SideBar';

const App = memo(() => {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const inited = useSelector(getUserInited);

    useEffect(() => {
        if (!inited) {
            dispatch(initAuthData());
        }
    }, [dispatch, inited]);

    if (!inited) {
        return (
            <div id="app" className={classNames('app', {}, [theme])}>
                <AppLoaderLayout />
            </div>
        );
    }

    return (
        <div id="app" className={classNames('app', {}, [theme])}>
            <MainLayout
                header={<Navbar />}
                content={<Outlet />}
                sidebar={<Sidebar />}
            />
        </div>
    );
});

export default App;
