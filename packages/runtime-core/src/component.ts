import { PublicInstanceProxyHandlers } from "./componentsPublicInstance"
import { initProps } from "./componentProps"
import { initSlots } from "./componentSlots"
import { shallowReadonly, proxyRefs } from "@mini-vue/reactivity"
import { emit } from "./componentEmit"

export function createComponentInstance(vnode, parent) {
    console.log("createComponentInstance " + parent)
    const component = {
        vnode,
        type: vnode.type,
        next: null,
        setupState: {},
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent,
        isMounted: false,
        subTree: {},
        emit: () => {}
    }

    component.emit = emit.bind(null, component) as any

    return component
}

export function setupComponent(instance) {
    initProps(instance, instance.vnode.props)
    initSlots(instance, instance.vnode.children)
    setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
    const Component = instance.type
    const { setup } = Component

    if (setup) {
        setCurrentInstance(instance)
        // function object
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        })
        setCurrentInstance(null)

        handleSetupResult(instance, setupResult)
    }

    // ctx
    instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandlers)   
}

function handleSetupResult(instance, setupResult: any) {
    // function object
    // TODO: function

    if (typeof setupResult === 'object') {
        instance.setupState = proxyRefs(setupResult)
    }

    finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
    const Component = instance.type

    if (compiler && !Component.render) {
        if (Component.template) {
            Component.render = compiler(Component.template)
        }
    }

    instance.render = Component.render
}

let currentInstance = null

export function getCurrentInstance() {
    return currentInstance
}

export function setCurrentInstance(instance) {
    currentInstance = instance
}

let compiler

export function registerRuntimeCompiler(_compiler) {
    compiler = _compiler
}