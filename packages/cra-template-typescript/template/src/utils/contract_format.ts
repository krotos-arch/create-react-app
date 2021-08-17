

// account is optional
import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers";
import {Contract} from "@ethersproject/contracts";
import {AddressZero} from "@ethersproject/constants";
import {getAddress} from "@ethersproject/address";

export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
    if (!isAddress(address) || address === AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }

    return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}


// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
    return account ? getSigner(library, account) : library
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
    return library.getSigner(account).connectUnchecked()
}


// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
    try {
        return getAddress(value)
    } catch {
        return false
    }
}
