"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/icons/ArrowLeft";
import { CheckCircle } from "@phosphor-icons/react/dist/icons/CheckCircle";

import Button from "@/components/button";
import Input from "@/components/input";
import Label from "@/components/label";
import Textarea from "@/components/textarea";
import { apiFetch } from "@/lib/api";
import { PageState, useAssessorData } from "../../use-assessor-data";

const CRITERIA = [
    { key: "task_mark", label: "Undertaking Tasks/Projects", weight: 10 },
    { key: "safety_mark", label: "Health and Safety Requirements", weight: 10 },
    { key: "knowledge_mark", label: "Connectivity and Use of Theoretical Knowledge", weight: 10 },
    { key: "report_mark", label: "Presentation of the Report", weight: 15 },
    { key: "clarity_mark", label: "Clarity of Language and Illustration", weight: 10 },
    { key: "learning_mark", label: "Lifelong Learning Activities", weight: 15 },
    { key: "project_mgt_mark", label: "Project Management", weight: 15 },
    { key: "time_mgt_mark", label: "Time Management", weight: 15 },
];

const EMPTY_MARKS = CRITERIA.reduce(
    (acc, criterion) => ({ ...acc, [criterion.key]: "" }),
    {},
);

function calculateScore(form) {
    return CRITERIA.reduce((sum, criterion) => {
        const value = Number(form[criterion.key]);
        if (Number.isNaN(value)) return sum;
        return sum + (value * criterion.weight) / 100;
    }, 0);
}

