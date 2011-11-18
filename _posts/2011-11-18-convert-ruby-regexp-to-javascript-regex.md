---
layout: post
title: Convert Ruby Regexp to JavaScript RegExp
comments: true
author: Brian Cardarella
twitter: bcardarella
github: bcardarella
---

This has a very limited use case, but I needed it for
[ClientSideValidations](http://github.com/bcardarella/client_side_validations). It took a while
to track down some of the possible conversion issues, I figure someone
else might find this useful.

{% highlight ruby %}
class Regexp
  def to_javascript
    Regexp.new(inspect.sub('\\A','^').sub('\\Z','$').sub('\\z','$').sub(/^\//,'').sub(/\/[a-z]*$/,'').gsub(/\(\?#.+\)/, '').gsub(/\(\?-\w+:/,'('), self.options).inspect
  end
end
{% endhighlight %}

If there are any edge-cases that won't convert cleanly please report
them in the comments.
