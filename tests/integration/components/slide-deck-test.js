import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { create } from 'ember-cli-page-object';
import slideDeck from '../../pages/components/slide-deck';

const component = create(slideDeck);

moduleForComponent('slide-deck', 'Integration | Component | slide deck', {
  integration: true,
  beforeEach() {
    component.setContext(this);
  },

  afterEach() {
    component.removeContext();
  }
});

test('it renders the first slide by default', function (assert) {
  this.render(hbs`
    {{#slide-deck tagName="div" as |s|}}
      {{#s.slide tagName="div" data-test-name="slide"}}
        First Slide
      {{/s.slide}}
      {{#s.slide tagName="div" data-test-name="slide"}}
        Second Slide
      {{/s.slide}}
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, 'First Slide');
  assert.equal(component.slides(1).text, '');
});

test('it renders the first slide when currentSlide is undefined', function (assert) {
  this.set('currentSlide', 2);

  this.render(hbs`
    {{#slide-deck currentSlide=currentSlide tagName="div" as |s|}}
      {{#s.slide name=1 tagName="div" data-test-name="slide"}}
        First Slide
      {{/s.slide}}
      {{#s.slide name=2 tagName="div" data-test-name="slide"}}
        Second Slide
      {{/s.slide}}
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, '');
  assert.equal(component.slides(1).text, 'Second Slide');

  this.set('currentSlide', undefined);

  assert.equal(component.slides(0).text, 'First Slide');
  assert.equal(component.slides(1).text, '');
});

test('setting currentSlide renders a slide by name', function (assert) {
  this.render(hbs`
    {{#slide-deck currentSlide="two" tagName="div" as |s|}}
      {{#s.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/s.slide}}
      {{#s.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/s.slide}}
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, '');
  assert.equal(component.slides(1).text, 'Second Slide');
});

test('slide changes mutate the bound value of currentSlide', function (assert) {
  this.set('slide', 'one');

  this.render(hbs`
    {{#slide-deck currentSlide=slide tagName="div" as |s|}}
      {{#s.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/s.slide}}
      {{#s.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/s.slide}}
      <button {{action s.next}} data-test-name="next">Next</button>
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, 'First Slide', 'the first slide is visible');

  component.next.click();

  assert.equal(component.slides(1).text, 'Second Slide', 'the second slide is visible');
  assert.equal(this.get('slide'), 'two', 'the bound value was mutated');
});

test('an error is thrown when current slide does not initially exist', function (assert) {
  assert.expectAssertion(() => {
    this.render(hbs`
      {{#slide-deck currentSlide="ten" tagName="div" as |s|}}
        {{s.slide name="one" tagName="div"}}
        {{s.slide name="two" tagName="div"}}
      {{/slide-deck}}
    `);
  });
});

test('an error is thrown when changing the current slide to one that does not exist', function (assert) {
  this.set('currentSlide', 'one');

  this.render(hbs`
    {{#slide-deck currentSlide=currentSlide tagName="div" as |s|}}
      {{s.slide name="one" tagName="div"}}
      {{s.slide name="two" tagName="div"}}
    {{/slide-deck}}
  `);

  assert.expectAssertion(() => {
    this.set('currentSlide', 'ten');
  });
});

test('an error is thrown when registering a slide with a name that has already been used', function (assert) {
  assert.expectAssertion(() => {
    this.render(hbs`
      {{#slide-deck tagName="div" as |s|}}
        {{s.slide name="one" tagName="div"}}
        {{s.slide name="one" tagName="div"}}
      {{/slide-deck}}
    `);
  });
});

test('when on the first slide, and when wrap is false, prev will remain on the same slide', function (assert) {
  this.render(hbs`
    {{#slide-deck currentSlide="one" tagName="div" as |s|}}
      {{#s.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/s.slide}}
      {{#s.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/s.slide}}
      <button {{action s.prev}} data-test-name="prev">Prev</button>
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, 'First Slide', 'the first slide is visible');
  assert.equal(component.slides(1).text, '');

  component.prev.click();

  assert.equal(component.slides(0).text, 'First Slide', 'the first slide is still visible');
  assert.equal(component.slides(1).text, '');
});

test('when on the first slide, and when wrap is true, prev will move to the last slide', function (assert) {
  this.render(hbs`
    {{#slide-deck currentSlide="one" wrap=true tagName="div" as |s|}}
      {{#s.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/s.slide}}
      {{#s.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/s.slide}}
      <button {{action s.prev}} data-test-name="prev">Prev</button>
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, 'First Slide');
  assert.equal(component.slides(1).text, '');

  component.prev.click();

  assert.equal(component.slides(0).text, '');
  assert.equal(component.slides(1).text, 'Second Slide');
});

test('when on the last slide, and when wrap is false, next will remain on the same slide', function (assert) {
  this.render(hbs`
    {{#slide-deck currentSlide="two" tagName="div" as |s|}}
      {{#s.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/s.slide}}
      {{#s.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/s.slide}}
      <button {{action s.next}} data-test-name="next">Next</button>
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, '');
  assert.equal(component.slides(1).text, 'Second Slide', 'the second slide is visible');

  component.next.click();

  assert.equal(component.slides(0).text, '');
  assert.equal(component.slides(1).text, 'Second Slide', 'the second slide is still visible');
});

test('when on the last slide, and when wrap is true, next will move to the first slide', function (assert) {
  this.render(hbs`
    {{#slide-deck currentSlide="two" wrap=true tagName="div" as |s|}}
      {{#s.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/s.slide}}
      {{#s.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/s.slide}}
      <button {{action s.next}} data-test-name="next">Next</button>
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, '');
  assert.equal(component.slides(1).text, 'Second Slide');

  component.next.click();

  assert.equal(component.slides(0).text, 'First Slide');
  assert.equal(component.slides(1).text, '');
});

test('prev will move to the previous slide', function (assert) {
  this.render(hbs`
    {{#slide-deck currentSlide="two" tagName="div" as |s|}}
      {{#s.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/s.slide}}
      {{#s.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/s.slide}}
      <button {{action s.prev}} data-test-name="prev">Prev</button>
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, '');
  assert.equal(component.slides(1).text, 'Second Slide');

  component.prev.click();

  assert.equal(component.slides(0).text, 'First Slide');
  assert.equal(component.slides(1).text, '');
});

test('next will move to the next slide', function (assert) {
  this.render(hbs`
    {{#slide-deck currentSlide="one" tagName="div" as |s|}}
      {{#s.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/s.slide}}
      {{#s.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/s.slide}}
      <button {{action s.next}} data-test-name="next">Next</button>
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, 'First Slide');
  assert.equal(component.slides(1).text, '');

  component.next.click();

  assert.equal(component.slides(0).text, '');
  assert.equal(component.slides(1).text, 'Second Slide');
});

test('goTo will move to the specified slide it if exists', function (assert) {
  this.render(hbs`
    {{#slide-deck currentSlide="one" tagName="div" as |s|}}
      {{#s.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/s.slide}}
      {{#s.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/s.slide}}
      <button {{action s.goTo "two"}} data-test-name="goto">Go to two</button>
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, 'First Slide');
  assert.equal(component.slides(1).text, '');

  component.goto.click();

  assert.equal(component.slides(0).text, '');
  assert.equal(component.slides(1).text, 'Second Slide');
});

test('goTo will throw an error if the specified slide does not exist', function (assert) {
  this.render(hbs`
    {{#slide-deck currentSlide="one" tagName="div" as |s|}}
      {{s.slide name="one" tagName="div"}}
      {{s.slide name="two" tagName="div"}}
      <button {{action s.goTo "ten"}} data-test-name="goto">Go to ten</button>
    {{/slide-deck}}
  `);

  assert.expectAssertion(() => {
    component.goto.click();
  });
});

test('slides can be rendered dynamically', function (assert) {
  this.set('slides', [1, 2, 3, 4, 5]);

  this.render(hbs`
    {{#slide-deck tagName="div" as |s|}}
      {{#each slides as |slide|}}
        {{s.slide tagName="div" data-test-name="slide"}}
      {{/each}}
    {{/slide-deck}}
  `);

  assert.equal(component.slides().count, 5);
});

test('will move to the previous slide if the current slide is the last slide and it is removed', function (assert) {
  assert.expect(4);

  this.set('slides', [1, 2, 3, 4, 5]);

  this.render(hbs`
    {{#slide-deck currentSlide=5 tagName="div" as |s|}}
      {{#each slides as |slide|}}
        {{#s.slide name=slide tagName="div" data-test-name="slide"}}
          {{slide}}
        {{/s.slide}}
      {{/each}}
    {{/slide-deck}}
  `);

  assert.equal(component.slides().count, 5);
  assert.equal(component.slides(4).text, 5);

  this.set('slides', [1, 2, 3, 4]);

  assert.equal(component.slides().count, 4);
  assert.equal(component.slides(3).text, 4);
});

test('will move to the last slide if the current slide is the first slide and it is removed', function (assert) {
  this.set('slides', [1, 2, 3, 4, 5]);

  this.render(hbs`
    {{#slide-deck currentSlide=1 tagName="div" as |s|}}
      {{#each slides as |slide|}}
        {{#s.slide name=slide tagName="div" data-test-name="slide"}}
          {{slide}}
        {{/s.slide}}
      {{/each}}
    {{/slide-deck}}
  `);

  assert.equal(component.slides().count, 5);
  assert.equal(component.slides(0).text, 1);

  this.set('slides', [2, 3, 4, 5]);

  assert.equal(component.slides().count, 4);
  assert.equal(component.slides(3).text, 5);
});

test('will stay on the same slide if a different slide is removed', function (assert) {
  this.set('slides', [1, 2, 3, 4, 5]);

  this.render(hbs`
    {{#slide-deck currentSlide=3 tagName="div" as |s|}}
      {{#each slides as |slide|}}
        {{#s.slide name=slide tagName="div" data-test-name="slide"}}
          {{slide}}
        {{/s.slide}}
      {{/each}}
    {{/slide-deck}}
  `);

  assert.equal(component.slides().count, 5);
  assert.equal(component.slides(2).text, 3);

  this.set('slides', [2, 3, 4, 5]);

  assert.equal(component.slides().count, 4);
  assert.equal(component.slides(1).text, 3);
});

test('will call a supplied currentSlideRemoved action if the current slide is removed', function (assert) {
  assert.expect(0);

  const done = assert.async();

  this.set('slides', [1]);
  this.on('slideRemoved', () => done());

  this.render(hbs`
    {{#slide-deck currentSlideRemoved=(action "slideRemoved") tagName="div" as |s|}}
      {{#each slides as |slide|}}
        {{s.slide name=slide}}
      {{/each}}
    {{/slide-deck}}
  `);

  this.set('slides', []);
});

test('the yieled slide names can be rendered before the slides are defined', function (assert) {
  this.render(hbs`
    {{#slide-deck currentSlide="one" tagName="div" as |s|}}
      {{#each s.slides as |name|}}
        <div data-test-name="yielded-slide-name">
          {{name}}
        </div>
      {{/each}}
      {{s.slide name="one" tagName="div"}}
      {{s.slide name="two" tagName="div"}}
    {{/slide-deck}}
  `);

  assert.ok(component.yieldedSlideNames().count, 2);
  assert.ok(component.yieldedSlideNames(0).text, 'one');
  assert.ok(component.yieldedSlideNames(1).text, 'two');
});

test('the yieled slide names can be rendered after the slides are defined', function (assert) {
  this.render(hbs`
    {{#slide-deck currentSlide="one" tagName="div" as |s|}}
      {{s.slide name="one" tagName="div"}}
      {{s.slide name="two" tagName="div"}}
      {{#each s.slides as |name|}}
        <div data-test-name="yielded-slide-name">
          {{name}}
        </div>
      {{/each}}
    {{/slide-deck}}
  `);

  assert.ok(component.yieldedSlideNames().count, 2);
  assert.ok(component.yieldedSlideNames(0).text, 'one');
  assert.ok(component.yieldedSlideNames(1).text, 'two');
});

test('onFirstSlide is true when on the first slide', function (assert) {
  this.render(hbs`
    {{#slide-deck currentSlide="one" tagName="div" as |s|}}
      {{s.slide name="one" tagName="div"}}
      {{s.slide name="two" tagName="div"}}
      <button {{action s.prev}} disabled={{s.onFirstSlide}} data-test-name="prev">Prev</button>
    {{/slide-deck}}
  `);

  assert.ok(component.prev.isDisabled, 'onFirstSlide is true, causing button to be disabled');
});

test('onFirstSlide is false when not on the first slide', function (assert) {
  this.render(hbs`
    {{#slide-deck currentSlide="two" tagName="div" as |s|}}
      {{s.slide name="one" tagName="div"}}
      {{s.slide name="two" tagName="div"}}
      <button {{action s.prev}} disabled={{s.onFirstSlide}} data-test-name="prev">Prev</button>
    {{/slide-deck}}
  `);

  assert.notOk(component.prev.isDisabled, 'onFirstSlide is false, causing button to be enabled');
});

test('onLastSlide is true when on the last slide', function (assert) {
  this.render(hbs`
    {{#slide-deck currentSlide="two" tagName="div" as |s|}}
      {{s.slide name="one" tagName="div"}}
      {{s.slide name="two" tagName="div"}}
      <button {{action s.next}} disabled={{s.onLastSlide}} data-test-name="next">Next</button>
    {{/slide-deck}}
  `);

  assert.ok(component.next.isDisabled, 'onLastSlide is true, causing button to be disabled');
});

test('onLastSlide is false when not on the last slide', function (assert) {
  this.render(hbs`
    {{#slide-deck currentSlide="one" tagName="div" as |s|}}
      {{s.slide name="one" tagName="div"}}
      {{s.slide name="two" tagName="div"}}
      <button {{action s.next}} disabled={{s.onLastSlide}} data-test-name="next">Next</button>
    {{/slide-deck}}
  `);

  assert.notOk(component.next.isDisabled, 'onLastSlide is false, causing button to be enabled');
});
