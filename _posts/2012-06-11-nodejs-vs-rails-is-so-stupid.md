---
layout: post
title: node.js vs Ruby on Rails is so stupid
comments: true
author: Brian Cardarella
twitter: bcardarella
github: bcardarella
category: ruby
summary: Why comparing the too frameworks is dumb and how Ruby is still the best choice
published: false
social: true
---

Let me start this by admitting a few things:

1. I am a Ruby/Rails developer
2. My consulatncy, [DockYard](http://dockyard.com) specializes in Rails
3. I organize [The Boston Ruby Group](http://bostonrb.org)

Ok, so now that we have established that a grieat argument can be made
that I am not impartial I'm going to ask that read this as if I am. I
know, crazy! This is not a "Rails" is better than node blog post. I'm
hoping to show some hard data to prove my points. Please feel free to
leave a comment as I'm sure some will disagree.

## The Superficial Debate ##

A few months ago [node.js](http://nodejs.org) passed [Ruby on Rails](http://rubyonrails.org)
for the [#1 Watched Repo on Github!](https://www.google.com/search?sugexp=chrome,mod=12&sourceid=chrome&ie=UTF-8&q=nodejs+more+followers+than+rails).
Many took this as a changing of the guard, node was now the new king
shit. But does the number of watchers on Github actually mean anything?
If we are to believe that the mission of Github is "Social Coding" then
I would argue that the number of contributors is a more significant
number.

As of this writing Rails has 1,779 contributors while Node has 362. You
can grab these numbers for yourself:

{% highlight bash %}
$ git shortlog -s | wc -l
{% endhighlight %}

Rails has been under development for over 8 years and node for over 3.
That means Rails has averaged adding over 220 unique contributors per
year and node has only averaged about 120. Keep in mind that Rails did
not move to Github until 2008, don't think that made much of a
difference check this out this contributor visualization (Rails' move to
Github happens around 5:05)

<iframe src="http://player.vimeo.com/video/2979844" width="593"
height="333" frameborder="0" webkitAllowFullScreen mozallowfullscreen
allowFullScreen></iframe>

## Does this mean anything? ##

I don't think so, but I just wanted to highlight how pointless the
"Watcher" debate is. I do think within the context of Github
contributions are more important but ultimately it comes down to code
quality, more more difficult to measure.

Ok, let's put that behind us. The next argument is comparing the
performance in Rails to Node 
