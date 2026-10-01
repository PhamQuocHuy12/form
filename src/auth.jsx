import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Check, Dumbbell, LockKeyhole, Mail } from "lucide-react";

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

export function AuthScreen({ auth }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  function changeMode(next) {
    setMode(next);
    setError("");
    setMessage("");
    setPassword("");
  }
  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      if (mode === "reset") {
        await sendPasswordResetEmail(auth, email.trim());
        setMessage(
          "If an account uses that email, you’ll receive a password reset link.",
        );
      } else if (mode === "signup")
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      else await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword("");
    } catch (err) {
      if (mode === "reset" && err.code === "auth/user-not-found")
        setMessage(
          "If an account uses that email, you’ll receive a password reset link.",
        );
      else setError(authError(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-page">
      <header className="auth-brand">
        <span className="brand-mark">
          <Dumbbell size={23} />
        </span>
        <strong>FORM</strong>
      </header>
      <main className="auth-layout">
        <section className="auth-intro">
          <div className="eyebrow">
            <span /> YOUR TRAINING, WITH YOU
          </div>
          <h1>
            Same focus.
            <br />
            Wherever you train.
          </h1>
          <p>
            Keep your workout plan, every logged set, and your progress together
            across devices.
          </p>
          <div className="auth-benefit">
            <Check size={18} />
            Your weekly plan
          </div>
          <div className="auth-benefit">
            <Check size={18} />
            Your weights and workout notes
          </div>
          <div className="auth-benefit">
            <Check size={18} />
            Your personal records
          </div>
        </section>
        <section className="auth-card">
          <div className="auth-lock">
            <LockKeyhole size={24} />
          </div>
          <h2>
            {mode === "signup"
              ? "Start your training log"
              : mode === "reset"
                ? "Reset your password"
                : "Welcome back"}
          </h2>
          <p>
            {mode === "signup"
              ? "Create an account to keep your progress with you."
              : mode === "reset"
                ? "We’ll send a link to help you get back in."
                : "Sign in to pick up where you left off."}
          </p>
          <form onSubmit={submit}>
            <label>
              Email
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy}
                placeholder="you@example.com"
              />
            </label>
            {mode !== "reset" && (
              <label>
                Password
                <input
                  type="password"
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  required
                  minLength={mode === "signup" ? 6 : 1}
                  maxLength={4096}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={busy}
                  placeholder={
                    mode === "signup"
                      ? "At least 6 characters"
                      : "Your password"
                  }
                />
              </label>
            )}
            {mode === "signin" && (
              <button
                className="auth-text-button"
                type="button"
                disabled={busy}
                onClick={() => changeMode("reset")}
              >
                Forgot password?
              </button>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            {message && (
              <p className="auth-message" role="status">
                <Mail size={18} />
                {message}
              </p>
            )}
            <button className="button primary full-width" disabled={busy}>
              {busy
                ? "Please wait…"
                : mode === "signup"
                  ? "Create account"
                  : mode === "reset"
                    ? "Send reset link"
                    : "Sign in"}
            </button>
          </form>
          <div className="auth-switch">
            {mode === "signin" ? (
              <>
                New to FORM?{" "}
                <button disabled={busy} onClick={() => changeMode("signup")}>
                  Create an account
                </button>
              </>
            ) : (
              <button disabled={busy} onClick={() => changeMode("signin")}>
                Back to sign in
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
