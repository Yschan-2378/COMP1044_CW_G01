"use client";

function Toggle({
    checked,
    onChange,
    label,
    disabled = false,
    className = "",
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            disabled={disabled}
            onClick={() => onChange?.(!checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#0052ff] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                checked ? "bg-[#0052ff]" : "bg-[#d4d8de]"
            } ${className}`}
        >
            <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    checked ? "translate-x-[22px]" : "translate-x-[2px]"
                }`}
            />
        </button>
    );
}

export default Toggle;
