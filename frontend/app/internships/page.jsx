"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Briefcase } from "@phosphor-icons/react/dist/icons/Briefcase";
import { CalendarDots } from "@phosphor-icons/react/dist/icons/CalendarDots";
import { CheckCircle } from "@phosphor-icons/react/dist/icons/CheckCircle";
import { ClipboardText } from "@phosphor-icons/react/dist/icons/ClipboardText";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/icons/MagnifyingGlass";
import { Plus } from "@phosphor-icons/react/dist/icons/Plus";
import { WarningCircle } from "@phosphor-icons/react/dist/icons/WarningCircle";

import Button from "@/components/button";
import Input from "@/components/input";
import Label from "@/components/label";
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

const STUDENTS = [
    {
        id: "20210456",
        name: "Aisha Rahman",
        programme: "Computer Science",
    },
    {
        id: "20221287",
        name: "Marcus Johnson",
        programme: "Software Engineering",
    },
    {
        id: "20203098",
        name: "Priya Nair",
        programme: "Data Science",
    },
    {
        id: "20224410",
        name: "Tomáš Horák",
        programme: "Information Technology",
    },
    {
        id: "20212201",
        name: "Lina Osei",
        programme: "Cybersecurity",
    },
    {
        id: "20231005",
        name: "Chen Wei",
        programme: "Computer Science",
    },
    {
        id: "20208842",
        name: "Sofia Martinez",
        programme: "Software Engineering",
    },
];

const ASSESSORS = [
    {
        id: "AS-1042",
        name: "Dr. James Chen",
        role: "Lecturer",
        department: "Computer Science",
        active: true,
    },
    {
        id: "AS-1043",
        name: "Prof. Sarah Lin",
        role: "Lecturer",
        department: "Software Engineering",
        active: true,
    },
    {
        id: "AS-1044",
        name: "Mr. David Park",
        role: "Supervisor",
        department: "Industry Partner",
        active: true,
    },
    {
        id: "AS-1045",
        name: "Dr. Emily Carter",
        role: "Lecturer",
        department: "Data Science",
        active: false,
    },
    {
        id: "AS-1046",
        name: "Prof. Michael Adams",
        role: "Lecturer",
        department: "Information Technology",
        active: true,
    },
    {
        id: "AS-1047",
        name: "Dr. Anna Volkov",
        role: "Supervisor",
        department: "Industry Partner",
        active: true,
    },
];

const INITIAL_INTERNSHIPS = [
    {
        id: "INT-3001",
        studentId: "20210456",
        companyName: "Northstar Systems",
        companyAddress: "15 King Street, Manchester",
        industrySupervisorName: "Hannah Doyle",
        assessorId: "AS-1042",
        startDate: "2026-01-15",
        endDate: "2026-06-15",
        position: "Software Engineering Intern",
        assessmentStatus: "Not Submitted",
    },
    {
        id: "INT-3002",
        studentId: "20221287",
        companyName: "Blue Harbour Analytics",
        companyAddress: "2 Riverside Court, Leeds",
        industrySupervisorName: "Victor Mensah",
        assessorId: "AS-1043",
        startDate: "2025-09-01",
        endDate: "2026-02-28",
        position: "QA Automation Intern",
        assessmentStatus: "Submitted",
    },
    {
        id: "INT-3003",
        studentId: "20203098",
        companyName: "Civic Data Lab",
        companyAddress: "88 York Road, Birmingham",
        industrySupervisorName: "Grace Holloway",
        assessorId: "AS-1046",
        startDate: "2025-05-05",
        endDate: "2025-11-30",
        position: "Data Analyst Intern",
        assessmentStatus: "Approved",
    },
    {
        id: "INT-3004",
        studentId: "20212201",
        companyName: "Aegis Cyber Defence",
        companyAddress: "41 Trinity Park, London",
        industrySupervisorName: "Milan Petrović",
        assessorId: "AS-1047",
        startDate: "2026-02-03",
        endDate: "2026-08-21",
        position: "Security Operations Intern",
        assessmentStatus: "Not Submitted",
    },
];

const STATUS_OPTIONS = ["All", "Ongoing", "Pending Assessment", "Completed"];
const ASSESSMENT_OPTIONS = ["Not Submitted", "Submitted", "Approved"];