function FormField({ criterion, value, onChange, error }) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3">
                <Label>{criterion.label}</Label>
                <span className="rounded-full bg-[#eef0f3] px-3 py-1 text-[12px] font-bold text-[#5b616e]">
                    {criterion.weight}%
                </span>
            </div>
            <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={value}
                onChange={(event) => onChange(criterion.key, event.target.value)}
                placeholder="0-100"
            />
            {error && (
                <p className="mt-1.5 text-[13px] font-semibold text-[#c9182e]">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function GradeStudentPage() {
    const params = useParams();
    const router = useRouter();
    const internshipId = Number(params.internshipId);
    const { data, loading, error } = useAssessorData("/internships.php");
    const internships = data?.internships || [];
    const internship = internships.find((item) => Number(item.internship_id) === internshipId);

    const [form, setForm] = useState({ ...EMPTY_MARKS, qualitative_comments: "" });
    const [errors, setErrors] = useState({});
    const [loadingAssessment, setLoadingAssessment] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadAssessment() {
            setLoadingAssessment(true);
            try {
                const data = await apiFetch(`/assessments.php?internship_id=${internshipId}`);
                if (cancelled) return;
                const assessment = data.assessment;
                setForm({
                    ...EMPTY_MARKS,
                    ...Object.fromEntries(
                        CRITERIA.map((criterion) => [
                            criterion.key,
                            assessment?.[criterion.key] ?? "",
                        ]),
                    ),
                    qualitative_comments: assessment?.qualitative_comments ?? "",
                });
            } catch (err) {
                if (!cancelled && err.status !== 404) {
                    setMessage(err.message || "Unable to load existing assessment.");
                }
            } finally {
                if (!cancelled) setLoadingAssessment(false);
            }
        }

        if (internshipId) loadAssessment();
        return () => {
            cancelled = true;
        };
    }, [internshipId]);

    const score = useMemo(() => calculateScore(form), [form]);

    function updateField(key, value) {
        setForm((current) => ({ ...current, [key]: value }));
        setErrors((current) => ({ ...current, [key]: "" }));
        setMessage("");
    }

    function validate() {
        const next = {};
        for (const criterion of CRITERIA) {
            const value = Number(form[criterion.key]);
            if (form[criterion.key] === "") next[criterion.key] = "Required";
            else if (Number.isNaN(value) || value < 0 || value > 100) {
                next[criterion.key] = "Enter a mark from 0 to 100";
            }
        }
        return next;
    }

    async function submit(event) {
        event.preventDefault();
        const nextErrors = validate();
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;

        setSaving(true);
        setMessage("");
        try {
            const payload = {
                internship_id: internshipId,
                qualitative_comments: form.qualitative_comments,
            };
            CRITERIA.forEach((criterion) => {
                payload[criterion.key] = Number(form[criterion.key]);
            });

            const result = await apiFetch("/assessments.php", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            setMessage(`Saved. Final score: ${Number(result.final_calculated_score).toFixed(2)}%.`);
        } catch (err) {
            if (err.status === 401) router.push("/login");
            else {
                if (err.fields) setErrors(err.fields);
                setMessage(err.message || "Unable to save assessment.");
            }
        } finally {
            setSaving(false);
        }
    }

    const pageLoading = loading || loadingAssessment;
    const notFound = !pageLoading && !error && !internship;

    return (
        <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-white">
            <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                            Internship Result Entry
                        </p>
                        <h1 className="mt-3 text-[52px] font-medium leading-[1] tracking-[-0.03em] text-[#0a0b0d] md:text-[72px]">
                            Enter Marks
                        </h1>
                    </div>
                    <Button href="/assessor/students" variant="secondary" className="gap-2">
                        <ArrowLeft size={18} weight="bold" />
                        Back
                    </Button>
                </div>

                <section className="mt-8">
                    <PageState
                        loading={pageLoading}
                        error={error}
                        empty={notFound}
                    >
                        {internship && (
                            <form onSubmit={submit}>
                                <div className="grid grid-cols-1 gap-4 rounded-[24px] border border-[rgba(91,97,110,0.2)] bg-[#f8f9fb] px-6 py-5 md:grid-cols-3">
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                                            Student
                                        </p>
                                        <p className="mt-1 text-[16px] font-semibold text-[#0a0b0d]">
                                            {internship.student_name}
                                        </p>
                                        <p className="mt-1 text-[13px] text-[#5b616e]">
                                            {internship.student_id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                                            Programme
                                        </p>
                                        <p className="mt-1 text-[16px] font-semibold text-[#0a0b0d]">
                                            {internship.programme}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5b616e]">
                                            Company
                                        </p>
                                        <p className="mt-1 text-[16px] font-semibold text-[#0a0b0d]">
                                            {internship.company_name}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {CRITERIA.map((criterion) => (
                                        <FormField
                                            key={criterion.key}
                                            criterion={criterion}
                                            value={form[criterion.key]}
                                            onChange={updateField}
                                            error={errors[criterion.key]}
                                        />
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <Label className="mb-2">Qualitative Comments</Label>
                                    <Textarea
                                        rows={6}
                                        value={form.qualitative_comments}
                                        onChange={(event) =>
                                            updateField("qualitative_comments", event.target.value)
                                        }
                                        placeholder="Add feedback to justify the marks."
                                    />
                                    {errors.qualitative_comments && (
                                        <p className="mt-1.5 text-[13px] font-semibold text-[#c9182e]">
                                            {errors.qualitative_comments}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-[#0052ff] px-6 py-5 text-white">
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/70">
                                            Calculated Score
                                        </p>
                                        <p className="mt-1 text-[36px] font-medium leading-none tabular-nums">
                                            {score.toFixed(2)}%
                                        </p>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        variant="secondary"
                                    >
                                        {saving ? "Saving..." : "Save Assessment"}
                                    </Button>
                                </div>

                                {message && (
                                    <div className="mt-4 flex items-center gap-3 rounded-[20px] border border-[rgba(91,97,110,0.2)] bg-white px-5 py-4 text-[15px] font-semibold text-[#0a0b0d]">
                                        <CheckCircle size={18} weight="fill" className="text-[#0052ff]" />
                                        {message}
                                    </div>
                                )}
                            </form>
                        )}
                    </PageState>
                </section>
            </div>
        </main>
    );
}
