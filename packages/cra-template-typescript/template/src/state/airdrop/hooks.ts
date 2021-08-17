import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, AppState} from "../index";
import {useCallback} from "react";
import {setConfig, setTx} from "./actions";
import {AirDropState} from "./reducer";


export const useSetConfigs = () => {
    const dispatch = useDispatch<AppDispatch>();
    return useCallback((config: AirDropState) => {
        dispatch(setConfig(config),);
    }, [dispatch])
}
export const useSetTx = () => {
    const dispatch = useDispatch<AppDispatch>();
    return useCallback((tx: string) => {
        dispatch(setTx(tx));
    }, [dispatch])
}

export const useGetConfigs = (): AirDropState => {
    const config = useSelector((state: AppState) => state.airdropstate)
    return config;
}
