import { extend } from "@mini-vue/shared";
let activeEffect;
let shouldTrack;
export class ReactiveEffect {
    constructor(fn, scheduler) {
        this.scheduler = scheduler;
        this.deps = [];
        this.active = true;
        this._fn = fn;
    }
    run() {
        activeEffect = this;
        // 1. 会收集依赖
        // shouldTrack做区分
        if (!this.active) {
            return this._fn();
        }
        shouldTrack = true;
        activeEffect = this;
        let result = this._fn();
        // reset
        shouldTrack = false;
        return result;
    }
    stop() {
        if (this.active) {
            this.cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
    cleanupEffect(effect) {
        effect.deps.forEach((dep) => {
            dep.delete(effect);
        });
        effect.deps.length = 0;
    }
}
// WeakMap?
// const targetMap = new WeakMap()
const targetMap = new Map();
export function track(target, key) {
    if (!isTracking())
        return;
    // target -> key -> dep
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    trackEffects(dep);
}
export function trackEffects(dep) {
    // 如果之前已经在dep中，则无需添加
    if (dep.has(activeEffect))
        return;
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}
export function isTracking() {
    // shouldTracking:
    // 只有在调用 run 方法的时候才能收集依赖，防止++操作也触发依赖收集
    // 在调用cleanupTrack之后，调用set方法不会出发run方法
    return shouldTrack && activeEffect !== undefined;
}
export function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    triggerEffects(dep);
}
export function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}
export function effect(fn, options = {}) {
    // fn
    const _effect = new ReactiveEffect(fn, options.scheduler);
    // extends
    extend(_effect, options);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    // 返回一个以_effect为this的函数
    return runner;
}
export function stop(runner) {
    runner.effect.stop();
}
