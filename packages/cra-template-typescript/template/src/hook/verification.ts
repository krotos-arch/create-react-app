import {useTokenContract} from "./useContract";
import {NEVER_RELOAD, useSingleCallResult} from "../state/multicall/hooks";
import React, {useCallback, useContext} from "react";
import {UnControlled} from "react-codemirror2";
import {IndexContext} from "../view";
import {useActiveWeb3React} from "./index";
import {useSetConfigs} from "../state/airdrop/hooks";
import {BillingMsg} from "../state/airdrop/reducer";

const ERRNAME = 'tis_err';
export const useVerAdds = (adds: string) => {
    const myRef: any = React.createRef<UnControlled>();

    const {transferList: [value, setValue],handleNext} = useContext(IndexContext);
    const {web3} = useActiveWeb3React();
    const setConfigs = useSetConfigs();
    const tokenContract = useTokenContract(adds);
    const symbol = useSingleCallResult(tokenContract, 'symbol', undefined, NEVER_RELOAD);
    const decimals = useSingleCallResult(tokenContract, 'decimals', undefined, NEVER_RELOAD);
    const addLineClass = useCallback((i: number) => {
        if (myRef.current) {
            myRef.current.editor.doc.addLineClass(i, 'span', ERRNAME);
        }
    }, [myRef]);

    const removeLineClass = useCallback((i: number) => {
        if (myRef.current) {
            myRef.current.editor.doc.removeLineClass(i, 'span', ERRNAME);
        }
    }, [myRef]);

    const verificationFn = useCallback(() => {
        if (!myRef.current) return;
        const _listValue: Array<BillingMsg> = myRef.current.editor.doc.getValue().split('\n').map((ev: String) => {
            let _item = ev.split(',');
            return {
                adds: _item[0],
                amount: _item[1]
            };
        });

        let success = true;
        _listValue.forEach((_item, i) => {

            if (!_item.adds || !_item.amount) {
                addLineClass(i);
                success = false;
                return
            }
            if (!web3.utils.isAddress(_item.adds)) {
                success = false;
                addLineClass(i);
                return
            }
            removeLineClass(i);
        });
        if (success && symbol.result?.length) {
            setConfigs({erc20adds: adds,listBillingMsg:_listValue});
            handleNext(1);
        }
    }, [myRef, web3, addLineClass, removeLineClass, symbol, setConfigs, adds,value]);


    return {
        verificationFn,
        myRef,
        value,
        setValue,
        symbol,
        decimals: decimals.result
    };
}


