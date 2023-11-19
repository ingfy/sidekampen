import type { Result as LighthouseReport } from "lighthouse";
import { useRef, useState } from "react";
import ReactDOM from "react-dom";
import classes from "./Details.module.css";

export function DetailsButton({
  report,
  children,
}: {
  report: LighthouseReport;
  children: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          dialog.current?.showModal();
        }}
      >
        {children}
      </button>
      {typeof document === "object"
        ? ReactDOM.createPortal(
            <dialog ref={dialog}>
              <form method="dialog">
                <table>
                  <tbody>
                    <tr>
                      <th>URL</th>
                      <td colSpan={2}>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={report.finalDisplayedUrl}
                        >
                          {report.finalDisplayedUrl}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <th>Fetch Time</th>
                      <td>{new Date(report.fetchTime).toLocaleDateString()}</td>
                      <td>{new Date(report.fetchTime).toLocaleTimeString()}</td>
                    </tr>
                  </tbody>
                </table>
                <button>Lukk</button>
              </form>
            </dialog>,
            document.body
          )
        : null}
    </>
  );
}
