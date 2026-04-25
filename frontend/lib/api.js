export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const FIELD_LABELS = {
    assessor_id: "assessor",
    clarity_mark: "clarity mark",
    company_name: "company name",
    internship_id: "internship",
    knowledge_mark: "knowledge mark",
    learning_mark: "learning mark",
    password: "password",
    programme: "programme",
    project_mgt_mark: "project management mark",
    qualitative_comments: "comments",
    report_mark: "report mark",
    safety_mark: "safety mark",
    student_id: "student ID",
    student_name: "student name",
    task_mark: "task mark",
    time_mgt_mark: "time management mark",
    user_id: "assessor",
    username: "username",
};

function sentenceCase(value) {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function fieldLabel(field) {
    return FIELD_LABELS[field] || field.replaceAll("_", " ");
}

function formatFieldMessage(field, message) {
    const label = fieldLabel(field);
    let next = String(message || "").trim();

    next = next.replaceAll("character(s)", "characters");
    next = next.replaceAll(field, label);

    const inlinePrefix = `${label} `;
    if (next.toLowerCase().startsWith(inlinePrefix.toLowerCase())) {
        next = next.slice(inlinePrefix.length);
    }

    if (next === "is required.") return "Required";
    if (next === "has an invalid format." && field === "student_id") {
        return "Use format 20XXXXXX";
    }
    if (next === "has an invalid format." && field === "username") {
        return "Use letters, numbers, underscores, dots, or hyphens";
    }
    if (next === "has an invalid format.") return "Use the required format";
    if (next === "must be a string.") return "Enter text";
    if (next === "must be an integer.") return "Enter a whole number";
    if (next === "must be numeric.") return "Enter a number";
    if (next === "must be between 0 and 100.") return "Enter a value from 0 to 100";

    return sentenceCase(next);
}

function formatValidationFields(fields) {
    if (!fields || typeof fields !== "object") return null;

    return Object.fromEntries(
        Object.entries(fields).map(([field, message]) => [
            field,
            formatFieldMessage(field, message),
        ]),
    );
}

export async function apiFetch(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        const fields = formatValidationFields(data.fields);
        const error = new Error(fields ? "Fix the highlighted fields." : data.error || "Request failed.");
        error.status = response.status;
        error.fields = fields;
        error.payload = data;
        throw error;
    }

    return data;
}
