import {useMemo} from "react";
import {useSingleContractMultipleData} from "../state/multicall/hooks";
import {useMulticallContract} from "./useContract";
import {isAddress} from "../utils/contract_format";
import BigNumber from "bignumber.js";


export function useETHBalances(
    uncheckedAddresses?: (string | undefined)[]
): { [address: string]: BigNumber } {
    const multicallContract = useMulticallContract()

    const addresses: string[] = useMemo(
        () =>
            uncheckedAddresses
                ? uncheckedAddresses
                    .map(isAddress)
                    .filter((a): a is string => a !== false)
                    .sort()
                : [],
        [uncheckedAddresses]
    )

    const results = useSingleContractMultipleData(
        multicallContract,
        'getEthBalance',
        addresses.map(address => [address])
    )
    return useMemo(
        () => {
            return addresses.reduce<{ [address: string]: any }>((memo, address, i) => {
                    const value = results?.[i]?.result?.[0];
                    if (value) memo[address] = value._hex;
                    return memo
                }, {}
            );
        },
        [addresses, results]
    )
}
