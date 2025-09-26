
import React, { useState } from "react";
import { uploadFile } from "./storageUtils";
import { saveBugAttachmentUrl } from "./bugAttachmentDb";
import { useSelector } from "react-redux";
import { hasPermission, PERMISSIONS } from "../utils/roleUtils";


export default function BugAttachmentUpload({ projectId, bugId, onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useSelector(state => state.user.user);
  const canUpload = hasPermission(user?.role, PERMISSIONS.UPLOAD_BUG_ATTACHMENT);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };


  const handleUpload = async (e) => {
    e.preventDefault();
    if (!canUpload) {
      setError("You do not have permission to upload attachments.");
      return;
    }
    if (!file) return;
    // File type validation
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only PNG, JPG, or PDF files are allowed.");
      return;
    }
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

  if (!canUpload) {
    return <div className="card card-disabled"><p className="card-message">Only QA users can upload attachments.</p></div>;
  }
  return (
    <form className="card bug-attachment-upload-form" onSubmit={handleUpload}>
      <input
        type="file"
        className="input"
        onChange={handleFileChange}
        accept=".png,.jpg,.jpeg,.pdf"
      />
      <button
        type="submit"
        className="btn btn-secondary"
        disabled={loading || !file}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
      {error && <span className="error-message">{error}</span>}
    </form>
  );
}
