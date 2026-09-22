-- Portfolio copy edits, 21/09/2026
-- Run in the Supabase SQL editor as the project owner.
-- Every replace() below was verified to match exactly once against the live bodies.
begin;

-- 1. Commit counts out, the authorship distinction kept. 20 edits across 18 projects.
update bigyems_portfolio.projects set body = replace(body, $o$38 of 49 commits are mine.$o$, $n$Most of the build is mine.$n$) where slug = 'aienai-co';
update bigyems_portfolio.projects set body = replace(body, $o$Design plus a small number of commits: 2 of 22 in the repository, alongside David Yusuf and others.$o$, $n$Design plus a small hand in the build, alongside David Yusuf and others.$n$) where slug = 'allsaints';
update bigyems_portfolio.projects set body = replace(body, $o$Two commits is two commits, and I am not going to present a supporting contribution as ownership.$o$, $n$A small contribution is a small contribution, and I am not going to present it as ownership.$n$) where slug = 'allsaints';
update bigyems_portfolio.projects set body = replace(body, $o$I did not lead this one and there are no commits of mine in the repository, so the credit here is supporting contributor and nothing more.$o$, $n$I did not lead this one and I did not write the code, so the credit here is supporting contributor and nothing more.$n$) where slug = 'leanhq';
update bigyems_portfolio.projects set body = replace(body, $o$I did not lead it and I have no commits in the repository.$o$, $n$I did not lead it and I did not write the code.$n$) where slug = 'settle-in';
update bigyems_portfolio.projects set body = replace(body, $o$25 commits, sole author, with a second 25-commit rebuild in 2024.$o$, $n$Sole author, with a second rebuild in 2024.$n$) where slug = 'eventx';
update bigyems_portfolio.projects set body = replace(body, $o$83 commits, sole author.$o$, $n$Sole author.$n$) where slug = 'devignfx';
update bigyems_portfolio.projects set body = replace(body, $o$664 commits, all of them mine.$o$, $n$All of it mine.$n$) where slug = 'flock';
update bigyems_portfolio.projects set body = replace(body, $o$There are no commits of mine to point at in the repository, so I will not claim lead engineer or lead designer on it. That distinction runs through this whole portfolio: where I built it, it says so and there is a commit count.$o$, $n$I did not write the code, so I will not claim lead engineer or lead designer on it. That distinction runs through this whole portfolio: where I built it, it says so.$n$) where slug = 'axe-lms';
update bigyems_portfolio.projects set body = replace(body, $o$67 commits, sole author, and it is now the interface layer under my own production work.$o$, $n$Sole author, and it is now the interface layer under my own production work.$n$) where slug = 'devign';
update bigyems_portfolio.projects set body = replace(body, $o$I am not going to claim a commit count I cannot show.$o$, $n$I am not going to claim work I cannot show.$n$) where slug = 'ucda';
update bigyems_portfolio.projects set body = replace(body, $o$108 of 111 commits are mine.$o$, $n$Nearly all of it is mine.$n$) where slug = 'academy';
update bigyems_portfolio.projects set body = replace(body, $o$216 of 252 commits are mine.$o$, $n$Most of the build is mine.$n$) where slug = 'outout';
update bigyems_portfolio.projects set body = replace(body, $o$423 commits, sole author.$o$, $n$Sole author.$n$) where slug = 'lightlife';
update bigyems_portfolio.projects set body = replace(body, $o$Over 40 pages, 370 commits, 359 of them mine, 62 migrations and 10 edge functions.$o$, $n$Over 40 pages, 62 migrations and 10 edge functions, nearly all of it mine.$n$) where slug = 'gr8qm';
update bigyems_portfolio.projects set body = replace(body, $o$79 commits, sole author.$o$, $n$Sole author.$n$) where slug = 'outout-landing';
update bigyems_portfolio.projects set body = replace(body, $o$because whole-repository commit counts would have told you I was a minor contributor$o$, $n$because a whole-repository view would have told you I was a minor contributor$n$) where slug = 'skoolrithm';
update bigyems_portfolio.projects set body = replace(body, $o$By commits across the whole monorepo I look like roughly a third of it.$o$, $n$Across the whole monorepo I look like roughly a third of it.$n$) where slug = 'skoolrithm';
update bigyems_portfolio.projects set body = replace(body, $o$The repository is shared and a meaningful commit count is not mine to claim.$o$, $n$The repository is shared and the build is not mine to claim.$n$) where slug = 'whodeygo';
update bigyems_portfolio.projects set body = replace(body, $o$I contributed to it as part of the wider AIENAI portfolio and I do not have commits in the repository, so the credit is supporting contributor.$o$, $n$I contributed to it as part of the wider AIENAI portfolio and I did not write the code, so the credit is supporting contributor.$n$) where slug = 'hum';

