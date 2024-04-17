import { useCallback } from "react";

export const useHttp = () => {
    const request = useCallback(
        async (
            url,
            method = "GET",
            body = null,
            headers = { "Content-Type": "application/json" }
        ) => {
            const response = await fetch(url, { method, body, headers });
            if (!response.ok) {
                throw new Error(
                    `Could not fetch ${url}, status: ${response.status}`
                );
            }
            return await response.json();
        },
        []
    );

    return {
        request,
    };
};
