export function Card({ children, className = "", dark = false, ...props }) {
    const base = "rounded-[24px] border transition-colors duration-200";

    const styles = dark
        ? "border-[rgba(255,255,255,0.08)] bg-[#282b31] text-white"
        : "border-[rgba(91,97,110,0.2)] bg-white text-[#0a0b0d]";

    return (
        <div className={`${base} ${styles} ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = "", ...props }) {
    return (
        <div className={`p-6 pb-3 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = "", ...props }) {
    return (
        <h3
            className={`text-[24px] font-semibold leading-[1.2] tracking-[-0.01em] ${className}`}
            {...props}
        >
            {children}
        </h3>
    );
}

export function CardDescription({ children, className = "", ...props }) {
    return (
        <p
            className={`mt-2 text-[16px] leading-normal text-[#5b616e] ${className}`}
            {...props}
        >
            {children}
        </p>
    );
}

export function CardContent({ children, className = "", ...props }) {
    return (
        <div className={`px-6 pb-6 ${className}`} {...props}>
            {children}
        </div>
    );
}
