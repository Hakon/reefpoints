---
layout: post
title: ClientSideValidations goes modular
comments: true
author: Brian Cardarella
twitter: bcardarella
github: bcardarella
summary: Brian summarizes the changes to come in ClientSideValidations 3.2.0
category: ruby
---

[ClientSideValidations](https://github.com/bcardarella/client_side_validations) has been gaining popularity over the past few
months as it is nearing 1000 watchers on Github. With the release of
Rails 3.2.0 I've decided to start extracting out all of the non-Rails
components, such as SimpleForm support and Mongoid support, into their
own gems. I want to disucss my reasons for doing this as I believe this
path of modularity is going to mean better gem maintenance, more frequent
releases, and the opportunity for the community to really get involved.

Last night I released ClientSideValidations-3.2.0.beta.1 and I have extracted the following into their own gems:

##### ORMs #####

* [ClientSideValidations-Mongoid](https://github.com/dockyard/client_side_validations-mongoid)
* [ClientSideValidations-MongoMapper](https://github.com/dockyard/client_side_validations-mongo_mapper)

##### FormBuilders #####

* [ClientSideValidations-Formtastic](https://github.com/dockyard/client_side_validations-formtastic)
* [ClientSideValidations-SimpleForm](https://github.com/dockyard/client_side_validations-simple_form)


## Going Modular ##

The problem with keeping support for the many different ORMs and
FormBuilders in the ClientSideValidations gem is that there are just too
many dependencies doing different things. A great example is with
Mongoid and [ClientSideValidations Issue #253](https://github.com/bcardarella/client_side_validations/issues/253).
Mongoid `2.4.0` added a [PresenceValidator](https://github.com/mongoid/mongoid/blob/2.4.0-stable/lib/mongoid/validations/presence.rb) instead of using
the ActiveModel version. This caused translations to fail as they were
being served up directly from Mongoid instead of ActiveModel. I could
have fixed this easily in ClientSideValidations but now this means all
future releases would require anyone using a version of Mongoid previous
to this change to upgrade. There are many reason why you may not want to
upgrade Mongoid, none of which are my business.

Pulling the Mongoid code out into its own plugin allows this bug to be
fixed there and I can continue to do bug fixes/feature development in
ClientSideValidations that everyone an benefit from.

## More than just SemVer ##

The versions of the plugins now matter. I've decided to
match the library they are supporting's Major and Minor version. For
example, with Mongoid the current version is `2.4.x` so the current
version of [ClientSideValidations-Mongoid](https://github.com/dockyard/client_side_validations-mongoid)
is `2.4.0`. All bug fixes for this version will only bump the patch
version. We can then go back and add a `2.3.0` version that does not
expect a Mongoid PresenceValidator and you won't need to change the
version of ClientSideValidations. Simple enough stuff, but it gives the
library a lot of flexibility.

## Community Support ##

I won't go back and cover every single Major/Minor
release of the different gems. I'm starting with the current versions
and going to look to the community to send pull-requests to fill in the
gaps.

With these ORM and FormBuilder gems the community should have a good
starting point for writing their own ClientSideValidations plugins.

If someone is looking for a good starting point to build a gem you can
start with NestedForm as this is a gem that I did not extract and its
support was dropped.

In addition, I'm looking for help. It would be nice to get some
maintainers on the plugins but I'm also looking for someone to lend a
hand with ClientSideValidations.

## When will it be released? ##

I've got a bunch of [issues in
ClientSideValidations](https://github.com/bcardarella/client_side_validations/issues) I want to fix, I'm
guessing maybe a week or two to get through all of these. I'll go
through a few `beta` gems then a release candidate or two. I am always open to community contributions. If you want to help, please do!

You can start using this today with the beta version. All of the plugins
require the beta version of ClientSideValidations 3.2.0.

## The Future ##

Rails `3.2.0` will be the last `3.x` version of Rails, and so this will
also be the last `3.x` version of ClientSideValidations. Work is already
underway on the `4.x` version. One of the biggest changes is going to
happen on the JavaScript side. Client-side model validations will be the
goal. As well as compostite views for the error rendering. Ideally I
would like ClientSideValidations to be able to hook into the popular
JavaScript MVC frameworks.