-- 2. Tori: platforms, production status, audio mechanism, consent, competitors, metrics.
update bigyems_portfolio.projects set role = 'Lead engineer, React and Supabase' where slug = 'gr8qm';
update bigyems_portfolio.projects set role = 'Designer and lead developer, React and Supabase' where slug = 'academy';
update bigyems_portfolio.projects set role = 'Principal developer, Flutter and Supabase' where slug = 'outout';
update bigyems_portfolio.projects set role = 'Sole developer, React and Vercel edge functions' where slug = 'outout-landing';
update bigyems_portfolio.projects set role = 'Sole developer, Electron, C# and Supabase' where slug = 'tori';
update bigyems_portfolio.projects set role = 'Lead developer, Tauri and Rust core' where slug = 'motif';
update bigyems_portfolio.projects set role = 'Sole developer, Python on MetaTrader 5' where slug = 'devignfx';
update bigyems_portfolio.projects set role = 'Sole developer, Node and the Figma API' where slug = 'devign-figma-mcp';
update bigyems_portfolio.projects set role = 'Creator and lead maintainer, React and Radix' where slug = 'devign';
update bigyems_portfolio.projects set role = 'Designer and front-end developer, React' where slug = 'aienai-co';
update bigyems_portfolio.projects set role = 'Lead designer and mobile lead, React Native' where slug = 'skoolrithm';
update bigyems_portfolio.projects set role = 'Flutter developer, Riverpod and Supabase' where slug = 'whodeygo';
update bigyems_portfolio.projects set role = 'Front-end developer, React and Tailwind' where slug = 'suap';
update bigyems_portfolio.projects set role = 'Lead developer, React and Supabase' where slug = 'ucda';
update bigyems_portfolio.projects set role = 'Designer and developer, Vue' where slug = 'eventx';
update bigyems_portfolio.projects set role = 'Designer and developer, Flutter' where slug = 'xafe';
update bigyems_portfolio.projects set role = 'Design system and delivery support' where slug = 'axe-lms';
update bigyems_portfolio.projects set role = 'Design system and delivery support' where slug = 'leanhq';
update bigyems_portfolio.projects set role = 'Design system and delivery support' where slug = 'settle-in';

-- 6. AllSaints and HUM: the credit corrected to what Yemi says he did. 22/09/2026.
update bigyems_portfolio.projects set body = $b$A university admission and document-management web application, built during my Hikima Academy engagement. Lead developer and designer, alongside David Yusuf and others.

## The credit, stated first

I led the build and I did the design. It was a small team, with David Yusuf and others alongside me, and the sections below are the decisions I made rather than a tour of somebody else's work.

## Admissions is a document problem wearing an application's clothes

The visible product is a form. The actual product is everything behind it: transcripts, identity documents, references and certificates arriving in every format a scanner or a phone camera can produce, each needing to be attached to the right applicant, checked by a human, and retrievable months later when somebody queries a decision.

Design a portal around the form and you build something that collapses the first week it is used. Design it around the document lifecycle and the form becomes the easy part.

## Applicants are one-time users under stress

Nobody applies to university often enough to learn an interface, and they are doing it at a moment that matters. That rules out anything requiring familiarity: no hidden state, no multi-session flows that lose work, no error messages that assume the reader knows what a field is for.

## Why it is listed

Because it is real, it shipped, and it is the kind of unglamorous institutional software that most portfolios omit in favour of prettier things.$b$, role = 'Lead developer, PHP and MySQL' where slug = 'allsaints';
update bigyems_portfolio.projects set body = $b$HUM is a React Native mobile app built with Expo, currently in TestFlight beta. I built the backend.

## The honest scope

The app is not mine. I built the data layer behind it as part of the wider AIENAI portfolio, which is work that lives in schema, policies and functions rather than in the app repository, so a reading of that repository alone would undersell it. It is here because it is real, shipped work, and the client-side credit belongs to someone else.