const EMPTY_FORM = {
    studentId: "",
    companyName: "",
    companyAddress: "",
    industrySupervisorName: "",
    assessorId: "",
    startDate: "",
    endDate: "",
    position: "",
    assessmentStatus: "Not Submitted",
};

function formatDate(value) {
    if (!value) return "—";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(`${value}T00:00:00`));
}

function getInternshipStatus(internship) {
    if (internship.assessmentStatus === "Approved") return "Completed";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const end = internship.endDate
        ? new Date(`${internship.endDate}T00:00:00`)
        : null;

    if (internship.assessmentStatus === "Submitted") {
        return "Pending Assessment";
    }

    if (end && end < today) {
        return "Pending Assessment";
    }

    return "Ongoing";
}

function generateId(existing) {
    let n = 3001;
    const ids = new Set(existing.map((item) => item.id));
    while (ids.has(`INT-${n}`)) n += 1;
    return `INT-${n}`;
}

function getStudent(studentId) {
    return STUDENTS.find((student) => student.id === studentId);
}

function getAssessor(assessorId) {
    return ASSESSORS.find((assessor) => assessor.id === assessorId);
}

function validateInternship(form, internships, editingId) {
    const errors = {};

    if (!form.studentId) errors.studentId = "Select a student";
    if (!form.companyName.trim()) errors.companyName = "Required";
    if (!form.companyAddress.trim()) errors.companyAddress = "Required";
    if (!form.industrySupervisorName.trim())
        errors.industrySupervisorName = "Required";
    if (!form.assessorId) errors.assessorId = "Select an assessor";
    if (!form.startDate) errors.startDate = "Required";
    if (!form.endDate) errors.endDate = "Required";
    if (!form.position.trim()) errors.position = "Required";

    if (form.startDate && form.endDate && form.endDate <= form.startDate) {
        errors.endDate = "End date must be after start date";
    }

    const assessor = getAssessor(form.assessorId);
    if (form.assessorId && !assessor?.active) {
        errors.assessorId = "Selected assessor must be active";
    }

    if (form.studentId) {
        const hasAnotherActive = internships.some((internship) => {
            if (internship.id === editingId) return false;
            if (internship.studentId !== form.studentId) return false;
            return getInternshipStatus(internship) !== "Completed";
        });

        if (hasAnotherActive) {
            errors.studentId = "Student already has an active internship";
        }
    }

    return errors;
}

function FormField({ label, error, hint, children }) {
    return (
        <div>
            <Label className="mb-2">{label}</Label>
            {children}
            {error ? (
                <p className="mt-1.5 text-[13px] font-semibold text-[#c9182e]">
                    {error}
                </p>
            ) : hint ? (
                <p className="mt-1.5 text-[13px] text-[#5b616e]">{hint}</p>
            ) : null}
        </div>
    );
}

function StatChip({ label, value, icon: Icon, isLast }) {
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
                    {label}
                </p>
                <p className="mt-1 text-[28px] font-semibold leading-[1] tracking-[-0.02em] text-[#0a0b0d] tabular-nums">
                    {value}
                </p>
            </div>
        </div>
    );
}

function InternshipStatusBadge({ status }) {
    const base =
        "inline-flex items-center rounded-full px-3 py-1 text-[13px] font-bold leading-[1.23] tracking-[0.01em]";

    const styles = {
        Ongoing: "bg-[#0a0b0d] text-white",
        "Pending Assessment": "bg-white text-[#0a0b0d] border border-[#0a0b0d]",
        Completed: "bg-[#0052ff] text-white",
    };

    return <span className={`${base} ${styles[status]}`}>{status}</span>;
}

function AssessmentBadge({ status }) {
    const base =
        "inline-flex items-center rounded-full px-3 py-1 text-[13px] font-bold leading-[1.23] tracking-[0.01em]";
    const styles = {
        "Not Submitted": "bg-[#eef0f3] text-[#5b616e]",
        Submitted: "bg-white text-[#0a0b0d] border border-[#0a0b0d]",
        Approved: "bg-[#0052ff] text-white",
    };

    return <span className={`${base} ${styles[status]}`}>{status}</span>;
}

