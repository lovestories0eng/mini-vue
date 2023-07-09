import { ReactiveEffect } from "./effect";
class ComputedRefImpl {
    constructor(getter) {
        this._dirty = true;
        this._getter = getter;
        this._effect = new ReactiveEffect(getter, () => {
            if (!this._dirty) {
                this._dirty = true;
            }
        });
    }
    get value() {
        // get
        // get value -> dirty value
        // 当依赖的响应式对象的值发生改变的时候
        // effect
        if (this._dirty) {
            this._dirty = false;
            this._value = this._effect.run();
        }
        return this._value;
    }
}
export function computed(getter) {
    return new ComputedRefImpl(getter);
}
