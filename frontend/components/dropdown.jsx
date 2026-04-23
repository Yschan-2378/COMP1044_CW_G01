"use client";

import { useEffect, useRef, useState } from "react";
import { CaretDown, Check } from "@phosphor-icons/react/dist/ssr";

function Dropdown({
    value,
    onChange,
    options,
    placeholder = "Select",
    className = "",
    align = "left",
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const normalized = options.map((opt) =>
        typeof opt === "object" && opt !== null
            ? { value: opt.value, label: opt.label ?? String(opt.value) }
            : { value: opt, label: String(opt) }
    );

    const current = normalized.find((o) => o.value === value);

    useEffect(() => {
        function onDocClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        function onKey(e) {
            if (e.key === "Escape") setOpen(false);
        }
        if (open) {
            document.addEventListener("mousedown", onDocClick);
            document.addEventListener("keydown", onKey);
            return () => {
                document.removeEventListener("mousedown", onDocClick);
                document.removeEventListener("keydown", onKey);
            };
        }
    }, [open]);

    function select(v) {
        onChange?.(v);
        setOpen(false);
    }

    return (
        <div ref={ref} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`flex w-full items-center justify-between gap-2 rounded-[24px] border bg-[#eef0f3] px-5 py-3 text-left text-[16px] font-medium leading-[1.5] text-[#0a0b0d] outline-none transition-colors duration-200 hover:bg-[#dfe3e8] focus:ring-2 focus:ring-[#0052ff] ${
                    open
                        ? "border-[#0052ff]"
                        : "border-[rgba(91,97,110,0.2)]"
                }`}
            >
                <span className={current ? "" : "text-[#5b616e]"}>
                    {current ? current.label : placeholder}
                </span>
                <CaretDown
                    size={14}
                    weight="bold"
                    className={`shrink-0 text-[#5b616e] transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <div
                    role="listbox"
                    className={`absolute z-20 mt-2 min-w-full overflow-hidden rounded-[16px] border border-[rgba(91,97,110,0.2)] bg-white py-1 shadow-[0_12px_32px_rgba(10,11,13,0.08)] ${
                        align === "right" ? "right-0" : "left-0"
                    }`}
                >
                    {normalized.map((opt) => {
                        const selected = opt.value === value;
                        return (
                            <button
                                key={String(opt.value)}
                                type="button"
                                role="option"
                                aria-selected={selected}
                                onClick={() => select(opt.value)}
                                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-[15px] font-medium leading-[1.4] transition-colors ${
                                    selected
                                        ? "bg-[#eef0f3] text-[#0a0b0d]"
                                        : "text-[#0a0b0d] hover:bg-[#f5f6f8]"
                                }`}
                            >
                                <span className="truncate">{opt.label}</span>
                                {selected && (
                                    <Check
                                        size={14}
                                        weight="bold"
                                        className="shrink-0 text-[#0052ff]"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Dropdown;