## Shipping to the App Store is the part that is not glamorous

Review, provisioning, build signing, and the fact that a mistake costs days rather than a redeploy. Web work has conditioned a generation of engineers to treat release as free. Mobile does not let you, and the discipline it forces back into a team (finish it, test it, then ship it) is usually good for the web work as well.

## Expo, and what it buys

Expo with EAS handles the build and update machinery that otherwise eats a week per platform, and over-the-air updates mean a copy fix does not need a review cycle. It is the same trade as any framework: less control, far less time spent on the parts nobody sees.$b$, role = 'Backend developer' where slug = 'hum';

-- NOTE: the earlier replace() for Flock's commit count is now a no-op, because this
--       statement writes the whole body with that edit already applied. Order matters:
--       this runs after it, inside the same transaction.

-- 9. Answers to the open notes, 22/09/2026: Flock's origin, Devign's reason to exist,
--    how the three education products differ, Hikima in React, LightLife's note closed.
update bigyems_portfolio.projects set body = $b$Flock is a multi-tenant church platform. Eighteen admin modules, twenty member-facing surfaces, three separate audiences and a platform console of its own, sitting on 63 Supabase edge functions and 554 migrations. All of it mine.

## Where it starts

A church of a few hundred people runs on three things: a spreadsheet of members, a WhatsApp group, and one volunteer who knows where everything is. It holds until the volunteer is away on the Sunday the attendance sheet is needed, or until somebody asks how many first-time visitors came back a second time and the honest answer is that nobody knows, because the data that would answer it was never in one place.

That is the shape of the problem, and it is not a missing feature. It is a missing system.

## Fourteen was the wrong number

My own copy has been saying fourteen modules. On the admin side alone it is eighteen: analytics, attendance, billing, communications, community, dashboard, discipleship, engagement, finance, forms, media, members, pastoral care, programs, reports, settings, testimonies and users.

The count matters, but not as a boast. Eighteen is roughly the point at which a product either becomes a platform or quietly becomes eighteen small applications wearing the same logo. Everything interesting about this build was refusing the second outcome.

## Tenancy is resolved once, and nothing below it gets a vote

The failure mode in multi-tenant software is that each module grows its own opinion: its own idea of who the current user is, its own permission checks, its own notion of what a term or a campus or a service is. It works for the first three modules and becomes unmaintainable by the tenth.

So tenancy, auth and the interface primitives live in internal packages rather than in the modules that consume them:

- `packages/tenant` resolves which church you are in, once
- `packages/auth` owns identity and role, and every module reads the same permission set
- `packages/ui` means no module ships its own button

A module cannot answer "which church is this" for itself, because it has no way to ask. That constraint is the architecture.

## Three audiences, one codebase

Admin, member and guest are genuinely different products with different risk profiles. An admin deletes people. A member sees only themselves. A guest is not authenticated at all. They are separate route trees over shared packages rather than one interface with things hidden, because hiding is not a security model.

Above all of them is a platform console: plans, platform roles, subscription retry and cancellation. That is the part that makes it a business rather than an installation.

## The work is mostly in the edges

63 edge functions is where the real complexity ended up, and looking at the list is a fair summary of what running this actually involves: church signup and slug checking, user creation and deletion, subscription retry and cancellation, email OAuth and secret handling and unsubscribe, event reminder scanning, a daily automation pass, an error digest, a developer API, signed Cloudinary uploads.

Almost none of that is visible in a screenshot. All of it is the difference between a demo and something a church can run on a Sunday.

## An API other systems can build on

One of those edge functions is a developer API, and it is the piece that turns Flock from an application into something other software can sit on top of. A church's own tools, or somebody building alongside them, can read and write through it rather than exporting spreadsheets out of the admin and re-importing them somewhere else.

That is a different discipline from building screens. An interface can be changed on a Tuesday; an API that another system depends on cannot, so it has to be designed once, versioned deliberately and documented well enough that somebody can integrate without asking me a question.

## What I would do differently

554 migrations for one product is a lot. Honestly read, that number says the schema was discovered rather than designed: I learned what a church actually needed by building it, and the migration history is the record of that learning. It works, and the cost is that nobody can reconstruct the intent of the data model by reading it.

[YEMI: do you agree with that reading? If you do it is a strong thing to say out loud, because it is the kind of judgement people hire a senior for. If you think the migration count has another explanation, say so instead and I will rewrite it.]

