function Badge({ status, className = "" }) {
    const base =
        "inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold leading-[1.23]";

    const variants = {
        approved: "bg-[#eef7ee] text-[#166534]",
        pending: "bg-[#fff7e6] text-[#92400e]",
        rejected: "bg-[#fef2f2] text-[#b91c1c]",
        submitted: "bg-[#eef4ff] text-[#0052ff]",
        default: "bg-[#eef0f3] text-[#0a0b0d]",
    };

    const key = String(status).toLowerCase();
    const style = variants[key] || variants.default;

    return <span className={`${base} ${style} ${className}`}>{status}</span>;
}

export default Badge;
