import { hasChanged, isObject } from "@mini-vue/shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";
class RefImpl {
    constructor(value) {
        this.__v_isRef = true;
        this._rawValue = value;
        // 如果 value 是对象需要用 reactive包裹
        this._value = convert(value);
        this.dep = new Set();
    }
    get value() {
        trackRefValue(this);
        return this._value;
    }
    set value(newValue) {
        // 值一样则无需通知更新
        if (hasChanged(newValue, this._rawValue)) {
            this._rawValue = newValue;
            this._value = convert(newValue);
            triggerEffects(this.dep);
        }
    }
}
function convert(value) {
    return isObject(value) ? reactive(value) : value;
}
function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep);
    }
}
export function ref(value) {
    return new RefImpl(value);
}
export function isRef(ref) {
    return !!ref.__v_isRef;
}
export function unRef(ref) {
    return isRef(ref) ? ref.value : ref;
}
export function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target, key) {
            // get -> age (ref) 那么就给他返回 .value
            // not ref -> value
            return unRef(Reflect.get(target, key));
        },
        set(target, key, value) {
            // set -> ref .value
            if (isRef(target[key]) && !isRef(value)) {
                return target[key].value = value;
            }
            else {
                return Reflect.set(target, key, value);
            }
        }
    });
}