Real usage as it stands: 832 members, 4,219 messages, 2,242 attendance records and 1,100 emails sent.$b$, role = $r$Lead engineer, React and Supabase, and the API$r$ where slug = 'flock';
update bigyems_portfolio.projects set body = $b$Devign is a React component library on npm: 43 components, design tokens, theming and a setup CLI. Built on Radix for behaviour, Tailwind v4 for styling, Motion for animation. Sole author, and it is now the interface layer under my own production work.

## Why not shadcn, Radix directly or Mantine

Because I wanted to own the layer everything else is built on.

shadcn hands you the code and then it is yours, copy by copy, in every project that uses it: a fix is a fix in one repository and a memory in the other four. Mantine hands you a finished opinion, and changing it means arguing with it. Radix on its own is behaviour with no appearance, which leaves the entire visual system to rebuild each time.

Devign is the middle of those three. Radix underneath for behaviour, my own tokens, density and motion on top, published as a package so a change lands everywhere at once. When I need something to work a particular way, I change it once and every product I run gets it.

## A library earns its keep by being used, not by existing

The test of a component library is not its README. It is whether the person who wrote it reaches for it under deadline, on a real project, when hand-rolling would be faster.

LightLife Church runs on Devign in production. So does this portfolio. That is the only claim about it worth making, and it is the one most component libraries cannot make.

## Behaviour is borrowed, appearance is owned

Every component wraps Radix rather than reimplementing it. Accessible focus management, keyboard interaction, portalling and dismissal are solved problems with brutal edge cases, and the correct move is to take them.

What is left is the part worth owning: tokens, density, motion and the decisions that make forty components look like one product rather than forty. `npx devign init` writes a themeable token file, so consuming it does not mean inheriting my taste.

## The bug I found in it by using it

Dogfooding produced a real defect, and it is worth writing down because it is the kind that never shows up in a test.

`devign/styles.css` is not a small component sheet. It is a complete precompiled Tailwind build, and in it the media-query blocks are emitted before the unprefixed utilities. Imported in the order the README gives, its own `grid-cols-2` therefore lands later in the cascade than its own `sm:grid-cols-4` and silently beats it at every width.

The symptom is a responsive layout that collapses with no error anywhere. The class is in the DOM. The class is in the stylesheet. It simply loses. On this site one grid was correct and the grid directly beside it was not, which is exactly why it hid for so long.

The workaround is to import Devign before Tailwind. The actual fix belongs in the library, in how the stylesheet is emitted, and it is still outstanding.

[YEMI: this is a flaw in your own product, so it is your call whether it goes on the page. My view is that it should. Finding a subtle cascade bug in your own library by dogfooding it, diagnosing it by byte offset, and saying so publicly reads as senior. Hiding it reads as marketing. But it is your library and your call, and if it stays you should fix it upstream first.]

## Where it is

Published as `devign` on npm, documented at devign-ui.vercel.app. It was called `yems-ui` before.$b$ where slug = 'devign';
update bigyems_portfolio.projects set body = $b$AIENAI Academy: a learning platform with a course catalogue, enrolment, payments and transactional email, at aienai.academy. Designer and lead developer. Nearly all of it is mine.

## Enrolment and payment are one flow, not two

The temptation is to treat the catalogue as marketing and the checkout as plumbing. It is the same flow. A learner deciding whether a course is for them and a learner entering card details are the same person thirty seconds apart, and the moment the visual and verbal register changes between those two screens, confidence drops and so does completion.

## Transactional email is part of the product

The receipt, the enrolment confirmation and the access details are, for most learners, the first thing they keep. They arrive when the person is least certain they made a good decision. Treating them as system output rather than as designed communication is a missed opportunity that almost every education platform takes.

## Payments in this market are not a single integration

Cards, bank transfer and local rails all have different failure modes and different user expectations about what "paid" means and how long it takes. Designing a confirmation state that is honest across all of them, rather than optimistically telling everyone they are enrolled, is most of the work.

## Three education products, and why they are not one

A reader who sees all three will assume they are the same thing wearing three names. They are not.

