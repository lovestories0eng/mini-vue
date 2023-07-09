// mini-vue 出口
export * from '@mini-vue/runtime-dom';
import { baseCompile } from '@mini-vue/compiler-core';
import * as runtimeDom from '@mini-vue/runtime-dom';
import { registerRuntimeCompiler } from '@mini-vue/runtime-dom';
function compileToFunction(template) {
    const { code } = baseCompile(template);
    const render = new Function('Vue', code)(runtimeDom);
    return render;
}
registerRuntimeCompiler(compileToFunction);
