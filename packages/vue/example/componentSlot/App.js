import { h, createTextVnode } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./foo.js"

export const App = {
    name: 'App',
    // .vue
    // <template></template>
    render() {
        const app = h('div', {}, 'App')
        // const foo = h(Foo, {}, [
        //     h('p', {}, '123'),
        //     h('p', {}, '456')
        // ])

        const foo = h(
            Foo, 
            {}, 
            {
                header: ({ age }) => [h('p', {}, 'header' + age), createTextVnode('你好呀')],
                footer: () => h('p', {}, 'footer')
            })

        return h('div', {}, [app, foo])
    },

    setup() {
        // composition api
        return {}
    }
}