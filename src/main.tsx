import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import "./assets/css/index.css";

// the admin never loads for a normal visitor
const Admin = lazy(() => import("./admin/Admin.tsx"));
/* Case studies are plain DOM. Keeping them out of the landing chunk means they
   load fast and never pull three.js with them. There is no separate work index
   any more: the index is the landing page. */
const Project = lazy(() => import("./pages/Project.tsx"));
// an alternative shell over the same content, on its own route and its own chunk
const Mac = lazy(() => import("./mac/Mac.tsx"));
const Ubuntu = lazy(() => import("./ubuntu/Ubuntu.tsx"));
const Windows = lazy(() => import("./win/Windows.tsx"));
// fixture harness, dev only: tree-shaken out of the production bundle
const Preview = import.meta.env.DEV ? lazy(() => import("./pages/Preview.tsx")) : null;

/* This is the entry file: it mounts the app and exports nothing, so the
   fast-refresh rule cannot apply. The rule started firing when `Lazy`
   was added here alongside the route table. */
// eslint-disable-next-line react-refresh/only-export-components
function Lazy({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="grid min-h-[100svh] place-items-center bg-void"><span className="hud">Loading</span></div>}>
      {children}
    </Suspense>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/work/:slug" element={<Lazy><Project /></Lazy>} />
        <Route path="/mac" element={<Lazy><Mac /></Lazy>} />
        <Route path="/ubuntu" element={<Lazy><Ubuntu /></Lazy>} />
        <Route path="/windows" element={<Lazy><Windows /></Lazy>} />
        <Route path="/admin" element={<Lazy><Admin /></Lazy>} />
        {Preview && <Route path="/preview" element={<Lazy><Preview /></Lazy>} />}
        {/* an unknown address lands on the work rather than on nothing */}
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
