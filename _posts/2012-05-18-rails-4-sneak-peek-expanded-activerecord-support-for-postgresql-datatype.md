---
layout: post
title: "Rails 4.0 Sneak Peek: Expanded ActiveRecord Support for PostgreSQL Datatypes"
comments: true
author: Dan McClain
twitter: _danmcclain
github: danmcclain
category: ruby
social: true
summary: "Support added to ActiveRecord for INET, CIDR and MACADDR types for PostgreSQL"
published: true
---

This week, I had a [pull request accepted](https://github.com/rails/rails/commit/835df6f3ed9b1575fd6a1fb62516d8ebeffbf114#diff-0)
into Rails which adds support for
[PostgreSQL's MACADDR, INET, and CIDR datatypes](http://www.postgresql.org/docs/current/static/datatype-net-types.html).
In Rails 4.0, the following migration will be supported:

{% highlight ruby %}
create_table :network_types do |t|
  t.cidr :cidr_address
  t.inet :ip_address
  t.macaddr :mac_address
end
{% endhighlight %}

Also, the schema dumper supports these types as well (previously they
would appear as `string` types in the schema.rb file).

ActiveRecord will also cast the values of the INET and CIDR types to
Ruby's [IPAddr](http://www.ruby-doc.org/stdlib-1.9.3/libdoc/ipaddr/rdoc/IPAddr.html),
while MACADDR will continue to be converted to a string.
