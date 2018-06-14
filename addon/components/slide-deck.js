import { A as array } from '@ember/array';
import { assert } from '@ember/debug';
import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { scheduleOnce } from '@ember/runloop';
import { set, get, computed } from '@ember/object';
import layout from '../templates/components/slide-deck';

export default Component.extend({
  layout,

  init() {
    this._super(...arguments);
    this.slides = array();
  },

  /**
   * Create a tagless component so by default we don't interfere
   * with the consuming app's layout.
   *
   * @type {String}
   */
  tagName: '',

  /**
   * When false:
   *   Clicking "prev" on the first slide will stay on that slide.
   *   Clicking "next" on the last slide will stay on that slide.
   * When true:
   *   Clicking "prev" on the first slide will render the last slide.
   *   Clicking "next" on the last slide will render the first slide.
   *
   * @type {Boolean}
   */
  wrap: false,

  /**
   * The names of registered slides.
   *
   * @type {Array<String>}
   */
  slides: null,

  /**
   * An array containing the names of each slide and whether or
   * not they are currently active.
   *
   * @return {Array}
   */
  yieldedSlides: computed('slides.@each', 'activeSlide', function () {
    const slides = get(this, 'slides');
    const activeSlide = get(this, 'activeSlide');

    return slides.map(name => ({ name, isActive: name === activeSlide }));
  }),

  /**
   * The name of the active slide.
   *
   * @type {String}
   */
  activeSlide: reads('firstSlide'),

  /**
   * The name of the first slide.
   *
   * @type {String}
   */
  firstSlide: reads('slides.firstObject'),

  /**
   * The name of the last slide.
   *
   * @type {String}
   */
  lastSlide: reads('slides.lastObject'),

  /**
   * Is the first slide rendered?
   *
   * @return {Boolean}
   */
  onFirstSlide: computed('activeSlide', 'firstSlide', function() {
    return get(this, 'activeSlide') === get(this, 'firstSlide');
  }),

  /**
   * Is the last slide rendered?
   *
   * @return {Boolean}
   */
  onLastSlide: computed('activeSlide', 'lastSlide', function() {
    return get(this, 'activeSlide') === get(this, 'lastSlide');
  }),

  /**
   * Is showing the previous slide disabled?
   *
   * @return {Boolean}
   */
  prevDisabled: computed('onFirstSlide', 'wrap', function () {
    return get(this, 'onFirstSlide') && !get(this, 'wrap');
  }),

  /**
   * Is showing the next slide disabled?
   *
   * @return {Boolean}
   */
  nextDisabled: computed('onLastSlide', 'wrap', function () {
    return get(this, 'onLastSlide') && !get(this, 'wrap');
  }),

  /**
   * Method that is called when the currently rendered slide is removed.
   * It temporarily sets wrap=true (if not already set) so that it
   * moves to the previous slide, even if the first was removed.
   *
   * @return {void}
   */
  activeSlideRemoved() {
    const wrap = get(this, 'wrap');

    set(this, 'wrap', true);
    this.send('prev');
    set(this, 'wrap', wrap);
  },

  didReceiveAttrs() {
    this._super(...arguments);

    scheduleOnce('actions', () => {
      const slides = get(this, 'slides');
      const activeSlide = get(this, 'activeSlide');

      assert('active slide does not exist', slides.includes(activeSlide));
    });
  },

  didUpdateAttrs() {
    this._super(...arguments);

    scheduleOnce('actions', () => {
      const slides = get(this, 'slides');
      const firstSlide = get(this, 'firstSlide');
      const activeSlide = get(this, 'activeSlide');

      if (activeSlide === undefined) {
        set(this, 'activeSlide', firstSlide);
      } else {
        assert('active slide does not exist', slides.includes(activeSlide));
      }
    });
  },

  actions: {
    /**
     * @param  {String} name
     * @return {void}
     */
    registerSlide(name) {
      const slides = get(this, 'slides');

      assert(`Slide names must be unique; ${name} has already been registered.`, slides.indexOf(name));

      get(this, 'slides').pushObject(name);
    },

    /**
     * @param  {String} name
     * @return {void}
     */
    unregisterSlide(name) {
      const activeSlide = get(this, 'activeSlide');

      if (name === activeSlide) {
        scheduleOnce('actions', () => this.activeSlideRemoved(this, activeSlide));
      }

      scheduleOnce('actions', () => get(this, 'slides').removeObject(name));
    },

    /**
     * Move to the previous slide.
     *
     * @return {void}
     */
    prev() {
      const wrap = get(this, 'wrap');
      const slides = get(this, 'slides');
      const lastSlide = get(this, 'lastSlide');
      const activeSlide = get(this, 'activeSlide');
      const onFirstSlide = get(this, 'onFirstSlide');
      let prevSlideIndex;

      if (onFirstSlide && wrap) {
        prevSlideIndex = slides.indexOf(lastSlide);
      } else if (!onFirstSlide) {
        prevSlideIndex = slides.indexOf(activeSlide) - 1
      } else {
        return;
      }

      set(this, 'activeSlide', slides.objectAt(prevSlideIndex));
    },

    /**
     * Move to the next slide.
     *
     * @return {void}
     */
    next() {
      const wrap = get(this, 'wrap');
      const slides = get(this, 'slides');
      const firstSlide = get(this, 'firstSlide');
      const activeSlide = get(this, 'activeSlide');
      const onLastSlide = get(this, 'onLastSlide');
      let nextSlideIndex;

      if (onLastSlide && wrap) {
        nextSlideIndex = slides.indexOf(firstSlide);
      } else if (!onLastSlide) {
        nextSlideIndex = slides.indexOf(activeSlide) + 1;
      } else {
        return;
      }

      set(this, 'activeSlide', slides.objectAt(nextSlideIndex));
    },

    /**
     * Show the slide with the given name.
     *
     * @return {void}
     */
    show(name) {
      const slides = get(this, 'slides');
      const slideIndex = slides.indexOf(name);

      assert(`You attempted to go to a slide with the name ${name} that doesn't exist.`, slideIndex !== -1);

      set(this, 'activeSlide', slides.objectAt(slideIndex));
    }
  }
});
