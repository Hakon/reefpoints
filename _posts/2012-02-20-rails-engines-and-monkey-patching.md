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

Let's start with writing the spec of where I want the model to be (I am
using [ValidAttribute](https://github.com/bcardarella/valid_attribute) if
the specs don't look familiar, I suggest you try it test spec your
validations)

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

It's verbose and this could be better so let's clean that up.

In my engine I've added a spec to `spec/lib/invitable/engine_spec.rb`
with the following (I'm using [Mocha](https://github.com/floehopper/mocha) for the stubbing)

{% highlight ruby %}
require 'spec_helper'

describe Invitable::Engine do
  before { Invitable::Engine.stubs(:called_from).returns('/lib/invitable') }

  describe '.app_path' do
    it 'returns the path to the engine app directory' do
      Invitable::Engine.app_path.should eq '/app'
    end
  end

  describe 'controller_path' do
    it 'returns the path to the named engine controller' do
      Invitable::Engine.controller_path(:test_controller).should eq '/app/controllers/invitable/test_controller.rb'
    end
  end

  describe 'helper_path' do
    it 'returns the path to the named engine helper' do
      Invitable::Engine.helper_path(:test_helper).should eq '/app/helpers/invitable/test_helper.rb'
    end
  end

  describe 'mailer_path' do
    it 'returns the path to the named engine mailer' do
      Invitable::Engine.mailer_path(:test_mailer).should eq '/app/mailers/invitable/test_mailer.rb'
    end
  end

  describe 'model_path' do
    it 'returns the path to the named engine model' do
      Invitable::Engine.model_path(:test_model).should eq '/app/models/invitable/test_model.rb'
    end
  end
end
{% endhighlight %}

This looks good enough to me. Now to make it green I added the following
to `lib/invitable/engine.rb`

{% highlight ruby %}
def self.app_path
  File.expand_path('../../app', called_from)
end

%w{controller helper mailer model}.each do |resource|
  class_eval <<-RUBY
    def self.#{resource}_path(name)
      File.expand_path("#{resource.pluralize}/invitable/\#{name}.rb", app_path)
    end
  RUBY
end
{% endhighlight %}

And now in the app model I can do the following

{% highlight ruby %}
require Inivitable::Engine.model_path :invitation

module Invitable
  class Invitation
    validates :name, :zipcode, :presence => true
    validates :zipcode, :format => /^\d{5}$|^\d{5}-\d{4}$/
  end
end
{% endhighlight %}

Nice and clean!

This simple pattern can be applied to the controllers, mailers, etc... any class you want to actually
extend from the engine instead of overwrite entirely.

Finally, I'd like the address a question I'm sure some of you have. Why
not subclass? For this engine the `Invitable::InvitationsController` is
expecting a class of `Invitation` within the context of the `Invitable`
module. So if I were to subclass

{% highlight ruby %}
class Inivtation < Inivitable::Invitation
{% endhighlight %}

You would then have to subclass the controller

{% highlight ruby %}
class InvitationsController < Invitable::InvitationsController
{% endhighlight %}

And because the `InvitationsController` is referencing
`InvitationMailer` within the context of the `Invitable` module you
would have to subclass the mailer

{% highlight ruby %}
class InvitationMailer < Invitable::InvitationMailer
{% endhighlight %}

Finally, because you've subclassed the controller the mount in
`routes.rb` becomes meaningless. If you head down the subclass path you
defeat the purpose of using the engine in the first place.
