import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createReduxStore, StorePreloadedState } from '../config/store';

interface StoreProviderProps {
    children?: ReactNode;
    initialState?: StorePreloadedState;
}

export const StoreProvider = (props: StoreProviderProps) => {
    const { children, initialState } = props;

    const store = createReduxStore(initialState);

    return <Provider store={store}>{children}</Provider>;
};
