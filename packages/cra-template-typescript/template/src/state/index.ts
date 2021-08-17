import { configureStore } from '@reduxjs/toolkit'
import airdropstate from "./airdrop/reducer";
import multicall from "./multicall/reducer";
import transactions from "./transactions/reducer";
import application from "./application/reducer";
import lists from "./lists/reducer";
import user from "./user/reducer";

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']

const store = configureStore({
    reducer: {
        airdropstate,
        multicall,
        application,
        transactions,
        lists,
        user,
    },
/*    middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PERSISTED_KEYS })],
    preloadedState: load({ states: PERSISTED_KEYS })*/
})


export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
