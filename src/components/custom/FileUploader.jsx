import React from "react";

export function FileUploader({ label, file, onFileChange }) {
  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
      />
      {file && (
        <p className="text-sm text-gray-500 mt-1">
          📄 Selected: <strong>{file.name}</strong>
        </p>
      )}
    </div>
  );
}
