import { isObject } from "@mini-vue/shared";
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers";
export function reactive(raw) {
    return createReactiveObjects(raw, mutableHandlers);
}
export function readonly(raw) {
    return createReactiveObjects(raw, readonlyHandlers);
}
export function shallowReadonly(raw) {
    return createReactiveObjects(raw, shallowReadonlyHandlers);
}
export function isReactive(value) {
    // undefined
    // !undefined = true
    // !!undefined = false
    return !!value["__v_isReactive" /* ReactiveFlag.IS_REACTIVE */];
}
export function isReadonly(value) {
    return !!value["__v_isReadonly" /* ReactiveFlag.IS_READONLY */];
}
export function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}
function createReactiveObjects(target, baseHandlers) {
    if (!isObject(target)) {
        console.warn(`target ${target} 必须是一个对象`);
        return target;
    }
    return new Proxy(target, baseHandlers);
}
