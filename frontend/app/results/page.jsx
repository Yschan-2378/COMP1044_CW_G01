"use client";

import { useMemo, useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react/dist/icons/DownloadSimple";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/icons/MagnifyingGlass";
import {
    Bar,
    BarChart,
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

const CRITERIA = [
    { key: "tasks", label: "Undertaking Tasks/Projects", weight: 10 },
    { key: "health", label: "Health and Safety Requirements", weight: 10 },
    {
        key: "connectivity",
        label: "Connectivity and Use of Theoretical Knowledge",
        weight: 10,
    },
    { key: "presentation", label: "Presentation of the Report", weight: 15 },
    {
        key: "clarity",
        label: "Clarity of Language and Illustration",
        weight: 10,
    },
    { key: "lifelong", label: "Lifelong Learning Activities", weight: 15 },
    { key: "project", label: "Project Management", weight: 15 },
    { key: "time", label: "Time Management", weight: 15 },
];

const RESULTS = [
    {
        id: "RES-5001",
        studentId: "20210456",
        studentName: "Aisha Rahman",
        programme: "Computer Science",
        company: "Northstar Systems",
        assessorId: "AS-1042",
        assessorName: "Dr. James Chen",
        status: "Approved",
        scores: {
            tasks: 85,
            health: 90,
            connectivity: 80,
            presentation: 88,
            clarity: 85,
            lifelong: 82,
            project: 87,
            time: 90,
        },
        comments:
            "Aisha consistently demonstrated strong ownership of her deliverables and integrated feedback from the supervising team without being prompted. Her final report was well-structured, though the reflective chapter could have benefited from a more critical voice. Time management was exemplary — all sprint deadlines were met or beaten.",
    },
    {
        id: "RES-5002",
        studentId: "20221287",
        studentName: "Marcus Johnson",
        programme: "Software Engineering",
        company: "Blue Harbour Analytics",
        assessorId: "AS-1043",
        assessorName: "Prof. Sarah Lin",
        status: "Submitted",
        scores: {
            tasks: 78,
            health: 82,
            connectivity: 75,
            presentation: 80,
            clarity: 78,
            lifelong: 70,
            project: 76,
            time: 74,
        },
        comments:
            "Solid technical contribution on the QA automation suite. The report demonstrates a working grasp of the theoretical framework, though connections to second-year coursework were more superficial than expected. Lifelong learning evidence was limited to in-house training — external certification or self-directed study would have strengthened this section.",
    },
    {
        id: "RES-5003",
        studentId: "20203098",
        studentName: "Priya Nair",
        programme: "Data Science",
        company: "Civic Data Lab",
        assessorId: "AS-1046",
        assessorName: "Prof. Michael Adams",
        status: "Approved",
        scores: {
            tasks: 92,
            health: 88,
            connectivity: 94,
            presentation: 90,
            clarity: 92,
            lifelong: 95,
            project: 90,
            time: 93,
        },
        comments:
            "Outstanding placement. Priya led a cross-team analytics initiative that produced a measurable impact on public transit routing in the host borough. Her reflective writing was the strongest in this cohort, and her evidence of lifelong learning (two certifications, a conference talk, and a reading log) sets a benchmark for future placements.",
    },
    {
        id: "RES-5004",
        studentId: "20212201",
        studentName: "Lina Osei",
        programme: "Cybersecurity",
        company: "Aegis Cyber Defence",
        assessorId: "AS-1047",
        assessorName: "Dr. Anna Volkov",
        status: "Pending",
        scores: null,
        comments: null,
    },
    {
        id: "RES-5005",
        studentId: "20224410",
        studentName: "Tomáš Horák",
        programme: "Information Technology",
        company: "Helix Cloud Services",
        assessorId: "AS-1046",
        assessorName: "Prof. Michael Adams",
        status: "Submitted",
        scores: {
            tasks: 65,
            health: 78,
            connectivity: 60,
            presentation: 68,
            clarity: 70,
            lifelong: 55,
            project: 62,
            time: 66,
        },
        comments:
            "Tomáš completed his assigned work but struggled to move beyond the prescribed task list. Evidence of independent initiative was thin, and the theoretical section of the report leaned heavily on textbook paraphrasing rather than demonstrating how concepts were applied to the work. Recommend follow-up conversation before final grade is released.",
    },
    {
        id: "RES-5006",
        studentId: "20231005",
        studentName: "Chen Wei",
        programme: "Computer Science",
        company: "Northstar Systems",
        assessorId: "AS-1042",
        assessorName: "Dr. James Chen",
        status: "Approved",
        scores: {
            tasks: 88,
            health: 85,
            connectivity: 86,
            presentation: 82,
            clarity: 80,
            lifelong: 85,
            project: 84,
            time: 88,
        },
        comments:
            "A reliable and quietly excellent placement. Chen's project management earned particular praise from the industry supervisor — he ran the weekly standup in his team's absence and documented decisions rigorously. Report presentation was adequate but would have benefited from stronger diagrams.",
    },
    {
        id: "RES-5007",
        studentId: "20208842",
        studentName: "Sofia Martinez",
        programme: "Software Engineering",
        company: "Meridian Fintech",
        assessorId: "AS-1043",
        assessorName: "Prof. Sarah Lin",
        status: "Pending",
        scores: null,
        comments: null,
    },
    {
        id: "RES-5008",
        studentId: "20195532",
        studentName: "Daniel Okafor",
        programme: "Computer Science",
        company: "Aurelia Labs",
        assessorId: "AS-1042",
        assessorName: "Dr. James Chen",
        status: "Approved",
        scores: {
            tasks: 72,
            health: 80,
            connectivity: 70,
            presentation: 75,
            clarity: 72,
            lifelong: 68,
            project: 74,
            time: 76,
        },
        comments:
            "Competent, workmanlike placement. Daniel hit every deliverable on schedule and received positive feedback from his industry supervisor on day-to-day professionalism. The report would have benefited from sharper reflection — the sections describing what he would do differently next time were the strongest and deserved more space.",
    },
];

const PROGRAMMES = [
    "All",
    "Computer Science",
    "Software Engineering",
    "Data Science",
    "Information Technology",
    "Cybersecurity",
];

const STATUS_OPTIONS = ["All", "Pending", "Submitted", "Approved"];

const GRADE_RANGES = [
    { value: "All", label: "All Grades" },
    { value: "A", label: "A (80–100%)" },
    { value: "B", label: "B (65–79%)" },
    { value: "C", label: "C (50–64%)" },
    { value: "F", label: "Below 50%" },
];

const ASSESSORS = [
    { id: "AS-1042", name: "Dr. James Chen" },
    { id: "AS-1043", name: "Prof. Sarah Lin" },
    { id: "AS-1046", name: "Prof. Michael Adams" },
    { id: "AS-1047", name: "Dr. Anna Volkov" },
];

function weightedTotal(scores) {
    if (!scores) return null;
    return CRITERIA.reduce(
        (sum, c) => sum + (scores[c.key] * c.weight) / 100,
        0,
    );
}

function gradeFromScore(score) {
    if (score == null) return null;
    if (score >= 80) return "A";
    if (score >= 65) return "B";
    if (score >= 50) return "C";
    return "F";
}

function gradeBand(score) {
    if (score == null) return "All";
    return gradeFromScore(score);
}

function formatScore(score) {
    if (score == null) return "—";
    return `${score.toFixed(2)}%`;
}

function GradeBadge({ grade, size = "sm" }) {
    if (!grade) {
        return (
            <span className="inline-flex items-center rounded-full bg-[#eef0f3] px-3 py-1 text-[13px] font-bold leading-[1.23] tracking-[0.01em] text-[#5b616e]">
                —
            </span>
        );
    }

    const styles = {
        A: "bg-[#0052ff] text-white",
        B: "bg-[#0a0b0d] text-white",
        C: "bg-white text-[#0a0b0d] border border-[#0a0b0d]",
        F: "bg-[#c9182e] text-white",
    };

    const sizing =
        size === "lg"
            ? "px-5 py-2 text-[18px] tracking-[0.02em]"
            : "px-3 py-1 text-[13px] tracking-[0.01em]";

    return (
        <span
            className={`inline-flex items-center rounded-full font-bold leading-[1.23] ${sizing} ${styles[grade]}`}
        >
            {grade}
        </span>
    );
}

function StatusBadge({ status }) {
    const base =
        "inline-flex items-center rounded-full px-3 py-1 text-[13px] font-bold leading-[1.23] tracking-[0.01em]";
    const styles = {
        Pending: "bg-[#eef0f3] text-[#5b616e]",
        Submitted: "bg-white text-[#0a0b0d] border border-[#0a0b0d]",
        Approved: "bg-[#0052ff] text-white",
    };
    return <span className={`${base} ${styles[status]}`}>{status}</span>;
}

function InsightCard({ label, value, note, tone = "light" }) {
    const styles =
        tone === "dark"
            ? "border-[#0052ff] bg-[#0052ff] text-white"
            : "border-[rgba(91,97,110,0.2)] bg-white text-[#0a0b0d]";

    return (
        <div className={`rounded-[24px] border px-6 py-5 ${styles}`}>
            <p
                className={`text-[12px] font-semibold uppercase tracking-[0.08em] ${
                    tone === "dark" ? "text-white/70" : "text-[#5b616e]"
                }`}
            >
                {label}
            </p>
            <p className="mt-3 text-[36px] font-medium leading-none tracking-[-0.03em] tabular-nums">
                {value}
            </p>
            {note && (
                <p
                    className={`mt-3 text-[14px] leading-[1.5] ${
                        tone === "dark" ? "text-white/70" : "text-[#5b616e]"
                    }`}
                >
                    {note}
                </p>
            )}
        </div>
    );
}

function GradeDistribution({ counts, total }) {
    const data = ["A", "B", "C", "F"].map((grade) => ({
        grade,
        count: counts[grade] || 0,
    }));

    return (
        <div className="rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-white px-6 py-5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                        Grade Distribution
                    </p>
                    <p className="mt-2 text-[18px] font-semibold text-[#0a0b0d]">
                        Assessed cohort
                    </p>
                </div>
                <span className="rounded-full bg-[#eef0f3] px-3 py-1 text-[13px] font-bold text-[#0a0b0d]">
                    {total} results
                </span>
            </div>
            <div className="mt-5 h-[180px] min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                    >
                        <XAxis
                            dataKey="grade"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#0a0b0d",
                                fontSize: 14,
                                fontWeight: 700,
                            }}
                        />
                        <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#5b616e",
                                fontSize: 13,
                                fontWeight: 600,
                            }}
                        />
                        <Tooltip
                            cursor={{ fill: "rgba(0,82,255,0.08)" }}
                            contentStyle={{
                                borderRadius: 16,
                                border: "1px solid rgba(91,97,110,0.2)",
                                boxShadow: "0 12px 32px rgba(10,11,13,0.08)",
                            }}
                            formatter={(value) => [
                                `${value} result${value === 1 ? "" : "s"}`,
                                "Count",
                            ]}
                            labelFormatter={(grade) => `Grade ${grade}`}
                        />
                        <Bar
                            dataKey="count"
                            fill="#0052ff"
                            radius={[12, 12, 0, 0]}
                            barSize={48}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function downloadCsv(rows) {
    const header = [
        "Result ID",
        "Student ID",
        "Student Name",
        "Programme",
        "Company",
        "Assessor",
        "Status",
        "Final Score",
        "Grade",
        ...CRITERIA.map((c) => `${c.label} (${c.weight}%)`),
    ];

    const escape = (value) => {
        if (value == null) return "";
        const str = String(value);
        if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
        return str;
    };

    const lines = [header.map(escape).join(",")];

    rows.forEach((row) => {
        const total = weightedTotal(row.scores);
        const grade = gradeFromScore(total);
        const line = [
            row.id,
            row.studentId,
            row.studentName,
            row.programme,
            row.company,
            row.assessorName,
            row.status,
            total != null ? total.toFixed(2) : "",
            grade ?? "",
            ...CRITERIA.map((c) =>
                row.scores ? row.scores[c.key] : "",
            ),
        ];
        lines.push(line.map(escape).join(","));
    });

    const blob = new Blob([lines.join("\n")], {
        type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `results-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function BreakdownTable({ scores }) {
    const total = weightedTotal(scores);

    return (
        <div className="overflow-hidden rounded-[20px] border border-[rgba(91,97,110,0.2)] bg-white">
            <div className="grid grid-cols-[minmax(0,1fr)_80px_80px_96px] items-center gap-3 border-b border-[rgba(91,97,110,0.2)] bg-[#f8f9fb] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                <span>Criterion</span>
                <span className="text-right">Weight</span>
                <span className="text-right">Score</span>
                <span className="text-right">Weighted</span>
            </div>
            {CRITERIA.map((c) => {
                const score = scores[c.key];
                const weighted = (score * c.weight) / 100;
                return (
                    <div
                        key={c.key}
                        className="grid grid-cols-[minmax(0,1fr)_80px_80px_96px] items-center gap-3 border-b border-[rgba(91,97,110,0.2)] px-5 py-3.5 last:border-b-0"
                    >
                        <span className="text-[15px] font-medium text-[#0a0b0d]">
                            {c.label}
                        </span>
                        <span className="text-right text-[14px] text-[#5b616e] tabular-nums">
                            {c.weight}%
                        </span>
                        <span className="text-right text-[15px] font-semibold text-[#0a0b0d] tabular-nums">
                            {score}
                        </span>
                        <span className="text-right text-[15px] font-semibold text-[#0a0b0d] tabular-nums">
                            {weighted.toFixed(2)}
                        </span>
                    </div>
                );
            })}
            <div className="grid grid-cols-[minmax(0,1fr)_80px_80px_96px] items-center gap-3 bg-[#0052ff] px-5 py-4 text-white">
                <span className="text-[13px] font-bold uppercase tracking-[0.12em]">
                    Total
                </span>
                <span className="text-right text-[14px] tabular-nums opacity-70">
                    100%
                </span>
                <span />
                <span className="text-right text-[20px] font-semibold leading-none tracking-[-0.02em] tabular-nums">
                    {total.toFixed(2)}
                </span>
            </div>
        </div>
    );
}

export default function ResultsPage() {
    const [search, setSearch] = useState("");
    const [programmeFilter, setProgrammeFilter] = useState("All");
    const [assessorFilter, setAssessorFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [gradeFilter, setGradeFilter] = useState("All");
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [viewTarget, setViewTarget] = useState(null);

    const enriched = useMemo(
        () =>
            RESULTS.map((result) => {
                const total = weightedTotal(result.scores);
                return {
                    ...result,
                    finalScore: total,
                    grade: gradeFromScore(total),
                };
            }),
        [],
    );

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return enriched.filter((row) => {
            if (programmeFilter !== "All" && row.programme !== programmeFilter)
                return false;
            if (assessorFilter !== "All" && row.assessorId !== assessorFilter)
                return false;
            if (statusFilter !== "All" && row.status !== statusFilter)
                return false;

            if (gradeFilter !== "All") {
                if (gradeBand(row.finalScore) !== gradeFilter) return false;
            }

            if (
                q &&
                !row.studentName.toLowerCase().includes(q) &&
                !row.studentId.toLowerCase().includes(q)
            )
                return false;

            return true;
        });
    }, [
        enriched,
        search,
        programmeFilter,
        assessorFilter,
        statusFilter,
        gradeFilter,
    ]);

    const stats = useMemo(() => {
        const assessed = enriched.filter((r) => r.finalScore != null);
        const pending = enriched.length - assessed.length;

        const avg = assessed.length
            ? assessed.reduce((sum, r) => sum + r.finalScore, 0) /
              assessed.length
            : 0;

        const highest = assessed.length
            ? Math.max(...assessed.map((r) => r.finalScore))
            : 0;

        return {
            totalAssessed: assessed.length,
            average: avg,
            highest,
            pending,
        };
    }, [enriched]);

    const performance = useMemo(() => {
        const assessed = enriched.filter((r) => r.finalScore != null);
        const distribution = { A: 0, B: 0, C: 0, F: 0 };
        assessed.forEach((row) => {
            if (row.grade) distribution[row.grade] += 1;
        });

        const criterionAverages = CRITERIA.map((criterion) => {
            const scored = assessed.filter((row) => row.scores?.[criterion.key] != null);
            const avg = scored.length
                ? scored.reduce((sum, row) => sum + row.scores[criterion.key], 0) /
                  scored.length
                : 0;
            return { ...criterion, avg };
        }).sort((a, b) => a.avg - b.avg);

        const passRate = assessed.length
            ? Math.round(
                  (assessed.filter((row) => row.finalScore >= 50).length /
                      assessed.length) *
                      100,
              )
            : 0;

        return {
            distribution,
            assessedCount: assessed.length,
            weakestCriteria: criterionAverages.slice(0, 2),
            passRate,
        };
    }, [enriched]);

    const isFiltered =
        search !== "" ||
        programmeFilter !== "All" ||
        assessorFilter !== "All" ||
        statusFilter !== "All" ||
        gradeFilter !== "All";

    function clearFilters() {
        setSearch("");
        setProgrammeFilter("All");
        setAssessorFilter("All");
        setStatusFilter("All");
        setGradeFilter("All");
    }

    const columns = [
        {
            key: "studentId",
            header: "Student ID",
            cellClassName: "font-semibold tabular-nums",
        },
        {
            key: "studentName",
            header: "Student",
            cell: (row) => (
                <div>
                    <p className="font-semibold text-[#0a0b0d]">
                        {row.studentName}
                    </p>
                    <p className="mt-1 text-[13px] text-[#5b616e]">
                        {row.programme}
                    </p>
                </div>
            ),
        },
        {
            key: "company",
            header: "Company",
            cell: (row) => (
                <span className="text-[#0a0b0d]">{row.company}</span>
            ),
        },
        {
            key: "assessorName",
            header: "Assessor",
            cell: (row) => (
                <span className="text-[#5b616e]">{row.assessorName}</span>
            ),
        },
        {
            key: "finalScore",
            header: "Final Score",
            accessor: (row) => row.finalScore ?? -1,
            cell: (row) => (
                <span
                    className={`tabular-nums ${
                        row.finalScore == null
                            ? "text-[#5b616e]"
                            : "font-semibold text-[#0a0b0d]"
                    }`}
                >
                    {formatScore(row.finalScore)}
                </span>
            ),
        },
        {
            key: "grade",
            header: "Grade",
            cell: (row) => <GradeBadge grade={row.grade} />,
        },
        {
            key: "status",
            header: "Status",
            cell: (row) => <StatusBadge status={row.status} />,
        },
    ];

    return (
        <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-white">
            <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                            Assessment Outcomes
                        </p>
                        <h1 className="mt-3 text-[56px] font-medium leading-[1] tracking-[-0.03em] text-[#0a0b0d] md:text-[72px]">
                            Results
                        </h1>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={() => downloadCsv(filtered)}
                    >
                        <DownloadSimple
                            size={18}
                            weight="bold"
                            className="mr-2"
                        />
                        Export CSV
                    </Button>
                </div>

                <section className="mt-12">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <InsightCard
                            label="Average Score"
                            value={`${stats.average.toFixed(1)}%`}
                            note="Across submitted and approved assessments."
                            tone="dark"
                        />
                        <InsightCard
                            label="Pass Rate"
                            value={`${performance.passRate}%`}
                            note={`${performance.assessedCount} assessed results`}
                        />
                        <InsightCard
                            label="Pending Review"
                            value={stats.pending}
                            note="Submitted or missing scores."
                        />
                    </div>
                    <div className="mt-4">
                        <GradeDistribution
                            counts={performance.distribution}
                            total={performance.assessedCount}
                        />
                    </div>
                </section>

                <section className="mt-4">
                    <div className="rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-white px-6 py-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="mt-2 text-[18px] font-semibold text-[#0a0b0d]">
                                    Lowest-scoring criteria
                                </p>
                            </div>
                            <span className="rounded-full bg-[#eef0f3] px-3 py-1 text-[13px] font-bold text-[#0a0b0d]">
                                Highest {stats.highest.toFixed(1)}%
                            </span>
                        </div>
                        <div className="mt-5 grid grid-cols-1 divide-y divide-[rgba(91,97,110,0.2)] md:grid-cols-2 md:divide-x md:divide-y-0">
                            {performance.weakestCriteria.map((criterion) => (
                                <div
                                    key={criterion.key}
                                    className="py-4 first:pt-0 last:pb-0 md:px-5 md:py-0 md:first:pl-0 md:last:pr-0"
                                >
                                    <p className="text-[15px] font-semibold text-[#0a0b0d]">
                                        {criterion.label}
                                    </p>
                                    <p className="mt-2 text-[28px] font-medium leading-none tracking-[-0.02em] tabular-nums text-[#0a0b0d]">
                                        {criterion.avg.toFixed(1)}%
                                    </p>
                                    <p className="mt-2 text-[13px] text-[#5b616e]">
                                        Cohort average, weighted at {criterion.weight}%.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mt-10">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
                        <div className="relative">
                            <MagnifyingGlass
                                size={18}
                                weight="bold"
                                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#5b616e]"
                            />
                            <Input
                                placeholder="Search student ID or name"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-12"
                            />
                        </div>

                        <Dropdown
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={STATUS_OPTIONS.map((s) => ({
                                value: s,
                                label: s === "All" ? "All Statuses" : s,
                            }))}
                        />

                        <Dropdown
                            value={gradeFilter}
                            onChange={setGradeFilter}
                            options={GRADE_RANGES}
                        />

                        <button
                            type="button"
                            onClick={() => setAdvancedOpen((open) => !open)}
                            className="rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-white px-5 py-3 text-[15px] font-semibold text-[#0a0b0d] transition-colors hover:bg-[#eef0f3]"
                        >
                            {advancedOpen ? "Hide Filters" : "More Filters"}
                        </button>
                    </div>

                    {advancedOpen && (
                        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                            <Dropdown
                                value={programmeFilter}
                                onChange={setProgrammeFilter}
                                options={PROGRAMMES.map((p) => ({
                                    value: p,
                                    label: p === "All" ? "All Programmes" : p,
                                }))}
                            />

                            <Dropdown
                                value={assessorFilter}
                                onChange={setAssessorFilter}
                                options={[
                                    { value: "All", label: "All Assessors" },
                                    ...ASSESSORS.map((a) => ({
                                        value: a.id,
                                        label: a.name,
                                    })),
                                ]}
                            />
                        </div>
                    )}
                </section>

                <section className="mt-6">
                    <DataTable
                        columns={columns}
                        rows={filtered}
                        rowKey={(r) => r.id}
                        emptyMessage={
                            isFiltered
                                ? "No results match your filters."
                                : "No results have been recorded yet."
                        }
                        filteredAway={isFiltered}
                        onClearFilters={clearFilters}
                        onRowActivate={(row) =>
                            row.scores ? setViewTarget(row) : null
                        }
                        rowActions={(row) => (
                            <button
                                type="button"
                                disabled={!row.scores}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setViewTarget(row);
                                }}
                                className="inline-flex items-center rounded-full border border-[rgba(91,97,110,0.3)] bg-white px-4 py-1.5 text-[13px] font-semibold text-[#0a0b0d] transition-colors hover:bg-[#eef0f3] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                View
                            </button>
                        )}
                        totalLabel={(shown) =>
                            `Showing ${shown} of ${enriched.length}`
                        }
                    />
                </section>
            </div>

            <Modal open={!!viewTarget} size="lg">
                <ModalHeader>
                    <ModalTitle>Result Breakdown</ModalTitle>
                    <ModalDescription>
                        Full assessment for{" "}
                        <span className="font-semibold text-[#0a0b0d]">
                            {viewTarget?.studentName}
                        </span>
                        {viewTarget ? ` · ${viewTarget.studentId}` : ""}
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    {viewTarget?.scores ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-3 rounded-[20px] border border-[rgba(91,97,110,0.2)] bg-[#f8f9fb] px-5 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                                            Company
                                        </p>
                                        <p className="mt-1 text-[15px] font-semibold text-[#0a0b0d]">
                                            {viewTarget.company}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                                            Assessor
                                        </p>
                                        <p className="mt-1 text-[15px] font-semibold text-[#0a0b0d]">
                                            {viewTarget.assessorName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                                            Programme
                                        </p>
                                        <p className="mt-1 text-[15px] font-semibold text-[#0a0b0d]">
                                            {viewTarget.programme}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <BreakdownTable scores={viewTarget.scores} />

                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                                    Assessor Comments
                                </p>
                                <p className="mt-2 max-w-[72ch] text-[15px] leading-[1.6] text-[#0a0b0d]">
                                    {viewTarget.comments}
                                </p>
                            </div>

                            <div className="flex items-center justify-between gap-4 rounded-[24px] border border-[#0052ff] bg-[#0052ff] px-6 py-5 text-white">
                                <div>
                                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] opacity-70">
                                        Final Grade
                                    </p>
                                    <p className="mt-1 text-[32px] font-medium leading-none tracking-[-0.02em] tabular-nums">
                                        {viewTarget.finalScore.toFixed(2)}%
                                    </p>
                                </div>
                                <GradeBadge grade={viewTarget.grade} size="lg" />
                            </div>
                        </div>
                    ) : null}
                </ModalContent>
                <ModalFooter>
                    <Button
                        variant="secondary"
                        onClick={() => setViewTarget(null)}
                    >
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() =>
                            viewTarget && downloadCsv([viewTarget])
                        }
                    >
                        <DownloadSimple
                            size={18}
                            weight="bold"
                            className="mr-2"
                        />
                        Export Result
                    </Button>
                </ModalFooter>
            </Modal>
        </main>
    );
}
