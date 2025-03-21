import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function ReportUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        alert("User not authenticated. Please log in.");
      } else {
        setUserId(data.user.id);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
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
    if (!file || !userId) {
      alert("Please select a file and ensure you're logged in.");
      return;
    }

    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `reports/${fileName}`;

    const { error: uploadError } = await supabase.storage.from("reports").upload(filePath, file);
    if (uploadError) {
      alert("Upload failed.");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("reports").getPublicUrl(filePath);
    const fileUrl = urlData.publicUrl;

    const { error: dbError } = await supabase
      .from("Reports_table")
      .insert([{ User_id: userId, report_path: fileUrl }]);

    if (dbError) {
      alert("Database update failed.");
    } else {
      alert("Upload successful!");
      setFile(null);
      setPreview(null);
    }
    setUploading(false);
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
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Upload New Report</h2>
          <p className="text-sm text-gray-500 mb-4">Supported formats: PNG, JPEG (Max: 10MB)</p>

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

          <textarea
            className="w-full border rounded-md p-3 mt-4 text-sm"
            placeholder="Add any additional information about allergies..."
          ></textarea>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
          >
            {uploading ? "Uploading..." : "Upload Report"}
          </button>
        </div>

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
