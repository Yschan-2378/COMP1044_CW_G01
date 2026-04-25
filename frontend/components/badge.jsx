function Badge({ status, className = "" }) {
    const base =
        "inline-flex items-center rounded-full px-3 py-1 text-[13px] font-bold leading-[1.23] tracking-[0.01em]";

    const variants = {
        approved: "bg-[#0a0b0d] text-white",            
        submitted: "bg-[#0052ff] text-white",          
        pending: "bg-white text-[#0a0b0d] border border-[#0a0b0d]", 
        rejected: "bg-[#0a0b0d] text-[#578bfa] border border-[#578bfa]",
        default: "bg-[#eef0f3] text-[#0a0b0d]",
    };

    const key = String(status).toLowerCase();
    const style = variants[key] || variants.default;

    return <span className={`${base} ${style} ${className}`}>{status}</span>;
}

export default Badge;
