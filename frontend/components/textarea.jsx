function Textarea({ className = "", rows = 5, ...props }) {
    const base =
        "w-full rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-[#eef0f3] px-5 py-4 text-[16px] font-medium leading-[1.5] text-[#0a0b0d] placeholder:text-[#5b616e] outline-none transition-colors duration-200 focus:border-[#0052ff] focus:ring-2 focus:ring-[#0052ff] disabled:cursor-not-allowed disabled:opacity-50 resize-none";

    return (
        <textarea rows={rows} className={`${base} ${className}`} {...props} />
    );
}

export default Textarea;
