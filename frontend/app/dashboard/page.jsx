"use client";

import {
    Plus,
    Briefcase,
    ChartBar,
    UserGear,
    ListChecks,
    Clock,
    ArrowUpRight,
    TrendUp,
} from "@phosphor-icons/react/dist/ssr";

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

const heroStat = {
    label: "Total Students",
    value: 248,
    delta: "+12 this week",
    caption:
        "Enrolled across the current programme cycle - spanning 192 active internships and 36 assessors.",
};

const supportingStats = [
    { label: "Assessors", value: 36, icon: UserGear },
    { label: "Internships Assigned", value: 192, icon: Briefcase },
    { label: "Pending Assessments", value: 44, icon: Clock },
    { label: "Completed Assessments", value: 148, icon: ListChecks },
];

const recentRecords = [
    {
        student: "Aisha Rahman",
        company: "TechFlow Solutions",
        assessor: "Dr. James Chen",
        status: "Approved",
    },
    {
        student: "Marcus Johnson",
        company: "Alpha Analytics",
        assessor: "Prof. Sarah Lin",
        status: "Pending",
    },
    {
        student: "Priya Nair",
        company: "CloudScale Inc.",
        assessor: "Mr. David Park",
        status: "Submitted",
    },
    {
        student: "Tomáš Horák",
        company: "DataBridge Ltd",
        assessor: "Dr. Emily Carter",
        status: "Pending",
    },
    {
        student: "Lina Osei",
        company: "NexGen Systems",
        assessor: "Prof. Michael Adams",
        status: "Approved",
    },
    {
        student: "Chen Wei",
        company: "Horizon Labs",
        assessor: "Dr. Anna Volkov",
        status: "Submitted",
    },
];

const quickActions = [
    { label: "Add Assessor", icon: Plus, href: "/assessors/add" },
    {
        label: "Assign Internship",
        icon: Briefcase,
        href: "/internships/assign",
    },
    { label: "View Results", icon: ChartBar, href: "/results" },
];

function SupportingStat({ stat, isLast }) {
    const Icon = stat.icon;

    return (
        <div
            className={`flex items-center gap-4 px-6 py-5 ${
                isLast ? "" : "border-b md:border-b-0 md:border-r"
            } border-[rgba(91,97,110,0.2)]`}
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#eef0f3] text-[#0a0b0d]">
                <Icon size={18} weight="bold" />
            </div>
            <div className="min-w-0">
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                    {stat.label}
                </p>
                <p className="mt-1 text-[28px] font-semibold leading-[1] tracking-[-0.02em] text-[#0a0b0d]">
                    {stat.value}
                </p>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-white">
            <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                        Dashboard
                    </p>
                    <Button variant="primary">
                        <Plus size={18} weight="bold" className="mr-2" />
                        New Student
                    </Button>
                </div>
                <section className="mt-12 grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-end">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                            {heroStat.label}
                        </p>
                        <p className="mt-4 text-[96px] font-medium leading-[0.92] tracking-[-0.04em] text-[#0a0b0d] md:text-[128px] lg:text-[144px] tabular-nums">
                            {heroStat.value}
                        </p>
                    </div>
                    <div className="lg:pb-4">
                        <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0052ff]">
                            <TrendUp size={16} weight="bold" />
                            {heroStat.delta}
                        </span>
                        <p className="mt-3 max-w-[36ch] text-[16px] leading-[1.5] text-[#5b616e]">
                            {heroStat.caption}
                        </p>
                    </div>
                </section>
                <section className="mt-12">
                    <div className="grid grid-cols-1 overflow-hidden rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-white md:grid-cols-4">
                        {supportingStats.map((stat, i) => (
                            <SupportingStat
                                key={stat.label}
                                stat={stat}
                                isLast={i === supportingStats.length - 1}
                            />
                        ))}
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="mt-16">
                    <div className="flex flex-wrap gap-3">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Button
                                    key={action.label}
                                    variant="secondary"
                                    href={action.href}
                                    className="gap-2"
                                >
                                    <Icon size={18} weight="bold" />
                                    {action.label}
                                </Button>
                            );
                        })}
                    </div>
                </section>

                {/* Recent Records Table */}
                <section className="mt-16">
                    <div className="flex items-end justify-between">
                        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                            Recent Assignments
                        </h2>
                        <a
                            href="/internships"
                            className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#0052ff] hover:text-[#578bfa] transition-colors"
                        >
                            View all
                            <ArrowUpRight size={16} weight="bold" />
                        </a>
                    </div>
                    <div className="mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Assessor</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentRecords.map((record) => (
                                    <TableRow key={record.student}>
                                        <TableCell className="font-semibold">
                                            {record.student}
                                        </TableCell>
                                        <TableCell>{record.company}</TableCell>
                                        <TableCell>{record.assessor}</TableCell>
                                        <TableCell>
                                            <Badge status={record.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </div>
        </main>
    );
}
