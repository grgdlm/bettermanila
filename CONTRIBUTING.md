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
A language sits in one of three states, and the switcher shows which:

| State                      | What it means                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Checked**                | A speaker has read the file through. English, Filipino.                                                   |
| **Draft, not yet checked** | A file exists but was machine-written. Bisaya, Ilokano, Ilonggo, Waray-Waray, Kapampangan, Bikol Central. |
| **Needs a translator**     | No file yet. Pangasinan, Maguindanaon, Tausug, Meranaw.                                                   |

Drafts are selectable, because a rough translation beats none for someone who
reads little English, but every page in one carries a banner saying it is
machine-written and unchecked. **Reviewing a draft is more valuable than
starting a new language.** The file is already there; it needs someone who
speaks the language to fix what is wrong.

Kapampangan is the weakest of the drafts and the best place to start. Bisaya,
Ilokano and Ilonggo are the strongest.

The three languages with no file are unwritten on purpose rather than by
oversight. The drafts above were machine-written by a model with real exposure
to those languages, so they are wrong in the way a rough draft is wrong.
Maguindanaon, Tausug and Meranaw are not in that position: what a machine
produces for them is closer to noise than to a draft, and it would cost a
reviewer more to untangle than to write from scratch. They stay blank until a
speaker writes them. If that is you, please get in touch — Meranaw especially
has a real community in Quiapo and nothing on this site speaks to them.

If you speak any of these, start with:

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

Both switches live in `src/i18n/languages.ts`. `available: true` makes a
language selectable; `reviewed: true` removes the draft banner and moves it out
of the draft group. `supportedLngs` is derived from that table, so there is no
second list to keep in step.

**Only a speaker flips `reviewed`.** Not the person who wrote the draft, and
not because it has been sitting there a while. If you have reviewed a draft
end to end, say so in the pull request and set it yourself.

Partial work is welcome. An unfinished file at `available: false` reaches no
readers and is a real head start for whoever comes next.

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
