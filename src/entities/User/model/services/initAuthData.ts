import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { User } from '../types/user';

// Заготовка для инициализации авторизации при старте приложения.
// Реализуй логику получения текущего пользователя под свой стек:
//   - cookie/session  → GET /auth/me
//   - JWT             → проверка токена, refresh при необходимости
//   - OAuth           → обмен кода на токен и получение профиля
export const initAuthData = createAsyncThunk<User, void, ThunkConfig<string>>(
    'user/initAuthData',
    async (_, { extra, rejectWithValue }) => {
        try {
            // TODO: заменить на реальный запрос
            // const { data } = await extra.api.get<User>('/auth/me');
            // return data;

            return rejectWithValue('Не реализовано');
        } catch {
            return rejectWithValue('Ошибка инициализации авторизации');
        }
    },
);
