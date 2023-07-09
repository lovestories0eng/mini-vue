var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { reactive } from "@mini-vue/reactivity";
import { watchEffect } from "../src/apiWatch";
import { nextTick } from "../src/scheduler";
describe("api: watch", () => {
    it("effect", () => __awaiter(void 0, void 0, void 0, function* () {
        const state = reactive({ count: 0 });
        let dummy;
        watchEffect(() => {
            dummy = state.count;
        });
        expect(dummy).toBe(0);
        state.count++;
        yield nextTick();
        expect(dummy).toBe(1);
    }));
});
