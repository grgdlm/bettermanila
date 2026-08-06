import {
  CloudRain,
  FileText,
  HeartPulse,
  Landmark,
  Siren,
  Trash2,
  type LucideIcon,
} from 'lucide-react';

/**
 * The pages people actually arrive looking for.
 *
 * The home page hero and the 404 both offer this list, and they used to carry
 * their own copy of it — kept in step by hand, which is a promise nobody keeps.
 * One array now, read by both.
 *
 * Labels and notes are not stored here: they live under `quickLinks.<key>` in
 * the locale files so they translate. What stays here is the part that is not
 * language — which icon, and which page. Every href below resolves to a page
 * that exists; check it before adding one, because a dead link in this list is
 * shown to someone who has already failed to find what they wanted once.
 */
export interface QuickLink {
  /** Key under `quickLinks` in the `common` namespace. */
  key: string;
  icon: LucideIcon;
  href: string;
}

export const QUICK_LINKS: QuickLink[] = [
  {
    key: 'hotlines',
    icon: Siren,
    href: '/government/emergency/hotlines',
  },
  {
    key: 'hospitals',
    icon: HeartPulse,
    href: '/services/health-services/go-to-the-local-hospital-for-treatment-or-confinement',
  },
  {
    key: 'permits',
    icon: FileText,
    href: '/services/business/apply-for-barangay-clearance-and-mayors-business-permits',
  },
  {
    key: 'suspensions',
    icon: CloudRain,
    href: '/government/news/suspensions-and-advisories',
  },
  {
    key: 'garbage',
    icon: Trash2,
    href: '/services/garbage-waste-disposal/check-garbage-collection-schedules-and-request-pickup',
  },
  {
    key: 'mayor',
    icon: Landmark,
    href: '/government/departments/executive',
  },
];
