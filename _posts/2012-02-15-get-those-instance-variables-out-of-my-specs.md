---
layout: post
title: Get those instance variables out of my specs!
comments: true
author: Brian Cardarella
twitter: bcardarella
github: bcardarella
category: ruby
social: true
summary: Clean up your specs with let and subject
---

If you're been writing [RSpec](https://www.relishapp.com/rspec) for any
period of time I'm sure you've come across [let](https://www.relishapp.com/rspec/rspec-core/v/2-8/docs/helper-methods/let-and-let) and [subject](https://www.relishapp.com/rspec/rspec-core/v/2-8/docs/subject/explicit-subject). (please take a moment to check out the links if you have no idea what I'm talking about) In most cases you get effectively have the same specs with instance variables. For example:

{% highlight ruby %}
describe '.find_good_cars' do
  before do
    @car_1 = Factory(:good_car)
    @car_2 = Factory(:good_car)
    @car_3 = Factory(:bad_car)
    @good_cars = Car.find_good_cars
  end

  it 'only finds good cars' do
    @good_cars.should eq [@car_1, @car_2]
  end
end
{% endhighlight %}

Here is what it looks like when using `let` and `subject`

{% highlight ruby %}
describe '.find_good_cars' do
  let!(:car_1) { Factory(:good_car) }
  let!(:car_2) { Factory(:good_car) }
  let!(:car_3) { Factory(:bad_car) }
  subject { Car }
  its(:find_good_cars) { should eq [car_1, car_2] }
end
{% endhighlight %}

Maybe it is just me but this *feels* cleaner. I'm treating instance
varialbes in my specs as a code smell from now on.
