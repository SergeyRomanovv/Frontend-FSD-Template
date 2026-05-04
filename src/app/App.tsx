import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Navbar } from '@/widgets/Navbar';
import { useTheme } from '@/shared/lib/hooks/useTheme/useTheme';
import { MainLayout } from '@/shared/layouts/MainLayout';
import { Sidebar } from '@/widgets/SideBar';

const App = memo(() => {
    const { theme } = useTheme();

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
