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

Real usage as it stands: more than 800 members, over 4,000 messages, more than 2,200 attendance records and over 1,000 emails sent.$b$ where slug = 'flock';
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

Published as `devign` on npm, documented at devign-ui.vercel.app. It was called `yems-ui` before.$b$ where slug = 'devign';
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

It holds because the same person built all three front ends. That is the honest version of the advantage: not a governance process, just no handoff to lose the system across.$b$ where slug = 'skoolrithm';
update bigyems_portfolio.projects set body = $b$Gr8QM Technovates is the company platform: a public site, a blog with its own CMS, courses, a job board, events, certificate verification, invoicing and payment, an admin surface, and the distribution portal for a separate product. Over 40 pages, 62 migrations and 10 edge functions, nearly all of it mine.

## What it replaced

A website. Not in the dismissive sense: a site that showed the company existed, said what it did, and stopped there. Everything a visitor might actually want to do next, enrol on a course, apply for a job, verify a certificate, pay an invoice, get a ticket to an event, happened somewhere else or by email.

That is the brief, and it is a common one. The company had a presence and no product. The work was turning the first into the second without it becoming a dozen disconnected tools sharing a logo.

## It is not a website, and that is the interesting part

The page list gives it away. Alongside the pages a company site is expected to have, there is `CertificateVerify`, `PayInvoice`, `PaymentSuccess`, `JobDetail`, `EventDetail`, `Glossary`, `Alumni`, `DsgnLaunchpad`, and a full DevignFX portal with its own login, dashboard and download-expiry handling.

Each of those is a small product with its own state and its own failure modes. Certificate verification has to be trustworthy to a stranger who was not the one issued it. Invoicing has to be correct. A download link that has expired has to say so clearly rather than 404.

## One platform carrying several audiences

A prospective student, an alumnus verifying a certificate, a job applicant, someone paying an invoice and a DevignFX customer collecting a build all arrive at the same domain wanting entirely different things. The structural decision was to let them share a shell and a design system while keeping their routes and their data properly separate.

## The honest state of the codebase

There is cruft. `AboutOld`, `HomeOld`, `CareersOld`, `ContactOld`, `PageNotFoundOld` are all still in the tree next to their replacements. That is what iterating on a live company site under time pressure looks like, and leaving the old page in place while the new one is proven is a reasonable thing to do. Not deleting it afterwards is not.$b$ where slug = 'gr8qm';
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

QR check-in works because it makes the volunteer's job smaller rather than larger: a phone, a code, and no clipboard to transcribe on Monday. The measure of it is not the feature list. It is that the attendance record exists at all by the time somebody wants to ask a question of it, which was never true of the spreadsheet it replaced.$b$ where slug = 'lightlife';
commit;
