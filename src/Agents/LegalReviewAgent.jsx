import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { getDocument } from "pdfjs-dist/build/pdf";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function LegalReviewAgent({ open, onClose, agent, dept }) {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [gcFile, setGcFile] = useState(null);
  const [zochertFile, setZochertFile] = useState(null);

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    return fullText;
  };

  const runLegalComparison = async () => {
    setIsRunning(true);
    setOutput("Analyzing contract and proposal...");

    if (!gcFile || !zochertFile) {
      setOutput("⚠️ Please upload both the GC contract and Zochert proposal.");
      setIsRunning(false);
      return;
    }

    try {
      const gcText = await extractTextFromPDF(gcFile);
      const zochertText = await extractTextFromPDF(zochertFile);

      let manualFlags = [];

      if (!gcText.toLowerCase().includes("general liability")) {
        manualFlags.push("⚠️ Missing 'General Liability' clause in GC contract.");
      }
      if (!gcText.toLowerCase().includes("indemnify")) {
        manualFlags.push("⚠️ No indemnity language found in GC contract.");
      }
      if (!gcText.toLowerCase().includes("payment terms") && !gcText.toLowerCase().includes("net")) {
        manualFlags.push("⚠️ No clear payment terms in GC contract.");
      }

      const res = await fetch("/api/legal-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gcText, zochertText }),
      });

      const data = await res.json();

      if (data?.choices?.[0]?.message?.content) {
        setOutput(`🧠 AI Legal Review:\n\n${manualFlags.join("\n")}\n\n${data.choices[0].message.content}`);
      } else {
        console.error(data);
        setOutput("⚠️ Failed to retrieve analysis from AI.");
      }
    } catch (err) {
      console.error(err);
      setOutput("❌ Error processing PDF files or connecting to server.");
    }

    setIsRunning(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-600 text-white top-[10%] left-1/2 transform -translate-x-1/2 p-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black">⚖️ {agent}</DialogTitle>
          <DialogDescription className="text-sm text-black mt-1">
            This AI agent supports the <strong>{dept}</strong> department.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <label htmlFor="gc-upload" className="text-sm font-medium text-black">
            Upload GC Contract (PDF)
          </label>
          <input
            type="file"
            accept="application/pdf"
            id="gc-upload"
            onChange={(e) => setGcFile(e.target.files[0])}
            className="w-full mt-1 block"
          />
          {gcFile && (
            <p className="text-sm text-gray-600 mt-1">
              Uploaded: {gcFile.name.slice(0, 15)}{gcFile.name.length > 15 ? "…" : ""}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="zochert-upload" className="text-sm font-medium text-black">
            Upload Zochert Proposal (PDF)
          </label>
          <input
            type="file"
            accept="application/pdf"
            id="zochert-upload"
            onChange={(e) => setZochertFile(e.target.files[0])}
            className="w-full mt-1 block"
          />
          {zochertFile && (
            <p className="text-sm text-gray-600 mt-1">
              Uploaded: {zochertFile.name.slice(0, 15)}{zochertFile.name.length > 15 ? "…" : ""}
            </p>
          )}
        </div>

        <div>
          <Button
            onClick={runLegalComparison}
            disabled={isRunning}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reviewing...
              </>
            ) : (
              `🚀 Run ${agent}`
            )}
          </Button>

          {output && (
            <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-100 whitespace-pre-wrap mt-4">
              {output}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
