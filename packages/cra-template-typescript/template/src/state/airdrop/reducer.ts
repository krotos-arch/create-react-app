import BigNumber from "bignumber.js";
import {createReducer} from "@reduxjs/toolkit";
import {setConfig, setTx} from "./actions";


export interface BillingMsg {
    adds: string,
    amount: string,

}

export interface AirDropState {
    readonly listBillingMsg: Array<BillingMsg>
    readonly erc20adds: string,
    tx?:string

}

const initialState: AirDropState = {
    listBillingMsg: [

    ],
    erc20adds: "",
}


export default createReducer(initialState, builder =>
    builder
        .addCase(setConfig, (state, action) => {
            const { listBillingMsg, erc20adds } = action.payload
            state.erc20adds = erc20adds;
            state.listBillingMsg = listBillingMsg;
        })
        .addCase(setTx, (state, action) => {
            state.tx = action.payload;
        })
)
