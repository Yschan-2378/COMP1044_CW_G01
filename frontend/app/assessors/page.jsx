"use client";

import { useMemo, useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/icons/Plus";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/icons/MagnifyingGlass";
import { PencilSimple } from "@phosphor-icons/react/dist/icons/PencilSimple";
import { Trash } from "@phosphor-icons/react/dist/icons/Trash";
import { Eye } from "@phosphor-icons/react/dist/icons/Eye";
import { UserGear } from "@phosphor-icons/react/dist/icons/UserGear";
import { Users } from "@phosphor-icons/react/dist/icons/Users";
import { Pulse } from "@phosphor-icons/react/dist/icons/Pulse";
import { ArrowsClockwise } from "@phosphor-icons/react/dist/icons/ArrowsClockwise";
import { Copy } from "@phosphor-icons/react/dist/icons/Copy";

import Button from "@/components/button";
import Input from "@/components/input";
import Label from "@/components/label";
import Dropdown from "@/components/dropdown";
import Toggle from "@/components/toggle";
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

const DEPARTMENTS = [
    "Computer Science",
    "Software Engineering",
    "Information Technology",
    "Data Science",
    "Industry Partner",
];

const ROLES = ["Lecturer", "Supervisor"];

const INITIAL_ASSESSORS = [
    {
        id: "AS-1042",
        name: "Dr. James Chen",
        email: "j.chen@uni.edu",
        department: "Computer Science",
        role: "Lecturer",
        username: "jchen",
        phone: "+44 7700 800001",
        active: true,
        assigned: ["Aisha Rahman", "Chen Wei", "Sofia Martinez"],
    },
    {
        id: "AS-1043",
        name: "Prof. Sarah Lin",
        email: "s.lin@uni.edu",
        department: "Software Engineering",
        role: "Lecturer",
        username: "slin",
        phone: "+44 7700 800002",
        active: true,
        assigned: ["Marcus Johnson", "Tomáš Horák"],
    },
    {
        id: "AS-1044",
        name: "Mr. David Park",
        email: "david.park@cloudscale.com",
        department: "Industry Partner",
        role: "Supervisor",
        username: "dpark",
        phone: "+44 7700 800003",
        active: true,
        assigned: ["Priya Nair"],
    },
    {
        id: "AS-1045",
        name: "Dr. Emily Carter",
        email: "e.carter@uni.edu",
        department: "Data Science",
        role: "Lecturer",
        username: "ecarter",
        phone: "+44 7700 800004",
        active: false,
        assigned: [],
    },
    {
        id: "AS-1046",
        name: "Prof. Michael Adams",
        email: "m.adams@uni.edu",
        department: "Information Technology",
        role: "Lecturer",
        username: "madams",
        phone: "+44 7700 800005",
        active: true,
        assigned: ["Lina Osei"],
    },
    {
        id: "AS-1047",
        name: "Dr. Anna Volkov",
        email: "anna.v@horizonlabs.io",
        department: "Industry Partner",
        role: "Supervisor",
        username: "avolkov",
        phone: "+44 7700 800006",
        active: true,
        assigned: ["Marcus Johnson", "Sofia Martinez"],
    },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-z][a-z0-9_]{2,19}$/;

const EMPTY_FORM = {
    id: "",
    name: "",
    email: "",
    department: DEPARTMENTS[0],
    role: ROLES[0],
    username: "",
    password: "",
    phone: "",
    active: true,
    assigned: [],
};

function generateId(existing) {
    let n = 1048;
    const ids = new Set(existing.map((a) => a.id));
    while (ids.has(`AS-${n}`)) n += 1;
    return `AS-${n}`;
}

function generatePassword() {
    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let out = "";
    for (let i = 0; i < 14; i += 1) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
}

function validate(form, assessors, editingId, requirePassword) {
    const errors = {};
    if (!form.name.trim()) errors.name = "Required";
    if (!form.email.trim()) errors.email = "Required";
    else if (!EMAIL_PATTERN.test(form.email.trim()))
        errors.email = "Invalid email";
    else if (
        assessors.some(
            (a) =>
                a.email.toLowerCase() === form.email.trim().toLowerCase() &&
                a.id !== editingId
        )
    )
        errors.email = "Email already in use";

    if (!form.username.trim()) errors.username = "Required";
    else if (!USERNAME_PATTERN.test(form.username.trim()))
        errors.username = "3–20 chars, lowercase, starts with a letter";
    else if (
        assessors.some(
            (a) =>
                a.username.toLowerCase() ===
                    form.username.trim().toLowerCase() && a.id !== editingId
        )
    )
        errors.username = "Username already taken";

    if (!form.department) errors.department = "Required";
    if (!form.role) errors.role = "Required";

    if (requirePassword) {
        if (!form.password.trim()) errors.password = "Required";
        else if (form.password.trim().length < 8)
            errors.password = "Min 8 characters";
    }

    return errors;
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

function RoleBadge({ role }) {
    const base =
        "inline-flex items-center rounded-full px-3 py-1 text-[13px] font-bold leading-[1.23] tracking-[0.01em]";
    const styles =
        role === "Supervisor"
            ? "bg-[#0052ff] text-white"
            : "bg-[#eef0f3] text-[#0a0b0d]";
    return <span className={`${base} ${styles}`}>{role}</span>;
}

function FormField({ label, error, children, hint }) {
    return (
        <div>
            <Label className="mb-2">{label}</Label>
            {children}
            {error ? (
                <p className="mt-1.5 text-[13px] font-semibold text-[#0052ff]">
                    {error}
                </p>
            ) : hint ? (
                <p className="mt-1.5 text-[13px] text-[#5b616e]">{hint}</p>
            ) : null}
        </div>
    );
}

function PasswordField({ value, onChange, error, onGenerate }) {
    async function copy() {
        if (!value) return;
        try {
            await navigator.clipboard.writeText(value);
        } catch {
            /* ignore */
        }
    }

    return (
        <FormField
            label="Initial Password"
            error={error}
            hint="Share securely with the assessor — they'll be prompted to change it on first login."
        >
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Click generate or type a password"
                    value={value}
                    onChange={onChange}
                    className="flex-1 font-mono"
                />
                <button
                    type="button"
                    onClick={copy}
                    aria-label="Copy password"
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-white text-[#0a0b0d] transition-colors hover:bg-[#eef0f3] disabled:opacity-50"
                    disabled={!value}
                >
                    <Copy size={16} weight="bold" />
                </button>
                <button
                    type="button"
                    onClick={onGenerate}
                    aria-label="Generate password"
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[24px] bg-[#0a0b0d] text-white transition-colors hover:bg-[#282b31]"
                >
                    <ArrowsClockwise size={16} weight="bold" />
                </button>
            </div>
        </FormField>
    );
}

function AssessorForm({ form, setForm, errors, mode }) {
    const update = (key) => (e) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
                <FormField label="Full Name" error={errors.name}>
                    <Input
                        placeholder="Dr. Jane Doe"
                        value={form.name}
                        onChange={update("name")}
                    />
                </FormField>
            </div>
            <FormField label="Email" error={errors.email}>
                <Input
                    type="email"
                    placeholder="jane.doe@uni.edu"
                    value={form.email}
                    onChange={update("email")}
                />
            </FormField>
            <FormField label="Phone">
                <Input
                    placeholder="+44 7700 800000"
                    value={form.phone}
                    onChange={update("phone")}
                />
            </FormField>
            <FormField label="Department" error={errors.department}>
                <Dropdown
                    value={form.department}
                    onChange={(v) =>
                        setForm((f) => ({ ...f, department: v }))
                    }
                    options={DEPARTMENTS}
                />
            </FormField>
            <FormField label="Role" error={errors.role}>
                <Dropdown
                    value={form.role}
                    onChange={(v) => setForm((f) => ({ ...f, role: v }))}
                    options={ROLES}
                />
            </FormField>
            <FormField label="Username" error={errors.username}>
                <Input
                    placeholder="jdoe"
                    value={form.username}
                    onChange={update("username")}
                />
            </FormField>
            <div className="flex items-end">
                <div className="flex w-full items-center justify-between rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-white px-5 py-3">
                    <div>
                        <p className="text-[14px] font-semibold text-[#0a0b0d]">
                            Account Active
                        </p>
                        <p className="text-[13px] text-[#5b616e]">
                            {form.active ? "Can sign in" : "Sign-in disabled"}
                        </p>
                    </div>
                    <Toggle
                        checked={form.active}
                        onChange={(v) =>
                            setForm((f) => ({ ...f, active: v }))
                        }
                        label="Account active"
                    />
                </div>
            </div>
            {mode === "add" && (
                <div className="sm:col-span-2">
                    <PasswordField
                        value={form.password}
                        onChange={update("password")}
                        error={errors.password}
                        onGenerate={() =>
                            setForm((f) => ({
                                ...f,
                                password: generatePassword(),
                            }))
                        }
                    />
                </div>
            )}
        </div>
    );
}

export default function AssessorsPage() {
    const [assessors, setAssessors] = useState(INITIAL_ASSESSORS);
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("All");
    const [roleFilter, setRoleFilter] = useState("All");

    const [addOpen, setAddOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [viewTarget, setViewTarget] = useState(null);
    const [resetTarget, setResetTarget] = useState(null);
    const [resetPassword, setResetPassword] = useState("");

    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return assessors.filter((a) => {
            if (deptFilter !== "All" && a.department !== deptFilter)
                return false;
            if (roleFilter !== "All" && a.role !== roleFilter) return false;
            if (
                q &&
                !a.name.toLowerCase().includes(q) &&
                !a.email.toLowerCase().includes(q)
            )
                return false;
            return true;
        });
    }, [assessors, search, deptFilter, roleFilter]);

    const stats = useMemo(() => {
        const total = assessors.length;
        const active = assessors.filter((a) => a.active).length;
        const totalAssigned = assessors.reduce(
            (sum, a) => sum + a.assigned.length,
            0
        );
        const avg = total ? (totalAssigned / total).toFixed(1) : "0";
        return { total, active, avg };
    }, [assessors]);

    function openAdd() {
        setForm({ ...EMPTY_FORM, id: generateId(assessors) });
        setErrors({});
        setAddOpen(true);
    }

    function openEdit(a) {
        setForm({ ...a, password: "" });
        setErrors({});
        setEditTarget(a);
    }

    function closeAll() {
        setAddOpen(false);
        setEditTarget(null);
        setDeleteTarget(null);
        setViewTarget(null);
        setResetTarget(null);
        setResetPassword("");
        setErrors({});
    }

    function submitAdd() {
        const errs = validate(form, assessors, null, true);
        if (Object.keys(errs).length) return setErrors(errs);
        const { password, ...rest } = form;
        setAssessors((prev) => [
            ...prev,
            {
                ...rest,
                id: form.id || generateId(prev),
                name: form.name.trim(),
                email: form.email.trim(),
                username: form.username.trim().toLowerCase(),
            },
        ]);
        closeAll();
    }

    function submitEdit() {
        const errs = validate(form, assessors, editTarget.id, false);
        if (Object.keys(errs).length) return setErrors(errs);
        setAssessors((prev) =>
            prev.map((a) =>
                a.id === editTarget.id
                    ? {
                          ...a,
                          name: form.name.trim(),
                          email: form.email.trim(),
                          username: form.username.trim().toLowerCase(),
                          phone: form.phone,
                          department: form.department,
                          role: form.role,
                          active: form.active,
                      }
                    : a
            )
        );
        closeAll();
    }

    function confirmDelete() {
        setAssessors((prev) => prev.filter((a) => a.id !== deleteTarget.id));
        closeAll();
    }

    function toggleActive(a) {
        setAssessors((prev) =>
            prev.map((x) =>
                x.id === a.id ? { ...x, active: !x.active } : x
            )
        );
    }

    function openReset(a) {
        setResetTarget(a);
        setResetPassword(generatePassword());
    }

    return (
        <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-white">
            <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16">
                {/* Header */}
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                            Accounts
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

                {/* Stats */}
                <section className="mt-12">
                    <div className="grid grid-cols-1 overflow-hidden rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-white md:grid-cols-3">
                        <StatChip
                            label="Total Assessors"
                            value={stats.total}
                            icon={UserGear}
                        />
                        <StatChip
                            label="Active Accounts"
                            value={stats.active}
                            icon={Pulse}
                        />
                        <StatChip
                            label="Avg Students / Assessor"
                            value={stats.avg}
                            icon={Users}
                            isLast
                        />
                    </div>
                </section>

                {/* Filter bar */}
                <section className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px_220px]">
                    <div className="relative">
                        <MagnifyingGlass
                            size={18}
                            weight="bold"
                            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#5b616e]"
                        />
                        <Input
                            placeholder="Search by name or email"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12"
                        />
                    </div>
                    <Dropdown
                        value={deptFilter}
                        onChange={setDeptFilter}
                        options={["All", ...DEPARTMENTS].map((d) => ({
                            value: d,
                            label: d === "All" ? "All Departments" : d,
                        }))}
                    />
                    <Dropdown
                        value={roleFilter}
                        onChange={setRoleFilter}
                        options={["All", ...ROLES].map((r) => ({
                            value: r,
                            label: r === "All" ? "All Roles" : r,
                        }))}
                    />
                </section>

                {/* Table */}
                <section className="mt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Assessor ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-center">
                                    Students
                                </TableHead>
                                <TableHead className="text-center">
                                    Active
                                </TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableEmpty colSpan={8}>
                                    No assessors match your filters.
                                </TableEmpty>
                            ) : (
                                filtered.map((a) => (
                                    <TableRow
                                        key={a.id}
                                        className={
                                            a.active ? "" : "opacity-60"
                                        }
                                    >
                                        <TableCell className="font-semibold tabular-nums">
                                            {a.id}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {a.name}
                                        </TableCell>
                                        <TableCell className="text-[#5b616e]">
                                            {a.email}
                                        </TableCell>
                                        <TableCell className="text-[#5b616e]">
                                            {a.department}
                                        </TableCell>
                                        <TableCell>
                                            <RoleBadge role={a.role} />
                                        </TableCell>
                                        <TableCell className="text-center tabular-nums font-semibold">
                                            {a.assigned.length}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <Toggle
                                                    checked={a.active}
                                                    onChange={() =>
                                                        toggleActive(a)
                                                    }
                                                    label={`Toggle ${a.name}`}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() =>
                                                        setViewTarget(a)
                                                    }
                                                    aria-label={`View students for ${a.name}`}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#5b616e] transition-colors hover:bg-[#eef0f3] hover:text-[#0052ff]"
                                                >
                                                    <Eye
                                                        size={16}
                                                        weight="bold"
                                                    />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openEdit(a)
                                                    }
                                                    aria-label={`Edit ${a.name}`}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#5b616e] transition-colors hover:bg-[#eef0f3] hover:text-[#0052ff]"
                                                >
                                                    <PencilSimple
                                                        size={16}
                                                        weight="bold"
                                                    />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setDeleteTarget(a)
                                                    }
                                                    aria-label={`Delete ${a.name}`}
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
                        Showing {filtered.length} of {assessors.length}
                    </p>
                </section>
            </div>

            {/* Add Modal */}
            <Modal open={addOpen} size="lg">
                <ModalHeader>
                    <ModalTitle>Add Assessor</ModalTitle>
                    <ModalDescription>
                        Create a sign-in account for a new lecturer or industry
                        supervisor.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <AssessorForm
                        form={form}
                        setForm={setForm}
                        errors={errors}
                        mode="add"
                    />
                </ModalContent>
                <ModalFooter>
                    <Button variant="secondary" onClick={closeAll}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={submitAdd}>
                        Create Account
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Edit Modal */}
            <Modal open={!!editTarget} size="lg">
                <ModalHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <ModalTitle>Edit Assessor</ModalTitle>
                            <ModalDescription>
                                Update profile for{" "}
                                <span className="font-semibold text-[#0a0b0d]">
                                    {editTarget?.name}
                                </span>
                                .
                            </ModalDescription>
                        </div>
                        <button
                            type="button"
                            onClick={() => openReset(editTarget)}
                            className="shrink-0 rounded-full border border-[rgba(91,97,110,0.2)] px-4 py-2 text-[13px] font-semibold text-[#0a0b0d] transition-colors hover:bg-[#eef0f3]"
                        >
                            Reset Password
                        </button>
                    </div>
                </ModalHeader>
                <ModalContent>
                    <AssessorForm
                        form={form}
                        setForm={setForm}
                        errors={errors}
                        mode="edit"
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

            {/* View Assigned Students */}
            <Modal open={!!viewTarget}>
                <ModalHeader>
                    <ModalTitle>Assigned Students</ModalTitle>
                    <ModalDescription>
                        {viewTarget?.assigned.length || 0} student
                        {viewTarget?.assigned.length === 1 ? "" : "s"} under{" "}
                        <span className="font-semibold text-[#0a0b0d]">
                            {viewTarget?.name}
                        </span>
                        .
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    {viewTarget?.assigned.length ? (
                        <ul className="divide-y divide-[rgba(91,97,110,0.2)] overflow-hidden rounded-[16px] border border-[rgba(91,97,110,0.2)]">
                            {viewTarget.assigned.map((s, i) => (
                                <li
                                    key={s}
                                    className="flex items-center gap-4 px-5 py-3"
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef0f3] text-[13px] font-semibold tabular-nums text-[#5b616e]">
                                        {i + 1}
                                    </span>
                                    <span className="text-[15px] font-semibold text-[#0a0b0d]">
                                        {s}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="rounded-[16px] border border-dashed border-[rgba(91,97,110,0.3)] px-5 py-8 text-center text-[14px] text-[#5b616e]">
                            No students currently assigned.
                        </p>
                    )}
                </ModalContent>
                <ModalFooter>
                    <Button variant="secondary" onClick={closeAll}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Reset Password */}
            <Modal open={!!resetTarget}>
                <ModalHeader>
                    <ModalTitle>Reset Password</ModalTitle>
                    <ModalDescription>
                        A new password has been generated for{" "}
                        <span className="font-semibold text-[#0a0b0d]">
                            {resetTarget?.name}
                        </span>
                        . Share it securely — they&apos;ll be prompted to change it
                        on next sign-in.
                    </ModalDescription>
                </ModalHeader>
                <ModalContent>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-[#eef0f3] px-5 py-3 font-mono text-[16px] text-[#0a0b0d] break-all">
                            {resetPassword}
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                navigator.clipboard
                                    ?.writeText(resetPassword)
                                    .catch(() => {})
                            }
                            className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[24px] bg-[#0a0b0d] text-white transition-colors hover:bg-[#282b31]"
                            aria-label="Copy password"
                        >
                            <Copy size={16} weight="bold" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setResetPassword(generatePassword())}
                            className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-white text-[#0a0b0d] transition-colors hover:bg-[#eef0f3]"
                            aria-label="Generate new"
                        >
                            <ArrowsClockwise size={16} weight="bold" />
                        </button>
                    </div>
                </ModalContent>
                <ModalFooter>
                    <Button
                        variant="primary"
                        onClick={() => setResetTarget(null)}
                    >
                        Done
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Delete Modal */}
            <Modal open={!!deleteTarget}>
                <ModalHeader>
                    <ModalTitle>Delete assessor?</ModalTitle>
                    <ModalDescription>
                        This permanently removes{" "}
                        <span className="font-semibold text-[#0a0b0d]">
                            {deleteTarget?.name}
                        </span>{" "}
                        ({deleteTarget?.id}) and their account.
                        {deleteTarget?.assigned.length ? (
                            <>
                                {" "}
                                They currently have{" "}
                                <span className="font-semibold text-[#0a0b0d]">
                                    {deleteTarget.assigned.length} assigned
                                    student
                                    {deleteTarget.assigned.length === 1
                                        ? ""
                                        : "s"}
                                </span>
                                . Consider deactivating instead so existing
                                assessment records remain intact.
                            </>
                        ) : null}
                    </ModalDescription>
                </ModalHeader>
                <ModalFooter>
                    <Button variant="secondary" onClick={closeAll}>
                        Cancel
                    </Button>
                    <Button variant="dark" onClick={confirmDelete}>
                        Delete Permanently
                    </Button>
                </ModalFooter>
            </Modal>
        </main>
    );
}
