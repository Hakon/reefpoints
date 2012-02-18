---
layout: post
title: Rails Engines and Monkey Patching
comments: true
author: Brian Cardarella
twitter: bcardarella
github: bcardarella
category: ruby
social: true
summary: A simple pattern for extending your Rails Engines in your app
published: false
---

We've started extracting simple behavior into Rails Engines lately. An
example of this is our
[Invitable](https://github.com/dockyard/invitable) engine. As you may
have guessed, it adds invitation request support to an existing app.
It's about 50% complete right now but for the purposes of this post it
will act as the example.

As an engine it has a very slim `Invitation` model that only
expects an `email` attribute. A client app we're currently
building requires two additional attributes to be gathered: `name` and `zipcode`.

There is no need to overwrite the model, I just want to extend it. The cleanest 
thing to do is just monkey patch it.

Let's start with writing the spec of where I want the model to be

{% highlight ruby %}
require 'spec_helper'

describe Invitable::Invitation do
  it { should     have_valid(:name).when('Henry Ford') }
  it { should_not have_valid(:name).when(nil, '') }
  it { should     have_valid(:zipcode).when('02115') }
  it { should_not have_valid(:zipcode).when(nil, '', 'hello', '0211', '021156') }
end
{% endhighlight %}

To make this spec green there are two things that I have to do

1. Add the `name` and `zipcode` columsn to the correct table
2. Open up the class and add the proper validations on those attributes

The first is simple. I just create a new migration and add the columns
to `invitable_invitations`.

The second is not so straight forward. If I open up the class in the client app and
attempt to add the validations like so:

{% highlight ruby %}
module Invitable
  class Invitation
    validates :name, :zipcode, :presence => true
    validates :zipcode, :format => /^\d{5}$|^\d{5}-\d{4}$/
  end
end
{% endhighlight %}

The app will raise a `NoMethodError` exception complaining that
`validates` is undefined. In the load path there are two
`app/models/invitable/invitation.rb` files and the one in the app takes precendence
over the one in the engine. This is fine because you might want to
overwrite the model entirely, but in this case I want to extend it. So
you must explicitly require the engine's model at the top of the app's model.

Thankfully the engine itself has a nice helper `called_from` that tracks its full path
on the file system. In this example we access it with
`Invitable::Engine.called_from`. This will point to the `lib/invitable` directory
in the gem itself. Here is what I ended up with in the model:

{% highlight ruby %}
require File.expand_path('../../app/models/invitable/invitation', Invitable::Engine.called_from)

module Invitable
  class Invitation
    validates :name, :zipcode, :presence => true
    validates :zipcode, :format => /^\d{5}$|^\d{5}-\d{4}$/
  end
end
{% endhighlight %}

It's verbose but it works. This simple pattern can be applied
to the controllers, mailers, etc... any class you want to actually
extend from the engine instead of overwrite entirely.