function SearchableSelect({
    label,
    value,
    onChange,
    options,
    placeholder,
    error,
    hint,
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef(null);

    const current = options.find((option) => option.value === value);
    const filtered = options.filter((option) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
            option.label.toLowerCase().includes(q) ||
            (option.meta || "").toLowerCase().includes(q)
        );
    });

    useEffect(() => {
        function onDocClick(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
                setQuery("");
            }
        }

        function onEscape(event) {
            if (event.key === "Escape") {
                setOpen(false);
                setQuery("");
            }
        }

        if (open) {
            document.addEventListener("mousedown", onDocClick);
            document.addEventListener("keydown", onEscape);
            return () => {
                document.removeEventListener("mousedown", onDocClick);
                document.removeEventListener("keydown", onEscape);
            };
        }
    }, [open]);

    return (
        <FormField label={label} error={error} hint={hint}>
            <div ref={ref} className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((state) => !state)}
                    className={`flex w-full items-center justify-between gap-3 rounded-[24px] border bg-[#eef0f3] px-5 py-3 text-left text-[16px] font-medium text-[#0a0b0d] transition-colors hover:bg-[#dfe3e8] focus:outline-none focus:ring-2 focus:ring-[#0052ff] ${
                        open
                            ? "border-[#0052ff]"
                            : "border-[rgba(91,97,110,0.2)]"
                    }`}
                >
                    <span className={current ? "" : "text-[#5b616e]"}>
                        {current ? current.label : placeholder}
                    </span>
                    <MagnifyingGlass size={16} weight="bold" className="text-[#5b616e]" />
                </button>

                {open && (
                    <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-[16px] border border-[rgba(91,97,110,0.2)] bg-white shadow-[0_12px_32px_rgba(10,11,13,0.08)]">
                        <div className="border-b border-[rgba(91,97,110,0.2)] p-3">
                            <Input
                                autoFocus
                                placeholder="Search student"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="bg-white"
                            />
                        </div>
                        <div className="max-h-64 overflow-y-auto py-1">
                            {filtered.length ? (
                                filtered.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setOpen(false);
                                            setQuery("");
                                        }}
                                        className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition-colors ${
                                            option.value === value
                                                ? "bg-[#eef0f3]"
                                                : "hover:bg-[#f5f6f8]"
                                        }`}
                                    >
                                        <span>
                                            <span className="block text-[15px] font-semibold text-[#0a0b0d]">
                                                {option.label}
                                            </span>
                                            {option.meta ? (
                                                <span className="mt-0.5 block text-[13px] text-[#5b616e]">
                                                    {option.meta}
                                                </span>
                                            ) : null}
                                        </span>
                                        {option.value === value ? (
                                            <span className="text-[13px] font-semibold text-[#0052ff]">
                                                Selected
                                            </span>
                                        ) : null}
                                    </button>
                                ))
                            ) : (
                                <p className="px-4 py-8 text-center text-[14px] text-[#5b616e]">
                                    No matching students found.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </FormField>
    );
}

function InternshipForm({ form, setForm, errors, internships, editingId }) {
    const studentOptions = STUDENTS.map((student) => ({
        value: student.id,
        label: student.name,
        meta: `${student.id} · ${student.programme}`,
    }));

    const assessorOptions = ASSESSORS.map((assessor) => ({
        value: assessor.id,
        label: assessor.name,
        labelWithState: `${assessor.name}${assessor.active ? "" : " (Inactive)"}`,
    }));

    const update = (key) => (e) =>
        setForm((current) => ({ ...current, [key]: e.target.value }));

    const currentStatus = getInternshipStatus(form);
    const activeConflict = internships.some((internship) => {
        if (internship.id === editingId) return false;
        if (internship.studentId !== form.studentId) return false;
        return getInternshipStatus(internship) !== "Completed";
    });

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
                <SearchableSelect
                    label="Student"
                    value={form.studentId}
                    onChange={(studentId) =>
                        setForm((current) => ({ ...current, studentId }))
                    }
                    options={studentOptions}
                    placeholder="Select a student"
                    error={errors.studentId}
                    hint={
                        activeConflict
                            ? undefined
                            : "Search by student name, ID, or programme."
                    }
                />
            </div>

            <FormField label="Company Name" error={errors.companyName}>
                <Input
                    placeholder="Northstar Systems"
                    value={form.companyName}
                    onChange={update("companyName")}
                />
            </FormField>

            <FormField label="Position / Role" error={errors.position}>
                <Input
                    placeholder="Software Engineering Intern"
                    value={form.position}
                    onChange={update("position")}
                />
            </FormField>

            <div className="sm:col-span-2">
                <FormField
                    label="Company Address"
                    error={errors.companyAddress}
                >
                    <Input
                        placeholder="15 King Street, Manchester"
                        value={form.companyAddress}
                        onChange={update("companyAddress")}
                    />
                </FormField>
            </div>

            <FormField
                label="Industry Supervisor Name"
                error={errors.industrySupervisorName}
            >
                <Input
                    placeholder="Hannah Doyle"
                    value={form.industrySupervisorName}
                    onChange={update("industrySupervisorName")}
                />
            </FormField>

            <FormField
                label="Assessor"
                error={errors.assessorId}
                hint="Only active assessors can be assigned."
            >
                <Dropdown
                    value={form.assessorId}
                    onChange={(assessorId) =>
                        setForm((current) => ({ ...current, assessorId }))
                    }
                    options={assessorOptions.map((assessor) => ({
                        value: assessor.value,
                        label: assessor.labelWithState,
                    }))}
                    placeholder="Select assessor"
                />
            </FormField>

            <FormField label="Start Date" error={errors.startDate}>
                <Input
                    type="date"
                    value={form.startDate}
                    onChange={update("startDate")}
                />
            </FormField>

            <FormField label="End Date" error={errors.endDate}>
                <Input
                    type="date"
                    value={form.endDate}
                    onChange={update("endDate")}
                />
            </FormField>

            <FormField
                label="Assessment Status"
                hint="Used in the details view and to determine whether the placement is still awaiting review."
            >
                <Dropdown
                    value={form.assessmentStatus}
                    onChange={(assessmentStatus) =>
                        setForm((current) => ({ ...current, assessmentStatus }))
                    }
                    options={ASSESSMENT_OPTIONS}
                />
            </FormField>

            <div className="flex items-end">
                <div className="w-full rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-white px-5 py-4">
                    <p className="text-[14px] font-semibold text-[#0a0b0d]">
                        Derived Status
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                        <InternshipStatusBadge status={currentStatus} />
                        <span className="text-[13px] text-[#5b616e]">
                            Auto-calculated from dates and assessment progress.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryRow({ label, value, muted = false }) {
    return (
        <div className="grid gap-1 border-b border-[rgba(91,97,110,0.2)] py-4 last:border-b-0 md:grid-cols-[180px_minmax(0,1fr)] md:gap-6">
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                {label}
            </p>
            <div className={muted ? "text-[#5b616e]" : "text-[#0a0b0d]"}>{value}</div>
        </div>
    );
}

export default function InternshipsPage() {
    const [internships, setInternships] = useState(INITIAL_INTERNSHIPS);
    const [search, setSearch] = useState("");
    const [assessorFilter, setAssessorFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const [assignOpen, setAssignOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [viewTarget, setViewTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    const enrichedInternships = useMemo(
        () =>
            internships.map((internship) => ({
                ...internship,
                status: getInternshipStatus(internship),
                student: getStudent(internship.studentId),
                assessor: getAssessor(internship.assessorId),
            })),
        [internships],
    );

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return enrichedInternships.filter((internship) => {
            if (
                assessorFilter !== "All" &&
                internship.assessorId !== assessorFilter
            ) {
                return false;
            }

            if (statusFilter !== "All" && internship.status !== statusFilter) {
                return false;
            }

            if (
                q &&
                !internship.student?.name.toLowerCase().includes(q) &&
                !internship.companyName.toLowerCase().includes(q)
            ) {
                return false;
            }

            return true;
        });
    }, [enrichedInternships, search, assessorFilter, statusFilter]);

    const stats = useMemo(() => {
        const total = internships.length;
        const ongoing = enrichedInternships.filter(
            (internship) => internship.status === "Ongoing",
        ).length;
        const pending = enrichedInternships.filter(
            (internship) => internship.status === "Pending Assessment",
        ).length;
        const completed = enrichedInternships.filter(
            (internship) => internship.status === "Completed",
        ).length;

        return { total, ongoing, pending, completed };
    }, [internships, enrichedInternships]);

    function closeAll() {
        setAssignOpen(false);
        setEditTarget(null);
        setViewTarget(null);
        setDeleteTarget(null);
        setForm(EMPTY_FORM);
        setErrors({});
    }

    function openAssign() {
        setForm({
            ...EMPTY_FORM,
            assessorId: ASSESSORS.find((assessor) => assessor.active)?.id || "",
        });
        setErrors({});
        setAssignOpen(true);
    }

    function openEdit(internship) {
        setForm({
            studentId: internship.studentId,
            companyName: internship.companyName,
            companyAddress: internship.companyAddress,
            industrySupervisorName: internship.industrySupervisorName,
            assessorId: internship.assessorId,
            startDate: internship.startDate,
            endDate: internship.endDate,
            position: internship.position,
            assessmentStatus: internship.assessmentStatus,
        });
        setErrors({});
        setEditTarget(internship);
    }

    function submitAssign() {
        const validation = validateInternship(form, internships, null);
        if (Object.keys(validation).length) {
            setErrors(validation);
            return;
        }

        setInternships((current) => [
            ...current,
            {
                ...form,
                id: generateId(current),
                companyName: form.companyName.trim(),
                companyAddress: form.companyAddress.trim(),
                industrySupervisorName: form.industrySupervisorName.trim(),
                position: form.position.trim(),
            },
        ]);
        closeAll();
    }

    function submitEdit() {
        const validation = validateInternship(form, internships, editTarget.id);
        if (Object.keys(validation).length) {
            setErrors(validation);
            return;
        }

        setInternships((current) =>
            current.map((internship) =>
                internship.id === editTarget.id
                    ? {
                          ...internship,
                          ...form,
                          companyName: form.companyName.trim(),
                          companyAddress: form.companyAddress.trim(),
                          industrySupervisorName:
                              form.industrySupervisorName.trim(),
                          position: form.position.trim(),
                      }
                    : internship,
            ),
        );
        closeAll();
    }

    function confirmDelete() {
        setInternships((current) =>
            current.filter((internship) => internship.id !== deleteTarget.id),
        );
        closeAll();
    }

    function clearFilters() {
        setSearch("");
        setAssessorFilter("All");
        setStatusFilter("All");
    }

    function bulkDelete(rows, clear) {
        const ids = new Set(rows.map((r) => r.id));
        setInternships((current) =>
            current.filter((internship) => !ids.has(internship.id)),
        );
        clear();
    }

    function bulkMarkApproved(rows, clear) {
        const ids = new Set(rows.map((r) => r.id));
        setInternships((current) =>
            current.map((internship) =>
                ids.has(internship.id)
                    ? { ...internship, assessmentStatus: "Approved" }
                    : internship,
            ),
        );
        clear();
    }

    const isFiltered =
        search !== "" || assessorFilter !== "All" || statusFilter !== "All";

    const columns = [
        {
            key: "id",
            header: "Internship ID",
            cellClassName: "font-semibold tabular-nums",
        },
        {
            key: "student",
            header: "Student",
            accessor: (row) => row.student?.name || "",
            cell: (row) => (
                <div>
                    <p className="font-semibold text-[#0a0b0d]">
                        {row.student?.name || "Unknown Student"}
                    </p>
                    <p className="mt-1 text-[13px] text-[#5b616e]">
                        {row.studentId}
                    </p>
                </div>
            ),
        },
        {
            key: "companyName",
            header: "Company",
            cell: (row) => (
                <div>
                    <p className="font-semibold text-[#0a0b0d]">
                        {row.companyName}
                    </p>
                    <p className="mt-1 text-[13px] text-[#5b616e]">
                        {row.position}
                    </p>
                </div>
            ),
        },
        {
            key: "assessor",
            header: "Assessor",
            accessor: (row) => row.assessor?.name || "",
            cell: (row) => (
                <span className="text-[#5b616e]">
                    {row.assessor?.name || "Unassigned"}
                </span>
            ),
        },
        {
            key: "startDate",
            header: "Start Date",
            cell: (row) => (
                <span className="tabular-nums">
                    {formatDate(row.startDate)}
                </span>
            ),
        },
        {
            key: "endDate",
            header: "End Date",
            cell: (row) => (
                <span className="tabular-nums">
                    {formatDate(row.endDate)}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            cell: (row) => <InternshipStatusBadge status={row.status} />,
        },
    ];

    return (
        <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-white">
            <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                            Placement Management
                        </p>
                        <h1 className="mt-3 text-[56px] font-medium leading-[1] tracking-[-0.03em] text-[#0a0b0d] md:text-[72px]">
                            Internships
                        </h1>
                    </div>
                    <Button variant="primary" onClick={openAssign}>
                        <Plus size={18} weight="bold" className="mr-2" />
                        Assign Internship
                    </Button>
                </div>

                <section className="mt-12">
                    <div className="grid grid-cols-1 overflow-hidden rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-white md:grid-cols-4">
                        <StatChip
                            label="Total Internships"
                            value={stats.total}
                            icon={Briefcase}
                        />
                        <StatChip
                            label="Ongoing"
                            value={stats.ongoing}
                            icon={CalendarDots}
                        />
                        <StatChip
                            label="Pending Assessment"
                            value={stats.pending}
                            icon={ClipboardText}
                        />
                        <StatChip
                            label="Completed"
                            value={stats.completed}
                            icon={CheckCircle}
                            isLast
                        />
                    </div>
                </section>

                <section className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_240px_240px]">
                    <div className="relative">
                        <MagnifyingGlass
                            size={18}
                            weight="bold"
                            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#5b616e]"
                        />
                        <Input
                            placeholder="Search by student or company"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12"
                        />
                    </div>

                    <Dropdown
                        value={assessorFilter}
                        onChange={setAssessorFilter}
                        options={[
                            { value: "All", label: "All Assessors" },
                            ...ASSESSORS.map((assessor) => ({
                                value: assessor.id,
                                label: assessor.name,
                            })),
                        ]}
                    />

                    <Dropdown
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={STATUS_OPTIONS.map((status) => ({
                            value: status,
                            label:
                                status === "All"
                                    ? "All Statuses"
                                    : status,
                        }))}
                    />
                </section>

                <section className="mt-6">
                    <DataTable
                        columns={columns}
                        rows={filtered}
                        rowKey={(r) => r.id}
                        emptyMessage={
                            isFiltered
                                ? "No internships match your filters."
                                : "No internships assigned yet."
                        }
                        filteredAway={isFiltered}
                        onClearFilters={clearFilters}
                        onRowActivate={setViewTarget}
                        onEdit={openEdit}
                        onDelete={setDeleteTarget}
                        selectable
                        bulkActions={[
                            {
                                label: "Mark Approved",
                                onClick: bulkMarkApproved,
                            },
                            {
                                label: "Delete",
                                variant: "danger",
                                onClick: bulkDelete,
                            },
                        ]}
                        totalLabel={(shown) =>
                            `Showing ${shown} of ${internships.length}`
                        }
                    />
                </section>
            </div>

            <Modal open={assignOpen} size="lg">
                <ModalHeader>
                    <ModalTitle>Assign Internship</ModalTitle>
                    <ModalDescription>
                        Link a student to a company placement and assign the supervising assessor.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <InternshipForm
                        form={form}
                        setForm={setForm}
                        errors={errors}
                        internships={internships}
                    />
                </ModalContent>
                <ModalFooter>
                    <Button variant="secondary" onClick={closeAll}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={submitAssign}>
                        Save Assignment
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal open={!!editTarget} size="lg">
                <ModalHeader>
                    <ModalTitle>Edit Internship</ModalTitle>
                    <ModalDescription>
                        Update placement details for <span className="font-semibold text-[#0a0b0d]">{editTarget?.id}</span>.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <InternshipForm
                        form={form}
                        setForm={setForm}
                        errors={errors}
                        internships={internships}
                        editingId={editTarget?.id}
                    />
                </ModalContent>
                <ModalFooter>
                    <Button variant="secondary" onClick={closeAll}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={submitEdit}>
                        Save Changes
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal open={!!viewTarget}>
                <ModalHeader>
                    <ModalTitle>Internship Details</ModalTitle>
                    <ModalDescription>
                        Read-only summary for <span className="font-semibold text-[#0a0b0d]">{viewTarget?.id}</span> including current assessment progress.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    {viewTarget ? (
                        <div className="overflow-hidden rounded-[20px] border border-[rgba(91,97,110,0.2)] bg-white px-5">
                            <SummaryRow
                                label="Student"
                                value={
                                    <div>
                                        <p className="font-semibold">
                                            {getStudent(viewTarget.studentId)?.name}
                                        </p>
                                        <p className="mt-1 text-[14px] text-[#5b616e]">
                                            {viewTarget.studentId}
                                        </p>
                                    </div>
                                }
                            />
                            <SummaryRow
                                label="Company"
                                value={
                                    <div>
                                        <p className="font-semibold">
                                            {viewTarget.companyName}
                                        </p>
                                        <p className="mt-1 text-[14px] text-[#5b616e]">
                                            {viewTarget.companyAddress}
                                        </p>
                                    </div>
                                }
                            />
                            <SummaryRow
                                label="Position / Role"
                                value={viewTarget.position}
                            />
                            <SummaryRow
                                label="Industry Supervisor"
                                value={viewTarget.industrySupervisorName}
                            />
                            <SummaryRow
                                label="Assessor"
                                value={
                                    <div>
                                        <p className="font-semibold">
                                            {getAssessor(viewTarget.assessorId)?.name}
                                        </p>
                                        <p className="mt-1 text-[14px] text-[#5b616e]">
                                            {getAssessor(viewTarget.assessorId)?.department}
                                        </p>
                                    </div>
                                }
                            />
                            <SummaryRow
                                label="Schedule"
                                value={`${formatDate(viewTarget.startDate)} → ${formatDate(viewTarget.endDate)}`}
                            />
                            <SummaryRow
                                label="Status"
                                value={
                                    <div className="flex flex-wrap items-center gap-2">
                                        <InternshipStatusBadge
                                            status={getInternshipStatus(viewTarget)}
                                        />
                                        <AssessmentBadge
                                            status={viewTarget.assessmentStatus}
                                        />
                                    </div>
                                }
                            />
                            <SummaryRow
                                label="Assessment Note"
                                muted
                                value={
                                    viewTarget.assessmentStatus === "Approved"
                                        ? "Assessment has been reviewed and marked complete."
                                        : viewTarget.assessmentStatus === "Submitted"
                                          ? "Assessment has been submitted and is awaiting assessor review."
                                          : "No assessment has been submitted yet."
                                }
                            />
                        </div>
                    ) : null}
                </ModalContent>
                <ModalFooter>
                    <Button variant="secondary" onClick={closeAll}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal open={!!deleteTarget}>
                <ModalHeader>
                    <ModalTitle>Delete / Unassign internship?</ModalTitle>
                    <ModalDescription>
                        This will remove the placement link for <span className="font-semibold text-[#0a0b0d]">{deleteTarget ? getStudent(deleteTarget.studentId)?.name : ""}</span> at <span className="font-semibold text-[#0a0b0d]">{deleteTarget?.companyName}</span>. Use this if the placement was assigned in error.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <div className="rounded-[20px] border border-[rgba(91,97,110,0.2)] bg-[#f8f9fb] p-5">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0a0b0d]">
                                <WarningCircle size={18} weight="fill" />
                            </div>
                            <div>
                                <p className="text-[15px] font-semibold text-[#0a0b0d]">
                                    The internship record will be deleted from the assignment table.
                                </p>
                                <p className="mt-2 text-[14px] leading-[1.5] text-[#5b616e]">
                                    If this internship is still active, unassigning it will allow the student to be matched to a different company immediately.
                                </p>
                            </div>
                        </div>
                    </div>
                </ModalContent>
                <ModalFooter>
                    <Button variant="secondary" onClick={closeAll}>
                        Cancel
                    </Button>
                    <Button variant="dark" onClick={confirmDelete}>
                        Delete Assignment
                    </Button>
                </ModalFooter>
            </Modal>
        </main>
    );
}
