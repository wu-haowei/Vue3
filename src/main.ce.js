import { defineCustomElement } from "vue";
import MyFirstCustomElement from "./elements/MyFirstCustomElements.ce.vue";
window.customElements.define('signature-file-canvas-element',defineCustomElement(MyFirstCustomElement))