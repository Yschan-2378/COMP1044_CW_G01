"use client";

import { ClipboardText } from "@phosphor-icons/react/dist/icons/ClipboardText";
import { ChartBar } from "@phosphor-icons/react/dist/icons/ChartBar";
import { Users } from "@phosphor-icons/react/dist/icons/Users";
import { ArrowRight } from "@phosphor-icons/react/dist/icons/ArrowRight";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import Button from "@/components/button";
import Badge from "@/components/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/table";
import { finalScore, markStatus, PageState, useAssessorData } from "./use-assessor-data";

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

function ChartTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-[14px] border border-[rgba(91,97,110,0.18)] bg-white px-3 py-2 text-[13px] shadow-sm">
            {payload.map((item) => (
                <p key={item.name} className="text-[#5b616e]">
                    <span className="font-semibold text-[#0a0b0d]">{item.name}: </span>
                    {item.value}
                </p>
            ))}
        </div>
    );
}

export default function AssessorDashboardPage() {
    const { data, loading, error } = useAssessorData("/internships.php");
    const internships = data?.internships || [];
    const graded = internships.filter((item) => item.assessment_id).length;
    const pending = internships.length - graded;
    const statusData = [
        { name: "Graded", value: graded, color: "#0052ff" },
        { name: "Pending", value: pending, color: "#a8b0bd" },
    ].filter((item) => item.value > 0);

    return (
        <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-white">
            <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16">
                <section className="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-end">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                            Assessor Workspace
                        </p>
                        <h1 className="mt-4 max-w-[11ch] text-[72px] font-medium leading-[0.96] tracking-[-0.04em] text-[#0a0b0d] md:text-[104px]">
                            My Assigned Students
                        </h1>
                    </div>
                    <div className="flex flex-col gap-3 lg:items-start lg:pb-4">
                        <p className="max-w-[38ch] text-[16px] leading-[1.5] text-[#5b616e]">
                            Review assigned internships, enter marks, and check final calculated scores.
                        </p>
                        <Button href="/assessor/students" variant="primary" className="w-fit gap-2">
                            Start grading
                            <ArrowRight size={18} weight="bold" />
                        </Button>
                    </div>
                </section>

                <section className="mt-12">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <StatChip label="Assigned Students" value={internships.length} icon={Users} />
                        <StatChip label="Pending Marks" value={pending} icon={ClipboardText} />
                        <StatChip label="Completed" value={graded} icon={ChartBar} />
                    </div>
                </section>

                <section className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-stretch">
                    <div className="rounded-[24px] border border-[rgba(91,97,110,0.18)] bg-transparent px-6 py-5">
                        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                            Assessment Progress
                        </h2>
                        <div className="mt-5 h-[260px]">
                            {statusData.length ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={68}
                                            outerRadius={98}
                                            paddingAngle={4}
                                        >
                                            {statusData.map((entry) => (
                                                <Cell key={entry.name} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<ChartTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center rounded-[18px] border border-dashed border-[rgba(91,97,110,0.28)] bg-white text-[14px] font-semibold text-[#5b616e]">
                                    No assigned students to chart yet.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-[24px] bg-[#0a0b0d] px-6 py-5 text-white">
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-white/60">
                            Queue Summary
                        </p>
                        <p className="mt-6 text-[56px] font-medium leading-none tabular-nums">
                            {internships.length ? Math.round((graded / internships.length) * 100) : 0}%
                        </p>
                        <p className="mt-3 text-[15px] leading-[1.5] text-white/70">
                            of assigned internships have submitted marks.
                        </p>
                        <div className="mt-8 grid grid-cols-2 gap-3">
                            <div className="rounded-[16px] bg-white/10 px-4 py-3">
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/55">
                                    Graded
                                </p>
                                <p className="mt-1 text-[26px] font-semibold tabular-nums">{graded}</p>
                            </div>
                            <div className="rounded-[16px] bg-white/10 px-4 py-3">
                                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/55">
                                    Pending
                                </p>
                                <p className="mt-1 text-[26px] font-semibold tabular-nums">{pending}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-16">
                    <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                        Current Assignments
                    </h2>
                    <div className="mt-4">
                        <PageState loading={loading} error={error} empty={!internships.length}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Final Score</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {internships.slice(0, 6).map((row) => (
                                        <TableRow key={row.internship_id}>
                                            <TableCell className="font-semibold">
                                                {row.student_name}
                                            </TableCell>
                                            <TableCell>{row.company_name}</TableCell>
                                            <TableCell>
                                                <Badge status={markStatus(row)} />
                                            </TableCell>
                                            <TableCell className="font-semibold tabular-nums">
                                                {finalScore(row) ? `${finalScore(row)}%` : "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </PageState>
                    </div>
                </section>
            </div>
        </main>
    );
}
