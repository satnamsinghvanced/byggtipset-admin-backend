function slugSanitizer(str = "") {
  return str
    .toLowerCase()

    // Norwegian characters
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")

    // Normalize all accented characters
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    // Replace spaces with hyphen
    .replace(/[\s_]+/g, "-")

    // Remove everything except a-z, numbers and -
    .replace(/[^a-z0-9-]/g, "")

    // Remove multiple hyphens
    .replace(/-+/g, "-")

    // Trim hyphens from start or end
    .replace(/^-|-$/g, "");
}

module.exports = slugSanitizer;
