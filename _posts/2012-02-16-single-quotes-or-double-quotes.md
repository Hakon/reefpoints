---
layout: post
title: Single quotes or double quotes?
comments: true
author: Brian Cardarella
twitter: bcardarella
github: bcardarella
category: ruby
social: true
summary: An opinion on when to use the different quoting styles with some performance notes
---

I have a simple rule when it comes to strings: I always start out with
single quotes

{% highlight ruby %}
'Hello world!'
{% endhighlight %}

When I need to interpolate in the string or add an escaped character it
is time to upgrade to double quotes

{% highlight ruby %}
"Hello #{planet}!"

"To: John Adamsn\nFrom: Thomas Jefferson"
{% endhighlight %}

Now what happens when the string style is part of that string itself?
For example, I don't need to interpolate and the only escaped character
needed is a single quote. This is when I've been using [string
expressions](http://web.njit.edu/all_topics/Prog_Lang_Docs/html/ruby/syntax.html#string)
A string literal of `%q` is the equivalent of a single quote string and
a `%Q` is the equivalent of a double quote string. The string literals
are contained withing a non-alphanumeric delimiter.

{% highlight ruby %}
# single quote
%q{Wayne's world!}

# double quote
%Q{#{name}'s world!}

# ZOMG also a double quote!
%{#{name}'s world!}
{% endhighlight %}

I try to follow this rule. I don't think it saves anything other than it
just looks nicer to me. A very simple (and completely unscientific)
benchmark shows that the difference between the two is a wash

** Update: These benchmarks may be wrong, please see the comments for more information **

{% highlight ruby %}
require 'benchmark'

Benchmark.measure { 1..10_000_000.times { a = 'hey now' } }
# =>   1.960000   0.000000   1.970000 (  1.958126)

Benchmark.measure { 1..10_000_000.times { a = "hey now" } }
# =>   1.980000   0.010000   1.980000 (  1.988363)
{% endhighlight %}

Any given run of this and the times would flip. The string is probably
just being optimized somewhere so this test is not very good. But at the 
very least it shows that execution time is similar... unless we're interpolating:

{% highlight ruby %}
Benchmark.measure { 1..10_000_000.times { |i| a = "hey now #{i}" } }
# =>   6.110000   0.010000   6.120000 (  6.111669)
{% endhighlight %}

Now we can see a significant jump in time. (over 3 times longer) Why does this take so much longer?
To help answer this question we need to first compare this benchmark to string concatenation using single quotes

{% highlight ruby %}
Benchmark.measure { 1..10_000_000.times { |i| a = 'hey now ' + i.to_s } }
# =>   6.490000   0.020000   6.510000 (  6.502408)
{% endhighlight %}

This ends up be about the same execution time as string interpolation.
Before we answer the previous question let's take a look at one more option

{% highlight ruby %}
require 'benchmark'

Benchmark.measure { 1..10_000_000.times { |i| a = 'hey now ' << i } }
#  =>   2.990000   0.010000   3.000000 (  2.986346)
{% endhighlight %}

Whoa, this is much faster, more than 50% faster than interpolation and
concatenation. Why? What is happening here?

What we are seeing is the difference between creating a new object and
modifying an existing object. It is not immediately obvious with string
interpolation as it is with concatenation. With the append we are actually 
modyfing the object so there is no need to do any memory allocation.

There are several differences between the two styles, they aren't
always interchangable. Most of the time the decision comes down to a
styling preference but there are certain use cases where it can make a
difference. String interpolation is in Ruby as a nice convenience but if
you're doing anything that is relying upon interpolation quite heavily
you may want to consider other options.
