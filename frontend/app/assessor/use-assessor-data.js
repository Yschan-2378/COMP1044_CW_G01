"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export function useAssessorData(path) {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const session = await apiFetch("/auth/me.php");
            if (session.user?.role !== "Assessor") {
                setError("This page is only available to assessor accounts.");
                setData(null);
                return;
            }

            const next = await apiFetch(path);
            setData(next);
        } catch (err) {
            if (err.status === 401) {
                router.push("/login");
                return;
            }
            if (err.status === 403) {
                setError("This page is only available to assessor accounts.");
            } else {
                setError(err.message || "Unable to load data.");
            }
        } finally {
            setLoading(false);
        }
    }, [path, router]);

    useEffect(() => {
        // Load is the effect's external sync point: it checks the PHP session and fetches API data.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
    }, [load]);

    return { data, loading, error, reload: load };
}

export function PageState({ loading, error, empty, children }) {
    if (loading) {
        return (
            <div className="rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-[#f8f9fb] px-6 py-10 text-[15px] font-semibold text-[#5b616e]">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div
                role="alert"
                className="rounded-[24px] border border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.06)] px-6 py-5 text-[15px] font-semibold text-[#a11616]"
            >
                {error}
            </div>
        );
    }

    if (empty) {
        return (
            <div className="rounded-[24px] border border-dashed border-[rgba(91,97,110,0.3)] bg-white px-6 py-10 text-center text-[15px] text-[#5b616e]">
                No assigned records yet.
            </div>
        );
    }

    return children;
}

export function finalScore(row) {
    if (row.final_calculated_score == null) return null;
    return Number(row.final_calculated_score).toFixed(2);
}

export function markStatus(row) {
    return row.assessment_id ? "Graded" : "Pending";
}
