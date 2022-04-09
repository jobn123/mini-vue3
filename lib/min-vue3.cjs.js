'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children
    };
    return vnode;
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps
    // initSlots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function object
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    // patch()
    patch(vnode, container);
}
function patch(vnode, container) {
    // TODO 判断vnode是否为element类型
    // 是element处理element 否则视为组件
    if (typeof vnode.type === "string") {
        // 处理element
        processElement(vnode, container);
    }
    else {
        // 处理组件
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function processElement(vnode, container) {
    const el = document.createElement(vnode.type);
    const { children } = vnode;
    // content
    if (typeof children === "string") {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(children, el);
    }
    // props
    const { props } = vnode;
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function mountChildren(vnode, container) {
    vnode.forEach((v) => {
        patch(v, container);
    });
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // vnode -> patch
    patch(subTree, container);
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先转换为虚拟节点
            // 后续所有操作都基于虚拟节点
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;