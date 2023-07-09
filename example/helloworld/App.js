import { h } from "../../lib/mini-vue.esm.js"
import { Foo } from "./foo.js"

export const App = {
    name: 'App',
    // .vue
    // <template></template>
    render() {
        return  h('div', {}, [
            h('div', {}, 'App'),
            h(Foo, {
                onAdd(a, b) {
                    console.log('onAdd')
                    console.log(a + b)
                },
                // add-foo -> addFoo
                onAddFoo() {
                    console.log('onAddFoo')
                }
            })
        ])
    },

    setup() {
        // composition api
        return {}
    }
}