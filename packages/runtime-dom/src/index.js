import { createRenderer } from "@mini-vue/runtime-core";
function createElement(type) {
    return document.createElement(type);
}
export function patchProp(el, key, prevVal, nextVal) {
    const isOn = (key) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, nextVal);
    }
    else {
        if (nextVal === undefined || nextVal === null) {
            el.removeAttribute(key);
        }
        else {
            el.setAttribute(key, nextVal);
        }
    }
}
function insert(child, parent, anchor) {
    parent.insertBefore(child, anchor);
}
function remove(child) {
    const parent = child.parentNode;
    parent && parent.removeChild(child);
}
function setElementText(el, text) {
    el.textContent = text;
}
const renderer = createRenderer({
    createElement,
    patchProp,
    insert,
    remove,
    setElementText
});
export function createApp(...args) {
    return renderer.createApp(...args);
}
export * from '@mini-vue/runtime-core';
