# Portfolio punch list

What still needs you, after `portfolio-copy-edits.sql` is run. Generated 22/09/2026.

## 1. Questions only you can answer

These are the `[YEMI: ...]` notes still in the case studies. They never render in production

(`src/lib/markdown.tsx:48`); append `?notes` in dev to read them in place.

**16 questions across 8 projects.**
### Flock ChMS (`flock`)
- this needs its origin in your words. Was there a specific church, a conversation, a thing you watched somebody do badly in a spreadsheet? Everything below is verifiable from the code. This paragraph is the part only you can write, and it is the part a reader will remember.
- do you agree with that reading? If you do it is a strong thing to say out loud, because it is the kind of judgement people hire a senior for. If you think the migration count has another explanation, say so instead and I will rewrite it.

### Devign (`devign`)
- why did you build this rather than use shadcn, Radix directly, or Mantine? There is a real answer and it is the whole reason the project exists. Without it a reader assumes you did not know the alternatives.
- this is a flaw in your own product, so it is your call whether it goes on the page. My view is that it should. Finding a subtle cascade bug in your own library by dogfooding it, diagnosing it by byte offset, and saying so publicly reads as senior. Hiding it reads as marketing. But it is your library and your call, and if it stays you should fix it upstream first.

### OutOut (`outout`)
- what is the product actually for, in one sentence a stranger would understand? "Social events app" is a category, not a proposition.
- worth deciding how much of the cost work goes on the page. My view is all of it: measuring your own unit economics and finding that your database is 4% of your bill is a genuinely uncommon thing for a developer to have done, and it is the section a technical founder would react to. Figures were measured 06/08/2026 and should be labelled as such.
- the metrics on this project (137 users, 203 events, 204 photos, 513 messages) do not match the production figures I measured in August (about 119 users ever, roughly 60 monthly active, 4,369 event rows). One of the two is measuring something different. Tell me which numbers you want to stand and I will make them consistent.

### LightLife Church (`lightlife`)
- how did this one come about, and what were they using before? Also worth saying plainly whether this is the same problem as Flock or a different one, because a reader who sees both will ask.
- what actually happened the first time this was used live? If something went wrong, that is the best paragraph on this page.
- pick the one of these you are proudest of and tell me why, and I will expand it into a proper section.

### Gr8QM Technovates Platform (`gr8qm`)
- what was here before, and what was the brief? A platform that grew to forty pages usually replaced something. Saying what, and what was wrong with it, is what turns this from an inventory into a case study.
- worth deciding whether to say this. I think a short, specific admission like this is worth more than another paragraph of features, because everyone reading has the same files in their own repos. Alternatively I cut it and we clean the files up instead.

### AIENAI Academy (`academy`)
- how does this relate to AXE LMS and to the Gr8QM courses? There are three education products in your portfolio and a reader will want to know whether they are the same thing for different audiences or genuinely different products.

### Skoolrithm (`skoolrithm`)
- what is the single hardest thing you solved in this app? Offline persistence for a school context has some genuinely awkward problems in it (whose data syncs, what a parent sees versus a teacher, what happens when a term rolls over) and one specific war story would carry this whole page.
- you are credited as lead designer here as well. What did you actually decide about the design, and did the three applications end up sharing a system or diverging? This is the part that makes it a design engineering case study rather than a mobile one.

### Hikima Academy (`hikima`)
- the live site at hikimaacademy.net no longer looks like a Framer build, so it may have been rebuilt since. Worth checking whether the link should still point there, and whether this should be described in the past tense.

## 2. Factual gaps I can close once you answer

| Project | What is missing |
|---|---|
| UCDA (`ucda`) | cover |
| WhoDeyGo (`whodeygo`) | cover, any link (live or repo) |
| Fountium (`fountium`) | cover |
| YAHWCF (`yahwcf`) | cover, any link (live or repo) |
| ECOSYSTEM (`ecosystem`) | cover |
| TedPrime Hub (`tedprime`) | cover |
| SUAP (`suap`) | cover, any link (live or repo) |
| HUM (`hum`) | cover, any link (live or repo) |
| LeanHQ (`leanhq`) | cover |
| Brand Applied (`brand-applied`) | any link (live or repo) |
| AMMBAN (`ammban`) | any link (live or repo) |
| Print & Editorial (`print-editorial`) | any link (live or repo) |
| Moniepoint, South West (`moniepoint`) | any link (live or repo) |
| Microsoft AgroTech Hackathon (`agrotech`) | cover, any link (live or repo) |
| Fresh Pick Mart (`freshpick`) | cover, any link (live or repo) |
| eventX (`eventx`) | cover |
| All Saints University (`allsaints`) | cover, any link (live or repo) |
| 7th Infotech LMS (`lagos-lms`) | cover, any link (live or repo) |
| Xafe (`xafe`) | cover |

## 3. Known wrong, not just missing

- **OutOut metrics contradict production.** The page says 137 users, 203 events, 204 photos,
  513 messages. Figures measured in August were about 119 users ever, roughly 60 monthly active
  and 4,369 event rows. One of the two counts something different. A wrong number on a public
  page is worse than no number.
- **Hikima's live link may be stale.** hikimaacademy.net no longer looks like a Framer build, so
  it may have been rebuilt by someone else. Worth checking whether the link should stay and
  whether the case study should move to the past tense.
- **Tori's transcript accuracy** is still written without a figure. One recording, transcribed
  with the echo-cancellation mode on and off, scored against a hand-typed reference, closes it.

## 4. Optional

Almost every project has no `metrics`. That is fine: metrics are for projects with a real number
worth showing. Only fill them where one exists, rather than manufacturing four per project.

