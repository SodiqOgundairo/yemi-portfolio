import { Component, type ErrorInfo, type ReactNode } from "react";

/* The second of two guards, and the two are not redundant.
 *
 *   index.html  a failure BEFORE React runs: a module-scope throw, a chunk
 *               that 404s, a bundle that never arrives. Inline, so it still
 *               works when the bundle is the thing that broke.
 *   this file   a failure AFTER mount: any render-time throw in the tree.
 *
 * Neither can stand in for the other. A boundary cannot catch a throw that
 * happened before it was ever constructed, and the inline guard cannot see a
 * component that renders and then dies. */

/** A chunk that fails to import is nearly always a tab left open across a
 *  redeploy, pointing at a filename that no longer exists. That is a reload,
 *  not a fault, and saying so beats a generic apology. */
function isStaleChunk(e: unknown) {
  const m = e instanceof Error ? e.message : String(e);
  return /dynamically imported module|Importing a module script failed|Loading chunk|ChunkLoadError|Failed to fetch/i.test(m);
}

type Props = { children: ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // The console is the only reporter this site has. Keep the component
    // stack: without it a minified message names nothing useful.
    console.error("Render failed:", error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const stale = isStaleChunk(error);
    return (
      <div className="fixed inset-0 z-[300] flex flex-col justify-center bg-void px-gutter">
        <span className="hud absolute left-gutter top-5 text-bone">Ogundairo</span>
        <div className="flex max-w-xl flex-col gap-5">
          <h1 className="display text-section">
            {stale ? "This page moved on." : "Something broke."}
          </h1>
          <p className="text-lead leading-relaxed text-ghost">
            {stale
              ? "The site was updated while this tab was open, so part of it is no longer where the page expects. A reload picks up the new version."
              : "A piece of the page failed while rendering. A reload usually fixes it."}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-6">
            <button
              onClick={() => location.reload()}
              className="border border-edge px-6 py-3 text-small text-bone transition-colors duration-[var(--dur-move)] hover:border-bone"
            >
              Reload
            </button>
            <a
              href="mailto:ogundairosodiq954@gmail.com"
              className="border-b border-edge pb-0.5 text-small text-ghost transition-colors duration-[var(--dur-move)] hover:text-bone"
            >
              Tell me it is broken
            </a>
          </div>
          <details className="mt-6">
            <summary className="hud cursor-pointer">Technical detail</summary>
            <pre className="mt-3 max-h-[40vh] overflow-auto whitespace-pre-wrap break-words border border-edge bg-ash p-3.5 font-mono text-micro leading-relaxed text-ghost">
              {error.message || String(error)}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}
