---
layout: post
title: Authenticating multiple models with a strategy
comments: true
author: Brian Cardarella
twitter: bcardarella
github: bcardarella
summary: Using the Strategy Pattern to clean up multiple login paths
category: ruby
social: true
---

A current project requires that there be multiple models that can sign
in and each one must use the same sign in form. The original
`SessionsController#create` action looked like the following:

{% highlight ruby %}
def create
  if user = (Owner.authenticate(params[:user]) || Employee.authenticate(params[:user]))
    session[:user_id]    = user.id
    session[:user_class] = user.class
    redirect_to dashboard_path
  else
    render :action => :new
  end
end
{% endhighlight %}

We're using `has_secure_password` and rolling our own authentication.
Considering that, the above was good enough. But... looking down
the line for this app it is likely we will have to support authentication
for more than just two models on the same form. I also don't like having
logic in my controllers. So I decided to break this logic out and I
chose the [Strategy Pattern](http://en.wikipedia.org/wiki/Strategy_pattern) to help.

I like putting all of my strategies stratgies into
`app/strategies`. This required me to add this directory to the Rails
`autoload_paths`. Simply open up `config/application.rb`

{% highlight ruby %}
config.autoload_paths += %W(#{config.root}/app/strategies)
{% endhighlight %}

Next I wrote up a simple spec, thankfully I already had the logic from
the controller so there wasn't much work to be done here. This went into
`spec/strategies/authentication_strategy_spec.rb`

{% highlight ruby %}
require 'spec_helper'

describe AuthenticationStrategy do
  context 'authenticating an owner' do
    let(:owner) { mock('Owner') }
    before do
      owner.stubs(:authenticate).returns(owner)
      Owner.stubs(:where).returns([owner])
    end
    it 'returns an owner' do
      AuthenticationStrategy.run(:email => 'owner@example.com', :password => 'password').should eq owner
    end
  end

  context 'authenticating an employee' do
    let(:employee) { mock('Employee') }
    before do
      employee.stubs(:authenticate).returns(employee)
      Employee.stubs(:where).returns([employee])
    end
    it 'returns an employee' do
      AuthenticationStrategy.run(:email => 'employee@example.com', :password => 'password').should eq employee
    end

  end

  describe 'failing to authenticate' do
    context 'with no attributes' do
      it 'returns nil' do
        AuthenticationStrategy.run.should be_nil
      end
    end
    context 'with no match for owner or employee' do
      it 'returns nil' do
        AuthenticationStrategy.run(:email => 'test@example.com', :password => 'password').should be_nil
      end
    end
  end
end
{% endhighlight %}

Now it was time to make these specs green! The strategy file goes into
`app/strategies/authentication_strategy.rb`

{% highlight ruby %}
class AuthenticationStrategy
  def self.run(attributes = nil)
    return nil if (attributes.nil? || attributes[:email].blank? || attributes[:password].blank?)
    Owner.authenticate(attributes) || Employee.authenticate(attributes)
  end
end
{% endhighlight %}

And finally to clean up the controller

{% highlight ruby %}
def create
  if user = AuthenticationStrategy.run(params[:user])
    session[:user_id]    = user.id
    session[:user_class] = user.class
    redirect_to dashboard_path
  else
   render :action => :new
  end
end
{% endhighlight %}

In the end this may appear to be more work than is necessary. Keep in
mind that when the app requirements now include having to authenticate
against 5 or 6 models on a single form. The wins should be obivious
considering that context. Perhaps at that point it makes sense to
actually break the authentication up into [Identities](http://en.wikipedia.org/wiki/Identity_management) with a [polymorphic 
association](http://guides.rubyonrails.org/association_basics.html#polymorphic-associations) to the different models.
But we'll cross that road when we get there.
