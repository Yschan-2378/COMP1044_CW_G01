"use client";

import { useMemo, useState } from "react";
import { Briefcase } from "@phosphor-icons/react/dist/icons/Briefcase";
import { ClipboardText } from "@phosphor-icons/react/dist/icons/ClipboardText";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/icons/MagnifyingGlass";
import { Plus } from "@phosphor-icons/react/dist/icons/Plus";
import { Users } from "@phosphor-icons/react/dist/icons/Users";

import Button from "@/components/button";
import Badge from "@/components/badge";
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

const EMPTY_FORM = { student_id: "", assessor_id: "", company_name: "" };

function validate(form, internships, editingId) {
    const errors = {};

    if (!form.student_id) errors.student_id = "Select a student";
    if (!form.assessor_id) errors.assessor_id = "Select an assessor";
    if (!form.company_name.trim()) errors.company_name = "Required";

    const duplicateStudent = internships.some(
        (internship) =>
            internship.internship_id !== editingId &&
            internship.student_id === form.student_id,
    );
    if (form.student_id && duplicateStudent) {
        errors.student_id = "Student already has an internship";
    }

    return errors;
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

function InternshipForm({ form, setForm, errors, students, assessors }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Student" error={errors.student_id}>
                <Dropdown
                    value={form.student_id}
                    onChange={(student_id) =>
                        setForm((current) => ({ ...current, student_id }))
                    }
                    options={students.map((student) => ({
                        value: student.student_id,
                        label: `${student.student_id} - ${student.student_name}`,
                    }))}
                    placeholder="Select student"
                />
            </FormField>
            <FormField label="Assessor" error={errors.assessor_id}>
                <Dropdown
                    value={form.assessor_id}
                    onChange={(assessor_id) =>
                        setForm((current) => ({ ...current, assessor_id }))
                    }
                    options={assessors.map((assessor) => ({
                        value: assessor.user_id,
                        label: assessor.username,
                    }))}
                    placeholder="Select assessor"
                />
            </FormField>
            <div className="sm:col-span-2">
                <FormField label="Company Name" error={errors.company_name}>
                    <Input
                        placeholder="Northstar Systems"
                        value={form.company_name}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                company_name: event.target.value,
                            }))
                        }
                    />
                </FormField>
            </div>
        </div>
    );
}

