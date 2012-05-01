---
layout: post
title: "Sleep helper for your request tests"
comments: true
author: Brian Cardarella
twitter: bcardarella
github: bcardarella
category: ruby
social: true
summary: "A clean helper for giving visual feedback on long sleeps in your request tests"
published: true
---

We have been using [capybara-webkit](http://github.com/thoughtbot/capybara-webkit) quite a bit.
Because of the async nature of JavaScript you sometimes have to use
[sleeps](http://rubydoc.org/stdlib/core/1.9.2/Kernel#sleep-instance_method) in your tests if the action is taking longer than the default
Capybara 2 second timeout. Lately I have had the need to sleep for up to 30
seconds for certain actions and I wanted a clean visual indicator of how
much time was remaining. So I whipped up the following:

{% highlight ruby %}
def sleep_for(sleep_time, message = 'Sleeping...')
  sleep_time.times do |i|
    print_message = "#{message} #{sleep_time - i} seconds remaining"
    print print_message
    sleep 1
    print ["\b", " ", "\b"].map { |c| c * print_message.length }.join
  end
end
{% endhighlight %}

I hope others find this useful!
