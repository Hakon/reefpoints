---
layout: post
title: Use Association Extensions to Build Join Attributes on a HMT
comments: true
author: Russell Jones
twitter: codeofficer
github: codeofficer
summary: Russ lays down a use case for ActiveRecord association extensions
category: ruby
social: true
---

It's common in Rails to use a `has_many :through` relationship to model User/Group Memberships. 
Sometimes we have extra data in the join that we would like to make use of, but getting that 
data in there can be combersome depending on our approach. For example, given the
following diagram and schema:

![Diagram](/images/russ/yuml-cb495048.png)

{% highlight ruby %}
ActiveRecord::Schema.define(:version => 20120324170519) do

  create_table "groups", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "memberships", :force => true do |t|
    t.integer  "user_id"
    t.integer  "group_id"
    t.string   "role"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end
{% endhighlight %}

We might deal directly with the join table to assign our additonal data.

{% highlight ruby %}
@user = User.create(name: 'User 1')
@user = Group.create(name: 'Group 1')
@membership = Membership.create do |m|
  m.user = @user
  m.group = @group
  m.role = 'admin'
end
@user.admin? #=> true
@user.editor? #=> false
{% endhighlight %}

There's a better way to pull this off ...

{% highlight ruby %}
@group.admins << @user
@user.admin? #=> true
@user.editor? #=> false
{% endhighlight %}

And this is how it's done ...

{% highlight ruby %}
# User model
class User < ActiveRecord::Base
  has_many :memberships
  has_many :groups, :through => :memberships

  def admin?
    memberships.where(:role => 'admin').first
  end

  def editor?
    memberships.where(:role => 'editor').first
  end
end
{% endhighlight %}

{% highlight ruby %}
# Membership model
class Membership < ActiveRecord::Base
  belongs_to :group
  belongs_to :user
end
{% endhighlight %}

{% highlight ruby %}
# Group model
class Group < ActiveRecord::Base
  has_many :memberships
  has_many :users, :through => :memberships

  has_many :admins, :through => :memberships, :source => :user,
    :conditions => "memberships.role = 'admin'" do
      def <<(admin)
        proxy_association.owner.memberships.create(:role => 'admin', :user => admin)
      end
  end

  has_many :editors, :through => :memberships, :source => :user,
    :conditions => "memberships.role = 'editor'" do
      def <<(editor)
        proxy_association.owner.memberships.create(:role => 'editor', :user => editor)
      end
  end
end
{% endhighlight %}

We're defining an extension on our group's `has_many` association which overrides
the `<<` method on that collection. We then tell the proxy association's owner
(which is our group object) to create the user/group join record, but with an additional
role assignment of 'admin'.

{% highlight ruby %}
@group.admins << @user
@user.admin? #=> true
@user.editor? #=> false
{% endhighlight %}

Pretty exporessive really. Thanks to ActiveRecord magic!

{% highlight ruby %}
require 'test_helper'

class GroupTest < ActiveSupport::TestCase
  setup do
    @user_1 = User.create(name: 'User 1')
    @user_2 = User.create(name: 'User 2')
    @user_3 = User.create(name: 'User 3')
    @group = Group.create(name: 'Group 1')
  end

  test "No Memberships" do
    assert_equal @user_1.memberships.count, 0
  end

  test "@group.users << @user_1 sets nil role on membership" do
    @group.users << @user_1
    assert_equal @user_1.memberships.count, 1
    assert_equal @user_1.memberships.first.role, nil
  end

  test "@group.admins << @user_2 sets 'admin' role on membership" do
    @group.admins << @user_2
    assert_equal @user_2.memberships.count, 1
    assert_equal @user_2.memberships.first.role, 'admin'
  end

  test "@group.editors << @user_3 sets 'editor' role on membership" do
    @group.editors << @user_3
    assert_equal @user_3.memberships.count, 1
    assert_equal @user_3.memberships.first.role, 'editor'
  end

  teardown do
    User.delete_all
    Group.delete_all
    Membership.delete_all
  end
end
{% endhighlight %}