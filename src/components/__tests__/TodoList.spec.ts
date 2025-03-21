import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoList from '../TodoList.vue';

describe('TodoList', () => {
  window.indexedDB = {
    open: vi.fn().mockReturnValue({
      onsuccess: vi.fn(),
      onupgradeneeded: vi.fn(),
      onerror: vi.fn(),
    }),
    cmp: vi.fn(),
    databases: vi.fn(),
    deleteDatabase: vi.fn(),
  };

  describe('when mounted', () => {
    it('render the title', () => {
      const component = mount(TodoList);
      expect(component.find('h2').text()).toBe('Get Things Done!');
    });
  });
});
