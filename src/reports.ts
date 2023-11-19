import type { Result as LighthouseResult } from "lighthouse";

export async function loadReports() {
    const json: Record<string, () => Promise<LighthouseResult>> = await import.meta.glob(
        `../reports/**/report.json`,
    );
    const html: Record<string, () => Promise<string>> = await import.meta.glob(
        `../reports/**/report.html`,
        { as: "raw" }
    );

    return Object.keys(json).map(key => {
        const parts = key.split("/");
        const siteName = parts[parts.length - 2];
        return ({
            siteName: siteName,
            json: json[key],
            html: html[`../reports/${siteName}/report.html`]
        });
    });
}