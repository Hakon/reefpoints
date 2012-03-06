---
layout: post
title: "Our Continuous Integration Setup"
comments: true
author: Dan Seaver
twitter: dan_seaver
github: danseaver
category: ruby ci jenkins
social: true
summary: "What we are doing to keep our developers honest with their tests"
published: true
---

When I started at DockYard, Brian tasked me with setting up a continous
integration (CI) server so that we could keep an eye on our RSpec test
suite. We went with Jenkins since we are writing client code, so
[travis-ci.org](http://travis-ci.org) is out of the question (for now).

Our CI server is running on Ubuntu 10.04. We are using nginx as a
reverse proxy infront of our Jenkins server. Our basic setup is the same
as [the presentation I gave at Boston RB in January](http://bostonrb.org/presentations/jenkins-rails).
There are a few upgrades I have made since then.  First, I set up the
GitHub authentication plugin. The other plugin I installed was the
Campfire notification plugin. Since we are all remote, we use Campfire
as our main line of communication. Having Jenkins notify us in Campfire
allows us to see when new code is pushed to master, and when someone
breaks the build.

## RSpec HTML formatter + Jenkins = Every Build is successful (even when it isn't)##

As we found out the hard way, using the RSpec HTML formatter from within
jenkins is not the best idea.  The problem is the HTML formatter returns
the same exit code regardless of whether or not the suite passes. This
is a huge problem, as you end up with false positives.

## Enter ci_reporter ##

The [ci_reporter](https://github.com/nicksieger/ci_reporter) gem provides a rake
task that generates a set of xml reports that Jenkins can interpret and
give us a more complete picture of our test suite. Jenkins will plot the
number of failure over time, display test duration, and provide a number 
of other stats you can utilize. 

## Capybara-webkit + Xvfb + headless = Javascript without opening a browser ##
We are using capybara to run our [request
specs](http://railscasts.com/episodes/257-request-specs-and-capybara).
When our request spec needs javascript, we use 
[Capybara-webkit](https://github.com/thoughtbot/capybara-webkit) as our
javascript driver. Capybara-webkit is a
webkit capybara driver, allowing you to run javascript in a headless
webkit instance.  It accomplishes this by using QtWebKit. On Ubuntu, to
utilize capybara-webkit, you need an X Server running when you run your
test.  To accomplish this, I installed Xvfb, which will create a
virtual framebuffer.  To instantiate xvfb, I used the headless
gem, which is a ruby wrapper for xvfb.  With headless, I don't have to
do any bash scripting to get a framebuffer ready before we run our
tests. 

I added the following code to our `spec_helper.rb` file

{% highlight ruby %}
config.before(:suite) do
  @headless = Headless.new
  @headless.start
end
 
config.after(:suite) do
  @headless.destroy
end
{% endhighlight %}    

The above spippet creates the headless instance and creates the
framebuffer at the beginning of the test suite, and destorys it
afterwards.

## Conclusion ##
Overall, I'm pretty happy with our set up as it is. The one issue I have
with it is the way ci_reporter and jenkins interact. Since Jenkins was
origianlly built for Java, builds are BROKEN when they don't build, but
UNSTABLE when their tests fail.  UNSTABLE builds are seen as successful.
I would rather an UNSTABLE build be seen as a failure, since the
campfire notification plugin plays the same sound for successful and
unstable builds.  I may poke around with the plugin or ci_reporter to
have jenkins notify us of builds in a way that makes more sense.
