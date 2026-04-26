"use client";

import { useMemo, useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react/dist/icons/DownloadSimple";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/icons/MagnifyingGlass";
import { ClipboardText } from "@phosphor-icons/react/dist/icons/ClipboardText";
import { ChartBar } from "@phosphor-icons/react/dist/icons/ChartBar";
import { Users } from "@phosphor-icons/react/dist/icons/Users";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import Button from "@/components/button";
import Input from "@/components/input";
import Dropdown from "@/components/dropdown";
import { DataTable } from "@/components/data-table";
import {
    Modal,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from "@/components/modal";
import { useApi } from "@/lib/use-api";

const CRITERIA = [
    { key: "task_mark",        label: "Undertaking Tasks/Projects",                  weight: 10 },
    { key: "safety_mark",      label: "Health and Safety Requirements",              weight: 10 },
    { key: "knowledge_mark",   label: "Connectivity and Use of Theoretical Knowledge", weight: 10 },
    { key: "report_mark",      label: "Presentation of the Report",                  weight: 15 },
    { key: "clarity_mark",     label: "Clarity of Language and Illustration",        weight: 10 },
    { key: "learning_mark",    label: "Lifelong Learning Activities",                weight: 15 },
    { key: "project_mgt_mark", label: "Project Management",                          weight: 15 },
    { key: "time_mgt_mark",    label: "Time Management",                             weight: 15 },
];

const DISPLAY_ROUNDING_TOLERANCE = 1e-9;

function asNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
}

function formatDecimal(value) {
    return (Math.round((asNumber(value) + DISPLAY_ROUNDING_TOLERANCE) * 100) / 100).toFixed(2);
}

function formatScore(score) {
    return `${formatDecimal(score)}%`;
}

function downloadCsv(rows) {
    const header = [
        "Assessment ID",
        "Internship ID",
        "Student ID",
        "Student Name",
        "Programme",
        "Company Name",
        "Assessor Username",
        ...CRITERIA.map((criterion) => `${criterion.label} (${criterion.weight}%)`),
        "Qualitative Comments",
        "Final Calculated Score",
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
                row.assessment_id,
                row.internship_id,
                row.student_id,
                row.student_name,
                row.programme,
                row.company_name,
                row.assessor_username,
                ...CRITERIA.map((criterion) => row[criterion.key]),
                row.qualitative_comments,
                formatDecimal(row.final_calculated_score),
            ]
                .map(escape)
                .join(","),
        ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `internship-results-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function StatChip({ label, value, icon: Icon }) {
    return (
        <div className="flex items-center gap-4 rounded-[20px] bg-[#eef0f3] px-6 py-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white text-[#0a0b0d]">
                <Icon size={18} weight="bold" />
            </div>
            <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                    {label}
                </p>
                <p className="mt-1 text-[28px] font-semibold leading-[1] text-[#0a0b0d] tabular-nums">
                    {value}
                </p>
            </div>
        </div>
    );
}

function ChartPanel({ title, children }) {
    return (
        <div className="rounded-[24px] border border-[rgba(91,97,110,0.18)] bg-transparent px-5 py-5">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                {title}
            </h2>
            <div className="mt-5 h-[280px]">{children}</div>
        </div>
    );
}

function EmptyChart({ message }) {
    return (
        <div className="flex h-full items-center justify-center rounded-[18px] border border-dashed border-[rgba(91,97,110,0.28)] bg-white text-[14px] font-semibold text-[#5b616e]">
            {message}
        </div>
    );
}

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-[14px] border border-[rgba(91,97,110,0.18)] bg-white px-3 py-2 text-[13px] shadow-sm">
            {label ? <p className="font-semibold text-[#0a0b0d]">{label}</p> : null}
            {payload.map((item) => (
                <p key={item.dataKey || item.name} className="mt-1 text-[#5b616e]">
                    <span className="font-semibold text-[#0a0b0d]">{item.name}: </span>
                    {item.value}
                </p>
            ))}
        </div>
    );
}

function getScoreBand(score) {
    if (score < 50) return "0-49";
    if (score < 60) return "50-59";
    if (score < 70) return "60-69";
    if (score < 80) return "70-79";
    return "80-100";
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
                const mark = asNumber(result[criterion.key]);
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
                            {formatDecimal(mark)}
                        </span>
                        <span className="text-right text-[15px] font-semibold text-[#0a0b0d] tabular-nums">
                            {formatDecimal(weighted)}
                        </span>
                    </div>
                );
            })}
            <div className="grid grid-cols-[minmax(0,1fr)_80px_80px_96px] items-center gap-3 bg-[#0052ff] px-5 py-4 text-white">
                <span className="text-[13px] font-bold uppercase tracking-[0.12em]">
                    Final Score
                </span>
                <span className="text-right text-[14px] tabular-nums opacity-70">100%</span>
                <span />
                <span className="text-right text-[20px] font-semibold leading-none tabular-nums">
                    {formatDecimal(result.final_calculated_score)}
                </span>
            </div>
        </div>
    );
}

export default function ResultsPage() {
    const { data, loading, error } = useApi("/results.php");
    const allRows = data?.results ?? [];

    const [search, setSearch] = useState("");
    const [assessorFilter, setAssessorFilter] = useState("All");
    const [viewTarget, setViewTarget] = useState(null);

    const rows = useMemo(
        () => allRows.filter((row) => row.assessment_id != null),
        [allRows],
    );

    const assessorOptions = useMemo(() => {
        const usernames = Array.from(
            new Set(rows.map((row) => row.assessor_username).filter(Boolean)),
        ).sort();
        return ["All", ...usernames];
    }, [rows]);

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        return rows.filter((row) => {
            if (assessorFilter !== "All" && row.assessor_username !== assessorFilter) {
                return false;
            }
            if (
                query &&
                !(row.student_name || "").toLowerCase().includes(query) &&
                !row.student_id.toLowerCase().includes(query)
            ) {
                return false;
            }
            return true;
        });
    }, [rows, search, assessorFilter]);
    const scoreDistribution = ["0-49", "50-59", "60-69", "70-79", "80-100"].map((band) => ({
        band,
        students: filtered.filter(
            (row) => getScoreBand(asNumber(row.final_calculated_score)) === band,
        ).length,
    }));

    const average = rows.length
        ? rows.reduce((sum, row) => sum + asNumber(row.final_calculated_score), 0) / rows.length
        : 0;

    const columns = [
        {
            key: "assessment_id",
            header: "Assessment ID",
            cellClassName: "font-semibold tabular-nums",
        },
        { key: "student_id", header: "Student ID", cellClassName: "font-semibold tabular-nums" },
        {
            key: "student_name",
            header: "Student Name",
            cell: (row) => (
                <div>
                    <p className="font-semibold text-[#0a0b0d]">{row.student_name}</p>
                    <p className="mt-1 text-[13px] text-[#5b616e]">{row.programme}</p>
                </div>
            ),
        },
        { key: "company_name", header: "Company Name" },
        { key: "assessor_username", header: "Assessor" },
        {
            key: "final_calculated_score",
            header: "Final Score",
            align: "right",
            cellClassName: "font-semibold tabular-nums",
            cell: (row) => formatScore(row.final_calculated_score),
        },
    ];

    const isFiltered = search !== "" || assessorFilter !== "All";

    return (
        <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-white">
            <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                            Assessment Records
                        </p>
                        <h1 className="mt-3 text-[56px] font-medium leading-[1] tracking-[-0.03em] text-[#0a0b0d] md:text-[72px]">
                            Results
                        </h1>
                    </div>
                    <Button variant="secondary" onClick={() => downloadCsv(filtered)}>
                        <DownloadSimple size={18} weight="bold" className="mr-2" />
                        Export CSV
                    </Button>
                </div>

                <section className="mt-12">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <StatChip label="Assessments" value={rows.length} icon={ClipboardText} />
                        <StatChip
                            label="Students Graded"
                            value={new Set(rows.map((row) => row.student_id)).size}
                            icon={Users}
                        />
                        <StatChip label="Average Score" value={formatScore(average)} icon={ChartBar} />
                    </div>
                </section>

                <section className="mt-12">
                    <ChartPanel title="Score Distribution">
                        {filtered.length ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={scoreDistribution} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                                    <CartesianGrid stroke="rgba(91,97,110,0.18)" vertical={false} />
                                    <XAxis
                                        dataKey="band"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: "#5b616e", fontSize: 12, fontWeight: 600 }}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: "#5b616e", fontSize: 12, fontWeight: 600 }}
                                    />
                                    <Tooltip content={<ChartTooltip />} />
                                    <Bar
                                        dataKey="students"
                                        name="Students"
                                        fill="#0052ff"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={64}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart message="No results to chart yet." />
                        )}
                    </ChartPanel>
                </section>

                <section className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                    <div className="relative">
                        <MagnifyingGlass
                            size={18}
                            weight="bold"
                            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#5b616e]"
                        />
                        <Input
                            placeholder="Search student ID or name"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="pl-12"
                        />
                    </div>
                    <Dropdown
                        value={assessorFilter}
                        onChange={setAssessorFilter}
                        options={assessorOptions.map((assessor) => ({
                            value: assessor,
                            label: assessor === "All" ? "All Assessors" : assessor,
                        }))}
                    />
                </section>

                {error && (
                    <p className="mt-6 text-[14px] font-semibold text-[#c9182e]">
                        Failed to load results: {error.message}
                    </p>
                )}

                <section className="mt-6">
                    <DataTable
                        columns={columns}
                        rows={filtered}
                        rowKey={(row) => row.assessment_id}
                        emptyMessage={
                            loading
                                ? "Loading results..."
                                : isFiltered
                                  ? "No results match your filters."
                                  : "No assessments recorded yet."
                        }
                        filteredAway={isFiltered}
                        onClearFilters={() => {
                            setSearch("");
                            setAssessorFilter("All");
                        }}
                        onRowActivate={setViewTarget}
                        rowActions={(row) => (
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setViewTarget(row);
                                }}
                                className="inline-flex items-center rounded-full border border-[rgba(91,97,110,0.3)] bg-white px-4 py-1.5 text-[13px] font-semibold text-[#0a0b0d] transition-colors hover:bg-[#eef0f3]"
                            >
                                View
                            </button>
                        )}
                        totalLabel={(shown) => `Showing ${shown} of ${rows.length}`}
                    />
                </section>
            </div>

            <Modal open={!!viewTarget} size="lg">
                <ModalHeader>
                    <ModalTitle>Assessment Breakdown</ModalTitle>
                    <ModalDescription>
                        Marks, comments, and final calculated score for {viewTarget?.student_name}.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    {viewTarget && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-3 rounded-[20px] border border-[rgba(91,97,110,0.2)] bg-[#f8f9fb] px-5 py-4 md:grid-cols-3">
                                <div>
                                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                                        Internship ID
                                    </p>
                                    <p className="mt-1 text-[15px] font-semibold text-[#0a0b0d]">
                                        {viewTarget.internship_id}
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
                                        Assessor
                                    </p>
                                    <p className="mt-1 text-[15px] font-semibold text-[#0a0b0d]">
                                        {viewTarget.assessor_username}
                                    </p>
                                </div>
                            </div>

                            <BreakdownTable result={viewTarget} />

                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                                    Qualitative Comments
                                </p>
                                <p className="mt-2 max-w-[72ch] text-[15px] leading-[1.6] text-[#0a0b0d]">
                                    {viewTarget.qualitative_comments}
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
