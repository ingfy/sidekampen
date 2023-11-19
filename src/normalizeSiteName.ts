export function normalizeSiteName(site: URL) {
    return site
        .toString()
        .replace(/https?:\/\//, "")
        .replace(/\//g, "");
}
