import {
  clickable,
  collection,
  is,
} from 'ember-cli-page-object';

export default {
  slides: collection('[data-test-name="slide"]'),

  yieldedSlides: collection('[data-test-name="yielded-slide"]'),

  prev: {
    scope: '[data-test-name="prev"]',
    click: clickable(),
    isDisabled: is(':disabled')
  },

  next: {
    scope: '[data-test-name="next"]',
    click: clickable(),
    isDisabled: is(':disabled')
  },

  show: {
    scope: '[data-test-name="show"]',
    click: clickable()
  }
};
