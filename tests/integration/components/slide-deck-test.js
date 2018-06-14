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
    {{#slide-deck tagName="div" as |d|}}
      {{#d.slide tagName="div" data-test-name="slide"}}
        First Slide
      {{/d.slide}}
      {{#d.slide tagName="div" data-test-name="slide"}}
        Second Slide
      {{/d.slide}}
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, 'First Slide');
  assert.equal(component.slides(1).text, '');
});

test('it renders the first slide when activeSlide is undefined', function (assert) {
  this.set('activeSlide', 2);

  this.render(hbs`
    {{#slide-deck activeSlide=activeSlide tagName="div" as |d|}}
      {{#d.slide name=1 tagName="div" data-test-name="slide"}}
        First Slide
      {{/d.slide}}
      {{#d.slide name=2 tagName="div" data-test-name="slide"}}
        Second Slide
      {{/d.slide}}
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, '');
  assert.equal(component.slides(1).text, 'Second Slide');

  this.set('activeSlide', undefined);

  assert.equal(component.slides(0).text, 'First Slide');
  assert.equal(component.slides(1).text, '');
});

test('setting activeSlide renders a slide by name', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="two" tagName="div" as |d|}}
      {{#d.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/d.slide}}
      {{#d.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/d.slide}}
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, '');
  assert.equal(component.slides(1).text, 'Second Slide');
});

test('slide changes mutate the bound value of activeSlide', function (assert) {
  this.set('slide', 'one');

  this.render(hbs`
    {{#slide-deck activeSlide=slide tagName="div" as |d|}}
      {{#d.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/d.slide}}
      {{#d.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/d.slide}}
      <button {{action d.next}} data-test-name="next">Next</button>
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, 'First Slide', 'the first slide is visible');

  component.next.click();

  assert.equal(component.slides(1).text, 'Second Slide', 'the second slide is visible');
  assert.equal(this.get('slide'), 'two', 'the bound value was mutated');
});

test('an error is thrown when active slide does not initially exist', function (assert) {
  assert.expectAssertion(() => {
    this.render(hbs`
      {{#slide-deck activeSlide="ten" tagName="div" as |d|}}
        {{d.slide name="one" tagName="div"}}
        {{d.slide name="two" tagName="div"}}
      {{/slide-deck}}
    `);
  });
});

test('an error is thrown when changing the active slide to one that does not exist', function (assert) {
  this.set('activeSlide', 'one');

  this.render(hbs`
    {{#slide-deck activeSlide=activeSlide tagName="div" as |d|}}
      {{d.slide name="one" tagName="div"}}
      {{d.slide name="two" tagName="div"}}
    {{/slide-deck}}
  `);

  assert.expectAssertion(() => {
    this.set('activeSlide', 'ten');
  });
});

// test('an error is thrown when registering a slide with a name that has already been used', function (assert) {
//   this.set('slides', []);

//   assert.expectAssertion(() => {
//     this.render(hbs`
//       {{#slide-deck tagName="div" as |d|}}
//         {{#each slides as |slide|}}
//           {{d.slide name="one" tagName="div"}}
//         {{/each}}
//         {{d.slide name="one" tagName="div"}}
//       {{/slide-deck}}
//     `);
//   });
// });

test('when on the first slide, and when wrap is false, prev will remain on the same slide', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="one" tagName="div" as |d|}}
      {{#d.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/d.slide}}
      {{#d.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/d.slide}}
      <button {{action d.prev}} data-test-name="prev">Prev</button>
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
    {{#slide-deck activeSlide="one" wrap=true tagName="div" as |d|}}
      {{#d.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/d.slide}}
      {{#d.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/d.slide}}
      <button {{action d.prev}} data-test-name="prev">Prev</button>
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
    {{#slide-deck activeSlide="two" tagName="div" as |d|}}
      {{#d.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/d.slide}}
      {{#d.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/d.slide}}
      <button {{action d.next}} data-test-name="next">Next</button>
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
    {{#slide-deck activeSlide="two" wrap=true tagName="div" as |d|}}
      {{#d.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/d.slide}}
      {{#d.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/d.slide}}
      <button {{action d.next}} data-test-name="next">Next</button>
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
    {{#slide-deck activeSlide="two" tagName="div" as |d|}}
      {{#d.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/d.slide}}
      {{#d.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/d.slide}}
      <button {{action d.prev}} data-test-name="prev">Prev</button>
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
    {{#slide-deck activeSlide="one" tagName="div" as |d|}}
      {{#d.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/d.slide}}
      {{#d.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/d.slide}}
      <button {{action d.next}} data-test-name="next">Next</button>
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, 'First Slide');
  assert.equal(component.slides(1).text, '');

  component.next.click();

  assert.equal(component.slides(0).text, '');
  assert.equal(component.slides(1).text, 'Second Slide');
});

test('show will move to the specified slide it if exists', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="one" tagName="div" as |d|}}
      {{#d.slide name="one" tagName="div" data-test-name="slide"}}
        First Slide
      {{/d.slide}}
      {{#d.slide name="two" tagName="div" data-test-name="slide"}}
        Second Slide
      {{/d.slide}}
      <button {{action d.show "two"}} data-test-name="show">Go to two</button>
    {{/slide-deck}}
  `);

  assert.equal(component.slides(0).text, 'First Slide');
  assert.equal(component.slides(1).text, '');

  component.show.click();

  assert.equal(component.slides(0).text, '');
  assert.equal(component.slides(1).text, 'Second Slide');
});

test('show will throw an error if the specified slide does not exist', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="one" tagName="div" as |d|}}
      {{d.slide name="one" tagName="div"}}
      {{d.slide name="two" tagName="div"}}
      <button {{action d.show "ten"}} data-test-name="show">Go to ten</button>
    {{/slide-deck}}
  `);

  assert.expectAssertion(() => {
    component.show.click();
  });
});

test('slides can be rendered dynamically', function (assert) {
  this.set('slides', [1, 2, 3, 4, 5]);

  this.render(hbs`
    {{#slide-deck tagName="div" as |d|}}
      {{#each slides as |slide|}}
        {{d.slide tagName="div" data-test-name="slide"}}
      {{/each}}
    {{/slide-deck}}
  `);

  assert.equal(component.slides().count, 5);
});

test('will move to the previous slide if the active slide is the last slide and it is removed', function (assert) {
  assert.expect(4);

  this.set('slides', [1, 2, 3, 4, 5]);

  this.render(hbs`
    {{#slide-deck activeSlide=5 tagName="div" as |d|}}
      {{#each slides as |slide|}}
        {{#d.slide name=slide tagName="div" data-test-name="slide"}}
          {{slide}}
        {{/d.slide}}
      {{/each}}
    {{/slide-deck}}
  `);

  assert.equal(component.slides().count, 5);
  assert.equal(component.slides(4).text, 5);

  this.set('slides', [1, 2, 3, 4]);

  assert.equal(component.slides().count, 4);
  assert.equal(component.slides(3).text, 4);
});

test('will move to the last slide if the active slide is the first slide and it is removed', function (assert) {
  this.set('slides', [1, 2, 3, 4, 5]);

  this.render(hbs`
    {{#slide-deck activeSlide=1 tagName="div" as |d|}}
      {{#each slides as |slide|}}
        {{#d.slide name=slide tagName="div" data-test-name="slide"}}
          {{slide}}
        {{/d.slide}}
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
    {{#slide-deck activeSlide=3 tagName="div" as |d|}}
      {{#each slides as |slide|}}
        {{#d.slide name=slide tagName="div" data-test-name="slide"}}
          {{slide}}
        {{/d.slide}}
      {{/each}}
    {{/slide-deck}}
  `);

  assert.equal(component.slides().count, 5);
  assert.equal(component.slides(2).text, 3);

  this.set('slides', [2, 3, 4, 5]);

  assert.equal(component.slides().count, 4);
  assert.equal(component.slides(1).text, 3);
});

test('will call a supplied activeSlideRemoved action if the active slide is removed', function (assert) {
  assert.expect(0);

  const done = assert.async();

  this.set('slides', [1]);
  this.on('slideRemoved', () => done());

  this.render(hbs`
    {{#slide-deck activeSlideRemoved=(action "slideRemoved") tagName="div" as |d|}}
      {{#each slides as |slide|}}
        {{d.slide name=slide}}
      {{/each}}
    {{/slide-deck}}
  `);

  this.set('slides', []);
});

test('onFirstSlide is true when on the first slide', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="one" tagName="div" as |d|}}
      {{d.slide name="one" tagName="div"}}
      {{d.slide name="two" tagName="div"}}
      <button {{action d.prev}} disabled={{d.onFirstSlide}} data-test-name="prev">Prev</button>
    {{/slide-deck}}
  `);

  assert.ok(component.prev.isDisabled, 'onFirstSlide is true, causing button to be disabled');
});

test('onFirstSlide is false when not on the first slide', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="two" tagName="div" as |d|}}
      {{d.slide name="one" tagName="div"}}
      {{d.slide name="two" tagName="div"}}
      <button {{action d.prev}} disabled={{d.onFirstSlide}} data-test-name="prev">Prev</button>
    {{/slide-deck}}
  `);

  assert.notOk(component.prev.isDisabled, 'onFirstSlide is false, causing button to be enabled');
});

test('onLastSlide is true when on the last slide', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="two" tagName="div" as |d|}}
      {{d.slide name="one" tagName="div"}}
      {{d.slide name="two" tagName="div"}}
      <button {{action d.next}} disabled={{d.onLastSlide}} data-test-name="next">Next</button>
    {{/slide-deck}}
  `);

  assert.ok(component.next.isDisabled, 'onLastSlide is true, causing button to be disabled');
});

test('onLastSlide is false when not on the last slide', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="one" tagName="div" as |d|}}
      {{d.slide name="one" tagName="div"}}
      {{d.slide name="two" tagName="div"}}
      <button {{action d.next}} disabled={{d.onLastSlide}} data-test-name="next">Next</button>
    {{/slide-deck}}
  `);

  assert.notOk(component.next.isDisabled, 'onLastSlide is false, causing button to be enabled');
});

test('prevDisabled is true when on the first slide and wrap is false', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="one" wrap=false tagName="div" as |d|}}
      {{d.slide name="one" tagName="div"}}
      {{d.slide name="two" tagName="div"}}
      <button {{action d.prev}} disabled={{d.prevDisabled}} data-test-name="prev">Prev</button>
    {{/slide-deck}}
  `);

  assert.ok(component.prev.isDisabled, 'prevDisabled is true, causing button to be disabled');
});

test('prevDisabled is false when on the first slide and wrap is true', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="one" wrap=true tagName="div" as |d|}}
      {{d.slide name="one" tagName="div"}}
      {{d.slide name="two" tagName="div"}}
      <button {{action d.prev}} disabled={{d.prevDisabled}} data-test-name="prev">Prev</button>
    {{/slide-deck}}
  `);

  assert.notOk(component.prev.isDisabled, 'prevDisabled is false, causing button to be enabled');
});

test('prevDisabled is false when not on the first slide', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="two" tagName="div" as |d|}}
      {{d.slide name="one" tagName="div"}}
      {{d.slide name="two" tagName="div"}}
      <button {{action d.prev}} disabled={{d.prevDisabled}} data-test-name="prev">Prev</button>
    {{/slide-deck}}
  `);

  assert.notOk(component.prev.isDisabled, 'prevDisabled is false, causing button to be enabled');
});

test('nextDisabled is true when on the last slide and wrap is false', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="two" wrap=false tagName="div" as |d|}}
      {{d.slide name="one" tagName="div"}}
      {{d.slide name="two" tagName="div"}}
      <button {{action d.next}} disabled={{d.nextDisabled}} data-test-name="next">Next</button>
    {{/slide-deck}}
  `);

  assert.ok(component.next.isDisabled, 'nextDisabled is true, causing button to be disabled');
});

test('nextDisabled is false when on the last slide and wrap is true', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="two" wrap=true tagName="div" as |d|}}
      {{d.slide name="one" tagName="div"}}
      {{d.slide name="two" tagName="div"}}
      <button {{action d.next}} disabled={{d.nextDisabled}} data-test-name="next">Next</button>
    {{/slide-deck}}
  `);

  assert.notOk(component.next.isDisabled, 'nextDisabled is false, causing button to be enabled');
});

test('nextDisabled is false when not on the last slide', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="one" tagName="div" as |d|}}
      {{d.slide name="one" tagName="div"}}
      {{d.slide name="two" tagName="div"}}
      <button {{action d.next}} disabled={{d.nextDisabled}} data-test-name="next">Next</button>
    {{/slide-deck}}
  `);

  assert.notOk(component.next.isDisabled, 'nextDisabled is false, causing button to be enabled');
});

test('it yields all of the slides with their name', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="one" tagName="div" as |d|}}
      {{d.slide name="one" tagName="div"}}
      {{d.slide name="two" tagName="div"}}
      {{#each d.slides as |s|}}
        <div data-test-name="yielded-slide">
          {{s.name}}
        </div>
      {{/each}}
    {{/slide-deck}}
  `);

  assert.ok(component.yieldedSlides().count, 2);
  assert.equal(component.yieldedSlides(0).text, 'one');
  assert.equal(component.yieldedSlides(1).text, 'two');
});

test('it yields the correct isActive value for each slide based on whether it is the active slide', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="one" tagName="div" as |d|}}
      {{d.slide name="one" tagName="div"}}
      {{d.slide name="two" tagName="div"}}
      {{#each d.slides as |s|}}
        <div data-test-name="yielded-slide">
          {{s.isActive}}
        </div>
      {{/each}}
    {{/slide-deck}}
  `);

  assert.ok(component.yieldedSlides().count, 2);
  assert.equal(component.yieldedSlides(0).text, 'true');
  assert.equal(component.yieldedSlides(1).text, 'false');
});

test('the yieled slide names can be rendered before the slides are defined', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="one" tagName="div" as |d|}}
      {{#each d.slides as |s|}}
        <div data-test-name="yielded-slide">
          {{s.name}}
        </div>
      {{/each}}
      {{d.slide name="one" tagName="div"}}
      {{d.slide name="two" tagName="div"}}
    {{/slide-deck}}
  `);

  assert.ok(component.yieldedSlides().count, 2);
  assert.ok(component.yieldedSlides(0).text, 'one');
  assert.ok(component.yieldedSlides(1).text, 'two');
});

test('the yieled slide names can be rendered after the slides are defined', function (assert) {
  this.render(hbs`
    {{#slide-deck activeSlide="one" tagName="div" as |d|}}
      {{d.slide name="one" tagName="div"}}
      {{d.slide name="two" tagName="div"}}
      {{#each d.slides as |s|}}
        <div data-test-name="yielded-slide">
          {{s.name}}
        </div>
      {{/each}}
    {{/slide-deck}}
  `);

  assert.ok(component.yieldedSlides().count, 2);
  assert.ok(component.yieldedSlides(0).text, 'one');
  assert.ok(component.yieldedSlides(1).text, 'two');
});
