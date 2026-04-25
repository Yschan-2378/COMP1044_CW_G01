"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/icons/MagnifyingGlass";
import { ClipboardText } from "@phosphor-icons/react/dist/icons/ClipboardText";

import Badge from "@/components/badge";
import Button from "@/components/button";
import Input from "@/components/input";
import { DataTable } from "@/components/data-table";
import { finalScore, markStatus, PageState, useAssessorData } from "../use-assessor-data";

export default function AssignedStudentsPage() {
    const { data, loading, error } = useAssessorData("/internships.php");
    const [search, setSearch] = useState("");
    const internships = useMemo(() => data?.internships || [], [data]);

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return internships;

        return internships.filter(
            (row) =>
                row.student_id.toLowerCase().includes(query) ||
                row.student_name.toLowerCase().includes(query) ||
                row.company_name.toLowerCase().includes(query),
        );
    }, [internships, search]);

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
            key: "status",
            header: "Status",
            cell: (row) => <Badge status={markStatus(row)} />,
        },
        {
            key: "final_calculated_score",
            header: "Final Score",
            align: "right",
            cellClassName: "font-semibold tabular-nums",
            cell: (row) => (finalScore(row) ? `${finalScore(row)}%` : "-"),
        },
    ];

    return (
        <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-white">
            <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                            Assessment Queue
                        </p>
                        <h1 className="mt-3 text-[56px] font-medium leading-[1] tracking-[-0.03em] text-[#0a0b0d] md:text-[72px]">
                            Assigned Students
                        </h1>
                    </div>
                    <Button href="/assessor/grade" variant="primary" className="gap-2">
                        <ClipboardText size={18} weight="bold" />
                        Enter Marks
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
                    <PageState loading={loading} error={error} empty={!internships.length}>
                        <DataTable
                            columns={columns}
                            rows={filtered}
                            rowKey={(row) => row.internship_id}
                            emptyMessage={
                                search ? "No assigned students match your search." : "No assigned students yet."
                            }
                            filteredAway={search !== ""}
                            onClearFilters={() => setSearch("")}
                            rowActions={(row) => (
                                <Button
                                    href={`/assessor/grade/${row.internship_id}`}
                                    variant={row.assessment_id ? "secondary" : "primary"}
                                    className="px-4 py-1.5 text-[13px]"
                                >
                                    {row.assessment_id ? "Update" : "Grade"}
                                </Button>
                            )}
                            totalLabel={(shown) => `Showing ${shown} of ${internships.length}`}
                        />
                    </PageState>
                </section>
            </div>
        </main>
    );
}
