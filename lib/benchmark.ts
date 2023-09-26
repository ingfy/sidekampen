import fs from "fs";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const exists = promisify(fs.exists);

function normalizeSiteName(site: URL) {
  return site
    .toString()
    .replace(/https?:\/\//, "")
    .replace(/\//g, "");
}

export async function generateReport(
  site: URL,
  target: { html: string; json: string }
) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });

  try {
    const runnerResult = await lighthouse(site.toString(), {
      logLevel: "info",
      output: ["json", "html"],
      port: chrome.port,
    });
    if (!runnerResult) throw new Error("Missing runner result");

    // `.report` is the HTML report as a string
    const [reportJSON, reportHtml] = runnerResult.report;
    await writeFile(target.html, reportHtml);
    await writeFile(target.json, reportJSON);

    // `.lhr` is the Lighthouse Result as a JS object
    console.log("Report is done for", runnerResult.lhr.finalDisplayedUrl);
    console.log(
      "Performance score was",
      (runnerResult.lhr.categories.performance?.score ?? 0) * 100
    );
  } finally {
    chrome.kill();
  }
}

function partialPaths(p: string) {
  const resovled = path.resolve(p);
  const parsed = path.parse(resovled);

  const parts = resovled.slice(parsed.root.length).split(path.sep);
  return parts
    .slice(1)
    .reduce(
      (acc, part) => [...acc, [...acc[acc.length - 1], part]],
      [[parts[0]]]
    )
    .map((parts) => path.join(parsed.root, parts.join(path.sep)));
}

function isDescendant(from: string, p: string) {
  const result = !path.relative(from, p).startsWith("..");
  console.log("isDescendant", from, "->", p, "?", result);
  return result;
}

async function ensureDirectory(from: string, p: string) {
  const dirs = partialPaths(p).filter((dir) => isDescendant(from, dir));
  for (const part of dirs) {
    if (!(await exists(part))) {
      await mkdir(part);
    }
  }
}

interface SitesConfig {
  sites: string[];
}

async function main() {
  const sitesJSON = await readFile(path.join(__dirname, "../sites.json"));
  const config = JSON.parse(sitesJSON.toString()) as SitesConfig;
  for (const site of config.sites.map((x) => new URL(x))) {
    const dirname = path.resolve(
      path.join(__dirname, "..", "reports", normalizeSiteName(site))
    );
    await ensureDirectory(path.resolve(path.join(__dirname, "..")), dirname);
    await generateReport(site, {
      html: path.join(dirname, "report.html"),
      json: path.join(dirname, "report.json"),
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
