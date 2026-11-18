/**
 * Launch gate for the Manila fork.
 *
 * The site is live by default. Set `VITE_COMING_SOON=true` in an environment
 * to put every route back behind the holding page, for example to take
 * bettermanila.org down for maintenance without a code change.
 */
export const COMING_SOON = import.meta.env.VITE_COMING_SOON === 'true';
