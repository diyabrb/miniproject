import { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { supabase } from "../supabaseClient"; // Ensure correct import

export default function ReportUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // Cleanup to avoid memory leaks
    }
  }, [file]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }

    if (selectedFile.type === "image/png" || selectedFile.type === "image/jpeg") {
      setFile(selectedFile);
    } else {
      alert("Only PNG and JPEG images are allowed.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `reports/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage.from("reports").upload(filePath, file);

    setUploading(false);

    if (error) {
      console.error("Upload error:", error.message);
      alert("Upload failed. Try again.");
      return;
    }

    // Get the public URL of the uploaded file
    const { data: fileData } = supabase.storage.from("reports").getPublicUrl(filePath);
    console.log("Uploaded file URL:", fileData.publicUrl);

    alert("File uploaded successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900">
        Nutrition <span className="font-light">Report Upload</span>
      </h1>
      <p className="text-gray-600 mt-2">
        Upload your nutrition report images to generate insightful analytics.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        {/* Upload Section */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Upload New Report</h2>
          <p className="text-sm text-gray-500 mb-4">Supported formats: PNG, JPEG (Max: 10MB)</p>

          {/* Upload Box */}
          <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-10 cursor-pointer hover:border-green-500 transition">
            <input
              type="file"
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
            <FaCloudUploadAlt className="text-4xl text-green-500 mb-2" />
            <p className="text-gray-600">Click to upload or drag and drop</p>
          </label>

          {/* File Preview */}
          {preview && (
            <div className="mt-4">
              <p className="text-sm font-medium">Selected File:</p>
              <img
                src={preview}
                alt="Preview"
                className="mt-2 rounded-lg shadow-md w-full max-h-40 object-cover"
              />
            </div>
          )}

          {/* Additional Notes */}
          <textarea
            className="w-full border rounded-md p-3 mt-4 text-sm"
            placeholder="Add any additional information about allergies..."
          ></textarea>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`mt-4 w-full py-2 rounded-md transition ${
              uploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {uploading ? "Uploading..." : "Upload Report"}
          </button>
        </div>

        {/* Analysis Section */}
        <div>
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Progress Tracking</h2>
            <Bar
              data={{
                labels: ["Report1", "Report2", "Report3"],
                datasets: [
                  { label: "Label 1", data: [30, 40, 25], backgroundColor: "#4CAF50" },
                  { label: "Label 2", data: [35, 45, 20], backgroundColor: "#FFEB3B" },
                  { label: "Label 3", data: [25, 35, 15], backgroundColor: "#8BC34A" },
                ],
              }}
              options={{ responsive: true, plugins: { legend: { position: "top" } } }}
            />
          </div>

          {/* All Reports Section */}
          <div className="mt-6 bg-white shadow-md p-6 rounded-lg text-center">
            <h2 className="text-lg font-semibold">All Reports</h2>
            <p className="text-sm text-gray-500 mt-1">
              View all your nutrition reports in one place.
            </p>
            <button className="mt-3 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition">
              View All Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
