import {useActiveWeb3React} from "./index";
import {Contract} from '@ethersproject/contracts'
import {useCallback, useMemo} from "react";
import {getContract} from "../utils/contract_format";
import ERC20_ABI from '../constants/abis/erc20.json'
import Multisender_ABI from '../constants/abis/multisender.json'
import {ChainId, MULTICALL_ABI, MULTICALL_NETWORKS, MULTISENDER_NETWORKS} from "../constants/multicall";

function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
    const {library, account, web3} = useActiveWeb3React()

    return useMemo(() => {

        if (!address || !ABI || !library || !web3.utils.isAddress(address)) return null

        try {

            return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [library, account,address])
}


export function useMulticallContract(): Contract | null {
    const { chainId } = useActiveWeb3React();
    return useContract(MULTICALL_NETWORKS[chainId??42], MULTICALL_ABI, false)
}


export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useMultisenderContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React();
    return useContract(MULTISENDER_NETWORKS[chainId??42], Multisender_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

const ERC20_BYTES32_ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]
