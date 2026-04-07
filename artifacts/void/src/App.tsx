import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import SnowLeopardLogin from "@/components/SnowLeopardLogin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Gate state — the Snow Leopard login screen sits in front of the app until
  // the correct password is entered. Once unlocked the login overlay fades out
  // and is unmounted, leaving the original frontend completely unchanged.
  const [unlocked, setUnlocked] = useState(false);

  return (
    <>
      {/* The existing frontend — always mounted so it's ready when login fades */}
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>

      {/* Snow Leopard login overlay — rendered on top until dismissed */}
      {!unlocked && <SnowLeopardLogin onUnlock={() => setUnlocked(true)} />}
    </>
  );
}

export default App;
