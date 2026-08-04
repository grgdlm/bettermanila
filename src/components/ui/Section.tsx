import { cn } from '../../lib/utils';

/**
 * Page section wrapper: vertical rhythm on the <section>, the centered
 * container inside it.
 *
 * `className` styles the section only. It used to be applied to the inner
 * container as well, so any padding or width override landed twice and
 * callers worked around it by zeroing the section and re-padding their own
 * column. Use `containerClassName` to reach the inner container.
 */
export default function Section({
  children,
  className,
  containerClassName,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}) {
  return (
    <section className={cn('bg-white py-12', className)} id={id}>
      <div className={cn('container mx-auto px-4', containerClassName)}>
        {children}
      </div>
    </section>
  );
}
