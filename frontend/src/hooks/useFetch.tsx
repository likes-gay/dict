import { useEffect, useState } from "react";

type UseFetchData<T> = {
    data?: T;
};

export function useFetch<T>(url: string, ops?: RequestInit): UseFetchData<T> {
	const [data, setData] = useState<T>();

	useEffect(() => {
		const abortController = new AbortController();

		(async () => {
			const res = await fetch(url, {
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
	};
}