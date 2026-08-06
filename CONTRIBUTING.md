# Contributing to BetterManila

BetterManila is a volunteer-run, open-source portal that makes City of Manila
public information easy to find. It is **not** an official site of the City
Government of Manila, and nothing here should claim otherwise.

The single most valuable thing you can contribute is a **verified fact with a
source**. The site marks every unverified gap with a "Help us complete this
section" callout — each one is a paragraph in the content starting with
`TODO:`, and each one is a ready-made first contribution.

## The one rule that matters

**Never publish a fact you cannot point to an official source for.** Fees,
hours, hotline numbers, officials' names, requirements, processing times —
every one of them must trace to an official publication (manila.gov.ph, PSA,
BLGF, COA, DILG, DTI, or the agency that owns the fact), and pages carrying
figures name their source and retrieval date in a note at the end.

A wrong hotline number on a government-information site does real harm. When
you cannot verify something, write `TODO:` followed by what is missing — the
site renders it as an invitation, not an error.

## How the content system works

Content is plain Markdown + YAML — no code required for most contributions:

```
src/data/services.yaml                      ← service category list
src/data/government.yaml                    ← government category list
content/services/<category>/index.yaml      ← pages in a category
content/services/<category>/<page>.md       ← the page itself
```

A page needs a single `# Title` heading and a real paragraph directly after it
(they become the page title and description). Sections are separated with
`---`. Facts that change with elections live in companion JSON files (see
`content/government/departments/executive.json`) so prose survives an
election.

Adding a whole new **category** additionally requires registering its
`index.yaml` in `src/data/yamlLoader.ts` — a category that skips this renders
empty with no error.

## Translations are wanted

The interface is translated by files in `public/locales/<code>/common.json`.
English and Filipino exist. The language switcher deliberately lists the other
Philippine languages Manileños speak — Cebuano, Ilocano, Hiligaynon, Waray,
Kapampangan, Bikol, Pangasinan, Maguindanaon, Tausug, Meranaw — as _wanted_:
each needs a speaker to translate one JSON file.

If you speak one of them, start with:

```bash
npm run i18n:new -- ceb    # or ilo, bcl, war, … ; omit the code to see the list
```

That writes `public/locales/ceb/common.json` as a copy of the English file.
Translate the **values** in place, never the keys. Two things have to survive
into your translation exactly as they appear:

- `{{count}}`, `{{query}}`, `{{year}}` and friends — these get replaced with
  real numbers and words at runtime.
- `<link>…</link>`, `<city>…</city>`, `<services>…</services>` — these wrap
  part of the sentence in a link or a highlight. Move them wherever the
  grammar of your language puts that phrase, but keep the pair intact.

Word order is yours to change. A sentence does not have to follow the English
shape, and for most of these languages it should not.

Check your work at any time:

```bash
npm run i18n:check
```

It compares every locale against English and fails on a missing key, a dropped
`{{variable}}`, an unbalanced `<component>`, or a language switched on without
a file behind it. It also reports how many values are still identical to
English, so you can see what is left. The same check runs automatically when
you commit a locale file.

Leave the language switched off in your pull request. A maintainer flips
`available: true` in `src/i18n/languages.ts` and adds the code to
`supportedLngs` in `src/i18n.ts` once a second speaker has read it — until
then the switcher keeps listing it as needing a translator, which is honest.
Partial translations are welcome: an unfinished file sitting at
`available: false` harms nobody and is a real head start for the next person.

## Local setup

```bash
npm install
npm run dev        # http://localhost:5173
```

The full site is gated behind a holding page while under construction; put
`VITE_COMING_SOON=false` in a `.env.local` file to see the real site locally.

Before opening a PR:

```bash
npm run lint
npm run build      # tsc -b is the real type gate
```

Run Prettier only on the files you changed (`npx prettier --write <files>`),
not repo-wide — this fork tracks an active upstream and whitespace-only diffs
become merge conflicts.

## Ground rules

- Plain language. Write for a resident on a phone, not for a lawyer.
- Filipino terms residents actually use (barangay, cedula, amilyar) are
  welcome in English text.
- No personal data in the repo, ever.
- Do not use the city seal or official logos — this project is independent
  and must look it.
- Be kind in reviews. Everyone here is a volunteer.

## Where to start

- Any "Help us complete this section" callout on the site
- The open items in any page's `TODO:` markers under `content/`
- A translation file for a language you speak
- Report a wrong fact: open an issue with the correct value **and its source**
