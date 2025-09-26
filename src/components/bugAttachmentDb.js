import { ref, set, get, child } from "firebase/database";
import { db } from "../firebase";

// Save attachment URL to the bug in the database
export async function saveBugAttachmentUrl(projectId, bugId, url) {
  const bugRef = ref(db, `projects/${projectId}/bugs/${bugId}/attachments`);
  // For simplicity, just push a new URL (could be extended for multiple files)
  const snapshot = await get(bugRef);
  let attachments = snapshot.exists() ? snapshot.val() : [];
  if (!Array.isArray(attachments)) attachments = [];
  attachments.push(url);
  await set(bugRef, attachments);
}

// Get attachment URLs for a bug
export async function getBugAttachments(projectId, bugId) {
  const bugRef = ref(db, `projects/${projectId}/bugs/${bugId}/attachments`);
  const snapshot = await get(bugRef);
  return snapshot.exists() ? snapshot.val() : [];
}
