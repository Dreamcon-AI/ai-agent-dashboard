"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ComplianceAgent() {
  const [openSections, setOpenSections] = useState({});
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/compliance");
      const data = await res.json();
      setDocs(data);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setUploadResult(null);

      const res = await fetch("/api/compliance/upload", {
        method: "POST",
        body: formData,
      });

      const body = await res.json();
      if (!res.ok) {
        console.error("Upload failed:", body);
        alert("Upload failed: " + (body.detail || body.error));
        return;
      }

      console.log("✅ Upload success:", body);
      setUploadResult(body.metadata || { message: "Upload succeeded." });
      await fetchDocs(); // Refresh dashboard
    } catch (err) {
      console.error("Unexpected upload error:", err);
      alert("Upload error. See console for details.");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const res = await fetch("/api/compliance/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const body = await res.json();
      if (!res.ok) {
        console.error("Search failed:", body);
        alert("Search failed: " + (body.detail || body.error));
        return;
      }

      setSearchResult(body.answer || "No relevant compliance data found.");
    } catch (err) {
      console.error("Unexpected search error:", err);
      alert("Search error. See console for details.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📋 Compliance Dashboard</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about licenses, insurance limits, endorsements..."
          className="w-full p-2 border border-gray-400 rounded mb-2 text-black"
        />
        <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 w-full">
          🔍 Search Compliance
        </Button>
        {searchResult && (
          <div className="mt-4 p-4 border border-gray-300 rounded bg-white text-black">
            <strong>AI Response:</strong>
            <pre className="whitespace-pre-wrap text-sm mt-2">{searchResult}</pre>
          </div>
        )}
      </div>

      {/* Upload */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">📤 Upload Compliance Document</h2>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
        />
        <Button
          onClick={handleFileUpload}
          disabled={!file || uploading}
          className="bg-green-600 hover:bg-green-700 w-full"
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {uploadResult && (
        <div className="mt-4 p-4 border border-green-300 bg-green-50 rounded text-black">
          <strong>✅ Full Metadata Extracted:</strong>
          <pre className="whitespace-pre-wrap text-sm mt-2">{JSON.stringify(uploadResult, null, 2)}</pre>
        </div>
      )}

      {/* Dashboard */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">📄 Stored Compliance Documents</h2>
        {loading ? (
          <p className="text-gray-500">Loading documents...</p>
        ) : docs.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          docs.map((doc, i) => (
            <Card key={i} className="mb-3 text-black">
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p><strong>{doc.license_title || doc.document_type}</strong></p>
                    <p className="text-sm">Expires: {doc.expiration_date || "N/A"}</p>
                  </div>
                  <button onClick={() => toggleSection(i)}>
                    {openSections[i] ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>
                {openSections[i] && (
                  <div className="mt-2 pl-4 text-sm">
                    <p><strong>Type:</strong> {doc.document_type}</p>
                    <p><strong>License #:</strong> {doc.license_number}</p>
                    <p><strong>Location:</strong> {doc.location}</p>
                    <p><strong>Company:</strong> {doc.company_name}</p>
                    <p><strong>Expires:</strong> {doc.expiration_date}</p>
                    {doc.general_aggregate && <p><strong>Aggregate Limit:</strong> {doc.general_aggregate}</p>}
                    {doc.each_occurrence && <p><strong>Occurrence Limit:</strong> {doc.each_occurrence}</p>}
                    {doc.policy && (
                      <>
                        <p className="mt-2"><strong>Policies:</strong></p>
                        <ul className="list-disc ml-6">
                          {doc.policy.map((p, idx) => (
                            <li key={idx}>{p.type}: {p.limit}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
