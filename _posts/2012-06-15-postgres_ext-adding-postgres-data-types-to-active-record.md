---
layout: post
title: "postgres_ext: Adding Posgres data types to Rails"
comments: true
author: Dan McClain
twitter: _danmcclain
github: danmcclain
category: ruby
social: true
summary: "Announcing postgres_ext, a gem that adds support for PostgreSQL data types to ActiveRecord"
published: true
---

Over the past few weeks, I have been working on a new gem which adds
support to Rail's ActiveRecord for PostgreSQL's native data types. I am
happy to announce that I have released the
[postgres\_ext](https://github.com/dockyard/postgres_ext) gem.

postgres\_ext supports for ActiveRecord version 3.2 and above (at this
time). Parallel to my development, I plan to submit pull request to
Rails master, so that postgres\_ext will not be needed in Rails 4.0.

## Features

### Migration/Schema support

postgres\_ext adds migration and `schema.rb` support for the following
PostgresSQL type:

 * INET
 * CIDR
 * MACADDR
 * UUID
 * Arrays

Information on creating migrations for these types can be found
[here](https://github.com/dockyard/postgres_ext#migrationschemarb-support)

### Type Casting

postgres\_ext converts INET and CIDR values to
[IPAddr](http://www.ruby-doc.org/stdlib-1.9.3/libdoc/ipaddr/rdoc/IPAddr.html) instances,
 and coverts arrays to array objects of the column type (integer arrays
are cast as an array of integers, INET arrays to are cast to an array of
IPAddrs).

## Another gem born out of necessity
I have also released
[pg\_array\_parser](https://github.com/dockyard/pg_array_parser), a C
extension which parses PostgreSQL array values and returns an array of
strings.  This gem is used by postgres\_ext to retrieve the array values
before casting them to the required type.

## Plans for postgres\_ext

[INET, CIDR and MACADDR support has already been added to Rails 4.](http://reefpoints.dockyard.com/ruby/2012/05/18/rails-4-sneak-peek-expanded-activerecord-support-for-postgresql-datatype.html)
My next step is to submit a pull request to add UUID migration support
and Array support to Rails master.  Then I plan to backport Rails 4's
hstore support back to postgres\_ext. After adding support for the other
PostgreSQL types, I plan to add support to arel for PostgreSQL type
specific where clauses (ie ANY for array comparison, `<<` and `>>` for
INET and CIDR comparisons. 
