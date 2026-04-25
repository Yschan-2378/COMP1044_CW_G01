"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function SidebarItem({
    href = "#",
    icon: Icon,
    label,
    active,
    exact = false,
    className = "",
    ...props
}) {
    const pathname = usePathname();
    const isActive =
        active ??
        (href !== "#" &&
            (exact
                ? pathname === href
                : pathname === href || pathname?.startsWith(`${href}/`)));

    return (
        <Link
            href={href}
            title={label}
            className={`relative flex h-12 w-full items-center justify-center text-white transition-all duration-200 group-hover:justify-start group-hover:px-3 group-focus-within:justify-start group-focus-within:px-3 ${
                isActive
                    ? "text-white"
                    : "text-white/85 hover:text-white hover:bg-white/10"
            } ${className}`}
            {...props}
        >
            {isActive && (
                <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white" />
            )}

            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                <Icon size={20} weight="bold" />
            </span>

            <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap text-[15px] font-semibold opacity-0 transition-all duration-200 group-hover:ml-2 group-hover:max-w-[160px] group-hover:opacity-100 group-focus-within:ml-2 group-focus-within:max-w-[160px] group-focus-within:opacity-100">
                {label}
            </span>
        </Link>
    );
}

export default SidebarItem;
