import axios from "axios";

export const apiRequest = async (method: "GET" | "POST", apiUrl: string, params?: Record<string, any>, headers?: object) => {
    const request = await axios({
        url: `${process.env.NEXT_PUBLIC_API_HOST}/v1/${apiUrl}`,
        method: method,
        params: params,
        headers: {
            "BackEndSecret": process.env.BACKEND_SECRET || "",
            ...headers
        }
    });
    return request.data;
}
