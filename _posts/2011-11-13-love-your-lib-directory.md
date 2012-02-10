---
layout: post
title: Love Your lib Directory
comments: true
author: Brian Cardarella
twitter: bcardarella
github: bcardarella
category: ruby
---

The `lib/` directory is the Red Headded Stepchild of your Rails
application. Let's discuss some conventions for keeping it clean and
what should and shouldn't go in there.

#### It's not a dump ####

![Dump](/images/dump.jpg)

Does this look familiar? It does to me. This is what my `lib/` directory
looked like before I got fed up with it. That truck, that was me dumping more
code into `lib/`.

In my experience there is one outstanding reason why code ends up
getting dumped into the lib/ directory: A poor understanding of what a
model is. Rails has this way of reinforcing bad habits. Perhaps because
it is so easy to get going some developers never bother to learn that a
model does not in any way need to be attached to a persitence layer.
(i.e. ActiveRecord)

Let's all agree to the following:

1. All Business Logic Goes Into A Model
2. All Models Go Into `app/models`

When we say "Business Logic" we are of course talking about "Application
Specific Business Logic". There is always the case of something you're
working on that is so generic it can be shared with other applications
you are (or will be) working on. Or, even better, with the community in
general as Open Source. That brings me to the next point.

#### Understanding the load path ####

If you have written a Rubygem, or at the very least, looked through one,
you know that the `lib/` directory is special. The short version of the
story is that Rubygems iterates over all of the libraries you have
installed as a gem, and appends any `lib/` directories onto Ruby's Load
Path. This is basically how Ruby gem files are exposed, so when you as
do a gem require it will iterate through every path in the load path and
give you the first match.

This is also true with Rails. After all of your gems are loaded and your
application is up Rails will append `./lib/` to your load path. Any
files you put in there can now be required the exact same way gems are.
This gives us an excellent path to extracting general functionality out
into. You can even play tricks with this, in your `application.rb` file
put the following at the top:

{% highlight ruby %}
$:.unshift(File.expand_path('../../lib', __FILE__))
{% endhighlight %}

Now in your lib directory create an 'active_record' directory and add a
file called 'base.rb'. Inside that file add the following:

{% highlight ruby %}
raise "ZOMG I BROKE RAILS!"
{% endhighlight %}

Load up your Rails app and watch it throw an exception. Why? Because
your app's `lib/` directory was prepended to the load paths and when the
lookup for `active_record/base` happened the first match was in your
app's `lib/` instead of in the proper gem. This of course is more of an interesting hack than anything really
useful. But it does do a good job of demonstrating how Rubygems' lookup
happens.

#### Using lib/ instead of monkey patching or forking ####

I have seen this far too often: A gem has a bug or does not do exactly
what the developer wants. This is Ruby and we have Github: FORK! Fork
the gem, patch the code, submit a pull request that gets ignored, original 
gem gets updated over time, those changes and bug fixes never
get pulled into the fork, things get ugly...

I suggest the following pattern: Inheritence.

We have been using OmniAuth-Identity in a recent project. Unfortunately
the authentication only does a case-sensitive match against email
addresses. This may be a bug. But in the mean time I do no want to
monkey-patch and I do not want to form. Instead I will inherit 
OmniAuth-Identity into a new class that will allow me to override this
behavior. I'll call this class `MyIdentity`. I could dump the file in
the base `lib/` directory but because the `lib/` directory is exposed on
the load path I don't want to possibly step on the toes of any other
libraries. Instead I'll namespace it in the exact same way OmniAuth
namespaces its own strategies: `lib/omniauth/my_identity.rb`

I create an initializer called `lib_loader.rb` and use this to require
anything in lib. (I am not a fan of adding `lib/` to Rails'
autoload_paths, but that is just a preference)

#### Use initializers for initializing, that is all ####

I have seen developers dump code into initializers that has no business
being there. Yes, it loads and it works. That is not the point. We have
conventions for a reason. Any code that you feel needs to go into an
initializer and has nothing to do with actually setting preferences or
something of that manner almost always should go into the `lib/`
directory. If you **must** monkey patch. Put it into the `lib/`
directory. If you are creating a new class or module that has no
business being in `app/models` put it in to the `lib/` directory.


