---
layout: post
title: Mobile Web Apps Still Have Some Major Hurdles
comments: true
author: Brian Cardarella
twitter: bcardarella
---

# {{ page.title }}
## {{ page.date || date_to_string }}

Over the past 24 hours I've seen several articles ([1](http://venturebeat.com/2011/11/09/mobile-web/),[2](http://www.guardian.co.uk/technology/blog/2011/nov/03/will-html5-replace-native-apps)) on [Hacker News](http://news.ycombinator.com)
predicting that in the near future mobile web apps are going to
replace their native counterparts. Here at DockYard we really hope this
happens, we believe in the mobile web and have decided forego regular
web application development in favor of focusing on mobile web
application development. However, xperience has told us the future is not as nigh as we
all hope.

Native applications (iOS, Android, etc...) still have and will continue
to have some significant advantages over mobile web apps. Let's start
with the obvious...

#### Native functionality

Having access to mobile hardware such as the camera, micorophone, and
storage (file system, internal datbases, etc...) is important. There is also the issue
of running the application in the background. None of this is currently
possible in a mobile web application. Immediately the scope of a mobile
web application is much smaller.

The [W3C has a working draft of what a media capture API should
be](http://www.w3.org/TR/html-media-capture/). It may be a
matter of time until we see mobile browsers begin to provide access to
this native functionality. Personally, I would like to see this API
developed further. In its current form it is simply a delegator API to
the camera and microphone application. We hand off application control and wait for a
callback that has the list of media just captured. This is not good
enough. How would a mobile web application compete with the many
different native camera applications that exist with custom camera
functionality if there was no way to
customize the camera experience? Simple: it can't. Augmented reality
mobile web application? Nope. What about something as simple as skinning
the camera? Not with the current working draft of the MediaCapture API.

Most mobile web browsers implement the HTML canvas element. So mobile
web gaming is possible. We're still waiting for the desktop
canvas apps to close the gap betweent their native desktop counterparts.
Mobile web gaming will not be competing with native mobile gaming
anytime soon.

#### Performance

Native is the clear winner here but with each new generation of phone
hardware the lead is becoming less noticeable. In fact, I'm going to
predict that in the 2nd half of 2012 (iPhone5, assuming Apple goes back
to the previous iPhone release cycle) for everything
except gaming the difference will be negligible.

We're getting closer and closer to the point of convergence. Hardware is
getting faster, JavaScript VMs are getting faster. Native and mobile web
apps will never be equally as fast, native will **always** be faster.
With each generation of mobile hardware we will care less because the gap will continue to get asymptotically
smaller.

This current performance gap can be felt most with [jQuery
Mobile](http://jquerymobile.com). We use jQuery Mobile, we believe in
it. On the latest iPhone 4S there is still a noticeable lag when
doing page trasitions, even on mobile web applications that have very few
pages of low complexity. The page enhancement algorithm does **a lot** of
DOM manipulation and hoop jumping. Elements are pulled out of the DOM,
wrapped, reinserted. In the end it allows us to
provide very little markup and get some beautiful results.

As of this writing jQuery Mobile is in 1.0 Release Candidate 2. On the bucket
list for 1.0 Gold is a [performance boost for page enhancement](https://github.com/jquery/jquery-mobile/issues/2853).
[Most likely this will only have an effect upon very complex pages](https://twitter.com/#!/jquerymobile/status/133670336318291969).
Closing the performance gap on jQuery Mobile is going to be a watershed
moment for mobile web application development.

#### Distribution

Nothing beats the web as a distribution platform. Everytime I use a web
app I am on the latest version of that app. If there are any business
critical updates they are immediately available for everybody. Native
mobile applications are at a clear disadvantage here. We're comparing a
passive opt-in system to an active apt-in system.

One disadvantage (for now) that mobile web applications have is
accessibility after distribution. Native apps default to installing on
your phone, mobile web applications do not. Yes, you can save links to
the mobile web app and make it appear you have it installed. But what
about off-line mode?

#### Discovery

I'm going to argue that native applications win here. Finding a native
mobile application is easier than finding a mobile web application.
Google has made a large dent for the web with Chrome's Omnibar. (btw,
why hasn't everybody copied the omnibar? This should be the default for mobile
web browsers, screen real estate is already at a premium.)

That being said, discovery for native is not great. We've
all see the studies where the Top 10 apps have a significantly skewed
download rate compared to the below Top 10. This is be expected. I don't
understand why the mobile app stores have not put more effort into
perfecting discovery. I'm more likely to purchase an application that I
like if I can find it easily.

#### PhoneGap (Apache Callback)

If you've made it this far you've probably been yelling at your screen
"**PhoneGap!**" to several of the points I've made above. Yes, PhoneGap solves many of these problems. But how do
we define a PhoneGap application? The technology stack I'm using is that
of a mobile web application: HTML, CSS, JavaScript. However, the
distribution and discovery system I'm using is that of a native
application. PhoneGap application straddle the fence betwen the two
worlds.

For those that don't know, PhoneGap extends a WebUI. It will add certain
functionality to the JavaScript API. Access to the camera, microphone,
filesystem [as well as many other wonderful features](http://docs.phonegap.com/en/1.2.0/index.html).
The PhoneGap developers were smart, they saw the W3C's proposed API for
some of this and modeled the PhoneGap API after it. In fact, PhoneGap
should acts as a polyfill if certain functionality already exists.

From a developer's point of view, PhoneGap in most cases should be a no
brainer. I am most likely developing a web site alongside the mobile
application. The website is likely going to be sharing the
functionality of the mobile application. It makes sense if my
mobile application can share a technology stack with my web application.
I don't have to employ a separate team to develop the mobile
application, and if you want to target more than one mobile platform
you'll most likely have to employ more than one team.

From our perspective PhoneGap gives us a
huge advantage. Why pay two teams to develop the same application when you
pay us once? Then when we hand off the team maintaining and developing
your website can also maintain and develop the mobile application. It's
a no-brainer. In most cases.

There are some serious issues with the PhoneGap project. The first of
which is the difficulty in reporting errors. This will hopefully change
now that the project is under Apache (as [Apache Callback](http://wiki.phonegap.com/w/page/46311152/apache-callback-proposal))
but the project has been split into different Github repos for each
platform. So there is one for [iOS](https://github.com/phonegap/phonegap-iphone), [Android](https://github.com/phonegap/phonegap-android), [Windows Phone 7](https://github.com/phonegap/phonegap-wp7), [BlackBerry](https://github.com/phonegap/phonegap-blackberry-webworks), [WebOS](https://github.com/phonegap/phonegap-webos), etc... they are all under seperate development with very dedicated teams. If I find a common problem that effects all platforms (for example, [a suggestion I proposed on how PhoneGap currently implements its File API](https://github.com/phonegap/phonegap-iphone/issues/280)) I have to report this issue individually on each platform. This is a very ineffecient process.

The second is the same issue stated above with the camera. While PhoneGap does give us the access to the camera we are still stuck
with the same experience we will have with the W3C MediaCapture API: no
camera customization, this is just a delegation with a callback. You can
hack together the camera experience you want if decide to write some
native code.

The third is lack of any background processing. When I throw my PhoneGap
app into the background it does nothing. It would be nice if we could
get a callback in the PhoneGap API that allowed us to kick off function
if the app is sent to the background. When it is up front again give us
another callback to halt the previous function.

[Check out the "Limitations" section on the PhoneGap wiki for some
others](http://wiki.phonegap.com/w/page/36752779/PhoneGap%20Plugins).

PhoneGap is fantastic. (despite some of the criticism I've stated) We have
high hopes for the project now that is is accepted into Apache.

### Conclusion

Perhaps [Adobe's announcement that they are abandoning Flash in
favor of HTML5 for mobile](http://techland.time.com/2011/11/09/mobile-flash-abandoned-for-html5-adobe-surrenders-apple-wins/?iid=tl-main-lede) will be seen as the turning point when
mobile web application development began to be a serious contender to
native. Or maybe it was just a coincidence that this buzz is happening
all at once. Either way, we're happy
people are talking about this. Discussions, arguments, and all of the
attention in between is the best way to push this technology into the
future we all know is just a matter of time.

We are not there... yet. Can anyone honestly say that in 5 years they do
not expect mobile web applications to be the norm? It is a great time to
be a web developer.

~ [{{ page.author }}](http://twitter.com/{{ page.twitter }})
