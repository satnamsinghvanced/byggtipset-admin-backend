const { normalizeText } = require("./normalizeText");

function createSlug(text) {
    if (!text) return '';
    const normalized = normalizeText(text);

    return normalized
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-');
}

module.exports = { createSlug };