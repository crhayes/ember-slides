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

test('it registers and unregisters itself with the slide deck with the correct name', function (assert) {
  assert.expect(2);

  this.on('registerSlide', name => assert.equal(name, 'test'));
  this.on('unregisterSlide', name => assert.equal(name, 'test'));

  this.render(hbs`
    {{#slide-card
      tagName="div"
      name="test"
      register-slide=(action "registerSlide")
      unregister-slide=(action "unregisterSlide")
    }}
      template block text
    {{/slide-card}}
  `);
});

test('it does not render its content when it is not active', function (assert) {
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

test('it renders the inverse content when it is not active', function (assert) {
  this.render(hbs`
    {{#slide-card
      tagName="div"
      register-slide=(action "registerSlide")
      unregister-slide=(action "unregisterSlide")
    }}
      template block text
    {{else}}
      inverse template block text
    {{/slide-card}}
  `);

  assert.equal(component.text, 'inverse template block text');
});

test('it renders its content when it is active', function (assert) {
  this.render(hbs`
    {{#slide-card
      tagName="div"
      isActive=true
      register-slide=(action "registerSlide")
      unregister-slide=(action "unregisterSlide")
    }}
      template block text
    {{/slide-card}}
  `);

  assert.equal(component.text, 'template block text');
});
