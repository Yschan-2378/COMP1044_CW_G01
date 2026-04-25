"use client";

import { Plus } from "@phosphor-icons/react/dist/icons/Plus";
import { Briefcase } from "@phosphor-icons/react/dist/icons/Briefcase";
import { ChartBar } from "@phosphor-icons/react/dist/icons/ChartBar";
import { UserGear } from "@phosphor-icons/react/dist/icons/UserGear";
import { Users } from "@phosphor-icons/react/dist/icons/Users";
import { ClipboardText } from "@phosphor-icons/react/dist/icons/ClipboardText";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import Button from "@/components/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/table";
import { useApi } from "@/lib/use-api";

function StatChip({ stat }) {
    const Icon = stat.icon;

    return (
        <div className="flex items-center gap-4 rounded-[20px] bg-[#eef0f3] px-6 py-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white text-[#0a0b0d]">
                <Icon size={18} weight="bold" />
            </div>
            <div className="min-w-0">
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                    {stat.label}
                </p>
                <p className="mt-1 text-[28px] font-semibold leading-[1] text-[#0a0b0d] tabular-nums">
                    {stat.value}
                </p>
            </div>
        </div>
    );
}

function ChartPanel({ title, children }) {
    return (
        <div className="rounded-[24px] border border-[rgba(91,97,110,0.18)] bg-transparent px-5 py-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                        {title}
                    </h2>
                </div>
            </div>
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

export default function DashboardPage() {
    const studentsApi = useApi("/students.php");
    const assessorsApi = useApi("/assessors.php");
    const internshipsApi = useApi("/internships.php");
    const resultsApi = useApi("/results.php");

    const students = studentsApi.data?.students ?? [];
    const assessors = assessorsApi.data?.assessors ?? [];
    const internships = internshipsApi.data?.internships ?? [];
    const results = resultsApi.data?.results ?? [];
    const assessmentCount = results.filter((row) => row.assessment_id != null).length;
    const pendingCount = Math.max(internships.length - assessmentCount, 0);

    const stats = [
        { label: "Students", value: students.length, icon: Users },
        { label: "Assessors", value: assessors.length, icon: UserGear },
        { label: "Internships", value: internships.length, icon: Briefcase },
        { label: "Assessments", value: assessmentCount, icon: ClipboardText },
    ];

    const recentAssignments = internships.slice(0, 5);
    const statusData = [
        { name: "Graded", value: assessmentCount, color: "#0052ff" },
        { name: "Pending", value: pendingCount, color: "#a8b0bd" },
    ].filter((item) => item.value > 0);
    const assessorLoad = assessors
        .map((assessor) => ({
            assessor: assessor.username,
            internships: Number(assessor.assigned_count || 0),
        }))
        .filter((row) => row.internships > 0);

    return (
        <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-white">
            <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16">
                <section className="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-end">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                            Internship Result Management
                        </p>
                        <h1 className="mt-4 max-w-[10ch] text-[72px] font-medium leading-[0.96] tracking-[-0.04em] text-[#0a0b0d] md:text-[104px]">
                            Admin Dashboard
                        </h1>
                    </div>
                    <p className="max-w-[38ch] text-[16px] leading-[1.5] text-[#5b616e] lg:pb-4">
                        Manage the entire student internship experience, from students to assessors.
                    </p>
                </section>

                <section className="mt-12">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => (
                            <StatChip key={stat.label} stat={stat} />
                        ))}
                    </div>
                </section>

                <section className="mt-16">
                    <div className="flex flex-wrap gap-3">
                        <Button variant="primary" href="/students">
                            <Plus size={18} weight="bold" className="mr-2" />
                            Add Student
                        </Button>
                        <Button variant="secondary" href="/assessors" className="gap-2">
                            <UserGear size={18} weight="bold" />
                            Create Assessor
                        </Button>
                        <Button variant="secondary" href="/internships" className="gap-2">
                            <Briefcase size={18} weight="bold" />
                            Assign Internship
                        </Button>
                        <Button variant="secondary" href="/results" className="gap-2">
                            <ChartBar size={18} weight="bold" />
                            View Results
                        </Button>
                    </div>
                </section>

                <section className="mt-16 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,4fr)_minmax(0,5fr)]">
                    <ChartPanel
                        title="Assessment Status"
                    >
                        {statusData.length ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={72}
                                        outerRadius={104}
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
                            <EmptyChart message="No internships to chart yet." />
                        )}
                    </ChartPanel>

                    <ChartPanel
                        title="Internships by Assessor"
                    >
                        {assessorLoad.length ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={assessorLoad} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                                    <CartesianGrid stroke="rgba(91,97,110,0.18)" vertical={false} />
                                    <XAxis
                                        dataKey="assessor"
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
                                        dataKey="internships"
                                        name="Internships"
                                        fill="#0052ff"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={64}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart message="No assigned internships to chart yet." />
                        )}
                    </ChartPanel>
                </section>

                <section className="mt-16">
                    <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                        Recent Internship Assignments
                    </h2>
                    <div className="mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Company Name</TableHead>
                                    <TableHead>Assessor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentAssignments.length === 0 ? (
                                    <TableRow>
                                        <TableCell className="text-[#5b616e]" colSpan={4}>
                                            {internshipsApi.loading
                                                ? "Loading assignments..."
                                                : "No internships assigned yet."}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recentAssignments.map((record) => (
                                        <TableRow key={record.internship_id}>
                                            <TableCell className="font-semibold tabular-nums">
                                                {record.student_id}
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {record.student_name}
                                            </TableCell>
                                            <TableCell>{record.company_name}</TableCell>
                                            <TableCell>{record.assessor_username}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </div>
        </main>
    );
}
