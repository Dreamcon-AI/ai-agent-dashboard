import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { RocketIcon } from "lucide-react";

const OnboardingAgent = () => {
  const [formData, setFormData] = useState({
    name: "",
    payRate: "",
    position: "",
    phone: "",
    email: "",
    address: "",
    ssn: "",
    birthdate: "",
    company: "zochert",
    files: {
      w4: null,
      i9: null,
      orw4: null,
      directDeposit: null,
      drugScreen: null,
      handbook: null,
    },
  });

  const [scanResult, setScanResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    setFormData((prev) => ({
      ...prev,
      files: { ...prev.files, [field]: e.target.files[0] },
    }));
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();

      // Add form fields
      for (const key in formData) {
        if (key !== "files") {
          data.append(key, formData[key]);
        }
      }

      // Add files
      for (const key in formData.files) {
        if (formData.files[key]) {
          data.append(key, formData.files[key]);
        }
      }

      const response = await fetch("http://localhost:4001/api/onboarding", {
  method: "POST",
  body: data,
});

      const result = await response.json();

      if (result.success) {
        setScanResult(`Submission successful. Employee ID: ${result.employeeId}`);
        if (window.__DirectoryAgent__?.receive) {
          window.__DirectoryAgent__.receive({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            company: formData.company,
          });
        }
      } else {
        setScanResult("Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting onboarding:", error);
      setScanResult("Submission failed due to error.");
    }
  };

  return (
    <div className="p-4">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👩‍💼</span>
            <div>
              <h2 className="text-xl font-semibold">Onboarding Agent</h2>
              <p className="text-sm text-muted-foreground">
                Collects employee info, uploads documents, and stores them for directory access.
              </p>
            </div>
          </div>

          {/* Basic Info */}
          {[
            { name: "name", placeholder: "Full Name" },
            { name: "payRate", placeholder: "Pay Rate" },
            { name: "position", placeholder: "Position" },
            { name: "phone", placeholder: "Phone Number", type: "tel" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "address", placeholder: "Address" },
            { name: "birthdate", label: "Birthdate", type: "date" },
            { name: "ssn", placeholder: "SSN", type: "password" },
          ].map(({ name, placeholder, type = "text", label }) => (
            <div key={name}>
              {label && <label className="font-semibold text-gray-700">{label}</label>}
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
              />
            </div>
          ))}

          {/* File Uploads */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {[
              { label: "W-4", field: "w4" },
              { label: "I-9", field: "i9" },
              { label: "OR W-4", field: "orw4" },
              { label: "Direct Deposit", field: "directDeposit" },
              { label: "Drug Screen", field: "drugScreen" },
              { label: "Handbook Acknowledgment", field: "handbook" },
            ].map(({ label, field }) => (
              <div key={field} className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">{label}</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, field)}
                  className="border p-2 rounded bg-white"
                />
                {formData.files[field] && (
                  <embed
                    src={URL.createObjectURL(formData.files[field])}
                    type="application/pdf"
                    width="100%"
                    height="200px"
                    className="mt-2 border rounded"
                  />
                )}
              </div>
            ))}
          </div>

          <Button onClick={handleSubmit} className="mt-6">
            <RocketIcon className="mr-2 h-4 w-4" /> Submit
          </Button>

          {scanResult && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
              {scanResult}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingAgent;
