"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import AdminSidebar from "./admin-sidebar";
import AssessorSidebar from "./assessor-sidebar";

function isAssessorPath(pathname) {
    return pathname === "/assessor" || pathname?.startsWith("/assessor/");
}

function AppShell({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const hideChrome = pathname?.startsWith("/login");
    const isAssessor = isAssessorPath(pathname);

    const [session, setSession] = useState(null);
    const [checking, setChecking] = useState(!hideChrome);

    useEffect(() => {
        if (hideChrome) {
            setChecking(false);
            return;
        }

        let cancelled = false;
        setChecking(true);

        (async () => {
            try {
                const data = await apiFetch("/auth/me.php");
                if (cancelled) return;
                const role = data.user?.role;
                if (!role) {
                    router.replace("/login");
                    return;
                }
                if (isAssessor && role !== "Assessor") {
                    router.replace("/dashboard");
                    return;
                }
                if (!isAssessor && role !== "Admin") {
                    router.replace("/assessor");
                    return;
                }
                setSession(data.user);
                setChecking(false);
            } catch (err) {
                if (cancelled) return;
                router.replace("/login");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [pathname, hideChrome, isAssessor, router]);

    if (hideChrome) {
        return children;
    }

    if (checking || !session) {
        return (
            <main className="flex h-screen w-full items-center justify-center bg-white text-[15px] font-semibold text-[#5b616e]">
                Loading...
            </main>
        );
    }

    return (
        <>
            {isAssessor ? <AssessorSidebar /> : <AdminSidebar />}
            {children}
        </>
    );
}

export default AppShell;
