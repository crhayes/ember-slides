import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { create } from 'ember-cli-page-object';
import singleSlide from '../../pages/components/slide-card';

const component = create(singleSlide);

moduleForComponent('slide-card', 'Integration | Component | single slide', {
  integration: true,
  beforeEach() {
    component.setContext(this);

    this.on('registerSlide', () => {});
    this.on('unregisterSlide', () => {});
  },

  afterEach() {
    component.removeContext();
  }
});

test('it renders', function(assert) {
  this.render(hbs`
    {{#slide-card
      tagName="div"
      register-slide=(action "registerSlide")
      unregister-slide=(action "unregisterSlide")
    }}
      template block text
    {{/slide-card}}
  `);

  assert.equal(component.text, '');
});
