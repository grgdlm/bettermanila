/**
 * Launch gate for the Manila fork.
 *
 * While this is true, every route renders the holding page instead of the
 * site, so visitors to bettermanila.org are greeted rather than shown the
 * unfinished starter-kit template.
 *
 * To work on the real site locally, add `VITE_COMING_SOON=false` to
 * `.env.local` (gitignored). To launch for good, flip the default below.
 */
export const COMING_SOON = import.meta.env.VITE_COMING_SOON !== 'false';