export default function InternshipsPage() {
    const internshipsApi = useApi("/internships.php");
    const studentsApi = useApi("/students.php");
    const assessorsApi = useApi("/assessors.php");

    const internships = internshipsApi.data?.internships ?? [];
    const students = studentsApi.data?.students ?? [];
    const assessors = assessorsApi.data?.assessors ?? [];

    const loading = internshipsApi.loading;
    const error = internshipsApi.error || studentsApi.error || assessorsApi.error;

    const [search, setSearch] = useState("");
    const [assessorFilter, setAssessorFilter] = useState("All");
    const [assignOpen, setAssignOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        return internships.filter((row) => {
            if (assessorFilter !== "All" && row.assessor_id !== Number(assessorFilter)) {
                return false;
            }
            if (
                query &&
                !row.company_name.toLowerCase().includes(query) &&
                !(row.student_name || "").toLowerCase().includes(query) &&
                !row.student_id.toLowerCase().includes(query)
            ) {
                return false;
            }
            return true;
        });
    }, [internships, search, assessorFilter]);

    function openAssign() {
        setForm(EMPTY_FORM);
        setErrors({});
        setSubmitError(null);
        setAssignOpen(true);
    }

    function openEdit(internship) {
        setForm({
            student_id: internship.student_id,
            assessor_id: internship.assessor_id,
            company_name: internship.company_name,
        });
        setErrors({});
        setSubmitError(null);
        setEditTarget(internship);
    }

    function closeAll() {
        setAssignOpen(false);
        setEditTarget(null);
        setDeleteTarget(null);
        setErrors({});
        setSubmitError(null);
    }

    async function submitAssign() {
        const nextErrors = validate(form, internships, null);
        if (Object.keys(nextErrors).length) return setErrors(nextErrors);
        setSubmitting(true);
        setSubmitError(null);
        try {
            await apiFetch("/internships.php", {
                method: "POST",
                body: JSON.stringify({
                    student_id: form.student_id,
                    assessor_id: Number(form.assessor_id),
                    company_name: form.company_name.trim(),
                }),
            });
            await internshipsApi.refetch();
            closeAll();
        } catch (err) {
            if (err.fields) setErrors(err.fields);
            setSubmitError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function submitEdit() {
        const nextErrors = validate(form, internships, editTarget.internship_id);
        if (Object.keys(nextErrors).length) return setErrors(nextErrors);
        setSubmitting(true);
        setSubmitError(null);
        try {
            await apiFetch("/internships.php", {
                method: "PUT",
                body: JSON.stringify({
                    internship_id: editTarget.internship_id,
                    student_id: form.student_id,
                    assessor_id: Number(form.assessor_id),
                    company_name: form.company_name.trim(),
                }),
            });
            await internshipsApi.refetch();
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
            await apiFetch("/internships.php", {
                method: "DELETE",
                body: JSON.stringify({ internship_id: deleteTarget.internship_id }),
            });
            await internshipsApi.refetch();
            closeAll();
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    function clearFilters() {
        setSearch("");
        setAssessorFilter("All");
    }

    const columns = [
        {
            key: "internship_id",
            header: "Internship ID",
            cellClassName: "font-semibold tabular-nums",
        },
        {
            key: "student",
            header: "Student",
            accessor: (row) => row.student_name || "",
            cell: (row) => (
                <div>
                    <p className="font-semibold text-[#0a0b0d]">
                        {row.student_name || "Unknown Student"}
                    </p>
                    <p className="mt-1 text-[13px] text-[#5b616e]">{row.student_id}</p>
                </div>
            ),
        },
        { key: "company_name", header: "Company Name", cellClassName: "font-semibold" },
        {
            key: "assessor_username",
            header: "Assessor",
            cellClassName: "text-[#5b616e]",
        },
        {
            key: "status",
            header: "Status",
            cell: (row) => <Badge status={row.assessment_id ? "Graded" : "Pending"} />,
        },
    ];

    const isFiltered = search !== "" || assessorFilter !== "All";

    return (
        <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-white">
            <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                            Internship Management
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
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <StatChip label="Internships" value={internships.length} icon={Briefcase} />
                        <StatChip label="Assigned Students" value={internships.length} icon={Users} />
                        <StatChip
                            label="Assessors Used"
                            value={new Set(internships.map((i) => i.assessor_id)).size}
                            icon={ClipboardText}
                        />
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
                            placeholder="Search by student or company"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="pl-12"
                        />
                    </div>
                    <Dropdown
                        value={assessorFilter}
                        onChange={setAssessorFilter}
                        options={[
                            { value: "All", label: "All Assessors" },
                            ...assessors.map((assessor) => ({
                                value: assessor.user_id,
                                label: assessor.username,
                            })),
                        ]}
                    />
                </section>

                {error && (
                    <p className="mt-6 text-[14px] font-semibold text-[#c9182e]">
                        Failed to load internships: {error.message}
                    </p>
                )}

                <section className="mt-6">
                    <DataTable
                        columns={columns}
                        rows={filtered}
                        rowKey={(row) => row.internship_id}
                        emptyMessage={
                            loading
                                ? "Loading internships..."
                                : isFiltered
                                  ? "No internships match your filters."
                                  : "No internships assigned yet."
                        }
                        filteredAway={isFiltered}
                        onClearFilters={clearFilters}
                        onRowActivate={openEdit}
                        onEdit={openEdit}
                        onDelete={setDeleteTarget}
                        totalLabel={(shown) => `Showing ${shown} of ${internships.length}`}
                    />
                </section>
            </div>

            <Modal open={assignOpen}>
                <ModalHeader>
                    <ModalTitle>Assign Internship</ModalTitle>
                    <ModalDescription>
                        Link one student to one assessor and record the company name.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <InternshipForm
                        form={form}
                        setForm={setForm}
                        errors={errors}
                        students={students}
                        assessors={assessors}
                    />
                    {submitError && (
                        <p className="mt-3 text-[13px] font-semibold text-[#c9182e]">{submitError}</p>
                    )}
                </ModalContent>
                <ModalFooter>
                    <Button variant="secondary" onClick={closeAll} disabled={submitting}>Cancel</Button>
                    <Button variant="primary" onClick={submitAssign} disabled={submitting}>
                        {submitting ? "Saving..." : "Save Assignment"}
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal open={!!editTarget}>
                <ModalHeader>
                    <ModalTitle>Edit Internship</ModalTitle>
                    <ModalDescription>
                        Update the student, assessor, or company stored for this assignment.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <InternshipForm
                        form={form}
                        setForm={setForm}
                        errors={errors}
                        students={students}
                        assessors={assessors}
                    />
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
                    <ModalTitle>Delete internship?</ModalTitle>
                    <ModalDescription>
                        This removes the internship assignment for {deleteTarget?.student_name}.
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
                        {submitting ? "Deleting..." : "Delete Assignment"}
                    </Button>
                </ModalFooter>
            </Modal>
        </main>
    );
}
