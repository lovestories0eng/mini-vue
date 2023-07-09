import { TO_DISPLAY_STRING } from "./runtimeHelpers";
export function transform(root, options = {}) {
    const context = createTransformContext(root, options);
    traverseNode(root, context);
    createRootCodeGen(root);
    root.helpers = [...context.helpers.keys()];
}
function createRootCodeGen(root) {
    const child = root.children[0];
    if (child.type === 2 /* NodeTypes.ELEMENT */) {
        root.codeGenNode = child.codeGenNode;
    }
    else {
        root.codeGenNode = root.children[0];
    }
}
function createTransformContext(root, options) {
    const context = {
        root,
        nodeTransforms: options.nodeTransforms || [],
        helpers: new Map(),
        helper(key) {
            context.helpers.set(key, 1);
        }
    };
    return context;
}
function traverseNode(node, context) {
    const nodeTransforms = context.nodeTransforms;
    const exitFns = [];
    for (let i = 0; i < nodeTransforms.length; i++) {
        const transform = nodeTransforms[i];
        const onExit = transform(node, context);
        onExit && exitFns.push(onExit);
    }
    switch (node.type) {
        case 0 /* NodeTypes.INTERPOLATION */:
            context.helper(TO_DISPLAY_STRING);
            break;
        case 4 /* NodeTypes.ROOT */:
        case 2 /* NodeTypes.ELEMENT */:
            traverseChildren(node, context);
            break;
        default:
            break;
    }
    let i = exitFns.length;
    while (i--) {
        exitFns[i]();
    }
}
function traverseChildren(node, context) {
    const children = node.children ? node.children : [];
    for (let i = 0; i < children.length; i++) {
        const node = children[i];
        traverseNode(node, context);
    }
}
