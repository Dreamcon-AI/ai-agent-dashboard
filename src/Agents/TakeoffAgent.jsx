// Updated TakeoffAgent.jsx UI with plan and spec thumbnails side-by-side
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button.js";
import { Textarea } from "../components/ui/Textarea.jsx";
import { Card, CardContent } from "../components/ui/card.js";
import { useToast } from "../components/ui/use-toast.js";
import { FileUploader } from "../components/custom/FileUploader.jsx";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function TakeoffAgent() {
  const { toast } = useToast();

  const [description, setDescription] = useState("");
  const [planFile, setPlanFile] = useState(null);
  const [specFile, setSpecFile] = useState(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const planCanvasRef = useRef(null);
  const specCanvasRef = useRef(null);
  const [planPages, setPlanPages] = useState(0);
  const [planCurrentPage, setPlanCurrentPage] = useState(1);
  const [specPages, setSpecPages] = useState(0);
  const [specCurrentPage, setSpecCurrentPage] = useState(1);

  useEffect(() => {
    const renderPDF = async (file, canvasRef, setPageCount, pageNum) => {
      if (!file || !canvasRef.current) return;

      const fileReader = new FileReader();
      fileReader.onload = async function () {
        try {
          const typedArray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
          setPageCount(pdf.numPages);

          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport }).promise;
        } catch (err) {
          console.error("Error rendering PDF:", err);
        }
      };
      fileReader.readAsArrayBuffer(file);
    };

    renderPDF(planFile, planCanvasRef, setPlanPages, planCurrentPage);
  }, [planFile, planCurrentPage]);

  useEffect(() => {
    const renderPDF = async (file, canvasRef, setPageCount, pageNum) => {
      if (!file || !canvasRef.current) return;

      const fileReader = new FileReader();
      fileReader.onload = async function () {
        try {
          const typedArray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
          setPageCount(pdf.numPages);

          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport }).promise;
        } catch (err) {
          console.error("Error rendering PDF:", err);
        }
      };
      fileReader.readAsArrayBuffer(file);
    };

    renderPDF(specFile, specCanvasRef, setSpecPages, specCurrentPage);
  }, [specFile, specCurrentPage]);

const handleRunEstimate = async () => {
  if (!planFile) {
    toast({ title: "Please upload a plan file." });
    return;
  }

  const formData = new FormData();
  formData.append("plans", planFile);
  if (specFile) formData.append("specs", specFile);

  // 🔍 Paste this right after creating the formData
  for (let pair of formData.entries()) {
    console.log("🧾 FormData Field:", pair[0], pair[1]);
  }

  setLoading(true);
  setOutput("");

  try {
    const backendUrl = "http://localhost:3002";
    const response = await fetch('http://localhost:3002/analyze', {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Server returned an error");

    const data = await response.json();
    setOutput(data.result || "✅ Plan processed, but no output returned.");
  } catch (error) {
    console.error("Takeoff error:", error);
    toast({ title: "Failed to analyze plan file." });
  } finally {
    setLoading(false);
  }
};


  return (
    <Card className="w-full shadow-xl rounded-2xl p-4">
      <CardContent className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">📐 Takeoff Agent</h2>

        <Textarea
          placeholder="Describe scope (e.g., 10' tall CLF with 3 rails and 2 gates)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <FileUploader label="Upload Plan PDF" file={planFile} onFileChange={setPlanFile} />
        <FileUploader label="Upload Specifications PDF/DOC" file={specFile} onFileChange={setSpecFile} />

        <Button onClick={handleRunEstimate} disabled={loading}>
          {loading ? "Running..." : "Run Estimate"}
        </Button>

        <div className="flex gap-4 mt-4">
          <div className="flex gap-4">
            {planFile && (
              <div className="w-[200px]">
                <h3 className="text-md font-semibold text-black mb-1">Plan Preview</h3>
                <canvas ref={planCanvasRef} className="border rounded shadow mb-1 max-w-full h-auto" />
                <div className="flex justify-between text-xs text-black">
                  <button
                    disabled={planCurrentPage <= 1}
                    onClick={() => setPlanCurrentPage((p) => p - 1)}
                    className="bg-gray-300 px-2 py-1 rounded disabled:opacity-50"
                  >◀ Prev</button>
                  <span>Page {planCurrentPage} of {planPages}</span>
                  <button
                    disabled={planCurrentPage >= planPages}
                    onClick={() => setPlanCurrentPage((p) => p + 1)}
                    className="bg-gray-300 px-2 py-1 rounded disabled:opacity-50"
                  >Next ▶</button>
                </div>
              </div>
            )}

            {specFile && (
              <div className="w-[200px]">
                <h3 className="text-md font-semibold text-black mb-1">Spec Preview</h3>
                <canvas ref={specCanvasRef} className="border rounded shadow mb-1 max-w-full h-auto" />
                <div className="flex justify-between text-xs text-black">
                  <button
                    disabled={specCurrentPage <= 1}
                    onClick={() => setSpecCurrentPage((p) => p - 1)}
                    className="bg-gray-300 px-2 py-1 rounded disabled:opacity-50"
                  >◀ Prev</button>
                  <span>Page {specCurrentPage} of {specPages}</span>
                  <button
                    disabled={specCurrentPage >= specPages}
                    onClick={() => setSpecCurrentPage((p) => p + 1)}
                    className="bg-gray-300 px-2 py-1 rounded disabled:opacity-50"
                  >Next ▶</button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 max-h-[600px] overflow-auto bg-gray-100 p-4 rounded-md whitespace-pre-wrap text-black">
            {output || "Upload a file and click Run Estimate to begin."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


