# Ember Slides

Signup "wizards", onboarding flows, image carousels... the list goes on. How many times have you created UIs that required multiple, sequential steps? How many times have you had to rewrite the same step logic?

With Ember Slides you'll never have to write that step code again.

## Installation
`ember install ember-slides`

## Examples

**Hardcoded Slides**
```hbs
{{#slide-deck as |s|}}
  {{#s.slide}}
    Slide 1
  {{/s.slide}}
  {{#s.slide}}
    Slide 2
  {{/s.slide}}
  {{#s.slide}}
    Slide 3
  {{/s.slide}}
  <button {{action s.prev}} disabled={{s.prevDisabled}}>Prev</button>
  <button {{action s.next}} disabled={{s.nextDisabled}}>Next</button>
{{/slide-deck}}
```

**Named Slides**
```hbs
{{#slide-deck as |s|}}
  {{#s.slide name="one"}}
    Slide 1
  {{/s.slide}}
  {{#s.slide name="two"}}
    Slide 2
  {{/s.slide}}
  {{#s.slide name="three"}}
    Slide 3
  {{/s.slide}}

  <button {{action s.show "one"}}>First</button>
  <button {{action s.show "two"}}>Second</button>
  <button {{action s.show "three"}}>Third</button>
{{/slide-deck}}
```

**Dynamic Slides**
```hbs
{{#slide-deck as |s|}}
  {{#each things as |thing|}}
    {{#s.slide}}
      {{thing}}
    {{/s.slide}}
  {{/each}}

  {{#each s.slides as |slide|}}
    <button {{action s.show slide}}>{{slide}}</button>
  {{/each}}
{{/slide-deck}}
```

There's more to see, so make sure to check out more examples in the following files: [`tests/dummy/app/templates/application.hbs`](https://github.com/crhayes/ember-slides/blob/master/tests/dummy/app/templates/application.hbs) and [`tests/integration/components/slide-deck-test.js`](https://github.com/crhayes/ember-slides/blob/master/tests/integration/components/slide-deck-test.js).

# Contributing

## Installation

* `git clone <repository-url>` this repository
* `cd ember-slides`
* `npm install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
