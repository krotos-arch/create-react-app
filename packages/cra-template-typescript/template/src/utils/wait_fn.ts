import {useCallback, useState} from "react";


export const useWait = <T>(backFn:Function)=>{
    const [status,setStatus] = useState<HttpStatus>(HttpStatus.start);
    const [data,setData] = useState<T | any>();

    const request = useCallback(async (ev:any):Promise<any> => {
        try {
            setStatus(HttpStatus.wait);
            let data = await backFn(ev);

            setData(data);
            setStatus(HttpStatus.success);
        }catch (e) {
            let a:any = {err:e};
            setData(a);
            setStatus(HttpStatus.failure);
        }


    },[setStatus,setData,backFn]);

    return {
        status,
        request,
        data
    };
}


export enum HttpStatus{
    start,
    wait,
    success,
    failure
}




