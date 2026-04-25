"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";

export function useApi(path, { enabled = true } = {}) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(enabled);
    const activeRequest = useRef(0);

    const load = useCallback(async () => {
        if (!path) return;
        const requestId = ++activeRequest.current;
        setLoading(true);
        setError(null);
        try {
            const result = await apiFetch(path);
            if (requestId === activeRequest.current) setData(result);
        } catch (err) {
            if (requestId === activeRequest.current) setError(err);
        } finally {
            if (requestId === activeRequest.current) setLoading(false);
        }
    }, [path]);

    useEffect(() => {
        if (enabled) load();
    }, [load, enabled]);

    return { data, error, loading, refetch: load };
}