AIENAI Academy is a school: our courses, our learners, our curriculum. AXE is the software a school runs on, sold to the people doing the teaching, which is a different product with a different customer. Gr8QM is a business, not an academy. It runs courses, but they are one line of what it sells rather than the thing itself, and treating it as a school misreads the company.$b$ where slug = 'academy';
update bigyems_portfolio.projects set body = $b$An education marketing site with a custom CMS and a course-enrolment flow for Hikima Academy, a cybersecurity and IT education provider. Designer and developer, built in React.

## A course catalogue is an information architecture problem

Hikima's offering spans foundational tracks (network administration, information security, software engineering, data science, forensics, cloud, identity and access management) and advanced specialisms on top of them. A prospective learner arrives knowing roughly what they want to become and nothing about how the tracks relate.

Presenting that as a flat list of courses fails everyone. The structure has to answer "where do I start" and "what does this lead to" before it answers "what is in module three".

## Cybersecurity education has a specific credibility problem

The field is full of providers promising employment outcomes. A marketing site for one of them is read sceptically by default, which means concrete specifics (named domains, hands-on labs, what a placement actually involves) do more work than any amount of confident copy.

## A custom CMS because the catalogue changes

Course content in this field goes stale fast. The CMS exists so the team can add a track, retire one, or change a module list without a developer in the loop. That is the difference between a site that is current in eighteen months and one that quietly becomes a liability.$b$ where slug = 'hikima';
update bigyems_portfolio.projects set body = $b$LightLife Church runs on this. Not a pitch, not a prototype: a live church platform and public site at lightlifechurch.com, with member management, QR check-in, attendance, programmes, media, giving, forms, voting, a Q&A surface and an admin. Sole author.

[YEMI: how did this one come about, and what were they using before? Also worth saying plainly whether this is the same problem as Flock or a different one, because a reader who sees both will ask.]

## The one to talk about is attendance

QR check-in is the feature that sounds trivial and is not. It has to work with a queue of people at a door, on their own phones, on a bad connection, operated by a volunteer who was handed the tablet ninety seconds ago and will not read instructions.

## Built on my own component library

The interface is Devign, my published component library, with Cloudinary handling media and React Router 7 for routing. That is worth stating for one reason: it is the difference between a design system that exists and a design system that is load-bearing. LightLife is the proof that Devign survives contact with a real deadline.

## Small surfaces that matter more than they look

Short-link redirects, an enquiry flow, testimony submission, a voting surface and a books catalogue are individually unremarkable. Collectively they are most of what a congregation actually touches, and they are the parts that get built last and worst on almost every church site.

[YEMI: pick the one of these you are proudest of and tell me why, and I will expand it into a proper section.]$b$, role = $r$Designer and sole developer, React and PHP$r$ where slug = 'lightlife';

-- 10. Four more covers, captured 22/09/2026.
update bigyems_portfolio.projects set cover_url = 'https://res.cloudinary.com/dmxfjy079/image/upload/v1790072677/bigyems-portfolio/ecosystem/ecosystem_bckrvx.png' where slug = 'ecosystem';
update bigyems_portfolio.projects set cover_url = 'https://res.cloudinary.com/dmxfjy079/image/upload/v1790072686/bigyems-portfolio/tedprime/tedprime_mjcfpr.png' where slug = 'tedprime';
update bigyems_portfolio.projects set cover_url = 'https://res.cloudinary.com/dmxfjy079/image/upload/v1790072694/bigyems-portfolio/eventx/eventx_obmw6j.png' where slug = 'eventx';
update bigyems_portfolio.projects set cover_url = 'https://res.cloudinary.com/dmxfjy079/image/upload/v1790072699/bigyems-portfolio/ucda/ucda_bydtqj.png' where slug = 'ucda';

-- 11. Metrics, counted from the repositories on this machine rather than estimated.
--     OutOut's user count is Yemi's current figure. Projects whose numbers are not worth
--     showing are left empty on purpose.
update bigyems_portfolio.projects set metrics = '{"users": 143, "screens": 45, "migrations": 179, "edge_functions": 18}'::jsonb where slug = 'outout';
update bigyems_portfolio.projects set metrics = '{"pages": 78, "migrations": 62, "edge_functions": 10}'::jsonb where slug = 'gr8qm';
update bigyems_portfolio.projects set metrics = '{"pages": 58}'::jsonb where slug = 'lightlife';
update bigyems_portfolio.projects set metrics = '{"pages": 40}'::jsonb where slug = 'academy';
update bigyems_portfolio.projects set metrics = '{"pages": 46}'::jsonb where slug = 'aienai-co';
update bigyems_portfolio.projects set metrics = '{"screens": 101}'::jsonb where slug = 'skoolrithm';
update bigyems_portfolio.projects set metrics = '{"components": 43}'::jsonb where slug = 'devign';

