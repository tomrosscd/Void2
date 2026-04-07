import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import SnowLeopardLogin from "@/components/SnowLeopardLogin";

// localStorage key used to persist the unlocked state across sessions.
// Change this key if you want to force everyone to re-enter the password
// (e.g. after rotating the password).
const UNLOCK_KEY = "void_unlocked";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialise from localStorage so returning visitors skip the login screen.
  // Falls back to false (show login) if the key is absent or storage is unavailable.
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(UNLOCK_KEY) === "1";
    } catch {
      return false;
    }
  });

  const handleUnlock = () => {
    try {
      localStorage.setItem(UNLOCK_KEY, "1");
    } catch {
      // localStorage unavailable (private browsing, storage quota) — session-only unlock
    }
    setUnlocked(true);
  };

  return (
    <>
      {/* The existing frontend — always mounted so it's ready when login fades */}
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>

      {/* Snow Leopard login overlay — skipped entirely for returning visitors */}
      {!unlocked && <SnowLeopardLogin onUnlock={handleUnlock} />}
    </>
  );
}

export default App;
