import { ref, push, set, onValue, remove } from "firebase/database";
import { db } from "../firebase";

// Add a new bug to the database
export function addBug(bug) {
  const bugsRef = ref(db, "bugs");
  const newBugRef = push(bugsRef);
  return set(newBugRef, bug);
}

// Listen for bug list changes
export function listenForBugs(callback) {
  const bugsRef = ref(db, "bugs");
  return onValue(bugsRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : []);
  });
}

// Remove a bug by id
export function removeBug(id) {
  const bugRef = ref(db, `bugs/${id}`);
  return remove(bugRef);
}
