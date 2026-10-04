import {
  authPage,
  authBrand,
  authLayout,
  authIntro,
  authBenefit,
  authCard,
  authLock,
  authTextButton,
  authMessage,
  authSwitch,
} from "./AuthPage.styles.js";
import { brandMark } from "../../components/layout/Brand/Brand.styles.js";
import { mainContent } from "../../components/layout/AppLayout/AppLayout.styles.js";
import {
  eyebrow,
  pageTitle,
} from "../../components/common/styles/Typography.styles.js";
import { field } from "../../components/common/styles/FormControls.styles.js";
import { formError } from "../../components/common/styles/FormFeedback.styles.js";
import { Button } from "../../components/common/Button/Button.jsx";
import React, { useState } from "react";
import { InstallApp } from "../../components/layout/InstallApp/InstallApp.jsx";
import { Check, Dumbbell, LockKeyhole, Mail } from "lucide-react";

import {
  authError,
  createAccount,
  resetPassword,
  signIn,
} from "../../services/auth.js";

export function AuthPage({ auth }) {
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
        await resetPassword(auth, email.trim());
        setMessage(
          "If an account uses that email, you’ll receive a password reset link.",
        );
      } else if (mode === "signup")
        await createAccount(auth, email.trim(), password);
      else await signIn(auth, email.trim(), password);
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
    <div className={`${authPage} auth-page`}>
      <header className={`${authBrand} auth-brand`}>
        <span className={`${brandMark} brand-mark`}>
          <Dumbbell size={23} />
        </span>
        <strong>FORM</strong>
        <InstallApp />
      </header>
      <main className={`${authLayout} ${mainContent} auth-layout`}>
        <section className={`${authIntro} auth-intro`}>
          <div className={`${eyebrow} eyebrow`}>
            <span /> YOUR TRAINING, WITH YOU
          </div>
          <h1 className={pageTitle}>
            Same focus.
            <br />
            Wherever you train.
          </h1>
          <p>
            Keep your workout plan, every logged set, and your progress together
            across devices.
          </p>
          <div className={`${authBenefit} auth-benefit`}>
            <Check size={18} />
            Your weekly plan
          </div>
          <div className={`${authBenefit} auth-benefit`}>
            <Check size={18} />
            Your weights and workout notes
          </div>
          <div className={`${authBenefit} auth-benefit`}>
            <Check size={18} />
            Your personal records
          </div>
        </section>
        <section className={`${authCard} auth-card`}>
          <div className={`${authLock} auth-lock`}>
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
                className={field}
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
                  className={field}
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
                className={`${authTextButton} auth-text-button`}
                type="button"
                disabled={busy}
                onClick={() => changeMode("reset")}
              >
                Forgot password?
              </button>
            )}
            {error && (
              <p className={`${formError} form-error`} role="alert">
                {error}
              </p>
            )}
            {message && (
              <p className={`${authMessage} auth-message`} role="status">
                <Mail size={18} />
                {message}
              </p>
            )}
            <Button variant="primary" type="submit" fullWidth disabled={busy}>
              {busy
                ? "Please wait…"
                : mode === "signup"
                  ? "Create account"
                  : mode === "reset"
                    ? "Send reset link"
                    : "Sign in"}
            </Button>
          </form>
          <div className={`${authSwitch} auth-switch`}>
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
