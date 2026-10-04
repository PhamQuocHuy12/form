const messages = {
  "auth/invalid-credential":
    "The email or password is incorrect. Please try again.",
  "auth/user-not-found":
    "The email or password is incorrect. Please try again.",
  "auth/wrong-password":
    "The email or password is incorrect. Please try again.",
  "auth/email-already-in-use":
    "An account already uses this email. Sign in or reset your password.",
  "auth/weak-password": "Use a stronger password with at least 6 characters.",
  "auth/password-does-not-meet-requirements":
    "This password does not meet your project’s password policy. Try a longer password with upper and lower case letters, numbers, and symbols.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/too-many-requests":
    "Too many attempts. Wait a moment before trying again.",
  "auth/network-request-failed":
    "Cannot connect to sign-in. Check your connection and try again.",
  "auth/operation-not-allowed":
    "Email/password sign-in needs to be enabled in Firebase Authentication.",
  "auth/configuration-not-found":
    "Firebase Authentication is not configured for this project. Open Firebase Console → Authentication → Get started, then enable Email/Password under Sign-in method. Check that your web configuration belongs to that same project.",
  "auth/invalid-api-key":
    "Firebase sign-in could not start. Check the web configuration and restart the app.",
  "auth/unauthorized-domain":
    "Add this app’s domain to Firebase Authentication’s authorized domains.",
};
export function authError(error) {
  return (
    messages[error?.code] || "Sign-in could not be completed. Please try again."
  );
}

export {
  createUserWithEmailAndPassword as createAccount,
  sendPasswordResetEmail as resetPassword,
  signInWithEmailAndPassword as signIn,
  onAuthStateChanged as watchAuthState,
  signOut,
} from "firebase/auth";
