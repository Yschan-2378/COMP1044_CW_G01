"use client";

import { useMemo, useState } from "react";
import {
    Plus,
    MagnifyingGlass,
    PencilSimple,
    Trash,
    GraduationCap,
    Briefcase,
    Users,
} from "@phosphor-icons/react/dist/ssr";

import Button from "@/components/button";
import Input from "@/components/input";
import Label from "@/components/label";
import Dropdown from "@/components/dropdown";
import {
    Table,
    TableBody,
    TableCell,
    TableEmpty,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/table";
import {
    Modal,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from "@/components/modal";

const PROGRAMMES = [
    "Computer Science",
    "Software Engineering",
    "Information Technology",
    "Data Science",
    "Cybersecurity",
];

const STATUSES = ["Active", "Pending", "None"];

const INITIAL_STUDENTS = [
    {
        id: "20210456",
        name: "Aisha Rahman",
        programme: "Computer Science",
        year: 3,
        email: "aisha.rahman@uni.edu",
        phone: "+44 7700 900123",
        status: "Active",
    },
    {
        id: "20221287",
        name: "Marcus Johnson",
        programme: "Software Engineering",
        year: 2,
        email: "marcus.j@uni.edu",
        phone: "+44 7700 900441",
        status: "Pending",
    },
    {
        id: "20203098",
        name: "Priya Nair",
        programme: "Data Science",
        year: 4,
        email: "priya.nair@uni.edu",
        phone: "+44 7700 900812",
        status: "Active",
    },
    {
        id: "20224410",
        name: "Tomáš Horák",
        programme: "Information Technology",
        year: 1,
        email: "tomas.horak@uni.edu",
        phone: "+44 7700 900334",
        status: "None",
    },
    {
        id: "20212201",
        name: "Lina Osei",
        programme: "Cybersecurity",
        year: 3,
        email: "lina.osei@uni.edu",
        phone: "+44 7700 900117",
        status: "Active",
    },
    {
        id: "20231005",
        name: "Chen Wei",
        programme: "Computer Science",
        year: 1,
        email: "chen.wei@uni.edu",
        phone: "+44 7700 900559",
        status: "Pending",
    },
    {
        id: "20208842",
        name: "Sofia Martinez",
        programme: "Software Engineering",
        year: 4,
        email: "sofia.m@uni.edu",
        phone: "+44 7700 900208",
        status: "Active",
    },
];

const STUDENT_ID_PATTERN = /^20\d{6}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM = {
    id: "",
    name: "",
    programme: PROGRAMMES[0],
    year: 1,
    email: "",
    phone: "",
    status: "None",
};

function validate(form, students, editingId) {
    const errors = {};
    if (!form.id.trim()) errors.id = "Required";
    else if (!STUDENT_ID_PATTERN.test(form.id.trim()))
        errors.id = "Must match 20XXXXXX (8 digits)";
    else if (
        students.some((s) => s.id === form.id.trim() && s.id !== editingId)
    )
        errors.id = "ID already exists";

    if (!form.name.trim()) errors.name = "Required";
    if (!form.programme) errors.programme = "Required";
    if (!form.year || form.year < 1 || form.year > 5)
        errors.year = "Year must be 1–5";

    if (!form.email.trim()) errors.email = "Required";
    else if (!EMAIL_PATTERN.test(form.email.trim()))
        errors.email = "Invalid email";

    return errors;
}

function InternshipBadge({ status }) {
    const base =
        "inline-flex items-center rounded-full px-3 py-1 text-[13px] font-bold leading-[1.23] tracking-[0.01em]";
    const map = {
        Active: "bg-[#0a0b0d] text-white",
        Pending: "bg-white text-[#0a0b0d] border border-[#0a0b0d]",
        None: "bg-[#eef0f3] text-[#5b616e]",
    };
    return (
        <span className={`${base} ${map[status] || map.None}`}>{status}</span>
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

function FormField({ label, error, children }) {
    return (
        <div>
            <Label className="mb-2">{label}</Label>
            {children}
            {error && (
                <p className="mt-1.5 text-[13px] font-semibold text-[#0052ff]">
                    {error}
                </p>
            )}
        </div>
    );
}

function StudentForm({ form, setForm, errors }) {
    const update = (key) => (e) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Student ID" error={errors.id}>
                <Input
                    placeholder="20210456"
                    value={form.id}
                    onChange={update("id")}
                    maxLength={8}
                />
            </FormField>
            <FormField label="Full Name" error={errors.name}>
                <Input
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={update("name")}
                />
            </FormField>
            <FormField label="Programme" error={errors.programme}>
                <Dropdown
                    value={form.programme}
                    onChange={(v) =>
                        setForm((f) => ({ ...f, programme: v }))
                    }
                    options={PROGRAMMES}
                />
            </FormField>
            <FormField label="Year of Study" error={errors.year}>
                <Dropdown
                    value={form.year}
                    onChange={(v) => setForm((f) => ({ ...f, year: v }))}
                    options={[1, 2, 3, 4, 5].map((y) => ({
                        value: y,
                        label: `Year ${y}`,
                    }))}
                />
            </FormField>
            <FormField label="Email" error={errors.email}>
                <Input
                    type="email"
                    placeholder="jane.doe@uni.edu"
                    value={form.email}
                    onChange={update("email")}
                />
            </FormField>
            <FormField label="Phone" error={errors.phone}>
                <Input
                    placeholder="+44 7700 900000"
                    value={form.phone}
                    onChange={update("phone")}
                />
            </FormField>
            <div className="sm:col-span-2">
                <FormField label="Internship Status">
                    <Dropdown
                        value={form.status}
                        onChange={(v) =>
                            setForm((f) => ({ ...f, status: v }))
                        }
                        options={STATUSES}
                    />
                </FormField>
            </div>
        </div>
    );
}

export default function StudentsPage() {
    const [students, setStudents] = useState(INITIAL_STUDENTS);
    const [search, setSearch] = useState("");
    const [programmeFilter, setProgrammeFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const [addOpen, setAddOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return students.filter((s) => {
            if (programmeFilter !== "All" && s.programme !== programmeFilter)
                return false;
            if (statusFilter !== "All" && s.status !== statusFilter)
                return false;
            if (
                q &&
                !s.name.toLowerCase().includes(q) &&
                !s.id.toLowerCase().includes(q)
            )
                return false;
            return true;
        });
    }, [students, search, programmeFilter, statusFilter]);

    const stats = useMemo(() => {
        const byProg = {};
        let activeCount = 0;
        for (const s of students) {
            byProg[s.programme] = (byProg[s.programme] || 0) + 1;
            if (s.status === "Active") activeCount += 1;
        }
        const topProg = Object.entries(byProg).sort((a, b) => b[1] - a[1])[0];
        return {
            total: students.length,
            topProgramme: topProg
                ? `${topProg[0].split(" ")[0]} (${topProg[1]})`
                : "—",
            activeInternship: activeCount,
        };
    }, [students]);

    function openAdd() {
        setForm(EMPTY_FORM);
        setErrors({});
        setAddOpen(true);
    }

    function openEdit(student) {
        setForm({ ...student });
        setErrors({});
        setEditTarget(student);
    }

    function closeAll() {
        setAddOpen(false);
        setEditTarget(null);
        setDeleteTarget(null);
        setErrors({});
    }

    function submitAdd() {
        const errs = validate(form, students, null);
        if (Object.keys(errs).length) return setErrors(errs);
        setStudents((prev) => [
            ...prev,
            { ...form, id: form.id.trim(), name: form.name.trim() },
        ]);
        closeAll();
    }

    function submitEdit() {
        const errs = validate(form, students, editTarget.id);
        if (Object.keys(errs).length) return setErrors(errs);
        setStudents((prev) =>
            prev.map((s) =>
                s.id === editTarget.id
                    ? { ...form, id: form.id.trim(), name: form.name.trim() }
                    : s,
            ),
        );
        closeAll();
    }

    function confirmDelete() {
        setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        closeAll();
    }

    return (
        <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-white">
            <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16">
                {/* Header */}
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                            Directory
                        </p>
                        <h1 className="mt-3 text-[56px] font-medium leading-[1] tracking-[-0.03em] text-[#0a0b0d] md:text-[72px]">
                            Students
                        </h1>
                    </div>
                    <Button variant="primary" onClick={openAdd}>
                        <Plus size={18} weight="bold" className="mr-2" />
                        Add Student
                    </Button>
                </div>

                {/* Stats */}
                <section className="mt-12">
                    <div className="grid grid-cols-1 overflow-hidden rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-white md:grid-cols-3">
                        <StatChip
                            label="Total Students"
                            value={stats.total}
                            icon={Users}
                        />
                        <StatChip
                            label="Top Programme"
                            value={stats.topProgramme}
                            icon={GraduationCap}
                        />
                        <StatChip
                            label="Active Internships"
                            value={stats.activeInternship}
                            icon={Briefcase}
                            isLast
                        />
                    </div>
                </section>

                {/* Filter bar */}
                <section className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px_180px]">
                    <div className="relative">
                        <MagnifyingGlass
                            size={18}
                            weight="bold"
                            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#5b616e]"
                        />
                        <Input
                            placeholder="Search by ID or name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12"
                        />
                    </div>
                    <Dropdown
                        value={programmeFilter}
                        onChange={setProgrammeFilter}
                        options={["All", ...PROGRAMMES].map((p) => ({
                            value: p,
                            label: p === "All" ? "All Programmes" : p,
                        }))}
                    />
                    <Dropdown
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={["All", ...STATUSES].map((s) => ({
                            value: s,
                            label: s === "All" ? "All Statuses" : s,
                        }))}
                    />
                </section>

                {/* Table */}
                <section className="mt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Programme</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableEmpty colSpan={7}>
                                    No students match your filters.
                                </TableEmpty>
                            ) : (
                                filtered.map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell className="font-semibold tabular-nums">
                                            {s.id}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {s.name}
                                        </TableCell>
                                        <TableCell className="text-[#5b616e]">
                                            {s.programme}
                                        </TableCell>
                                        <TableCell className="tabular-nums">
                                            {s.year}
                                        </TableCell>
                                        <TableCell className="text-[#5b616e]">
                                            {s.email}
                                        </TableCell>
                                        <TableCell>
                                            <InternshipBadge
                                                status={s.status}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => openEdit(s)}
                                                    aria-label={`Edit ${s.name}`}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#5b616e] transition-colors hover:bg-[#eef0f3] hover:text-[#0052ff]"
                                                >
                                                    <PencilSimple
                                                        size={16}
                                                        weight="bold"
                                                    />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setDeleteTarget(s)
                                                    }
                                                    aria-label={`Delete ${s.name}`}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#5b616e] transition-colors hover:bg-[#0a0b0d] hover:text-white"
                                                >
                                                    <Trash
                                                        size={16}
                                                        weight="bold"
                                                    />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                        Showing {filtered.length} of {students.length}
                    </p>
                </section>
            </div>

            {/* Add Modal */}
            <Modal open={addOpen}>
                <ModalHeader>
                    <ModalTitle>Add Student</ModalTitle>
                    <ModalDescription>
                        Create a new student profile. All fields except phone
                        are required.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <StudentForm
                        form={form}
                        setForm={setForm}
                        errors={errors}
                    />
                </ModalContent>
                <ModalFooter>
                    <Button variant="secondary" onClick={closeAll}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={submitAdd}>
                        Save Student
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Edit Modal */}
            <Modal open={!!editTarget}>
                <ModalHeader>
                    <ModalTitle>Edit Student</ModalTitle>
                    <ModalDescription>
                        Update profile details for{" "}
                        <span className="font-semibold text-[#0a0b0d]">
                            {editTarget?.name}
                        </span>
                        .
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <StudentForm
                        form={form}
                        setForm={setForm}
                        errors={errors}
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

            {/* Delete Modal */}
            <Modal open={!!deleteTarget}>
                <ModalHeader>
                    <ModalTitle>Delete student?</ModalTitle>
                    <ModalDescription>
                        This will permanently remove{" "}
                        <span className="font-semibold text-[#0a0b0d]">
                            {deleteTarget?.name}
                        </span>{" "}
                        ({deleteTarget?.id}) from the directory. This action
                        cannot be undone.
                    </ModalDescription>
                </ModalHeader>
                <ModalFooter>
                    <Button variant="secondary" onClick={closeAll}>
                        Cancel
                    </Button>
                    <Button variant="dark" onClick={confirmDelete}>
                        Delete
                    </Button>
                </ModalFooter>
            </Modal>
        </main>
    );
}
