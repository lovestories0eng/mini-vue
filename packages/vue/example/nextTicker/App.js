import { h, ref, reactive, nextTick, getCurrentInstance } from "../../lib/mini-vue.esm.js";
import NextTicker from "./NextTicker.js";

export default {
  name: "App",
  setup() {
    const count = ref(1)

    const instance = getCurrentInstance()

    function onClick() {
      for (let i = 0; i < 100; i++) {
        count.value = i
      }

      nextTick(() => {
        console.log(instance)
      })
    }

    return {
      onClick,
      count
    }
  },

  render() {
    const button = h(
      'button', 
      {
        onClick: this.onClick
      },
      'update'
    )
    const p = h('p', {}, 'count: ' + this.count)

    return h("div", { tId: 1 }, [button, p, h("p", {}, "主页"), h(NextTicker)]);
  },
};
