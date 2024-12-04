import axios from "axios";
const fetcher = (url: string): Promise<any> => axios.get(url).then(res => res.data);

type Direction = "before" | "after";

export const getMore = async (
    channel: string,
    offset: number,
    direction: Direction = "after"
): Promise<any> => {
    const apiHost = process.env.NEXT_PUBLIC_API_HOST;
    const url = `${apiHost}/v1/more/${channel}/${direction}/${offset}`;
    return await fetcher(url);
};
