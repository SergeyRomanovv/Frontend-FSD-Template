import { StoreProvider } from './ui/StoreProvider';
import {
    AppDispatch,
    createReduxStore,
    RootState,
    StorePreloadedState,
} from './config/store';
import type { StateSchema, ThunkConfig } from './config/StateSchema';

export { StoreProvider, createReduxStore };

export type {
    StateSchema,
    AppDispatch,
    ThunkConfig,
    RootState,
    StorePreloadedState,
};
