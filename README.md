# BetterManila

A volunteer-run website that makes City of Manila public information easy to
find — emergency numbers, permits, health services, what the city spends — in
plain language. It lives at [bettermanila.org](https://bettermanila.org).

**This is not an official site of the City Government of Manila.** It is not
run by, endorsed by, or affiliated with the city, and it uses no city seal or
official logo. For the city's own word on something, go to
[manila.gov.ph](https://manila.gov.ph). An unofficial site that looks official
is worse than no site at all, so the distinction is kept sharp on every page.

One maintainer, a hobby, no deadline, no funding. Help is genuinely welcome,
and most of it needs no code.

## Something here is wrong. How do I tell you?

**[Open an issue and say so.](https://github.com/grgdlm/bettermanila/issues/new)**
It needs a free GitHub account and no technical knowledge. Worth including:

- which page — the link, or just its title
- what it says now, and what it should say
- where you know it from, if there is something to point to: a page on
  manila.gov.ph, a poster at the office, a notice you were handed

If you have no source, report it anyway. That a number does not connect, or
that an office has moved, is worth as much as a citation — someone will look it
up. A wrong hotline number on a government-information site does real harm,
which is why reporting one is the most useful thing you can do here. One person
runs this, so replies are not instant, but every report is read.

## Where the site stands

bettermanila.org currently serves a holding page; the site has not launched.
The pages exist, though, and you can read them here under `content/`.

- **26 pages written** — emergency hotlines, the executive department,
  transparency documents (budget, procurement, citizen's charter), advisories,
  statistics, and services across business, education, health, waste, tourism
  and getting around.
- **8 interface languages.** English and Filipino have been read through by a
  speaker. Bisaya, Ilokano, Ilonggo, Waray-Waray, Kapampangan and Bikol Central
  ship as labelled drafts nobody has checked yet. Page content is English only
  so far.

## How the facts are handled

Every figure names its source and the date it was retrieved, in a note at the
end of the page, so you can check the original yourself. Population counts cite
the PSA release they came from; money figures cite BLGF and COA reports and say
which accounting basis they are on, because the audited and preliminary numbers
are not the same measure.

What could not be verified is published as a visible gap rather than a guess —
a paragraph starting with `TODO:`, which readers see as a "Help us complete
this section" callout rather than an error.

The emergency hotlines page is the clearest case. The city publishes two
different landline numbers for the same disaster office on two posters, both
printed clearly, so it is not a misreading. The page prints neither, says why,
and points to the mobile numbers and 911 until the office confirms.

## What is missing, specifically

This is the honest part, and it is where you come in. Counts verified
31 August 2026.

- **52 "Help us complete this section" callouts**, each a self-contained first
  task. List them with `grep -rn '^TODO:' content`.
- **Six service categories with no pages yet** — social welfare, housing and
  land use, infrastructure and public works, environment, agriculture and
  fisheries, disaster preparedness. Under `content/government/`, the
  legislative department is likewise empty, and guides and regulations and
  public consultations have no pages at all.
- **Six unreviewed translation drafts.** Reviewing a draft is worth more than
  starting a new language — the file is already there and needs someone who
  speaks the language to fix what is wrong. Kapampangan is the weakest and the
  best place to start.
- **Page content is English only.** The interface is translated; the pages
  themselves are not.

[CONTRIBUTING.md](CONTRIBUTING.md) is the real guide — how a page is put
together, what counts as a source, which translations need a speaker. Much of
it can be done in GitHub's web editor without cloning anything.

## Running it locally

React 19, TypeScript, Vite, Tailwind CSS v4, react-router, i18next and
react-markdown; developed on Node 22. Content is Markdown and YAML.

```bash
npm install
npm run dev          # http://localhost:5173
```

That gives you the holding page. Put `VITE_COMING_SOON=false` in a `.env.local`
file to see the real site. Before opening a pull request:

```bash
npm run lint
npm run build        # tsc -b is the real type gate
npm run i18n:check   # if you touched public/locales
```

Run Prettier only on the files you changed (`npx prettier --write <files>`),
never repo-wide — this fork tracks an active upstream, and a whitespace-only
diff becomes somebody's merge conflict later.

**Do not run `npm run setup`.** It is the starter kit's bootstrapper for a
brand-new fork: it overwrites `.env.local` and replaces a real content file —
`content/services/health-services/index.yaml`, four published pages — with
placeholder copy. It has no business running here.

## Where it came from

BetterManila is a fork of
[betterlocalgov](https://github.com/iyanski/betterlocalgov), a generic starter
kit for Philippine LGU websites, and still tracks it. The kit's own README is
preserved verbatim at [STARTER-KIT-README.md](STARTER-KIT-README.md), and the
other capitalised guides here — CONTENT-GUIDE.md, CONTENT-MANAGEMENT.md,
DEPLOYMENT-GUIDE.md, CHANGELOG.md — are upstream's too, written for a generic
LGU rather than for Manila. Where they disagree with this file or with
CONTRIBUTING.md, these two win.

## License

[CC0 1.0](LICENSE) — public domain, so take whatever is useful. To build one of
these for your own city, fork the starter kit above rather than this repo.
