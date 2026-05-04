import { screen } from '@testing-library/react';
import { routerRender } from '@/shared/lib/tests/componentRender/componentRender';
import { getRouteAbout, getRouteAdmin } from '@/shared/const/router';
import { UserRole } from '@/entities/User';

describe('app/router', () => {
    test('Страница должна отрендериться', async () => {
        routerRender(getRouteAbout());
        const page = await screen.findByTestId('AboutPage');
        expect(page).toBeInTheDocument();
    });

    test('Страница не найдена', async () => {
        routerRender('/asfasfasfasf');
        const page = await screen.findByTestId('NotFoundPage');
        expect(page).toBeInTheDocument();
    });

    test('Редирект неавторизованного пользователя на главную', async () => {
        routerRender(getRouteAdmin());
        const page = await screen.findByTestId('MainPage');
        expect(page).toBeInTheDocument();
    });

    test('Доступ к закрытой странице для авторизованного пользователя', async () => {
        routerRender(getRouteAdmin(), {
            initialState: {
                user: {
                    _inited: true,
                    authData: {
                        id: '2',
                        username: 'admin',
                        roles: [UserRole.ADMIN],
                    },
                },
            },
        });
        const page = await screen.findByTestId('AdminPanelPage');
        expect(page).toBeInTheDocument();
    });

    test('Доступ запрещён (отсутствует роль)', async () => {
        routerRender(getRouteAdmin(), {
            initialState: {
                user: {
                    _inited: true,
                    authData: { id: '3', username: 'user' },
                },
            },
        });
        const page = await screen.findByTestId('ForbiddenPage');
        expect(page).toBeInTheDocument();
    });
});
