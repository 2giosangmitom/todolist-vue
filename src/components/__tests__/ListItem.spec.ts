import { describe, expect, it, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import ListItem from '../ListItem.vue';

describe('ListItem', () => {
  let component: VueWrapper<unknown>;

  describe('when checked', () => {
    beforeEach(() => {
      component = mount(ListItem, { props: { title: 'Learn JavaScript', isChecked: true } });
    });

    it('contains checked class', () => {
      expect(component.find('.list_item > div').classes()).toContain('checked');
    });

    it('renders the correct title', () => {
      expect(component.find('.list_item > div').text()).toBe('Learn JavaScript');
    });
  });

  describe('when not checked', () => {
    beforeEach(() => {
      component = mount(ListItem, { props: { title: 'Learn JavaScript', isChecked: false } });
    });

    it('does not contain checked class', () => {
      expect(component.find('.list_item > div').classes()).not.toContain('checked');
    });

    it('renders the correct title', () => {
      expect(component.find('.list_item > div').text()).toBe('Learn JavaScript');
    });
  });
});
