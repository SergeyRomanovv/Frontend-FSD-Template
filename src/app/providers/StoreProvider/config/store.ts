import {
    combineReducers,
    configureStore,
    StateFromReducersMapObject,
} from '@reduxjs/toolkit';
import { PreloadedStateShapeFromReducersMapObject } from 'redux';
import { counterReducer } from '@/entities/Counter';
import { userReducer } from '@/entities/User';
import { $api } from '@/shared/api/api';
import { uiReducer } from '@/features/UI';
import { rtkApi } from '@/shared/api/rtkApi';
import { ThunkExtraArg } from './StateSchema';

export const rootReducers = {
    counter: counterReducer,
    user: userReducer,
    ui: uiReducer,
    [rtkApi.reducerPath]: rtkApi.reducer,
};

export const rootReducer = combineReducers(rootReducers);

export type RootState = StateFromReducersMapObject<typeof rootReducers>;
export type StorePreloadedState = Partial<
    PreloadedStateShapeFromReducersMapObject<typeof rootReducers>
>;

export function createReduxStore(initialState?: StorePreloadedState) {
    const extraArg: ThunkExtraArg = {
        api: $api,
    };

    const store = configureStore({
        reducer: rootReducer,
        devTools: __IS_DEV__,
        preloadedState: initialState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                thunk: {
                    extraArgument: extraArg,
                },
            }).concat(rtkApi.middleware),
    });

    return store;
}

export type AppDispatch = ReturnType<typeof createReduxStore>['dispatch'];
