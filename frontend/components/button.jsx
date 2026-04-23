function Button({ children, variant = "primary", className = "", ...props }) {
    const base =
        "inline-flex items-center justify-center rounded-[56px] px-6 py-3 text-sm font-semibold tracking-[0.16px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50";

    const variants = {
        primary:
            "bg-[#0052ff] text-white border border-[#0052ff] hover:bg-[#578bfa] hover:border-[#578bfa]",
        secondary:
            "bg-[#eef0f3] text-[#0a0b0d] border border-[#eef0f3] hover:bg-[#dfe3e8]",
        dark: "bg-[#282b31] text-white border border-[#282b31] hover:bg-[#3a3e45]",
        outline:
            "bg-transparent text-[#0052ff] border border-[#0052ff] hover:bg-[#0052ff] hover:text-white",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
