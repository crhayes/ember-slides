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

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{slide-deck tagName="div"}}`);

  assert.equal(component.text, '');

  // Template block usage:
  this.render(hbs`
    {{#slide-deck tagName="div"}}
      template block text
    {{/slide-deck}}
  `);

  assert.equal(component.text, 'template block text');
});
