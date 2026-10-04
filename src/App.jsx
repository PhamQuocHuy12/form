import React from "react";
import { auth, firebaseConfigurationError } from "./services/firebase.js";
import { AuthPage } from "./pages/AuthPage.jsx";
import { useAuthAccount } from "./hooks/useAuthAccount.js";
import { SetupPage } from "./pages/SetupPage.jsx";
import { WorkoutApp } from "./WorkoutApp.jsx";

export function App() {
  const { account, store } = useAuthAccount();
  if (firebaseConfigurationError || account.error)
    return <SetupPage error={firebaseConfigurationError || account.error} />;
  if (!account.ready)
    return <div className="loading">Restoring your sign-in…</div>;
  if (!account.user) return <AuthPage auth={auth} />;
  return (
    <WorkoutApp key={account.user.uid} store={store} user={account.user} />
  );
}
