import { cn } from '../../lib/utils';

/**
 * Sizes map to literal Tailwind classes: a template like `text-${size}`
 * produces `text-md`, which is not a Tailwind class, and dynamic class names
 * are invisible to Tailwind's static scanner anyway.
 */
const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Text({
  size = 'md',
  transform = 'none',
  className = '',
  children,
}: {
  size?: 'sm' | 'md' | 'lg';
  transform?: 'none' | 'uppercase' | 'lowercase';
  className?: string;
  children: React.ReactNode;
}) {
  const transformClasses = {
    none: '',
    uppercase: 'uppercase',
    lowercase: 'lowercase',
  };
  return (
    <p
      className={cn(
        sizeClasses[size],
        'mb-2 max-w-lg',
        transformClasses[transform],
        className
      )}
    >
      {children}
    </p>
  );
}
