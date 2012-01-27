---
layout: post
title: Love Your lib Directory
comments: true
author: Brian Cardarella
twitter: bcardarella
github: bcardarella
category: ruby
---

There are several directories generated in a new Rails application. One of the least understood and (in our opinion) misused directories is `lib/`.

#### 
#### It's not a dump

![Dump](/images/dump.jpg)

Does this look familiar? It does to me. This is what my `lib/` directory
looked like before I got fed up with it. That truck, that was me dumping more
code into `lib/`.

In my experience there is one outstanding reason why code ends up
getting dumped into the lib/ directory: A poor understanding of what a
model is. Rails has this way of reinforcing bad habits. Perhaps because
it is so easy to get going some developers never bother to 

For many, working with Rails is their first experience working with
[MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
so it only naturual to believe that each model must be backed by a
database table. However, this is limiting. 
