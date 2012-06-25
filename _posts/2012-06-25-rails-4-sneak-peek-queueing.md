---
layout: post
title: "Rails 4.0 Sneak Peek: Queueing"
comments: true
author: Brian Cardarella
github: bcardarella
twitter: bcardarella
category: ruby
social: true
summary: "A look at the new Queueing API"
published: true
---

Recently a [queueing system was added to Rails](https://github.com/rails/rails/commit/adff4a706a5d7ad18ef05303461e1a0d848bd662).
Let's dive in and see how to use it.

## Run, baby, run! ##

The queueing API is very simple. You push an object on to the queue and
that object is expected to respond to a `run` method. Let's take a look:

{% highlight ruby %}
class TestJob
  def run
    puts "I am running!"
  end
end

Rails.queue.push(TestJob.new)
=> "I am running!"
{% endhighlight %}

For most people, that is pretty much it. The queue is running in a
separate thread from the app thread, so your app shouldn't notice any
response impact from an expensive job.

The basic queue that comes with Rails is not a long-term solution. The
goal here is to establish a common API that more robust queueing systems
can plug themselves into. In most cases you shouldn't need to change any
of your app code if you want to switch from
[Resque](https://github.com/defunkt/resque) to
[Sidekiq](https://github.com/mperham/sidekiq). You should take care that
the objects you are enqueing can be properly marshalled.

You can even write your own queue, let's take a look at the API of a
custom queue

{% highlight ruby %}
class MyQueue
  def push(job)
    job.run
  end
end
{% endhighlight %}

Then in your `application.rb`

{% highlight ruby %}
config.queue = MyQueue
{% endhighlight %}

This example is straight from the Rails test suite. This will define a
queue that does not run jobs asynchronously. As soon as the job is
pushed onto the queue it is run. Let's make an actual queue (without relying on
the Queue class)

{% highlight ruby %}
class MyQueue
  def initialize
    @queue = []
  end

  def push(job)
    @queue.push(job)
  end

  def pop
    @queue.pop
  end
end
{% endhighlight %}

In this example we have implemented a simple queue. You will next need
to tell Rails's QueueConsumer to use this queue. You can do this in
`application.rb` with an initializer block:

{% highlight ruby %}
intializer 'start queue consumer' do |app|
  app.queue_consumer = config.queue_consumer.start(app.queue)
  at_exit { app.queue.consumer.shutdown }
end
{% endhighlight %}

and if we now push to our new queue:

{% highlight ruby %}
Rails.queue.push(TestJob.new)
{% endhighlight %}

...we get nothing. Why? Inspect the QueueConsumer:

{% highlight ruby %}
Rails.application.queue_consumer
=> #<Rails::Queueing::ThreadedConsumer @queue=#<MyQueue @queue=[]>, @thread=#<Thread dead>>
{% endhighlight %}


So you'll notice that the thread is `dead`. We can force the queue to
process by doing:

{% highlight ruby %}
Rails.application.queue_consumer.start
=> "I am running!"
{% endhighlight %}

Let's back up to understand what is going on here. First we'll start by looking at `ThreadedConsumer#start`

{% highlight ruby %}
def start
  @thread = Thread.new do
    while job = @queue.pop
      begin
        job.run
      rescue Exception => e
        handle_exception e
      end
    end
  end
  self
end
{% endhighlight %}

So this thread is only staying alive as long as the `@queue.pop` returns a truthy value.
It's not reasonable or us to keep shoving something into the queue, so let's see what is happening 
in `Queue#pop`. For this we'll look at Rubinius' implementation

{% highlight ruby %}
# Retrieves data from the queue.  If the queue is empty, the calling thread is
# suspended until data is pushed onto the queue.  If +non_block+ is true, the
# thread isn't suspended, and an exception is raised.
#
def pop(non_block=false)
  while true
    @mutex.synchronize do
      @waiting.delete(Thread.current)
      if @que.empty?
        raise ThreadError, "queue empty" if non_block
        @waiting.push Thread.current
        @resource.wait(@mutex)
      else
        retval = @que.shift
        @resource.signal
        return retval
      end
    end
  end
end
{% endhighlight %}

This now starts to make sense. `Queue#pop` is an infinite loop that will wait until it has
content before each iteration. Our simple `MyQueue` class would return `nil` when `ThreadConsumer#start`
is called because there is nothing in the queue and the thread would die. Even if we put something in
queue it would pop once, run the job, try to pop againg, then die.

For the sake of simplicity let's just have `MyQueue` inherit from
`Queue`

{% highlight ruby %}
class MyQueue < Queue
end
{% endhighlight %}

Now we can run

{% highlight ruby %}
Rails.queue.push(TestJob.new)
=> "I am running!"
{% endhighlight %}

The queue system in Rails 4.0 is a very simple solution, I'm looking
forward to the release and the support for it to be added to many of the
leading background job processing libraries.

Keep in mind that as of this writing the master branch is still
versioned as 'beta'. This API could change.
