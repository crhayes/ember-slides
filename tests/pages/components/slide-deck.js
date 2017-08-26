import {
  clickable,
  collection,
  is,
} from 'ember-cli-page-object';

export default {
  slides: collection({
    itemScope: '[data-test-name="slide"]'
  }),

  yieldedSlideNames: collection({
    itemScope: '[data-test-name="yielded-slide-name"]'
  }),

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

  goto: {
    scope: '[data-test-name="goto"]',
    click: clickable()
  }
};
