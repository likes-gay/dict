import { useEffect, useState } from "react";

type UseFetchData<T> = {
    data?: T;
};

export function useFetch<T>(url: string, ops?: RequestInit): UseFetchData<T> {
    const [data, setData] = useState<T>();
	const newUrl = new URL(url, "http://localhost:3000"); //http://localhost:3000 http://192.168.1.140:3000

    useEffect(() => {
        const abortController = new AbortController();

        (async () => {
            const res = await fetch(newUrl.href, {
                ...ops,
                signal: abortController.signal
            });
            const json: T = await res.json();
            
			setData(json);
        })();

        return () => abortController.abort();
    }, []);

    return {
        data
    }
}