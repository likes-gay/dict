import { useEffect, useState } from "react";

type UseFetchData<T> = {
    data?: T;
    isLoading: boolean;
}

export function useFetch<T>(url: string, ops?: RequestInit): UseFetchData<T> {
    const [data, setData] = useState<T | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();

        (async () => {
            const data = await fetch(url, {
                ...ops,
                signal: abortController.signal
            });
            
            setIsLoading(false);
            
        })();

        return () => abortController.abort();
    }, []);

    return {
        data,
        isLoading
    }
}