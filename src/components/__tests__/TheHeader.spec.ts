import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TheHeader from '../TheHeader.vue';

describe('TheHeader', () => {
  describe('when mounted', () => {
    it('contains h1', () => {
      const component = mount(TheHeader);
      expect(component.html()).toContain('h1');
    });
  });
});
