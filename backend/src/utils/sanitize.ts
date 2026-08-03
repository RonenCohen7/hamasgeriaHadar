import sanitizeHtml from "sanitize-html";

export function sanitizeText(value: unknown): string {
    if (typeof value !== "string") return "";

    return sanitizeHtml(value.trim(), {
        allowedTags: [],
        allowedAttributes: {}
    });
}