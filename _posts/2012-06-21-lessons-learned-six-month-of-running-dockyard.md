---
layout: post
title: "Lessons Learned: The First Six Months of Running a Software
Consultancy"
comments: true
author: Brian Cardarella
twitter: bcardarella
github: bcardarella
category: opinion
social: true
summary: "Brian talks about what has workked, what has not worked, and
the changes that have been made at DockYard during its first six month"
published: true
---

Before I get into it, I'm writing this because when I was first setting
out with DockYard there was little to no guidance. It seems that most
agencies are hush-hush on how they work internally. Or I just suck at
the Googles. In any event, I wanted to share our experience in the hope
that others can learn and give feedback.

## Clients ##

Be selective! If your gut tells you something is wrong listen to it. I
made a huge mistake with taking our very first client and an even bigger
mistake about re-signing with said client. It ended ugly, I always felt
it might. The client was bad (no I won't say who it was) and it really
put us in a very difficult position when we were getting started. I went
back to re-sign because the first contract ended in December. It turns
out December is a *terrible* month for finding new work. I panicked,
rookie move. Thankfully we have had great clients since. That's not to
say we haven't had to dodge potentially bad clients from time to time.

Some clients are just bad, but many are just "bad for us". Those two
statements are very different and recognizing the difference is
important. "Bad for us" clients might be fantasic people but the
projects aren't in our wheel house, in those cases I try my best to help
those people find other consultancies/freelancers.

## Employees ##

#### Salary ####

DockYard started as bringing together three freelance developers. The
first mistake I made was not insisting that everyone start on fulltime
salary. We were still paying out the full hourly rates then paying taxes
on top of that. Needless to say, accounting is not my strong point. It
took 2 months before I figured out why we weren't making any money.
Whoops.

### Process ###

I've changed from the "anything goes" type boss to the "I'm going to be
the hard-ass" over the past six months. Here is why: we want to balance
multiple projects. Finding a client that has enough of a budget for a 6
person team is great but not very likely if we stick with startups. So
our team sizes are small, but we need to be redundant. I tell everyone
on my team that they "need to be replacable". Don't take this statement
the wrong way, I'm clear that this doesn't mean they're getting canned
at the drop of a hat. It means that I don't want to be in a position
where someone gets sick, goes on vacation, or leaves for another
opportunity and we plug someone else into that project and it takes that
person a week to ramp up because we need to figure out what the last
person was doing. *Process is very important*, I would rather have good
developers that buy into our process than have awesome developers that
don't. We function best as a team. So when someone isn't buying into the
process we've been outlining I need to be the guy that says "no". A few times this
has turned into debates, sometimes into arguments. I'm willing to modify
our process if something better is proposed but I'm not willing to
switch into the "just get it done". At the start I avoided uncomfortable conversations, 
if something was happening that I didn't think was right for DockYard I would wait it out.
This was a bad idea, the best time to correct something is now. Today I 
am jumping on these things immediately. I would rather have an airing of grievances 
when the issue is small rather than let it blow up.

Here are some things that, arguably, are
[bikeshedding](http://en.wikipedia.org/wiki/Parkinson's_Law_of_Triviality)
but I have been insisting on:

#### The trivial ####

* Whitespace
* Single quotes instead of double quotes
* Verbose variable names
* Consistency between backend model names and HTML markup class names

#### The important ####

* Testing
* Code quality
* CoffeeScript
* File/class naming conventions and organization

### Remotes ###

We started as entirely remote team. Angelo in Rhode Island, Russ in
Maine, and myself in Boston. This is OK but I must admit I'm not a big
fan of this. We have been hiring in Boston and will continue to grow a
team here.

## Rates ##

We originally started at $120/hour. We have since moved to a flat
$4,000/week per developer. This buys the client about 32 hours of our
time.
This has been the single best change we've made. Keeping track of every
hours sucks, and I had to be on everyone's ass making sure they got
their hours in. Now it is pretty simple. The clients also prefer this
system of invoicing, especially many of the large enterprise type
clients we are looking to go after.

That being said, I think our rate is below our market value. I've spoken
with many other consultancies and the average seems to be $6k - 7k per
week for full stack (which we are). We are planning on raising our rates
to $5k in September then hopefully up to $6k by next year. It's not that
I don't think we are technically qualified to justify those rates yet,
its that I want to build out our portfolio first.

I've noticed that many people don't want to talk about money. I actually
don't mind it, to the point that some people might find it annoying. In
order for the market to adjust properly I think an open discussion on
rates is necessary.

I have also started telling potential clients our minimum project budget
($30k) before we get into any details of the engagement. Some might find
this off-putting. Here is my perspective: the client's time is valuable
and I don't want to waste their time. In most cases budget is a deciding
factor, let's get that out into the open immediately rather than dealing
with surprises a month from now.

We have reduced our rates to work on interesting projects. We're nearly
done with a real-time chat app using an EventMachine backend with a
websocket front end. That was a fun one to build, we reduced our rate by
17% because of the client's limited budget.

## Business Development ##

This is something I have learned as I go. Not to toot my own horn but I
believe one of my strengths is selling DockYard as a business to
potential clients. Finding new clients has not been easy. Here are some
things that led directly to client contact (sorted by most effective):

* Writing blog posts
* Giving presentations to general tech audiences (more beginners than
  experts)
* LinkedIn
* Referrals
* Being found on Google

LinkedIn?? Yeah, it actually worked. But I did something incredibly
douchey. I modified my LinkedIn profile to basically be an ad for
DockYard then I went to LinkedIn's "People you may know" page and
clicked on over a thousand people. I got flagged for spamming but it
worked. Yes, I know it was a huge douchebag move. However, I suspected
that people would look at my profile to see if they knew me, or wanted
to be connected. If they happened to have a development need they would
contact me, if they didn't they wouldn't. At the very least I was
exposing DockYard to many people. I went from less than 100 LinkedIn
connections to close to 1000 in a week. We got two contracts from doing
this, it was worth it.

Here are things that have not worked for us (yet)

* Running Community Events
* Sponsoring
* Open Source Development (see the comments for some interesting debate on this topic)

I organize [BostonRB](http://bostonrb.org), it is one of the largest
Ruby user groups in the world. We have awesome speakers every month.
Every now and then when I talk shop with someone about work I get the
"I'm sure running BostonRB doesn't hurt" with a wink. I find this
annoying. I've gone out of my way to make sure BostonRB doesn't get
co-opted by any one company for promotional purposes. There is another
"Boston Rails Meetup" in Newton, MA that is essentially used to boost
SEO for another consultancy. I think this is bullshit. I'll say it right
now: We have never been contacted by a client because of running
BostonRB. I'm not saying I would turn any down, but in my experience
running a user group is not driving clients to us.

Now that I'm getting off my soapbox in the upcoming months DockYard will
be listed as a Sponsor for BostonRB, along with every other company that
is donating time, pizza, meeting space, etc...

I'm a huge advocate for Open Source Development, but it also has very
poor ROI if your goal is to get clients. I believe there is a threshold
for this, if you're on a certain tier (i.e. core committer to a popular
framework) it might be different.

## Targeting Startups ##

On any given day people will hear me complain about startups. By their
very definition startups don't have money. As a consultancy we are
looking to make money by engaging clients. If anybody tells you they're
consulting because it is their passion or work with startups, they are
full of shit. This is a cash game. Demand is at an all time high, there
is a lot of opportunity to do well and work for yourself. While some of
the technology challenges startups present are very interesting I am
also running a business. This is why we have begun to favor enterprise.
We can get longer term contracts and these companies pay on time. The
downside is the technology is not terribly interesting.

We are striving to find a balance here. I would be interested in hearing
others experience.

## Doing Too Much ##

Right now I'm the guy wearing all of the hats. On any given day I'm
doign the following:

* Biz development
* Marketing
* Lead Development
* Project Management
* Paying bills

Thankfully I haven't burnt out yet but this cannot continue much longer.
The biggest mistake I have made over the first six months was not making
an early hire to take some of this load off. I must admit, this one
stumps me. I know how to hire a good developer, I know how to hire a
good designer. I have no idea how to hire for non-tech positions. We
have already hired a accountant to handle some of the larger items but
I'm still responsible for every day invoicing and book keeping. In my
mind, here are the priority hires:

1. Business developer. I have had light feelers out for this position
   over the past few months. We really need someone focused on this
fulltime. Ideally someone that wants to hook into the startup community
in Boston or has existing sales relationships in the enterprise world.
Or if you happen to be in DC and have existing connection in the
political world we'd love to talk. [Contact
us](mailto:contact@dockyard.com).

2. Office manager. We will be moving into our own space in the Fall. At
   that time we will be looking to fill this position.

3. More developers and designers.

## Our Process ##

We have modified how to engage clients. This is what we are currently
doing

### Initial Engagement ###

Phone call, get to know the client. Determine if we are a good fit. If
so and the client is happy with references, rate, etc... we move
forward.

### Kick off ###

We charge for this. Currently it is $1000. We will sit down the client and
will run through what they want soup to nuts. We'll have development and
design on hand for this meeting.

### Design Phase ###

We originally combined development and design after the kickoff. This
was a mistake. There is a lot to be learned by doing an upfront design
phase. It helps us make informed estimations. The clients are happier
when we can deliver what we estimate. This phase we generally go for
wireframes and workflow. Nothing polished. We like to wireframe in
HTML/CSS.

### Development Phase ###

Now that we have the general design worked out we begin development.
There will also be design done during this phase as well.

I would love to hear about other processes. What works, what doesn't
work.

## Conclusion ##

I hope some peope find this information useful. Please feel free to ask
any questions or if you need me to elaborate on anything. If you feel
I'm off the mark or have suggestions feel free to comment as well. We're
always looking to improve.

