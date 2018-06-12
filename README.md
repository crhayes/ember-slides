# Ember Slides

[![Build Status](https://travis-ci.org/crhayes/ember-slides.svg?branch=master)](https://travis-ci.org/crhayes/ember-slides)

Signup "wizards", onboarding flows, image carousels... the list goes on. How many times have you created UIs that required multiple, sequential steps? How many times have you had to rewrite the same step logic?

With Ember Slides you'll never have to write that step code again.

## Installation
`ember install ember-slides`

## Examples

**Hardcoded Slides**
```hbs
{{#slide-deck as |d|}}
  {{#d.slide}}
    Slide 1
  {{/d.slide}}
  {{#d.slide}}
    Slide 2
  {{/d.slide}}
  {{#d.slide}}
    Slide 3
  {{/d.slide}}
  <button {{action d.prev}} disabled={{d.prevDisabled}}>Prev</button>
  <button {{action d.next}} disabled={{d.nextDisabled}}>Next</button>
{{/slide-deck}}
```

**Named Slides**
```hbs
{{#slide-deck as |d|}}
  {{#d.slide name="one"}}
    Slide 1
  {{/d.slide}}
  {{#d.slide name="two"}}
    Slide 2
  {{/d.slide}}
  {{#d.slide name="three"}}
    Slide 3
  {{/d.slide}}

  <button {{action d.show "one"}}>First</button>
  <button {{action d.show "two"}}>Second</button>
  <button {{action d.show "three"}}>Third</button>
{{/slide-deck}}
```

**Dynamic Slides**
```hbs
{{#slide-deck as |d|}}
  {{#each things as |thing|}}
    {{#d.slide}}
      {{thing}}
    {{/d.slide}}
  {{/each}}

  {{#each d.slides as |s|}}
    <button {{action d.show s.name}} disabled={{s.isActive}}>{{s.name}}</button>
  {{/each}}
{{/slide-deck}}
```

There's more to see, so make sure to check out additional examples in the following files: [`tests/dummy/app/templates/application.hbs`](https://github.com/crhayes/ember-slides/blob/master/tests/dummy/app/templates/application.hbs) and [`tests/integration/components/slide-deck-test.js`](https://github.com/crhayes/ember-slides/blob/master/tests/integration/components/slide-deck-test.js).

# Contributing

Installation
------------------------------------------------------------------------------

* `git clone https://github.com/crhayes/ember-slides`
* `cd ember-slides`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
