import BigNumber from 'bignumber.js'
import {Result} from "../state/multicall/hooks";

export const getBalanceNumber = (ev: BigNumber | string | number, display = 4, decimals = 18) => {

    let balance;
    if (!ev) return 0
    if (typeof ev === 'string' || typeof ev === 'number') {
        balance = new BigNumber(ev);
    } else {
        balance = ev;
    }
    const displayBalance = balance.div(new BigNumber(10).pow(decimals));
    return parseFloat(displayBalance.toFixed(display + 1).slice(0, -1))
};

export function getBalanceFormat(ev: any, display = 4,) {
    let num: any = getBalanceNumber(ev, display).toString().split(".");
    let arr = num[0].split("").reverse();
    let res: any = [];
    for (let i = 0, len = arr.length; i < len; i++) {
        if (i % 3 === 0 && i !== 0) {
            res.push(",");
        }
        res.push(arr[i]);
    }
    res.reverse();
    if (num[1]) {

        while (num[1].length < display) {
            num[1] += '0';
        }
        res = res.join("").concat("." + num[1]);
    } else {

        if (display != 0)
            res = res.join("").concat("." + (new Array(display)).fill(0).join(''));
        else
            res = res.join("");
    }
    return res;
}

export const getHexNumber = (ev:Result | undefined, display = 4, decimals = 18) => {
    ev = ev && ev[0]._hex;
    let balance:any;
    if (!ev) return 0
    if (typeof ev === 'string' || typeof ev === 'number') {
        balance = new BigNumber(ev);
    } else {
        balance = ev;
    }
    const displayBalance = balance.div(new BigNumber(10).pow(decimals));
    return parseFloat(displayBalance.toFixed(display + 1).slice(0, -1))
};


export const getDisplayBalance = (balance: BigNumber, decimals = 18) => {
    const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals));
    if (displayBalance.lt(1)) {
        return displayBalance.toPrecision(4)
    } else {
        return displayBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
};


export const numberToUint256 = (balance: number | string): BigNumber => {
    // if(typeof balance == "string") balance = parseFloat(balance)
    return new BigNumber(balance).times(1e18)
}

export const formatAddress = (address: string, decimals: number = 6) => {
    if(!address) return  '';
    return address.slice(0, decimals) + '...' + address.slice(-decimals)
}
