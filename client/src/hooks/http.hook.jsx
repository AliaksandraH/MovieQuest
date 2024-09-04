import { useCallback } from "react";

export const useHttp = () => {
    const request = useCallback(
        async (
            url,
            method = "GET",
            body = null,
            headers = { "Content-Type": "application/json" }
        ) => {
            try {
                let requestUrl = url;
                let options = { method, headers };

                if (method === "GET" && body) {
                    const queryParams = new URLSearchParams(body).toString();
                    requestUrl += `/?${queryParams}`;
                } else if (body) {
                    options.body = JSON.stringify(body);
                }

                const response = await fetch(requestUrl, options);

                return await response.json();
            } catch (error) {
                console.log("--- error ---", error, url);
            }
        },
        []
    );

    return {
        request,
    };
};
