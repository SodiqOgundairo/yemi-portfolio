begin;
update bigyems_portfolio.projects set body = $b$Flock is a multi-tenant church platform. Eighteen admin modules, twenty member-facing surfaces, three separate audiences and a platform console of its own, sitting on more than seventy Supabase edge functions and over six hundred migrations. All of it mine.

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

Six hundred migrations for one product is a lot. Honestly read, that number says the schema was discovered rather than designed: I learned what a church actually needed by building it, and the migration history is the record of that learning. It works, and the cost is that nobody can reconstruct the intent of the data model by reading it.

[YEMI: do you agree with that reading? If you do it is a strong thing to say out loud, because it is the kind of judgement people hire a senior for. If you think the migration count has another explanation, say so instead and I will rewrite it.]

Real usage as it stands: more than 800 members, over 4,000 messages, more than 2,200 attendance records and over 1,000 emails sent.$b$, metrics = '{"members": "800+", "messages": "4,000+", "attendance_records": "2,200+", "emails": "1,000+"}'::jsonb where slug = 'flock';
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

[YEMI: this is a flaw in your own product, so it is your call whether it goes on the page. My view is that it should. Finding a subtle cascade bug in your own library by dogfooding it, diagnosing it by byte offset, and saying so publicly reads as senior. Hiding it reads as marketing. But it is your library and your call, and if it stays you should fix it upstream first.]

## Where it is

Published as `devign` on npm, documented at devign-ui.vercel.app. It was called `yems-ui` before.$b$, metrics = '{"components": "40+"}'::jsonb where slug = 'devign';
update bigyems_portfolio.projects set body = $b$Skoolrithm is a multi-tenant school-management SaaS: a pnpm monorepo with three applications, a tenant web app, a platform admin and an Expo mobile app. I own the mobile app, which is live on the App Store as `com.skoolrithm.app`, and contributed substantially to the other two. I did not own the repository and I am not the founder.

That distinction is worth making plainly, because a whole-repository view would have told you I was a minor contributor and that is not true either.

## Why the numbers needed reading properly

Across the whole monorepo I look like roughly a third of it. By files touched inside `apps/mobile` I am about 69% of it, and I built the tenant and platform front ends as well.

For a monorepo, per-directory authorship is the real signal. A whole-repo contributor graph can completely hide the fact that one person owns an entire application inside it, in either direction. Mine understated it, and I would rather explain the method than pick the flattering number.

## The mobile app

Expo and React Native, currently v1.0.3, distributed through EAS with over-the-air updates, Firebase for push, and TanStack Query with offline persistence so the app is usable on a school run rather than only on wifi.

[YEMI: what is the single hardest thing you solved in this app? Offline persistence for a school context has some genuinely awkward problems in it (whose data syncs, what a parent sees versus a teacher, what happens when a term rolls over) and one specific war story would carry this whole page.]

## Design lead as well as mobile lead

The three applications share a system rather than diverging, and that is a deliberate outcome rather than a happy one. `packages/ui`, `packages/api-client` and `packages/api-types` are shared across the mobile app, the tenant app and the platform console, so a component, a request and a type each exist once.

It holds because the same person built all three front ends. That is the honest version of the advantage: not a governance process, just no handoff to lose the system across.$b$, metrics = '{"screens": "100+"}'::jsonb where slug = 'skoolrithm';
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

[YEMI: pick the one of these you are proudest of and tell me why, and I will expand it into a proper section.]$b$, metrics = '{"pages": "55+"}'::jsonb where slug = 'lightlife';
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

That is a six-fold difference in unit economics sitting in two lines of config, and nobody would have found it by reading the code.$b$, metrics = '{"users": "140+", "screens": "45+", "migrations": "175+", "edge_functions": "18+"}'::jsonb where slug = 'outout';
update bigyems_portfolio.projects set metrics = '{"pages": "75+", "migrations": "60+", "edge_functions": "10+"}'::jsonb where slug = 'gr8qm';
update bigyems_portfolio.projects set metrics = '{"pages": "40+"}'::jsonb where slug = 'academy';
update bigyems_portfolio.projects set metrics = '{"pages": "45+"}'::jsonb where slug = 'aienai-co';
update bigyems_portfolio.projects set metrics = '{"users": "100+", "platforms": 3, "releases": "20+"}'::jsonb where slug = 'tori';
commit;
