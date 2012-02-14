---
layout: post
title: Love Your lib Directory
comments: true
author: Brian Cardarella
twitter: bcardarella
github: bcardarella
category: ruby
social: true
summary: Patterns for happy hacking
---

[Be sure to check out Bryan Helmkamp's blog post on the same topic](http://blog.codeclimate.com/blog/2012/02/07/what-code-goes-in-the-lib-directory)

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

#### Use initializers for initializing, that is all ####

I have seen developers dump code into initializers that has no business
being there. Yes, it loads and it works. That is not the point. We have
conventions for a reason. Any code that you feel needs to go into an
initializer and has nothing to do with actually setting preferences or
something of that manner almost always should go into the `lib/`
directory. If you **must** monkey patch. Put it into the `lib/`
directory. If you are creating a new class or module that has no
business being in `app/models` put it in to the `lib/` directory.

#### Using lib/ to extend core, stlib, or a gem ####

Far too often I've needed to extend a class that is being defined
outside of my project. There are a few ways to deal with this. You can
use a [Composite](http://en.wikipedia.org/wiki/Composite_pattern) to
define a new class that you can then play around with. The downside to
this is that I sometimes want to modify a class that is being inherited
by other classes. This is when I think it is appropriate to [Monkey
Patch](http://en.wikipedia.org/wiki/Monkey_patch).

The pattern I have fallen upon is to define a `gem_ext/` directory and a
`gem_ext.rb` file in lib. I then make sure the extensions are loaded up
using an initializer. For last of a better term I call this
`lib_loader.rb`. Lets start with the loader.

{% highlight ruby %}
# config/initializers/lib_loader.rb

require 'gem_ext'
{% endhighlight %}

Simple enough. Now for this example I'll use a [Haml](http://haml-lang.com/) custom filter I wrote.
This filter allows me to write [Handlebars](http://handlebarsjs.com)
templates in my views like so:

{% highlight haml %}
-# app/views/home/show.html.haml

:handlebars
  // handlebars code goes here
{% endhighlight %}

Now I can easily add handlebar templates to any haml file. This is how I
did it.

Under `lib/gem_ext` I defined a `haml/` directory and a `haml.rb` file. Then I defined `haml/custom_filters.rb` and inside that file
I added

{% highlight ruby %}
# lib/gem_ext/haml/custom_filters.rb

module Haml::Filters
  module Handlebars
    include Base

    def render_with_options(text, options)
      type = " type=#{options[:attr_wrapper]}text/x-handlebars#{options[:attr_wrapper]}"
      <<-END
<script#{type}>
//<![CDATA[
  #{text.rstrip.gsub("\n", "\n    ")}
//]]>
</script>
      END
    end
  end
end
{% endhighlight %}

Now in `haml.rb` I added

{% highlight ruby %}
# lib/gem_ext/haml.rb

require 'gem_ext/haml/custom_filters'
{% endhighlight %}

And finally in `gem_ext.rb` I added

{% highlight ruby %}
# lib/gem_ext.rb

require 'gem_ext/haml'
{% endhighlight %}

This gives me a very clean approach to extending classes without
worrying about muddying up the load path with name collisions or other
surprises. In addition this pattern can
be repeated for `Core` and `Stdlib` classes in `core_ext` and `stdlib_ext`
respectively.

#### Using lib/ as a pattern to extracting Rubygems ####

A pattern I have fallen upon when wanting to extract functionality out
of an app into a Rubygem has been to first extract that code into the
lib directoy. From there I have a nice way to test the code in
isolation. I am also forced to write the code as a class independent
from my app. After I am satisfied with what I have I can think about
extracting that into an external gem.

A great example of this is something that [Patrick Robertson](http://p-rob.me) wrote for
[BostonRB](http://bostonrb.org)

We wanted to show the next upcoming event at the top of the website. All
of our events are stored in a Google Calendar. Unfortunately most of the
Google Calendar gems out there are crap. Patrick decided to roll his
own.

You can see that the [boston_rb_calendar.rb](https://github.com/bostonrb/bostonrb/blob/master/lib/boston_rb_calendar.rb)
is requiring several files just like any Gem would. Because of the
isolation [he was able to test the class very easily](https://github.com/bostonrb/bostonrb/blob/master/spec/lib/boston_rb_calendar_spec.rb).

From here, if Patrick wanted to release this as a gem it wouldn't take
too much effort. Some renaming of classes would be required but he has
all of the major parts in place.

#### Go forth and show some <3<3<3<3 ####

Keeping your code clean pays itself forward in many way. The team you
are apart of or the team you are handing off to will thank you. Heck,
your future self might thank you. The patterns I've described here are
ones that I have found success with. If you have noticed other patterns
concerning the `lib/` directory please feel free to comment!
