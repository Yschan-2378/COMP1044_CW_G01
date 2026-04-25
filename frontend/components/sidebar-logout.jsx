"use client";

import { useRouter } from "next/navigation";
import { SignOut } from "@phosphor-icons/react/dist/icons/SignOut";
import { apiFetch } from "@/lib/api";

function SidebarLogout() {
    const router = useRouter();

    async function handleLogout() {
        try {
            await apiFetch("/auth/logout.php", { method: "POST" });
        } finally {
            router.replace("/login");
        }
    }

    return (
        <button
            type="button"
            title="Logout"
            onClick={handleLogout}
            className="relative flex h-12 w-full items-center justify-center text-white/85 transition-all duration-200 hover:bg-white/10 hover:text-white group-hover:justify-start group-hover:px-3 group-focus-within:justify-start group-focus-within:px-3"
        >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                <SignOut size={20} weight="bold" />
            </span>
            <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap text-[15px] font-semibold opacity-0 transition-all duration-200 group-hover:ml-2 group-hover:max-w-[160px] group-hover:opacity-100 group-focus-within:ml-2 group-focus-within:max-w-[160px] group-focus-within:opacity-100">
                Logout
            </span>
        </button>
    );
}

export default SidebarLogout;
