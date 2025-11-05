import { useState, useCallback } from "react";
import axios from "axios";
import type { PreviewData } from "@/types/channels";

interface UsePreviewResult {
    data: PreviewData | null;
    loading: boolean;
    error: any;
    notFound: boolean;
    fetchPreview: (channel: string) => Promise<PreviewData | null>;
    reset: () => void;
}

export const usePreview = (): UsePreviewResult => {
    const [data, setData] = useState<PreviewData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [notFound, setNotFound] = useState(false);

    const fetchPreview = useCallback(async (channel: string) => {
        setLoading(true);
        setError(null);
        setNotFound(false);

        try {
            const apiHost = process.env.NEXT_PUBLIC_API_HOST;
            const url = `${apiHost}/v1/preview/${channel}`;
            const response = await axios.get<PreviewData>(url);
            setData(response.data);
            setNotFound(false);
            return response.data;
        } catch (err: any) {
            if (err.response?.status === 404) {
                setNotFound(true);
                setData(null);
                return null;
            } else {
                setError(err);
                throw err;
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setNotFound(false);
        setLoading(false);
    }, []);

    return {
        data,
        loading,
        error,
        notFound,
        fetchPreview,
        reset
    };
};
