begin;
update bigyems_portfolio.projects set body = $b$Flock is a multi-tenant church platform. Eighteen admin modules, twenty member-facing surfaces, three separate audiences and a platform console of its own, sitting on a long tail of Supabase edge functions and a longer one of migrations. All of it mine.

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

The edge functions are where the real complexity ended up, and looking at the list is a fair summary of what running this actually involves: church signup and slug checking, user creation and deletion, subscription retry and cancellation, email OAuth and secret handling and unsubscribe, event reminder scanning, a daily automation pass, an error digest, a developer API, signed Cloudinary uploads.

Almost none of that is visible in a screenshot. All of it is the difference between a demo and something a church can run on a Sunday.

## An API other systems can build on

One of those edge functions is a developer API, and it is the piece that turns Flock from an application into something other software can sit on top of. A church's own tools, or somebody building alongside them, can read and write through it rather than exporting spreadsheets out of the admin and re-importing them somewhere else.

That is a different discipline from building screens. An interface can be changed on a Tuesday; an API that another system depends on cannot, so it has to be designed once, versioned deliberately and documented well enough that somebody can integrate without asking me a question.

## What I would do differently

The migration history for one product is very long. Honestly read, that says the schema was discovered rather than designed: I learned what a church actually needed by building it, and the migration history is the record of that learning. It works, and the cost is that nobody can reconstruct the intent of the data model by reading it.

Real usage as it stands: more than 800 members, over 4,000 messages, more than 2,200 attendance records and over 1,000 emails sent.

## What multi-tenancy actually costs
Multi-tenant is one word in a pitch and a year of work in a codebase, and the part that never appears in a screenshot is the security surface. Every table holding a church's data carries its own row-level policies, and there are over a thousand of them across more than two hundred tables. Each has to answer the same question the same way: which church is this, and what is this person allowed to do inside it. One of them wrong is not a bug, it is another church's data.

That is why tenancy resolution lives in its own package and identity in another, rather than inside the modules that consume them. A module cannot form a private opinion about which church it is in, because the only route to the answer runs through code that resolves it once.

The skills that actually took: Postgres row-level security as the primary authorisation mechanism rather than a backstop behind application checks, a role model that is data rather than branching, and the discipline never to let a browser-side application be the thing that decides who sees what. Plus the unglamorous half, a migration discipline that can move a schema this size forward without taking a live church offline on a Saturday night.
$b$ where slug = 'flock';
update bigyems_portfolio.projects set body = $b$OutOut is for the group of friends who cannot agree on a date, work out who owes what, or find the photos afterwards. It does those three things in one place instead of losing all of them in a group chat, and it works with no signal. Live on the App Store as `com.outout.mobileapp`. Flutter with BLoC, Drift for local persistence, Supabase behind it and FCM for push. Most of the build is mine.

## Offline-first was the requirement, not a feature

The users are out, on their phones, in venues, on Nigerian mobile data. An app that assumes a connection is an app that fails at exactly the moment it is being used.

So the local database is the source of truth the interface reads from, and sync is a separate concern that reconciles with the server when it can. Drift holds the local state, BLoC keeps the sync engine out of the widget tree, and the interface never waits on the network to render.

## The incident worth writing about

In July a Supabase upsell notice arrived for what is, by any measure, a small app. Roughly 1.6 million requests in a month against a user base of about a hundred people.

The cause was two things compounding, and neither looked wrong in isolation:

- A query passed an unbounded list of ids into an `in()` filter. Past a certain length the URL exceeded what the endpoint would accept and the request failed with a 400.
- A listener refetched on failure. No backoff, no cooldown, no cap.

A failing request that triggers an immediate retry of the same failing request is a loop that runs as fast as the network allows. The fix was to chunk the id list so the URL can never grow unbounded, and to put a backoff on the retry.

The lesson I took from it is that this class of bug is invisible in testing, because with ten rows the URL is short and the query succeeds. It only appears at the data volume where it costs money, and the first signal was a billing email a month later rather than an alert the same day. A cheap daily request-volume check would have caught it in a day.

## Then I measured what a user actually costs

Because the incident made the question concrete, I measured the full cost to serve one monthly active user against production rather than estimating it.

Measured on 06/08/2026, it came to about 18p per user per month as configured. The interesting part is the breakdown: Supabase was 0.7p of that. Over 85% was observability, dominated by session replay at roughly 15p per user, and two configuration lines accounted for most of the bill. Fixed, the same product costs about 3p per user per month.

