import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { REPO_URL } from '../data/navigation';

/**
 * Catches render errors so one bad page does not white-screen the site.
 *
 * There is no test suite here, and a thrown error in any component
 * unmounts the whole React tree and leaves an empty <div id="root">. On a
 * site people reach for emergency numbers, a blank page is the worst
 * possible failure: it looks like the site is gone rather than broken.
 *
 * Three deliberate constraints on the fallback:
 *
 *  - No translation. If i18next is what failed, useTranslation would throw
 *    again inside the fallback and produce the blank page this exists to
 *    prevent. English is a poor result; a white screen is a worse one.
 *  - No router. A plain <a> works whatever state react-router is in; a
 *    <Link> outside a working Router throws.
 *  - The hotlines link is a raw href, so it survives a broken client-side
 *    route table and just asks the server for the page again.
 *
 * Error boundaries only catch errors thrown while rendering. Anything in an
 * event handler or a promise still needs its own handling.
 */

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Nothing collects errors from real visitors yet, so the console is the
    // only place this is visible. It is still worth writing: it is what a
    // reporter will be asked to paste.
    console.error('BetterManila crashed while rendering:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="max-w-lg">
          {/* Plain text, not the logo image: the point of this screen is that
              it renders when other things have not, so it asks for nothing. */}
          <p className="text-sm font-semibold tracking-wide text-primary-800">
            BetterManila
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">
            This page broke
          </h1>
          <p className="mt-4 text-base text-gray-700">
            Something went wrong on our side, not yours. The rest of the site is
            probably fine — reloading usually fixes it.
          </p>
          <p className="mt-4 text-base text-gray-700">
            If you came here for an emergency number, go straight to{' '}
            <a
              href="/government/emergency/hotlines"
              className="font-medium text-primary-700 underline underline-offset-2 hover:text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:outline-none"
            >
              the hotlines page
            </a>
            , or dial <strong>911</strong>.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-800 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Reload the page
            </button>
            <a
              href={`${REPO_URL}/issues/new`}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Tell us it broke
            </a>
          </div>
        </div>
      </div>
    );
  }
}
