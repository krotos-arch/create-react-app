import { createAction } from '@reduxjs/toolkit'
import {AirDropState} from "./reducer";



export const setConfig = createAction<AirDropState>('airdrop/setErc20');

export const setTx = createAction<string>('airdrop/setTx');

