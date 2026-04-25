"use client";

import { useMemo, useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/icons/Plus";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/icons/MagnifyingGlass";
import { GraduationCap } from "@phosphor-icons/react/dist/icons/GraduationCap";
import { Users } from "@phosphor-icons/react/dist/icons/Users";

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
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/use-api";

const PROGRAMMES = [
    "Computer Science",
    "Software Engineering",
    "Information Technology",
    "Data Science",
    "Cybersecurity",
];

const STUDENT_ID_PATTERN = /^20\d{6}$/;
const EMPTY_FORM = { student_id: "", student_name: "", programme: PROGRAMMES[0] };

function validate(form, students, editingId) {
    const errors = {};
    const id = form.student_id.trim();

    if (!id) errors.student_id = "Required";
    else if (!STUDENT_ID_PATTERN.test(id)) errors.student_id = "Must match 20XXXXXX";
    else if (students.some((s) => s.student_id === id && s.student_id !== editingId)) {
        errors.student_id = "ID already exists";
    }

    if (!form.student_name.trim()) errors.student_name = "Required";
    if (!form.programme) errors.programme = "Required";

    return errors;
}

function StatChip({ label, value, icon: Icon }) {
    return (
        <div className="flex items-center gap-4 rounded-[20px] bg-[#eef0f3] px-6 py-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white text-[#0a0b0d]">
                <Icon size={18} weight="bold" />
            </div>
            <div className="min-w-0">
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

function FormField({ label, error, children }) {
    return (
        <div>
            <Label className="mb-2">{label}</Label>
            {children}
            {error && (
                <p className="mt-1.5 text-[13px] font-semibold text-[#c9182e]">
                    {error}
                </p>
            )}
        </div>
    );
}

function StudentForm({ form, setForm, errors, idDisabled }) {
    const update = (key) => (event) =>
        setForm((current) => ({ ...current, [key]: event.target.value }));

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Student ID" error={errors.student_id}>
                <Input
                    placeholder="20210456"
                    value={form.student_id}
                    onChange={update("student_id")}
                    maxLength={8}
                    disabled={idDisabled}
                />
            </FormField>
            <FormField label="Student Name" error={errors.student_name}>
                <Input
                    placeholder="Jane Doe"
                    value={form.student_name}
                    onChange={update("student_name")}
                />
            </FormField>
            <div className="sm:col-span-2">
                <FormField label="Programme" error={errors.programme}>
                    <Dropdown
                        value={form.programme}
                        onChange={(programme) =>
                            setForm((current) => ({ ...current, programme }))
                        }
                        options={PROGRAMMES}
                    />
                </FormField>
            </div>
        </div>
    );
}

export default function StudentsPage() {
    const { data, loading, error, refetch } = useApi("/students.php");
    const students = data?.students ?? [];

    const [search, setSearch] = useState("");
    const [programmeFilter, setProgrammeFilter] = useState("All");
    const [addOpen, setAddOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        return students.filter((s) => {
            if (programmeFilter !== "All" && s.programme !== programmeFilter) return false;
            if (
                query &&
                !s.student_name.toLowerCase().includes(query) &&
                !s.student_id.toLowerCase().includes(query)
            ) {
                return false;
            }
            return true;
        });
    }, [students, search, programmeFilter]);

    const stats = useMemo(() => {
        const programmes = new Set(students.map((s) => s.programme));
        const topProgramme = [...programmes]
            .map((programme) => ({
                programme,
                count: students.filter((s) => s.programme === programme).length,
            }))
            .sort((a, b) => b.count - a.count)[0];

        return {
            total: students.length,
            programmes: programmes.size,
            topProgramme: topProgramme
                ? `${topProgramme.programme.split(" ")[0]} (${topProgramme.count})`
                : "-",
        };
    }, [students]);

    function openAdd() {
        setForm(EMPTY_FORM);
        setErrors({});
        setSubmitError(null);
        setAddOpen(true);
    }

    function openEdit(student) {
        setForm({ ...student });
        setErrors({});
        setSubmitError(null);
        setEditTarget(student);
    }

    function closeAll() {
        setAddOpen(false);
        setEditTarget(null);
        setDeleteTarget(null);
        setErrors({});
        setSubmitError(null);
    }

    async function submitAdd() {
        const nextErrors = validate(form, students, null);
        if (Object.keys(nextErrors).length) return setErrors(nextErrors);
        setSubmitting(true);
        setSubmitError(null);
        try {
            await apiFetch("/students.php", {
                method: "POST",
                body: JSON.stringify({
                    student_id: form.student_id.trim(),
                    student_name: form.student_name.trim(),
                    programme: form.programme,
                }),
            });
            await refetch();
            closeAll();
        } catch (err) {
            if (err.fields) setErrors(err.fields);
            setSubmitError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function submitEdit() {
        const nextErrors = validate(form, students, editTarget.student_id);
        if (Object.keys(nextErrors).length) return setErrors(nextErrors);
        setSubmitting(true);
        setSubmitError(null);
        try {
            await apiFetch("/students.php", {
                method: "PUT",
                body: JSON.stringify({
                    student_id: editTarget.student_id,
                    student_name: form.student_name.trim(),
                    programme: form.programme,
                }),
            });
            await refetch();
            closeAll();
        } catch (err) {
            if (err.fields) setErrors(err.fields);
            setSubmitError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function confirmDelete() {
        setSubmitting(true);
        setSubmitError(null);
        try {
            await apiFetch("/students.php", {
                method: "DELETE",
                body: JSON.stringify({ student_id: deleteTarget.student_id }),
            });
            await refetch();
            closeAll();
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    function clearFilters() {
        setSearch("");
        setProgrammeFilter("All");
    }

    const columns = [
        { key: "student_id", header: "Student ID", cellClassName: "font-semibold tabular-nums" },
        { key: "student_name", header: "Student Name", cellClassName: "font-semibold" },
        { key: "programme", header: "Programme", cellClassName: "text-[#5b616e]" },
    ];

    const isFiltered = search !== "" || programmeFilter !== "All";

    return (
        <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-white">
            <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                            Student Profiles
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

                <section className="mt-12">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <StatChip label="Total Students" value={stats.total} icon={Users} />
                        <StatChip label="Programmes" value={stats.programmes} icon={GraduationCap} />
                        <StatChip label="Top Programme" value={stats.topProgramme} icon={GraduationCap} />
                    </div>
                </section>

                <section className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_240px]">
                    <div className="relative">
                        <MagnifyingGlass
                            size={18}
                            weight="bold"
                            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#5b616e]"
                        />
                        <Input
                            placeholder="Search by ID or name"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="pl-12"
                        />
                    </div>
                    <Dropdown
                        value={programmeFilter}
                        onChange={setProgrammeFilter}
                        options={["All", ...PROGRAMMES].map((programme) => ({
                            value: programme,
                            label: programme === "All" ? "All Programmes" : programme,
                        }))}
                    />
                </section>

                {error && (
                    <p className="mt-6 text-[14px] font-semibold text-[#c9182e]">
                        Failed to load students: {error.message}
                    </p>
                )}

                <section className="mt-6">
                    <DataTable
                        columns={columns}
                        rows={filtered}
                        rowKey={(s) => s.student_id}
                        emptyMessage={
                            loading
                                ? "Loading students..."
                                : isFiltered
                                  ? "No students match your filters."
                                  : "No students yet."
                        }
                        filteredAway={isFiltered}
                        onClearFilters={clearFilters}
                        onRowActivate={openEdit}
                        onEdit={openEdit}
                        onDelete={setDeleteTarget}
                        totalLabel={(shown) => `Showing ${shown} of ${students.length}`}
                    />
                </section>
            </div>

            <Modal open={addOpen}>
                <ModalHeader>
                    <ModalTitle>Add Student</ModalTitle>
                    <ModalDescription>
                        Store the student ID, student name, and programme.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <StudentForm form={form} setForm={setForm} errors={errors} />
                    {submitError && (
                        <p className="mt-3 text-[13px] font-semibold text-[#c9182e]">{submitError}</p>
                    )}
                </ModalContent>
                <ModalFooter>
                    <Button variant="secondary" onClick={closeAll} disabled={submitting}>Cancel</Button>
                    <Button variant="primary" onClick={submitAdd} disabled={submitting}>
                        {submitting ? "Saving..." : "Save Student"}
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal open={!!editTarget}>
                <ModalHeader>
                    <ModalTitle>Edit Student</ModalTitle>
                    <ModalDescription>
                        Update the profile fields stored in the Students table.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <StudentForm form={form} setForm={setForm} errors={errors} idDisabled />
                    {submitError && (
                        <p className="mt-3 text-[13px] font-semibold text-[#c9182e]">{submitError}</p>
                    )}
                </ModalContent>
                <ModalFooter>
                    <Button variant="secondary" onClick={closeAll} disabled={submitting}>Cancel</Button>
                    <Button variant="primary" onClick={submitEdit} disabled={submitting}>
                        {submitting ? "Saving..." : "Save Changes"}
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal open={!!deleteTarget}>
                <ModalHeader>
                    <ModalTitle>Delete student?</ModalTitle>
                    <ModalDescription>
                        This removes {deleteTarget?.student_name} from the student profile table.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    {submitError && (
                        <p className="text-[13px] font-semibold text-[#c9182e]">{submitError}</p>
                    )}
                </ModalContent>
                <ModalFooter>
                    <Button variant="secondary" onClick={closeAll} disabled={submitting}>Cancel</Button>
                    <Button variant="dark" onClick={confirmDelete} disabled={submitting}>
                        {submitting ? "Deleting..." : "Delete"}
                    </Button>
                </ModalFooter>
            </Modal>
        </main>
    );
}
