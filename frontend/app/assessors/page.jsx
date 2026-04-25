"use client";

import { useMemo, useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/icons/Plus";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/icons/MagnifyingGlass";
import { UserGear } from "@phosphor-icons/react/dist/icons/UserGear";
import { Users } from "@phosphor-icons/react/dist/icons/Users";
import { ArrowsClockwise } from "@phosphor-icons/react/dist/icons/ArrowsClockwise";

import Button from "@/components/button";
import Input from "@/components/input";
import Label from "@/components/label";
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

const USERNAME_PATTERN = /^[a-z][a-z0-9_]{2,19}$/;
const EMPTY_FORM = { username: "", password: "" };

function generatePassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let out = "";
    for (let index = 0; index < 14; index += 1) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
}

function validate(form, assessors, editingId, requirePassword) {
    const errors = {};
    const username = form.username.trim().toLowerCase();

    if (!username) errors.username = "Required";
    else if (!USERNAME_PATTERN.test(username)) {
        errors.username = "3-20 chars, lowercase, starts with a letter";
    } else if (
        assessors.some(
            (assessor) =>
                assessor.username.toLowerCase() === username && assessor.user_id !== editingId,
        )
    ) {
        errors.username = "Username already exists";
    }

    if (requirePassword) {
        if (!form.password.trim()) errors.password = "Required";
        else if (form.password.trim().length < 8) errors.password = "Min 8 characters";
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

function PasswordField({ value, onChange, error, onGenerate }) {
    return (
        <FormField label="Password" error={error}>
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Generate or type a password"
                    value={value}
                    onChange={onChange}
                    className="flex-1"
                />
                <button
                    type="button"
                    onClick={onGenerate}
                    aria-label="Generate password"
                    className="flex h-[50px] shrink-0 items-center justify-center gap-2 rounded-[24px] border border-[#eef0f3] bg-[#eef0f3] px-5 text-[14px] font-semibold text-[#0a0b0d] transition-colors hover:bg-[#dfe3e8]"
                >
                    <ArrowsClockwise size={16} weight="bold" />
                    Generate
                </button>
            </div>
        </FormField>
    );
}

function AssessorForm({ form, setForm, errors, mode }) {
    return (
        <div className="grid grid-cols-1 gap-4">
            <FormField label="Username" error={errors.username}>
                <Input
                    placeholder="jdoe"
                    value={form.username}
                    onChange={(event) =>
                        setForm((current) => ({ ...current, username: event.target.value }))
                    }
                />
            </FormField>
            {mode === "add" && (
                <PasswordField
                    value={form.password}
                    onChange={(event) =>
                        setForm((current) => ({ ...current, password: event.target.value }))
                    }
                    error={errors.password}
                    onGenerate={() =>
                        setForm((current) => ({ ...current, password: generatePassword() }))
                    }
                />
            )}
        </div>
    );
}

export default function AssessorsPage() {
    const { data, loading, error, refetch } = useApi("/assessors.php");
    const assessors = data?.assessors ?? [];

    const [search, setSearch] = useState("");
    const [addOpen, setAddOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [resetTarget, setResetTarget] = useState(null);
    const [resetPassword, setResetPassword] = useState("");
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        return assessors.filter((assessor) =>
            query ? assessor.username.toLowerCase().includes(query) : true,
        );
    }, [assessors, search]);
    const assignedInternships = assessors.reduce(
        (total, assessor) => total + Number(assessor.assigned_count || 0),
        0,
    );

    function openAdd() {
        setForm({ ...EMPTY_FORM, password: generatePassword() });
        setErrors({});
        setSubmitError(null);
        setAddOpen(true);
    }

    function openEdit(assessor) {
        setForm({ username: assessor.username, password: "" });
        setErrors({});
        setSubmitError(null);
        setEditTarget(assessor);
    }

    function closeAll() {
        setAddOpen(false);
        setEditTarget(null);
        setDeleteTarget(null);
        setResetTarget(null);
        setResetPassword("");
        setErrors({});
        setSubmitError(null);
    }

    async function submitAdd() {
        const nextErrors = validate(form, assessors, null, true);
        if (Object.keys(nextErrors).length) return setErrors(nextErrors);
        setSubmitting(true);
        setSubmitError(null);
        try {
            await apiFetch("/assessors.php", {
                method: "POST",
                body: JSON.stringify({
                    username: form.username.trim().toLowerCase(),
                    password: form.password,
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
        const nextErrors = validate(form, assessors, editTarget.user_id, false);
        if (Object.keys(nextErrors).length) return setErrors(nextErrors);
        setSubmitting(true);
        setSubmitError(null);
        try {
            await apiFetch("/assessors.php", {
                method: "PUT",
                body: JSON.stringify({
                    user_id: editTarget.user_id,
                    username: form.username.trim().toLowerCase(),
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
            await apiFetch("/assessors.php", {
                method: "DELETE",
                body: JSON.stringify({ user_id: deleteTarget.user_id }),
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

    function openReset(assessor) {
        setResetTarget(assessor);
        setResetPassword(generatePassword());
        setSubmitError(null);
    }

    async function applyReset() {
        setSubmitting(true);
        setSubmitError(null);
        try {
            await apiFetch("/assessors.php", {
                method: "PUT",
                body: JSON.stringify({
                    user_id: resetTarget.user_id,
                    username: resetTarget.username,
                    password: resetPassword,
                }),
            });
            closeAll();
        } catch (err) {
            if (err.fields) setErrors(err.fields);
            setSubmitError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    const columns = [
        { key: "user_id", header: "User ID", cellClassName: "font-semibold tabular-nums" },
        { key: "username", header: "Username", cellClassName: "font-semibold" },
        { key: "role", header: "Role", cellClassName: "text-[#5b616e]" },
        {
            key: "assigned_count",
            header: "Internships",
            cellClassName: "tabular-nums text-[#5b616e]",
        },
    ];

    return (
        <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-white">
            <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                            User Accounts
                        </p>
                        <h1 className="mt-3 text-[56px] font-medium leading-[1] tracking-[-0.03em] text-[#0a0b0d] md:text-[72px]">
                            Assessors
                        </h1>
                    </div>
                    <Button variant="primary" onClick={openAdd}>
                        <Plus size={18} weight="bold" className="mr-2" />
                        Add Assessor
                    </Button>
                </div>

                <section className="mt-12">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <StatChip label="Assessor Accounts" value={assessors.length} icon={UserGear} />
                        <StatChip label="Assigned Internships" value={assignedInternships} icon={Users} />
                    </div>
                </section>

                <section className="mt-12">
                    <div className="relative">
                        <MagnifyingGlass
                            size={18}
                            weight="bold"
                            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#5b616e]"
                        />
                        <Input
                            placeholder="Search by username"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="pl-12"
                        />
                    </div>
                </section>

                {error && (
                    <p className="mt-6 text-[14px] font-semibold text-[#c9182e]">
                        Failed to load assessors: {error.message}
                    </p>
                )}

                <section className="mt-6">
                    <DataTable
                        columns={columns}
                        rows={filtered}
                        rowKey={(assessor) => assessor.user_id}
                        emptyMessage={
                            loading
                                ? "Loading assessors..."
                                : search
                                  ? "No assessors match your search."
                                  : "No assessors yet."
                        }
                        filteredAway={search !== ""}
                        onClearFilters={() => setSearch("")}
                        onRowActivate={openEdit}
                        onEdit={openEdit}
                        onDelete={setDeleteTarget}
                        rowActions={(assessor) => (
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    openReset(assessor);
                                }}
                                className="inline-flex items-center rounded-full border border-[rgba(91,97,110,0.3)] bg-white px-4 py-1.5 text-[13px] font-semibold text-[#0a0b0d] transition-colors hover:bg-[#eef0f3]"
                            >
                                Reset
                            </button>
                        )}
                        totalLabel={(shown) => `Showing ${shown} of ${assessors.length}`}
                    />
                </section>
            </div>

            <Modal open={addOpen}>
                <ModalHeader>
                    <ModalTitle>Add Assessor</ModalTitle>
                    <ModalDescription>
                        Create a Users table account with the Assessor role.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <AssessorForm form={form} setForm={setForm} errors={errors} mode="add" />
                    {submitError && (
                        <p className="mt-3 text-[13px] font-semibold text-[#c9182e]">{submitError}</p>
                    )}
                </ModalContent>
                <ModalFooter>
                    <Button variant="secondary" onClick={closeAll} disabled={submitting}>Cancel</Button>
                    <Button variant="primary" onClick={submitAdd} disabled={submitting}>
                        {submitting ? "Creating..." : "Create Account"}
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal open={!!editTarget}>
                <ModalHeader>
                    <ModalTitle>Edit Assessor</ModalTitle>
                    <ModalDescription>
                        Update the username stored for this assessor account.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <AssessorForm form={form} setForm={setForm} errors={errors} mode="edit" />
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

            <Modal open={!!resetTarget}>
                <ModalHeader>
                    <ModalTitle>Reset Password</ModalTitle>
                    <ModalDescription>
                        Generate a temporary password for {resetTarget?.username}.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <div className="rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-[#eef0f3] px-5 py-3 font-mono text-[16px] text-[#0a0b0d] break-all">
                        {resetPassword}
                    </div>
                    {submitError && (
                        <p className="mt-3 text-[13px] font-semibold text-[#c9182e]">{submitError}</p>
                    )}
                </ModalContent>
                <ModalFooter>
                    <Button
                        variant="secondary"
                        onClick={() => setResetPassword(generatePassword())}
                        disabled={submitting}
                    >
                        Generate New
                    </Button>
                    <Button variant="primary" onClick={applyReset} disabled={submitting}>
                        {submitting ? "Saving..." : "Save Password"}
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal open={!!deleteTarget}>
                <ModalHeader>
                    <ModalTitle>Delete assessor?</ModalTitle>
                    <ModalDescription>
                        This removes {deleteTarget?.username} from the Users table.
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
