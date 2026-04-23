import Link from "next/link";

import { Circle } from "lucide-react";

export function Sidebar({ children, className = "", ...props }) {
    return (
        <aside
            className={`group flex h-screen w-[72px] flex-col overflow-hidden bg-[#0052ff] text-white transition-all duration-300 hover:w-[220px] ${className}`}
            {...props}
        >
            {children}
        </aside>
    );
}

export function SidebarHeader({ className = "", ...props }) {
    return (
        <div
            className={`flex h-16 items-center justify-center px-4 transition-all duration-200 group-hover:justify-start ${className}`}
            {...props}
        >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[#0052ff]">
                <Circle size={18} fill="currentColor" strokeWidth={0} />
            </div>

            <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap text-[18px] font-semibold opacity-0 transition-all duration-200 group-hover:ml-3 group-hover:max-w-[180px] group-hover:opacity-100">
                Internship Portal
            </span>
        </div>
    );
}

export function SidebarTitle({ children, className = "", ...props }) {
    return (
        <span
            className={`whitespace-nowrap text-[18px] font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${className}`}
            {...props}
        >
            {children}
        </span>
    );
}

export function SidebarContent({ children, className = "", ...props }) {
    return (
        <div className={`flex-1 px-2 py-3 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function SidebarGroup({ children, className = "", ...props }) {
    return (
        <div className={`mb-4 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function SidebarGroupLabel({ children, className = "", ...props }) {
    return (
        <div
            className={`mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function SidebarNav({ children, className = "", ...props }) {
    return (
        <nav className={`flex flex-col  ${className}`} {...props}>
            {children}
        </nav>
    );
}

export function SidebarItem({
    href = "#",
    icon: Icon,
    label,
    active = false,
    className = "",
    ...props
}) {
    return (
        <Link
            href={href}
            className={`relative flex h-12 w-full items-center justify-center text-white transition-all duration-200 group-hover:justify-start group-hover:px-3 ${
                active
                    ? "text-white"
                    : "text-white/85 hover:text-white hover:bg-white/10"
            } ${className}`}
            {...props}
        >
            {active && (
                <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white" />
            )}

            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                <Icon size={20} strokeWidth={2.2} />
            </span>

            <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap text-[15px] font-semibold opacity-0 transition-all duration-200 group-hover:ml-2 group-hover:max-w-[160px] group-hover:opacity-100">
                {label}
            </span>
        </Link>
    );
}

export function SidebarFooter({ children, className = "", ...props }) {
    return (
        <div className={` p-2 ${className}`} {...props}>
            {children}
        </div>
    );
}
