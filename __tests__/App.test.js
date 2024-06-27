import { test, describe, expect,it } from 'vitest';

import { mount } from '@vue/test-utils';
import AboutView from '../src/views/AboutView.vue';

describe('測試', () => {
    test('1 + 1 = 2', () => {
        expect(1 + 1).toBe(2);
    });
    it('2 + 2 = 4', () => {
        expect(2 + 2).toBe(4);
    });
});

describe('App.vue', () => {
    const wrapper = mount(AboutView);
  
    test('標題是否為 IsRayNotArray 正確', () => {
        const text = wrapper.find('h1.text-base').text();
        expect(text).toBe('IsRayNotArray');
    });
  });