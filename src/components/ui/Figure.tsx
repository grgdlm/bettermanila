import { type TypographyTheme } from '../../lib/typographyThemes';
import { IMAGE_CREDITS, IMAGE_DIMENSIONS } from '../../data/imageCredits';

/**
 * A photo, its caption, and the credit its licence requires.
 *
 * Written in markdown as an ordinary image whose title is the caption:
 *
 *     ![Fort Santiago's gate](/images/tourism/fort-santiago.webp 'The gate...')
 *
 * The alt text describes the picture for someone who cannot see it; the title
 * becomes the visible caption. They are different jobs and should not repeat
 * each other.
 *
 * The credit comes from src/data/imageCredits.ts rather than the markdown, so
 * it cannot be edited away by accident. An image with no entry there renders
 * as a visible error rather than an uncredited photo: silently publishing a
 * CC BY image without its attribution is a licence breach, and this site is
 * not in a position to be careless about other people's terms.
 */
export function Figure({
  src,
  alt,
  caption,
  theme,
}: {
  src: string;
  alt: string;
  caption?: string;
  theme: TypographyTheme;
}) {
  const credit = IMAGE_CREDITS[src];
  const size = IMAGE_DIMENSIONS[src];

  if (!credit) {
    return (
      <p className="my-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">
        Image <code className="font-mono">{src}</code> has no entry in
        src/data/imageCredits.ts, so it cannot be shown. Add its photographer
        and licence there first.
      </p>
    );
  }

  return (
    <figure className="my-8">
      <img
        src={src}
        alt={alt}
        width={size?.width}
        height={size?.height}
        loading="lazy"
        decoding="async"
        className="w-full rounded-xl border border-gray-200 bg-gray-100"
      />
      <figcaption className="mt-2.5 text-sm leading-relaxed text-gray-700">
        {caption}
        {caption ? ' ' : null}
        <span className="text-gray-600">
          Photo:{' '}
          <a
            href={credit.source}
            target="_blank"
            rel="noopener noreferrer"
            className={theme.components.a}
          >
            {credit.author}
          </a>
          ,{' '}
          <a
            href={credit.licenseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={theme.components.a}
          >
            {credit.license}
          </a>
          .
        </span>
      </figcaption>
    </figure>
  );
}