That is a six-fold difference in unit economics sitting in two lines of config, and nobody would have found it by reading the code.

## Offline is a write problem
Caching what somebody has already read is the easy half and it is the half most "offline-capable" apps stop at. The hard half is what happens when they change something with no signal, which on this product is most of the interesting actions: an RSVP on the Underground, a photo added in a basement bar, an expense split on the way home.

So writes go through a durable queue. Each deferred mutation is persisted with its kind, its payload, an attempt count and the last error it hit, which means it survives the process being killed and drains when connectivity returns, while an optimistic update keeps the interface truthful in the meantime. A row cache sits alongside it so reads stay warm.

The skills that needed: local-first data modelling in Drift rather than a cache bolted onto a network layer, an outbox that can be retried without doing the same thing twice, and enough judgement to decide which conflicts resolve silently and which have to be shown to a person. Then the mobile discipline around it, because a release that corrupts a local database is not a redeploy, it is a support problem on devices you cannot reach.
$b$ where slug = 'outout';
update bigyems_portfolio.projects set body = $b$Skoolrithm is a multi-tenant school-management SaaS: a pnpm monorepo with three applications, a tenant web app, a platform admin and an Expo mobile app. I own the mobile app, which is live on the App Store as `com.skoolrithm.app`, and contributed substantially to the other two. I did not own the repository and I am not the founder.

That distinction is worth making plainly, because a whole-repository view would have told you I was a minor contributor and that is not true either.

## Why the numbers needed reading properly

Across the whole monorepo I look like roughly a third of it. By files touched inside `apps/mobile` I am about 69% of it, and I built the tenant and platform front ends as well.

For a monorepo, per-directory authorship is the real signal. A whole-repo contributor graph can completely hide the fact that one person owns an entire application inside it, in either direction. Mine understated it, and I would rather explain the method than pick the flattering number.

## The mobile app

Expo and React Native, currently v1.0.3, distributed through EAS with over-the-air updates, Firebase for push, and TanStack Query with offline persistence so the app is usable on a school run rather than only on wifi.

## The hardest part was finding out what was actually broken

Three applications over one backend, and the interesting failures were not inside any of them. They were in the gaps: a route that existed twice, once as the real screen and once as a stub returning null, with the live product linking to the dead one from two places, the setup flow's completion step and the admin dashboard's own checklist. Nobody reported it, because the people who hit it assumed they had done something wrong.

The fix was ten minutes. Finding it took building a Playwright suite that drives a real tenant the way a real user does, signing in as an administrator and as a class teacher, and it surfaced four defects of that shape on the first run.

That is the part I would argue is the senior work. Anyone can fix a blank page once it is reported. The harder call is spending a week on a test suite that ships no feature, on the argument that a product with three front ends over a separate backend has failure modes nobody finds by clicking around.

## Design lead as well as mobile lead

The three applications share a system rather than diverging, and that is a deliberate outcome rather than a happy one. `packages/ui`, `packages/api-client` and `packages/api-types` are shared across the mobile app, the tenant app and the platform console, so a component, a request and a type each exist once.

It holds because the same person built all three front ends. That is the honest version of the advantage: not a governance process, just no handoff to lose the system across.

## What three front ends over one backend takes
A monorepo is not the achievement. Keeping three applications honest against a backend somebody else owns is.

The shared packages are the mechanism: one UI package, one API client and one set of types, so a field that changes in the backend breaks a type check rather than a screen in production. Routing is file-based on the web side and Expo on mobile, with builds and over-the-air updates through EAS, which is the part that decides whether a copy fix takes ten minutes or a week of store review.

The skills: contract-first work against an API you do not control, a mobile release process that spans two stores, and browser and device testing that runs against a real tenant rather than a mock, because the failures worth catching live in the gaps between the three apps rather than inside any one of them.
$b$ where slug = 'skoolrithm';
update bigyems_portfolio.projects set body = $b$LightLife Church runs on this. Not a pitch, not a prototype: a live church platform and public site at lightlifechurch.com, with member management, QR check-in, attendance, programmes, media, giving, forms, voting, a Q&A surface and an admin. Sole author.

## What it replaced

A managed WordPress account. That is the honest starting point and it is worth saying, because it is where most organisations of this size actually are: a theme, a pile of plugins, a renewal date, and no way to answer a question about your own membership without exporting something.

