/**
 * The category icons named in services.yaml and government.yaml, imported
 * individually so the bundler can drop the rest of lucide-react.
 *
 * A namespace import (`import * as LucideIcons`) defeats tree-shaking and
 * ships the entire icon library — measured at 602 kB minified in this app —
 * to look up seventeen icons. Every icon name a YAML file may use must be
 * added here; an unlisted name renders no icon, same as a typo.
 */

import {
  Book,
  Building2,
  Bus,
  ChartBar,
  FileText,
  GraduationCap,
  Heart,
  Home,
  Landmark,
  MessagesSquare,
  Newspaper,
  Shield,
  Siren,
  Trash2,
  TreePine,
  Users,
  Wheat,
  Wrench,
} from 'lucide-react';

export type IconComponent = React.ComponentType<{ className?: string }>;

export const CATEGORY_ICONS: Record<string, IconComponent> = {
  Book,
  Building2,
  Bus,
  ChartBar,
  FileText,
  GraduationCap,
  Heart,
  Home,
  Landmark,
  MessagesSquare,
  Newspaper,
  Shield,
  Siren,
  Trash2,
  TreePine,
  Users,
  Wheat,
  Wrench,
};

export function iconByName(name?: string): IconComponent | undefined {
  return name ? CATEGORY_ICONS[name] : undefined;
}
