import { defineCustomElement } from "vue";
import MyFirstCustomElement from "./elements/MyFirstCustomElements.ce.vue";
window.customElements.define('my-first-custom-element',defineCustomElement(MyFirstCustomElement))