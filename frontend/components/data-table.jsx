"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowDown } from "@phosphor-icons/react/dist/icons/ArrowDown";
import { ArrowUp } from "@phosphor-icons/react/dist/icons/ArrowUp";
import { ArrowsDownUp } from "@phosphor-icons/react/dist/icons/ArrowsDownUp";
import { CaretLeft } from "@phosphor-icons/react/dist/icons/CaretLeft";
import { CaretRight } from "@phosphor-icons/react/dist/icons/CaretRight";

function SortIcon({ state }) {
    if (state === "asc") return <ArrowUp size={12} weight="bold" />;
    if (state === "desc") return <ArrowDown size={12} weight="bold" />;
    return <ArrowsDownUp size={12} weight="bold" className="opacity-40" />;
}

function getCompare(row, key, accessor) {
    if (accessor) return accessor(row);
    return row[key];
}

export function DataTable({
    columns,
    rows,
    rowKey,
    emptyMessage = "No data available.",
    filteredAway = false,
    onClearFilters,
    onRowActivate,
    onEdit,
    onDelete,
    rowActions,
    selectable = false,
    bulkActions = [],
    pageSize = 25,
    totalLabel,
    inactiveRow,
}) {
    const [sort, setSort] = useState({ key: null, dir: null });
    const [selected, setSelected] = useState(new Set());
    const [page, setPage] = useState(0);
    const [focusIdx, setFocusIdx] = useState(0);
    const containerRef = useRef(null);
    const rowRefs = useRef([]);

    const sorted = useMemo(() => {
        if (!sort.key || !sort.dir) return rows;
        const col = columns.find((c) => c.key === sort.key);
        if (!col) return rows;
        const copy = [...rows];
        copy.sort((a, b) => {
            const av = getCompare(a, col.key, col.accessor);
            const bv = getCompare(b, col.key, col.accessor);
            if (av == null && bv == null) return 0;
            if (av == null) return 1;
            if (bv == null) return -1;
            if (typeof av === "number" && typeof bv === "number") {
                return sort.dir === "asc" ? av - bv : bv - av;
            }
            const as = String(av).toLowerCase();
            const bs = String(bv).toLowerCase();
            if (as < bs) return sort.dir === "asc" ? -1 : 1;
            if (as > bs) return sort.dir === "asc" ? 1 : -1;
            return 0;
        });
        return copy;
    }, [rows, sort, columns]);

    const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
    const currentPage = Math.min(Math.max(0, page), pageCount - 1);
    const start = currentPage * pageSize;
    const visible = sorted.slice(start, start + pageSize);
    const safeFocusIdx = Math.min(
        Math.max(0, focusIdx),
        Math.max(0, visible.length - 1),
    );

    const validIds = useMemo(
        () => new Set(rows.map((r) => rowKey(r))),
        [rows, rowKey],
    );
    const selectedValid = useMemo(() => {
        const next = new Set();
        selected.forEach((id) => {
            if (validIds.has(id)) next.add(id);
        });
        return next;
    }, [selected, validIds]);

    function cycleSort(key) {
        setSort((prev) => {
            if (prev.key !== key) return { key, dir: "asc" };
            if (prev.dir === "asc") return { key, dir: "desc" };
            return { key: null, dir: null };
        });
    }

    function toggleSelect(id) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    const allVisibleSelected =
        visible.length > 0 && visible.every((r) => selectedValid.has(rowKey(r)));
    const someVisibleSelected =
        visible.some((r) => selectedValid.has(rowKey(r))) && !allVisibleSelected;

    function toggleAllVisible() {
        setSelected((prev) => {
            const next = new Set(prev);
            if (allVisibleSelected) {
                visible.forEach((r) => next.delete(rowKey(r)));
            } else {
                visible.forEach((r) => next.add(rowKey(r)));
            }
            return next;
        });
    }

    function clearSelection() {
        setSelected(new Set());
    }

    function handleKeyDown(e) {
        if (!visible.length) return;
        const tag = document.activeElement?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

        const row = visible[safeFocusIdx];
        if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = Math.min(safeFocusIdx + 1, visible.length - 1);
            setFocusIdx(next);
            rowRefs.current[next]?.focus();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const next = Math.max(safeFocusIdx - 1, 0);
            setFocusIdx(next);
            rowRefs.current[next]?.focus();
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (row && onRowActivate) onRowActivate(row);
        } else if (e.key === "e" || e.key === "E") {
            if (row && onEdit) {
                e.preventDefault();
                onEdit(row);
            }
        } else if (e.key === "Delete" || e.key === "Backspace") {
            if (row && onDelete) {
                e.preventDefault();
                onDelete(row);
            }
        } else if (e.key === "x" || e.key === "X") {
            if (row && selectable) {
                e.preventDefault();
                toggleSelect(rowKey(row));
            }
        } else if (e.key === "Escape") {
            if (selectedValid.size) {
                e.preventDefault();
                clearSelection();
            }
        } else if ((e.ctrlKey || e.metaKey) && (e.key === "a" || e.key === "A")) {
            if (selectable) {
                e.preventDefault();
                setSelected(new Set(sorted.map((r) => rowKey(r))));
            }
        }
    }

    const selectedRows = rows.filter((r) => selectedValid.has(rowKey(r)));
    const hasRows = rows.length > 0;

    return (
        <div className="space-y-3">
            {selectable && selectedValid.size > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-[#0052ff] bg-[#0052ff] px-5 py-3 text-white">
                    <p className="text-[14px] font-semibold tabular-nums">
                        {selectedValid.size} selected
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        {bulkActions.map((action) => (
                            <button
                                key={action.label}
                                type="button"
                                onClick={() => {
                                    action.onClick(selectedRows, clearSelection);
                                }}
                                className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                                    action.variant === "danger"
                                        ? "bg-white text-[#0a0b0d] hover:bg-[#eef0f3]"
                                        : "border border-white/30 text-white hover:bg-white/10"
                                }`}
                            >
                                {action.label}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={clearSelection}
                            className="rounded-full px-3 py-1.5 text-[13px] font-semibold text-white/70 hover:text-white"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}

            <div
                ref={containerRef}
                onKeyDown={handleKeyDown}
                className="w-full overflow-hidden rounded-3xl border border-[rgba(91,97,110,0.2)] bg-white focus:outline-none"
            >
                <div className="max-h-[640px] overflow-auto">
                    <table className="w-full border-collapse text-left">
                        <thead className="sticky top-0 z-10 bg-[#eef0f3]">
                            <tr>
                                {selectable && (
                                    <th className="w-10 px-6 py-4">
                                        <input
                                            type="checkbox"
                                            aria-label="Select all visible rows"
                                            checked={allVisibleSelected}
                                            ref={(el) => {
                                                if (el)
                                                    el.indeterminate = someVisibleSelected;
                                            }}
                                            onChange={toggleAllVisible}
                                            className="h-4 w-4 cursor-pointer accent-[#0052ff]"
                                        />
                                    </th>
                                )}
                                {columns.map((col) => {
                                    const active = sort.key === col.key;
                                    const dir = active ? sort.dir : null;
                                    const alignCls =
                                        col.align === "right"
                                            ? "text-right"
                                            : col.align === "center"
                                              ? "text-center"
                                              : "text-left";
                                    return (
                                        <th
                                            key={col.key}
                                            aria-sort={
                                                col.sortable === false
                                                    ? undefined
                                                    : dir === "asc"
                                                      ? "ascending"
                                                      : dir === "desc"
                                                        ? "descending"
                                                        : "none"
                                            }
                                            className={`px-6 py-4 text-[14px] font-semibold leading-normal text-[#0a0b0d] ${alignCls} ${col.headerClassName || ""}`}
                                        >
                                            {col.sortable === false ? (
                                                <span>{col.header}</span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => cycleSort(col.key)}
                                                    className={`inline-flex items-center gap-1.5 rounded px-1 -mx-1 py-0.5 transition-colors hover:text-[#0052ff] ${
                                                        col.align === "right"
                                                            ? "flex-row-reverse"
                                                            : ""
                                                    } ${active ? "text-[#0052ff]" : ""}`}
                                                >
                                                    <span>{col.header}</span>
                                                    <SortIcon state={dir} />
                                                </button>
                                            )}
                                        </th>
                                    );
                                })}
                                {(onEdit || onDelete || rowActions) && (
                                    <th className="w-[140px] px-6 py-4 text-right text-[14px] font-semibold text-[#0a0b0d]">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {visible.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={
                                            columns.length +
                                            (selectable ? 1 : 0) +
                                            (onEdit || onDelete || rowActions ? 1 : 0)
                                        }
                                        className="px-6 py-16 text-center"
                                    >
                                        <p className="text-[15px] text-[#5b616e]">
                                            {emptyMessage}
                                        </p>
                                        {filteredAway && onClearFilters && (
                                            <button
                                                type="button"
                                                onClick={onClearFilters}
                                                className="mt-3 inline-flex items-center rounded-full border border-[rgba(91,97,110,0.3)] bg-white px-4 py-1.5 text-[13px] font-semibold text-[#0a0b0d] transition-colors hover:bg-[#eef0f3]"
                                            >
                                                Clear filters
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                visible.map((row, idx) => {
                                    const id = rowKey(row);
                                    const isSelected = selectedValid.has(id);
                                    const isInactive = inactiveRow?.(row);
                                    return (
                                        <tr
                                            key={id}
                                            ref={(el) => (rowRefs.current[idx] = el)}
                                            tabIndex={0}
                                            onFocus={() => setFocusIdx(idx)}
                                            onClick={(e) => {
                                                if (
                                                    e.target.closest(
                                                        "[data-row-action], input[type=checkbox], button, a",
                                                    )
                                                )
                                                    return;
                                                onRowActivate?.(row);
                                            }}
                                            className={`group cursor-pointer border-t border-[rgba(91,97,110,0.2)] transition-colors focus:outline-none focus:bg-[#eef7ff] ${
                                                isSelected
                                                    ? "bg-[#f4f8ff]"
                                                    : "hover:bg-[#f8f9fb]"
                                            } ${isInactive ? "opacity-70" : ""}`}
                                        >
                                            {selectable && (
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        aria-label={`Select row ${id}`}
                                                        checked={isSelected}
                                                        onChange={() => toggleSelect(id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="h-4 w-4 cursor-pointer accent-[#0052ff]"
                                                    />
                                                </td>
                                            )}
                                            {columns.map((col) => {
                                                const alignCls =
                                                    col.align === "right"
                                                        ? "text-right"
                                                        : col.align === "center"
                                                          ? "text-center"
                                                          : "text-left";
                                                return (
                                                    <td
                                                        key={col.key}
                                                        className={`px-6 py-4 text-[16px] leading-normal text-[#0a0b0d] ${alignCls} ${col.cellClassName || ""}`}
                                                    >
                                                        {col.cell
                                                            ? col.cell(row)
                                                            : row[col.key]}
                                                    </td>
                                                );
                                            })}
                                            {(onEdit || onDelete || rowActions) && (
                                                <td
                                                    className="px-6 py-4 text-right"
                                                    data-row-action
                                                >
                                                    <div className="flex items-center justify-end gap-1">
                                                        {rowActions?.(row)}
                                                        {onEdit && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onEdit(row);
                                                                }}
                                                                aria-label={`Edit ${id}`}
                                                                title="Edit (E)"
                                                                className="flex h-9 w-9 items-center justify-center rounded-full text-[#5b616e] transition-colors hover:bg-[#eef0f3] hover:text-[#0052ff]"
                                                            >
                                                                <PencilIcon />
                                                            </button>
                                                        )}
                                                        {onDelete && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onDelete(row);
                                                                }}
                                                                aria-label={`Delete ${id}`}
                                                                title="Delete (Del)"
                                                                className="flex h-9 w-9 items-center justify-center rounded-full text-[#5b616e] transition-colors hover:bg-[#0a0b0d] hover:text-white"
                                                            >
                                                                <TrashIcon />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                    {totalLabel
                        ? totalLabel(sorted.length, rows.length)
                        : `Showing ${visible.length} of ${sorted.length}`}
                </p>
                {hasRows && pageCount > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            aria-label="Previous page"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(91,97,110,0.2)] bg-white text-[#0a0b0d] transition-colors hover:bg-[#eef0f3] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <CaretLeft size={14} weight="bold" />
                        </button>
                        <p className="text-[13px] font-semibold tabular-nums text-[#0a0b0d]">
                            {currentPage + 1} / {pageCount}
                        </p>
                        <button
                            type="button"
                            onClick={() =>
                                setPage((p) => Math.min(pageCount - 1, p + 1))
                            }
                            disabled={currentPage >= pageCount - 1}
                            aria-label="Next page"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(91,97,110,0.2)] bg-white text-[#0a0b0d] transition-colors hover:bg-[#eef0f3] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <CaretRight size={14} weight="bold" />
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}

function PencilIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M11.5 2.5a1.5 1.5 0 0 1 2.1 2.1l-8.2 8.2-2.8.7.7-2.8 8.2-8.2Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M3 4.5h10M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5m-5.5 0 .6 8a1 1 0 0 0 1 .9h4.8a1 1 0 0 0 1-.9l.6-8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
