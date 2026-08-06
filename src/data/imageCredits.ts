/**
 * Every third-party image on the site, with the licence it arrived under.
 *
 * The text and code in this repository are CC0 — anyone may copy them without
 * asking or crediting. Photographs are the exception. Each one below is used
 * under a licence that requires the photographer be named, so the credit is
 * not decoration: dropping it makes the use unlicensed.
 *
 * Keeping the credits here rather than in the markdown means there is exactly
 * one place to audit what the site borrows and on what terms, and a caption
 * cannot drift away from its photo during an edit. The renderer in
 * markdownComponents.tsx looks a credit up by `src` and refuses to render a
 * figure without one, so an uncredited image fails loudly instead of shipping
 * quietly.
 *
 * Adding an image:
 *  1. Only CC0, public domain, or CC BY. Avoid CC BY-SA — its share-alike
 *     term reaches back into the work that embeds it, and this site is CC0.
 *  2. Read the licence off the file page, do not infer it from the search
 *     result or from a neighbouring file by the same author.
 *  3. Record the photographer exactly as they name themselves, including a
 *     username if that is what the file page shows.
 *  4. Link `source` to the file description page, not the raw image, so a
 *     reader can check the licence themselves.
 */
export interface ImageCredit {
  /** Photographer, exactly as named on the source page. */
  author: string;
  /** Short licence name, e.g. "CC BY 4.0". */
  license: string;
  /** Canonical licence deed. */
  licenseUrl: string;
  /** The file description page, where the licence can be verified. */
  source: string;
}

/** Keyed by the image's public path, exactly as written in the markdown. */
export const IMAGE_CREDITS: Record<string, ImageCredit> = {
  '/images/tourism/fort-santiago.webp': {
    author: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source:
      'https://commons.wikimedia.org/wiki/File:Manila,_Fort_Santiago,_Walled_city_of_Intramuros,_Philippines.jpg',
  },
  '/images/tourism/intramuros-gardens.webp': {
    author: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source:
      'https://commons.wikimedia.org/wiki/File:Manila,_Intramuros_Gardens,_Philippines.jpg',
  },
  '/images/tourism/rizal-monument.webp': {
    author: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source:
      'https://commons.wikimedia.org/wiki/File:Manila,_Rizal_Monument_(Motto_Stella),_Rizal_Park,_Philippines.jpg',
  },
  '/images/tourism/rizal-park-skyline.webp': {
    author: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source:
      'https://commons.wikimedia.org/wiki/File:Manila,_Rizal_Park_skyline,_Philippines.jpg',
  },
  '/images/tourism/national-museum.webp': {
    author: 'Judgefloro',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source:
      'https://commons.wikimedia.org/wiki/File:04762jfNational_Museum_of_the_Philippines_Ermita_Manilafvf_07.jpg',
  },
  '/images/tourism/fine-arts-golden-hour.webp': {
    author: 'PhiliptheNumber1',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source:
      'https://commons.wikimedia.org/wiki/File:National_Museum_of_Fine_Arts_façade_golden_hour_(Manila,_2024).jpg',
  },

  // Home page hero panel.
  '/images/hero/city-centre.webp': {
    author: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source:
      'https://commons.wikimedia.org/wiki/File:Manila,_Centre,_Philippines.jpg',
  },
  '/images/hero/bay-sunset.webp': {
    author: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source:
      'https://commons.wikimedia.org/wiki/File:Manila_Bay,_Sunset,_Philippines.jpg',
  },
  '/images/hero/pasig-river.webp': {
    author: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source:
      'https://commons.wikimedia.org/wiki/File:Manila,_Pasig_River,_Philippines.jpg',
  },
  '/images/hero/manila-cathedral.webp': {
    author: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source:
      'https://commons.wikimedia.org/wiki/File:Manila,_Manila_Cathedral,_Philippines.jpg',
  },
};

/**
 * Intrinsic size of each image, so the browser can reserve the right box
 * before the file arrives. Without this the page reflows as each photo loads,
 * which on a slow connection means the paragraph you are reading jumps away.
 */
export const IMAGE_DIMENSIONS: Record<
  string,
  { width: number; height: number }
> = {
  '/images/tourism/fort-santiago.webp': { width: 1600, height: 1067 },
  '/images/tourism/intramuros-gardens.webp': { width: 1600, height: 1067 },
  '/images/tourism/rizal-monument.webp': { width: 1600, height: 1067 },
  '/images/tourism/rizal-park-skyline.webp': { width: 1600, height: 1067 },
  '/images/tourism/national-museum.webp': { width: 1600, height: 1200 },
  '/images/tourism/fine-arts-golden-hour.webp': {
    width: 1600,
    height: 1061,
  },
  '/images/hero/city-centre.webp': { width: 1200, height: 800 },
  '/images/hero/bay-sunset.webp': { width: 1200, height: 800 },
  '/images/hero/pasig-river.webp': { width: 1200, height: 800 },
  '/images/hero/manila-cathedral.webp': { width: 1200, height: 800 },
};
