import React, { useState } from "react";
import { uploadFile } from "./storageUtils";
import { saveBugAttachmentUrl } from "./bugAttachmentDb";

export default function BugAttachmentUpload({ projectId, bugId, onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const path = `projects/${projectId}/bugs/${bugId}/attachments/${file.name}`;
  const url = await uploadFile(file, path);
  await saveBugAttachmentUrl(projectId, bugId, url);
  setFile(null);
  if (onUpload) onUpload(url);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form className="flex items-center gap-2 mt-2" onSubmit={handleUpload}>
      <input
        type="file"
        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-700 file:text-white hover:file:bg-blue-800"
        onChange={handleFileChange}
        accept="image/*,application/pdf"
      />
      <button
        type="submit"
        className="px-3 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 transition disabled:opacity-60"
        disabled={loading || !file}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
      {error && <span className="text-red-400 text-xs ml-2">{error}</span>}
    </form>
  );
}
