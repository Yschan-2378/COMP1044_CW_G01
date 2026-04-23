function Badge({ status, className = "" }) {
    const base =
        "inline-flex items-center rounded-full px-3 py-1 text-[13px] font-bold leading-[1.23] tracking-[0.01em]";

    // Coinbase palette: blue (#0052ff), near-black (#0a0b0d), white, cool gray (#eef0f3).
    // Status conveyed by fill weight, not hue.
    const variants = {
        approved: "bg-[#0a0b0d] text-white",              // done — resolved, calm
        submitted: "bg-[#0052ff] text-white",             // open — needs assessor action
        pending: "bg-white text-[#0a0b0d] border border-[#0a0b0d]", // awaiting — neutral
        rejected: "bg-[#0a0b0d] text-[#578bfa] border border-[#578bfa]", // rare — muted blue-on-dark
        default: "bg-[#eef0f3] text-[#0a0b0d]",
    };

    const key = String(status).toLowerCase();
    const style = variants[key] || variants.default;

    return <span className={`${base} ${style} ${className}`}>{status}</span>;
}

export default Badge;
