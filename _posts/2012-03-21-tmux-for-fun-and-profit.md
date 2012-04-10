---
layout: post
title: "Tmux, for fun and profit"
comments: true
author: Dan Seaver
twitter: dan_seaver
github: danseaver
category: ruby
social: true
summary: "Pair programming at distance"
published: true
---

## Screen - the gateway drug ##

I had been using screen for a while to multiplex my terminal when
working on Ruby projects.  I would have a tab for git (was using
MacVim), on for `rails s`/`tail
log/development.log`, one for running tests (now using `guard` or
`autotest`), one for `rails c` and lastly one for `rails db`. Detaching
from a screen session allowed me to have a full environment running
until my next reboot, I could switch back into the project quickly, and
I had configured my `.screenrc` to open these tabs everytime I started
screen.

I also utilized screen to keep sessions open on a remote server between
SSH connects. Instantiating a screen session on the remote server
would keep processes running even when my SSH connection would get
killed. This would prevent an `apt-get upgrade` from fragging the system
incase I disconnected, or allow me to drop the connection during a long
running process.

As much as I used it, I was still a screen newb, as my `.screenrc` was
pretty vanilla. I hadn't taken the time to read the man
pages/tutorials out there to understand some of the more subtle
features.

## Tmux and Brian P. Hogan's 'tmux' book ##

I had noticed that tmux was getting a decent amount of attention, so
when I started at DockYard, I told myself I would only use tmux.  I also
switched from MacVim to terminal vim, which works better when pair
programming.  [Brian P. Hogan](http://www.bphogan.com/) recently wrote
_tmux_ for Pragmatic Programmers.  After reading his book, I have a
solid `.tmux.conf` and a great understanding of tmux.

## Tmux and Pair Programming ##

The one disadvantage of everyone at DockYard working remotely is that you can't
just turn around and ask someone to come to your desk to pair up. Tmux
allows multiple user to connect to a specific session.  With a bit of
dynamic DNS magic, port forwarding, and ssh tunneling, multiple people
can connect to the same tmux session, work in the same vim window, and
see the same development server.

The first step is dynamic DNS and port forwarding, which I won't cover
here, since everyone has different modems and routers. You want to
forward port 22 through your router/firewall to your development
machine. Using dynamic DNS, you can connect to your coworkers via a
domain like `dan.example.com` instead of figuring out your IP and
sending that to your partner.

We use the following ssh command to forward connection on our local
machine to the other person's

```
    ssh dan.example.com -L 3000:127.0.0.1:3000
```

The above command forwards any request on port 3000 on my machine the
one to which I am connected. That way, I can see what my partner sees
when we edit files on his machine.  Once connected, I just attach to my
partner's tmux session.  At this point, we are programming in the same
terminal session, and we can both see the edits as we make them.  We use
a Google+ Hangout to communicate while we pair program.

## Conclusion

With a tmux, ssh port forwarding, and Google+ Hangout, you can create a
useful pair programming environment with your remote coworkers.  We find
this setup very effective and use it often to work together and tackle
an issue.
