import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

// Upload a file to Firebase Storage and return the download URL
export async function uploadFile(file, path = "uploads/") {
  const storageRef = ref(storage, path + file.name);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// Download a file from Firebase Storage by path
export async function getFileUrl(path) {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}
