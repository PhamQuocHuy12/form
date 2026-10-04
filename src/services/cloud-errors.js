export function cloudError(error, operation) {
  if (error?.code === "permission-denied" && operation === "appearance")
    return "Theme sync is unavailable. Publish the latest firestore.rules in Firebase Console → Firestore Database → Rules to enable appearance preferences, then retry.";
  if (error?.code === "permission-denied" && operation === "plan")
    return "Plan saving was denied. Check that the latest firestore.rules are published in Firebase Console → Firestore Database → Rules, including support for custom weekdays and exercises. Your selections are still open; retry after publishing.";
  if (error?.code === "permission-denied" && operation === "workout")
    return "This workout could not be changed. Publish the latest firestore.rules in Firebase Console → Firestore Database → Rules to enable editing and deletion, then retry.";
  if (error?.code === "permission-denied")
    return "Cloud access was denied. Publish the latest firestore.rules in Firebase Console → Firestore Database → Rules, including the routines path for custom exercises, then retry.";
  if (error?.code === "unavailable")
    return "Cloud storage is unavailable. Check your connection and try again.";
  return "Your cloud data could not be loaded or saved. Please try again.";
}

export function confirmWrite(promise, operation) {
  // Firestore queues writes offline. Keep the draft if server acknowledgement is delayed.
  let timeout;
  const deadline = new Promise((_, reject) => {
    timeout = setTimeout(
      () =>
        reject(
          new Error(
            operation === "appearance"
              ? "Theme saving could not be confirmed. Keep this dialog open and retry when you’re connected."
              : "Saving could not be confirmed. Keep your workout open and retry when you’re connected.",
          ),
        ),
      15000,
    );
  });
  return Promise.race([promise, deadline])
    .catch((error) => {
      if (error.code) throw new Error(cloudError(error, operation));
      throw error;
    })
    .finally(() => clearTimeout(timeout));
}