The distinction from Flock is worth drawing too, since a reader who sees both will ask. LightLife is one church running on a system built for it. Flock is the same problem generalised: multi-tenant, sold to churches that are not this one. One is the instance, the other is the product.

## The one to talk about is attendance

QR check-in is the feature that sounds trivial and is not. It has to work with a queue of people at a door, on their own phones, on a bad connection, operated by a volunteer who was handed the tablet ninety seconds ago and will not read instructions.

## Built on my own component library

The interface is Devign, my published component library, with Cloudinary handling media and React Router 7 for routing. That is worth stating for one reason: it is the difference between a design system that exists and a design system that is load-bearing. LightLife is the proof that Devign survives contact with a real deadline.

## Small surfaces that matter more than they look

Short-link redirects, an enquiry flow, testimony submission, a voting surface and a books catalogue are individually unremarkable. Collectively they are most of what a congregation actually touches, and they are the parts that get built last and worst on almost every church site.

Of all of it, attendance is the part that earns its keep. It is the second largest thing in the codebase after the admin itself, and it is the only piece used at a fixed time every week by people who are not administrators and did not ask for software.

QR check-in works because it makes the volunteer's job smaller rather than larger: a phone, a code, and no clipboard to transcribe on Monday. The measure of it is not the feature list. It is that the attendance record exists at all by the time somebody wants to ask a question of it, which was never true of the spreadsheet it replaced.

## A React application over an API I also wrote
There is no framework doing the wiring here. The front end is React, the back end is PHP, and the contract between them is a REST surface I designed and consume: attendance, events, forms, books, networks, users, the Q&A. Nothing generated it and nothing validates it for me.

That is a specific kind of work. Being on both ends means every decision is mine to get wrong twice, and the temptation is to let the API drift into whatever the current screen happens to need. Resisting that, keeping endpoints shaped around the domain rather than around the component that called them first, is the difference between an API and a pile of queries.

The skills: designing and versioning an interface with no framework enforcing it, session and permission handling written rather than installed, and the small hard pieces that a church actually uses on a Sunday, QR generation and short links that resolve on a phone with one bar of signal.
$b$ where slug = 'lightlife';
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

None of them can see your screen. Tori records the screen as well as the room, takes a screenshot when you ask for one, and turns the meeting into notes and deliverables rather than a transcript you still have to read yourself. It handles video as well as audio, and because every meeting you have had sits in one place, it can cross-reference them: what was agreed last time, what was said about this account in March, what has changed since. That is the part a transcription service cannot reach, and it is the reason to build rather than subscribe.

## Three operating systems, three toolchains
The capture story is the interesting engineering, but the work that consumed the most calendar time is the part nobody sees: shipping the same application to three platforms that agree on nothing.

Windows needs C# sidecars and an installer. macOS needs its own native helper, a hardened runtime, entitlements, code signing and notarisation before Gatekeeper will let a stranger open it, and a Homebrew cask if you want the install to be one line. Linux needs a third helper and an AppImage. Each platform has its own update channel, its own permission prompts and its own way of failing.

The skills: native interop from a TypeScript application without the bridge becoming the product, platform release engineering including signing and notarisation, and the judgement to decide what a single developer can maintain across three targets. The answer to that last one is why the capture helpers are small and sharply scoped rather than clever.
$b$ where slug = 'tori';
update bigyems_portfolio.projects set body = $b$Devign is a React component library on npm: over forty components, design tokens, theming and a setup CLI. Built on Radix for behaviour, Tailwind v4 for styling, Motion for animation. Sole author, and it is now the interface layer under my own production work.

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

## Where it is

Published as `devign` on npm, documented at devign-ui.vercel.app. It was called `yems-ui` before.

## Publishing is a different job from building
A component in an application has one consumer and you can change it whenever you like. A component in a published package has every project that installed it, and changing it is somebody else's Tuesday.

That changes the work. The API is the product, so a prop name is a commitment; the build has to ship modern modules and type definitions that hold up in editors; the version number carries meaning that other people rely on; and the styles have to land in somebody else's cascade without fighting whatever they already have, which is exactly where the defect above came from.

The skills: designing an interface for code you will not see, packaging and release discipline, and the specific patience of dogfooding your own library under deadline and fixing what that exposes rather than working around it in the consuming project.
$b$ where slug = 'devign';
commit;
