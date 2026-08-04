/**
 * VerifyNotice renders a content gap as an invitation to contribute.
 *
 * Better Manila marks facts it has not yet verified against an official
 * source with a markdown paragraph starting with "TODO:". Rather than
 * showing that developer note as body copy, the markdown renderer wraps it
 * in this callout, which frames the gap as something a reader can help
 * close. It is informational, not an error state, so it uses the primary
 * palette and role="note" instead of a warning treatment.
 */

import { type ReactNode } from 'react';
import { ExternalLink, HeartHandshake } from 'lucide-react';
import { REPO_URL } from '../../data/navigation';

export function VerifyNotice({ children }: { children?: ReactNode }) {
  return (
    <div
      role="note"
      className="my-6 rounded-xl border border-primary-100 bg-primary-50/70 p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700"
        >
          <HeartHandshake className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold tracking-tight text-primary-800">
            Help us complete this section
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-700 break-words">
            {children}
          </p>
          <p className="mt-3 text-sm">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-primary-700 underline decoration-primary-300 underline-offset-2 hover:text-primary-800 hover:decoration-primary-500"
            >
              Know the details? Contribute on GitHub
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
