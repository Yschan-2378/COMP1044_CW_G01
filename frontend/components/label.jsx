function Label({ children, className = "", ...props }) {
    const base = "block text-[14px] font-semibold leading-[1.5] text-[#0a0b0d]";

    return (
        <label className={`${base} ${className}`} {...props}>
            {children}
        </label>
    );
}

export default Label;
