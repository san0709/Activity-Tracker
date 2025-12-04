// AICopyReport.jsx
import React, { useState } from "react";
import { GEMINI_API_KEY } from "../config";
import { formatDuration } from "../utils";

function AICopyReport({ totalWork, totalBreak, totalLogged, dailyEntries, setNotification }) {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState("");

    const generateReport = async () => {
        setLoading(true);
        if (!GEMINI_API_KEY) {
            setReport("Gemini API key not provided. Please add your key to the GEMINI_API_KEY constant.");
            setLoading(false);
            return;
        }

        // Mock generation for testing if key is the placeholder "generateAtoZ()"
        if (GEMINI_API_KEY === "generateAtoZ()") {
            setTimeout(() => {
                const mockReport = `[MOCK REPORT] Today, the employee logged a total of ${formatDuration(totalLogged)}. Work activities included handling cases (e.g., ${dailyEntries.filter(e => e.activity === 'Work').map(e => e.caseNumber).join(', ') || 'none'}) with a total work duration of ${formatDuration(totalWork)}. Break time totaled ${formatDuration(totalBreak)}. This summary is generated locally for testing purposes.`;
                setReport(mockReport);
                setLoading(false);
            }, 1000);
            return;
        }

        try {
            const payload = {
                systemInstruction: {
                    role: "system",
                    parts: [{ text: "You are a Workforce Management Analyst. Summarize the day in a single professional paragraph, including total work, break, and logged times, and mention any case numbers and process descriptions from Work activities." }]
                },
                contents: [{
                    role: "user",
                    parts: [{
                        text: JSON.stringify({ totalWork, totalBreak, totalLogged, dailyEntries })
                    }]
                }]
            };
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (data.error) {
                setReport(`API Error: ${data.error.message}`);
            } else {
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No report generated.";
                setReport(text);
            }
        } catch (err) {
            setReport(`Error generating report: ${err.message}`);
        }
        setLoading(false);
    };

    const copyToClipboard = () => {
        const textarea = document.createElement("textarea");
        textarea.value = report;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        if (setNotification) setNotification("Report copied to clipboard");
    };

    return (
        <div className="card p-3 shadow-sm">
            <h5>AI Powered Daily Shift Report</h5>
            <button className="btn btn-outline-primary mb-2" onClick={generateReport} disabled={loading}>
                {loading ? "Generating..." : "Generate Report"}
            </button>
            {report && (
                <>
                    <textarea className="form-control mb-2" rows={4} readOnly value={report} />
                    <button className="btn btn-success" onClick={copyToClipboard}>Copy Report</button>
                </>
            )}
        </div>
    );
}

export default AICopyReport;
