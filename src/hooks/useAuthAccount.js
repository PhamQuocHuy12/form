import { useState, useEffect, useMemo } from "react";
import { authError, watchAuthState } from "../services/auth.js";
import { createCloudStore } from "../services/training-store.js";
import { auth, db } from "../services/firebase.js";

export function useAuthAccount() {
  const [account, setAccount] = useState({
    ready: !auth,
    user: null,
    error: "",
  });
  useEffect(() => {
    if (!auth) return;
    return watchAuthState(
      auth,
      (user) => setAccount({ ready: true, user, error: "" }),
      (error) =>
        setAccount({ ready: true, user: null, error: authError(error) }),
    );
  }, []);
  const store = useMemo(
    () => (account.user ? createCloudStore(db, account.user.uid) : null),
    [account.user?.uid],
  );
  return { account, store };
}