-- 12. Skoolrithm: he led design and mobile, and built the platform and tenant front ends.
update bigyems_portfolio.projects set role = 'Lead designer, mobile lead and React front ends' where slug = 'skoolrithm';

-- 2b. Tori and Motif, restored: an earlier regex in this file's construction removed them.
update bigyems_portfolio.projects set body = $b$Tori is a desktop AI meeting recorder, in production with more than 100 users. Electron and TypeScript for the application, a native capture layer per platform, ffmpeg for media handling and Supabase behind it, sole author. It runs on Windows, on macOS on both Apple silicon and Intel, and on Linux.

## Why a native capture layer exists at all

Recording a meeting properly means recording what the other people said, and that is system audio, not the microphone. Browsers cannot do it. Electron cannot do it on its own either.

So capture drops to native code, and every platform solves it differently. Windows uses Windows Graphics Capture for the screen and WASAPI loopback for the audio the machine is playing, through two C# sidecars. macOS has no loopback device at all, so it goes through ScreenCaptureKit, which hands back system audio alongside the video in one stream, driven by its own capture helper. Linux ships a third helper again.

That is the whole reason native components sit inside an otherwise TypeScript application, and it is the part of the product that could not be shortcut. It is also why macOS was a port rather than a build target: the interface was already portable, the capture pipeline had to be written again.

Distribution follows the same shape. An installer for Windows, a signed build and a Homebrew cask for macOS, an AppImage for Linux, across 23 releases between June and September 2026.

## The audio was the real problem

Raw meeting audio is unusable for transcription: room echo, reverb, a laptop microphone at the wrong end of a table. Transcription quality is bounded by input quality, and no amount of model choice fixes a bad recording.

The fix belongs at capture rather than after it. The microphone is opened with echo cancellation set to cancel audio rendered by other applications, not only Tori's own, so the other side's voice coming back out of your speakers never lands in the microphone track as a second, smeared copy of itself. Noise suppression and gain control run in the same pass, with a fallback for machines where that mode is not available. Finding that mattered more than any model choice downstream.

## Recording other people, and the law

Tori records system audio, so it records everyone on the call rather than only your side. That is the point of it, and it is the part that deserves a straight answer rather than a quiet one.

Two things carry it. The recordings never leave the machine: raw audio and video sit in your own Documents folder and are not uploaded, and only the audio and the resulting text go out to be transcribed and summarised. And the terms are explicit. You start every recording yourself, and you are responsible for making each one lawful where you and every other participant are, which includes telling people and obtaining whatever consent the law requires, because some jurisdictions require all-party consent. Tori is a tool and is not a party to your meeting.

A product that records other people should say plainly where the obligation sits, and that is where it sits.

## Why not Otter, Granola or Fathom

None of them can see your screen. Tori records the screen as well as the room, takes a screenshot when you ask for one, and turns the meeting into notes and deliverables rather than a transcript you still have to read yourself. It handles video as well as audio, and because every meeting you have had sits in one place, it can cross-reference them: what was agreed last time, what was said about this account in March, what has changed since. That is the part a transcription service cannot reach, and it is the reason to build rather than subscribe.$b$, summary = $s$Desktop AI meeting recorder for Windows, macOS and Linux. Native capture on each, with transcription, post-meeting deliverables and cross-meeting recall.$s$, metrics = '{"users": "100+", "platforms": 3, "releases": 23}'::jsonb where slug = 'tori';
update bigyems_portfolio.projects set body = $b$Motif is a desktop motion-graphics studio, in private beta at motif.gr8qm.com with the early-access list open. Tauri with a Rust core and a React interface, owned by Gr8QM Technovates. Lead developer, covering planning, specification and the build.

Private beta rather than a public download is deliberate. The data-reel wedge works end to end and people can ask for it now; the rest of the plan stays unbuilt until that one thing is unarguable.

## What exists so far

