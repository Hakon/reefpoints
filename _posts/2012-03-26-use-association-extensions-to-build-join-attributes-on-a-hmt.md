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
published: false
---

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

{% highlight ruby %}
class User < ActiveRecord::Base
  has_many :memberships
  has_many :groups, :through => :memberships
end

class Membership < ActiveRecord::Base
  belongs_to :group
  belongs_to :user
end

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



