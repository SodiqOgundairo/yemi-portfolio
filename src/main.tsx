import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import "./assets/css/index.css";

// the admin never loads for a normal visitor
const Admin = lazy(() => import("./admin/Admin.tsx"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div className="p-10 hud">Loading admin…</div>}>
              <Admin />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
