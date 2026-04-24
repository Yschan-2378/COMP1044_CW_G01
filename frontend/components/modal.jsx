export function Modal({ open, children, size = "md" }) {
    if (!open) return null;

    const widths = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0a0b0d]/40" />
            <div
                className={`relative z-10 w-full ${
                    widths[size] || widths.md
                } flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-white text-[#0a0b0d]`}
            >
                {children}
            </div>
        </div>
    );
}

export function ModalHeader({ children, className = "" }) {
    return <div className={`p-6 pb-4 ${className}`}>{children}</div>;
}

export function ModalTitle({ children, className = "" }) {
    return (
        <h2
            className={`text-[24px] font-semibold leading-[1.2] tracking-[-0.01em] ${className}`}
        >
            {children}
        </h2>
    );
}

export function ModalDescription({ children, className = "" }) {
    return (
        <p
            className={`mt-2 text-[16px] leading-[1.5] text-[#5b616e] ${className}`}
        >
            {children}
        </p>
    );
}

export function ModalContent({ children, className = "" }) {
    return <div className={`min-h-0 overflow-y-auto px-6 pb-6 ${className}`}>{children}</div>;
}

export function ModalFooter({ children, className = "" }) {
    return (
        <div
            className={`flex shrink-0 items-center justify-end gap-3 border-t border-[rgba(91,97,110,0.2)] bg-white px-6 py-4 ${className}`}
        >
            {children}
        </div>
    );
}
