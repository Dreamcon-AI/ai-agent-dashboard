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
    files: {
      w4: null,
      i9: null,
      orw4: null,
      directDeposit: null,
      drugScreen: null,
      handbook: null
    }
  });

  const [scanResult, setScanResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, field) => {
    setFormData({
      ...formData,
      files: { ...formData.files, [field]: e.target.files[0] },
    });
  };

  const handleSubmit = () => {
    // Simulate sending contact info to Directory Agent
    console.log("Sending to Directory:", {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
    });

    if (window.__DirectoryAgent__?.receive) {
      window.__DirectoryAgent__.receive({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
      });
    }

    // Simulate basic online check
    setScanResult("No public red flags found. Web scan completed.");
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
                Collects employee info, uploads documents, and runs light online scan.
              </p>
            </div>
          </div>

          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="text" name="payRate" placeholder="Pay Rate" value={formData.payRate} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="text" name="position" placeholder="Position" value={formData.position} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} className="border p-2 rounded" />
          <label className="font-semibold text-gray-700">Birthdate</label>
          <input type="date" name="birthdate" value={formData.birthdate} onChange={handleInputChange} className="border p-2 rounded" />
          <input type="password" name="ssn" placeholder="SSN" value={formData.ssn} onChange={handleInputChange} className="border p-2 rounded" />

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
                  onChange={(e) => handleFileChange(e, field)}
                  className="border p-2 rounded bg-white"
                />
              </div>
            ))}
          </div>

          <Button onClick={handleSubmit} className="mt-6">
            <RocketIcon className="mr-2 h-4 w-4" /> Submit
          </Button>

          {scanResult && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
              Online Scan Result: {scanResult}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingAgent;

