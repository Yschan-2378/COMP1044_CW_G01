"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/dist/icons/ArrowRight";
import { Eye } from "@phosphor-icons/react/dist/icons/Eye";
import { EyeSlash } from "@phosphor-icons/react/dist/icons/EyeSlash";

import Button from "@/components/button";
import Input from "@/components/input";
import Label from "@/components/label";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (!username.trim() || !password) {
            setError("Enter both your username and password to continue.");
            return;
        }

        setSubmitting(true);
        try {
            const data = await apiFetch("/auth/login.php", {
                method: "POST",
                body: JSON.stringify({
                    username: username.trim(),
                    password,
                }),
            });

            if (data.user?.role === "Assessor") {
                router.push("/assessor");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError(err.message || "Unable to sign in.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-white">
            <div className="grid h-full grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
                <section className="group relative hidden flex-col justify-between overflow-hidden bg-[#0052ff] px-10 py-12 text-white lg:flex xl:px-16 xl:py-16">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
                    >
                        <svg
                            viewBox="0 0 500 500"
                            className="absolute inset-0 h-full w-full"
                            preserveAspectRatio="xMidYMid slice"
                        >
                            <circle
                                cx="500"
                                cy="0"
                                r="80"
                                stroke="rgba(255,255,255,0.1)"
                                fill="none"
                            />
                            <circle
                                cx="500"
                                cy="0"
                                r="160"
                                stroke="rgba(255,255,255,0.1)"
                                fill="none"
                            />
                            <circle
                                cx="500"
                                cy="0"
                                r="240"
                                stroke="rgba(255,255,255,0.1)"
                                fill="none"
                            />
                            <circle
                                cx="500"
                                cy="0"
                                r="320"
                                stroke="rgba(255,255,255,0.1)"
                                fill="none"
                            />
                            <circle
                                cx="500"
                                cy="0"
                                r="420"
                                stroke="rgba(255,255,255,0.1)"
                                fill="none"
                            />
                            <circle
                                cx="500"
                                cy="0"
                                r="540"
                                stroke="rgba(255,255,255,0.1)"
                                fill="none"
                            />
                        </svg>
                    </div>

                    <div className="relative" />

                    <div className="relative">
                        <h1 className="max-w-[12ch] text-[64px] font-medium leading-[0.96] tracking-[-0.04em] text-white xl:text-[88px]">
                            Sign in to keep things moving.
                        </h1>
                        <p className="mt-8 max-w-[42ch] text-[16px] leading-[1.56] text-white/80">
                            Manage the student internship experience from a
                            single place.
                        </p>
                    </div>

                    <div className="relative text-[13px] font-medium tabular-nums text-white/60">
                        Internship Result Management
                    </div>
                </section>

                <section className="flex items-center justify-center px-6 py-12 md:px-10 md:py-16">
                    <div className="w-full max-w-[440px]">
                        <h2 className="mt-4 text-[44px] font-medium leading-[1.0] tracking-[-0.03em] text-[#0a0b0d] md:text-[56px]">
                            Log in.
                        </h2>
                        <p className="mt-5 max-w-[38ch] text-[16px] leading-[1.5] text-[#5b616e]">
                            Use your credentials to access the dashboard.
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-10 flex flex-col gap-5"
                        >
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    placeholder="e.g. madams"
                                    value={username}
                                    onChange={(event) =>
                                        setUsername(event.target.value)
                                    }
                                    disabled={submitting}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        disabled={submitting}
                                        className="pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#5b616e] transition-colors hover:text-[#0a0b0d] focus:outline-none focus:ring-2 focus:ring-[#0052ff]"
                                    >
                                        {showPassword ? (
                                            <EyeSlash size={18} weight="bold" />
                                        ) : (
                                            <Eye size={18} weight="bold" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error ? (
                                <div
                                    role="alert"
                                    className="rounded-[16px] border border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.06)] px-4 py-3 text-[14px] font-medium text-[#a11616]"
                                >
                                    {error}
                                </div>
                            ) : null}

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={submitting}
                                className="mt-2 w-full gap-2"
                            >
                                {submitting ? "Signing in…" : "Sign in"}
                                {!submitting && (
                                    <ArrowRight size={18} weight="bold" />
                                )}
                            </Button>
                        </form>
                    </div>
                </section>
            </div>
        </main>
    );
}
