"use client";

import { useMemo, useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react/dist/icons/DownloadSimple";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/icons/MagnifyingGlass";

import Button from "@/components/button";
import Input from "@/components/input";
import { DataTable } from "@/components/data-table";
import {
    Modal,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from "@/components/modal";
import { PageState, useAssessorData } from "../use-assessor-data";

const CRITERIA = [
    { key: "task_mark", label: "Undertaking Tasks/Projects", weight: 10 },
    { key: "safety_mark", label: "Health and Safety Requirements", weight: 10 },
    { key: "knowledge_mark", label: "Connectivity and Use of Theoretical Knowledge", weight: 10 },
    { key: "report_mark", label: "Presentation of the Report", weight: 15 },
    { key: "clarity_mark", label: "Clarity of Language and Illustration", weight: 10 },
    { key: "learning_mark", label: "Lifelong Learning Activities", weight: 15 },
    { key: "project_mgt_mark", label: "Project Management", weight: 15 },
    { key: "time_mgt_mark", label: "Time Management", weight: 15 },
];

function formatScore(value) {
    if (value == null) return "-";
    return `${Number(value).toFixed(2)}%`;
}

function downloadCsv(rows) {
    const header = [
        "Student ID",
        "Student Name",
        "Programme",
        "Company",
        ...CRITERIA.map((criterion) => `${criterion.label} (${criterion.weight}%)`),
        "Comments",
        "Final Score",
    ];

    const escape = (value) => {
        if (value == null) return "";
        const text = String(value);
        if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
        return text;
    };

    const lines = [
        header.map(escape).join(","),
        ...rows.map((row) =>
            [
                row.student_id,
                row.student_name,
                row.programme,
                row.company_name,
                ...CRITERIA.map((criterion) => row[criterion.key]),
                row.qualitative_comments,
                row.final_calculated_score,
            ]
                .map(escape)
                .join(","),
        ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `my-results-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function BreakdownTable({ result }) {
    return (
        <div className="overflow-hidden rounded-[20px] border border-[rgba(91,97,110,0.2)] bg-white">
            <div className="grid grid-cols-[minmax(0,1fr)_80px_80px_96px] items-center gap-3 border-b border-[rgba(91,97,110,0.2)] bg-[#f8f9fb] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                <span>Criterion</span>
                <span className="text-right">Weight</span>
                <span className="text-right">Mark</span>
                <span className="text-right">Weighted</span>
            </div>
            {CRITERIA.map((criterion) => {
                const mark = Number(result[criterion.key]);
                const weighted = (mark * criterion.weight) / 100;
                return (
                    <div
                        key={criterion.key}
                        className="grid grid-cols-[minmax(0,1fr)_80px_80px_96px] items-center gap-3 border-b border-[rgba(91,97,110,0.2)] px-5 py-3.5 last:border-b-0"
                    >
                        <span className="text-[15px] font-medium text-[#0a0b0d]">
                            {criterion.label}
                        </span>
                        <span className="text-right text-[14px] text-[#5b616e] tabular-nums">
                            {criterion.weight}%
                        </span>
                        <span className="text-right text-[15px] font-semibold text-[#0a0b0d] tabular-nums">
                            {mark.toFixed(2)}
                        </span>
                        <span className="text-right text-[15px] font-semibold text-[#0a0b0d] tabular-nums">
                            {weighted.toFixed(2)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default function AssessorResultsPage() {
    const { data, loading, error } = useAssessorData("/results.php");
    const [search, setSearch] = useState("");
    const [viewTarget, setViewTarget] = useState(null);
    const results = (data?.results || []).filter((row) => row.assessment_id);

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return results;

        return results.filter(
            (row) =>
                row.student_id.toLowerCase().includes(query) ||
                row.student_name.toLowerCase().includes(query) ||
                row.company_name.toLowerCase().includes(query),
        );
    }, [results, search]);

    const columns = [
        { key: "student_id", header: "Student ID", cellClassName: "font-semibold tabular-nums" },
        {
            key: "student_name",
            header: "Student",
            cell: (row) => (
                <div>
                    <p className="font-semibold text-[#0a0b0d]">{row.student_name}</p>
                    <p className="mt-1 text-[13px] text-[#5b616e]">{row.programme}</p>
                </div>
            ),
        },
        { key: "company_name", header: "Company" },
        {
            key: "final_calculated_score",
            header: "Final Score",
            align: "right",
            cellClassName: "font-semibold tabular-nums",
            cell: (row) => formatScore(row.final_calculated_score),
        },
    ];

    return (
        <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-white">
            <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                            Assessment Records
                        </p>
                        <h1 className="mt-3 text-[56px] font-medium leading-[1] tracking-[-0.03em] text-[#0a0b0d] md:text-[72px]">
                            My Results
                        </h1>
                    </div>
                    <Button variant="secondary" onClick={() => downloadCsv(filtered)}>
                        <DownloadSimple size={18} weight="bold" className="mr-2" />
                        Export CSV
                    </Button>
                </div>

                <section className="mt-12">
                    <div className="relative">
                        <MagnifyingGlass
                            size={18}
                            weight="bold"
                            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#5b616e]"
                        />
                        <Input
                            placeholder="Search student ID, name, or company"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="pl-12"
                        />
                    </div>
                </section>

                <section className="mt-6">
                    <PageState loading={loading} error={error} empty={!results.length}>
                        <DataTable
                            columns={columns}
                            rows={filtered}
                            rowKey={(row) => row.assessment_id}
                            emptyMessage={
                                search ? "No results match your search." : "No graded results yet."
                            }
                            filteredAway={search !== ""}
                            onClearFilters={() => setSearch("")}
                            onRowActivate={setViewTarget}
                            rowActions={(row) => (
                                <Button
                                    variant="secondary"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setViewTarget(row);
                                    }}
                                    className="px-4 py-1.5 text-[13px]"
                                >
                                    View
                                </Button>
                            )}
                            totalLabel={(shown) => `Showing ${shown} of ${results.length}`}
                        />
                    </PageState>
                </section>
            </div>

            <Modal open={!!viewTarget} size="lg">
                <ModalHeader>
                    <ModalTitle>Result Breakdown</ModalTitle>
                    <ModalDescription>
                        Full assessment for {viewTarget?.student_name}.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    {viewTarget && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-3 rounded-[20px] border border-[rgba(91,97,110,0.2)] bg-[#f8f9fb] px-5 py-4 md:grid-cols-3">
                                <div>
                                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                                        Student
                                    </p>
                                    <p className="mt-1 text-[15px] font-semibold text-[#0a0b0d]">
                                        {viewTarget.student_name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                                        Company
                                    </p>
                                    <p className="mt-1 text-[15px] font-semibold text-[#0a0b0d]">
                                        {viewTarget.company_name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                                        Final Score
                                    </p>
                                    <p className="mt-1 text-[15px] font-semibold text-[#0a0b0d]">
                                        {formatScore(viewTarget.final_calculated_score)}
                                    </p>
                                </div>
                            </div>
                            <BreakdownTable result={viewTarget} />
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                                    Qualitative Comments
                                </p>
                                <p className="mt-2 text-[15px] leading-[1.6] text-[#0a0b0d]">
                                    {viewTarget.qualitative_comments || "-"}
                                </p>
                            </div>
                        </div>
                    )}
                </ModalContent>
                <ModalFooter>
                    <Button variant="secondary" onClick={() => setViewTarget(null)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => viewTarget && downloadCsv([viewTarget])}>
                        <DownloadSimple size={18} weight="bold" className="mr-2" />
                        Export Result
                    </Button>
                </ModalFooter>
            </Modal>
        </main>
    );
}