The shell is real and the data path works. Pick a starting point, paste a table, get a reel that restages itself when the numbers change. The template row is the whole wedge in one screen: the same reel at 9:16, 16:9, 1:1 and 4:5, because a stat that only exists at one aspect ratio is half a deliverable. Starting from a prompt is marked as coming rather than quietly shown, which is the honest state of it. The engine is the moat and it gets built before the AI layer that sits on top of it.

## The scope decision is the interesting part

The full idea is large: references and research, design import, generative video, a web tier, collaboration, general vector authoring. Built in that order it never ships.

So v1 is narrowed to one wedge, the data reel. Paste or connect data, get an on-brand animated chart or stat reel, change the data and it restages, export. Nothing else until that works.

That narrowing is the only reason there is a buildable product here at all, and it is the decision I would defend hardest.

## Motion graphics, not video editing

The distinction matters and is easy to blur. A video editor arranges footage on a timeline. A motion-graphics tool generates and animates its own content from parameters, which means the primitives are procedural and data-bindable rather than clips.

Getting that right early is the difference between a product that can restage a reel when the numbers change and one where changing a number means redoing the work.

## Desktop first, and why

The web was the obvious choice and it was the wrong one, for two reasons that are both about cost rather than taste.

Export is the first. A motion tool has to turn a scene into a 4K file, and in a browser that means either capping export at something short and small or running a render farm. The farm was the largest cost and the largest risk in the web-only plan. On the desktop the export path is a native ffmpeg sidecar: 4K, long-form, deterministic, offline, and no server pays for it.

Storage is the second. Projects and media live on the machine, in the native file system with SQLite beside it, so the per-user storage cost is close to zero. A web tier can follow later off the same core, with a deliberately capped export and browser storage, but it follows rather than leads.

Tauri rather than Electron for the shell, which is lighter but means each platform renders in its own webview, and that is why the engine targets WebGL2 rather than WebGPU. Rust is the least familiar part of the stack, and it is also where the two hardest pieces sit: the engine and the export path. That is the argument for doing them first as spikes with a kill bar, rather than leaving the unfamiliar work until the end and discovering the gap halfway through a build.$b$, live_url = 'https://motif.gr8qm.com' where slug = 'motif';

-- 4b. The first five covers and the OutOut landing reuse, restored with the same regex casualty.
update bigyems_portfolio.projects set cover_url = 'https://res.cloudinary.com/dmxfjy079/image/upload/v1790066546/bigyems-portfolio/axe-lms/axe-lms_ncpdo6.png' where slug = 'axe-lms';
update bigyems_portfolio.projects set cover_url = 'https://res.cloudinary.com/dmxfjy079/image/upload/v1790066551/bigyems-portfolio/yarndok/yarndok_ohrqct.png' where slug = 'yarndok';
update bigyems_portfolio.projects set cover_url = 'https://res.cloudinary.com/dmxfjy079/image/upload/v1790066555/bigyems-portfolio/jaye/jaye_mdig2r.png' where slug = 'jaye';
update bigyems_portfolio.projects set cover_url = 'https://res.cloudinary.com/dmxfjy079/image/upload/v1790066559/bigyems-portfolio/skoolrithm/skoolrithm_athl28.png' where slug = 'skoolrithm';
update bigyems_portfolio.projects set cover_url = 'https://res.cloudinary.com/dmxfjy079/image/upload/v1790066562/bigyems-portfolio/settle-in/settle-in_yamlab.png' where slug = 'settle-in';
update bigyems_portfolio.projects set cover_url = (select cover_url from bigyems_portfolio.projects where slug = 'outout') where slug = 'outout-landing';
update bigyems_portfolio.projects set live_url = 'https://myhum.space' where slug = 'hum';
update bigyems_portfolio.projects set stack = '{"React 19","React Router 7","PHP","Devign","Cloudinary"}' where slug = 'lightlife';

-- 13. Hikima's stack follows its body: React, not Framer.
update bigyems_portfolio.projects set stack = '{"React","CMS"}' where slug = 'hikima';

commit;

-- NOT SET, and why:
--   hum       myhum.space serves a placeholder: "HUM is loading. We are putting the finishing touches to it."
--   ucda      usecase.design renders a red "Error: TypeError: Failed to fetch" in the body of the page.
--   fountium  fountium.com never finishes loading; every capture is a spinner over a dimmed hero.
--   leanhq    leanhq.io redirects to a Google sign-in wall. Captured but not used: your call whether a
--             login screen earns a place. The file is in the session scratchpad if you want it.
