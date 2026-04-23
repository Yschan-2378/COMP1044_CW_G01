export function Table({ children, className = "", ...props }) {
    return (
        <div
            className={`w-full overflow-hidden rounded-3xl border border-[rgba(91,97,110,0.2)] bg-white ${className}`}
            {...props}
        >
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    {children}
                </table>
            </div>
        </div>
    );
}

export function TableHeader({ children, className = "", ...props }) {
    return (
        <thead className={`bg-[#eef0f3] ${className}`} {...props}>
            {children}
        </thead>
    );
}

export function TableBody({ children, className = "", ...props }) {
    return (
        <tbody className={className} {...props}>
            {children}
        </tbody>
    );
}

export function TableRow({ children, className = "", ...props }) {
    return (
        <tr
            className={`border-t border-[rgba(91,97,110,0.2)] transition-colors hover:bg-[#f8f9fb] ${className}`}
            {...props}
        >
            {children}
        </tr>
    );
}

export function TableHead({ children, className = "", ...props }) {
    return (
        <th
            className={`px-6 py-4 text-[14px] font-semibold leading-normal text-[#0a0b0d] ${className}`}
            {...props}
        >
            {children}
        </th>
    );
}

export function TableCell({ children, className = "", ...props }) {
    return (
        <td
            className={`px-6 py-4 text-[16px] leading-normal text-[#0a0b0d] ${className}`}
            {...props}
        >
            {children}
        </td>
    );
}

export function TableEmpty({ children = "No data available", colSpan = 1 }) {
    return (
        <tr className="border-t border-[rgba(91,97,110,0.2)]">
            <td
                colSpan={colSpan}
                className="px-6 py-10 text-center text-[16px] text-[#5b616e]"
            >
                {children}
            </td>
        </tr>
    );
}
