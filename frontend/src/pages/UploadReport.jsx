import { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Tesseract from "tesseract.js";
import { supabase } from "../supabaseClient";

export default function ReportUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState("");
  const [progressData, setProgressData] = useState([]);
  

  useEffect(() => {
    fetchProgressData();
    fetchUserNotes();
  }, []);

  const fetchUserNotes = async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user?.id) return;
    const userId = authData.user.id;

    const { data: user } = await supabase
      .from("UserTable")
      .select("notes")
      .eq("auth_uid", userId)
      .single();
    
    if (user) setNotes(user.notes || "");
  };

  const updateUserNotes = async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user?.id) return;
    const userId = authData.user.id;

    const updates = { notes: notes };

    const { error } = await supabase
      .from("UserTable")
      .update(updates)
      .eq("auth_uid", userId);
    
    alert(error ? "Failed to update allergies" : "Allergies updated successfully!");
  };

  const fetchProgressData = async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user?.id) return;
    const userId = authData.user.id;

    const { data: reports } = await supabase
      .from("reports")
      .select("extracted_text, created_at")
      .eq("auth_uid", userId)
      .order("created_at", { ascending: true });

    const extractValues = (text) => {
      const patterns = {
        TSH: /TSH\s*[:\-]?\s*(\d+(\.\d+)?)/i,
        cholesterol: /cholesterol\s*[:\-]?\s*(\d+(\.\d+)?)/i,
        hemoglobin: /ha?emoglobin\s*[:\-]?\s*(\d+(\.\d+)?)/i,
        sugar: /sugar\s*[:\-]?\s*(\d+(\.\d+)?)/i,
      };

      let extracted = {};
      for (const key in patterns) {
        const match = text.match(patterns[key]);
        extracted[key] = match ? parseFloat(match[1]) : null;
      }
      return extracted;
    };

    const extractedValues = reports.map((report, index) => ({
      label: `Report ${index + 1}`,
      ...extractValues(report.extracted_text),
    }));

    setProgressData(extractedValues);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file before uploading.");

    setUploading(true);
    setMessage("");

    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user?.id) {
      setMessage("Authentication error. Please log in again.");
      setUploading(false);
      return;
    }
    const userId = authData.user.id;

    const fileExt = file.name.split(".").pop();
    const filePath = `reports/${userId}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("reports").upload(filePath, file);
    if (uploadError) {
      setMessage("Upload failed. Try again.");
      setUploading(false);
      return;
    }

    const { data: fileData } = supabase.storage.from("reports").getPublicUrl(filePath);
    const imageUrl = fileData.publicUrl;

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image.");

      const blob = await response.blob();
      const { data: ocrResult } = await Tesseract.recognize(blob, "eng");
      const extractedText = ocrResult?.text?.trim() || "";

      if (!extractedText) {
        setMessage("No readable text found.");
        setUploading(false);
        return;
      }

      await supabase.from("reports").insert([{ auth_uid: userId, extracted_text: extractedText, created_at: new Date() }]);
      setMessage("File uploaded & text extracted successfully!");
      fetchProgressData();
    } catch {
      setMessage("OCR failed. Try another image.");
    }

    setUploading(false);
  };
  

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900">
        Nutrition <span className="font-light">Report Upload</span>
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Upload New Report</h2>

          <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-10 cursor-pointer hover:border-green-500 transition">
            <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={(e) => setFile(e.target.files[0])} />
            <FaCloudUploadAlt className="text-4xl text-green-500 mb-2" />
            <p className="text-gray-600">Click to upload or drag and drop</p>
          </label>

          <textarea
            className="w-full mt-4 p-2 border rounded-md"
            placeholder="Add any additional information about allergies..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600" onClick={updateUserNotes}>
            Update Allergies
          </button>

          <button onClick={handleUpload} className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
            {uploading ? "Uploading..." : "Upload Report"}
          </button>

          <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Progress Tracking</h2>
          <Bar
            data={{
              labels: progressData.map((d) => d.label),
              datasets: progressData.length
                ? Object.keys(progressData[0] || {})
                    .filter((k) => k !== "label" && progressData.some((d) => d[k] !== null))
                    .flatMap((key) => {
                      const standardRanges = {
                        TSH: 2.5,
                        cholesterol: 162.5,
                        hemoglobin: 15.5,
                        sugar: 105,
                      };

                      return [
                        { label: `${key} (Actual)`, data: progressData.map((d) => d[key]), backgroundColor: "rgba(54, 162, 235, 0.6)" },
                        { label: `${key} (Standard)`, data: progressData.map((d) => (d[key] !== null ? standardRanges[key] : null)), backgroundColor: "rgba(255, 99, 132, 0.6)" },
                      ];
                    })
                : [],
            }}
            
          />
          {/* Standard Values Table */}
<h3 className="text-lg font-semibold mt-6">Standard Test Values</h3>
<table className="w-full mt-4 border-collapse border border-gray-300">
  <thead>
    <tr className="bg-gray-100">
      <th className="border border-gray-300 p-2">Test</th>
      <th className="border border-gray-300 p-2">Standard Value</th>
    </tr>
  </thead>
  <tbody>
    {[
      { name: "TSH", standard: 2.5 },
      { name: "Cholesterol", standard: 162.5 },
      { name: "Hemoglobin", standard: 15.5 },
      { name: "Sugar", standard: 105 },
    ].map((test) => (
      <tr key={test.name} className="border border-gray-300">
        <td className="border border-gray-300 p-2">{test.name}</td>
        <td className="border border-gray-300 p-2">{test.standard}</td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      </div>
    </div>
  );
}
