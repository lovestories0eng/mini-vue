import { baseParse } from "../src/parse";
import { generate } from "../src/codegen";
import { transform } from "../src/transform";
import { transformExpression } from "../src/transforms/transformExpression";
import { transformElement } from "../src/transforms/transformElement";
import { transformText } from "../src/transforms/transformText";

describe('codegen', () => {
    it('string', () => {
        const ast = baseParse('hi 1')

        transform(ast)

        const { code } = generate(ast)

        // 快照
        expect(code).toMatchSnapshot()
    })

    it('interpolation', () => {
        const ast = baseParse('{{message}}')
        transform(ast, {
            nodeTransforms: [transformExpression]
        })

        const { code } = generate(ast)
        expect(code).toMatchSnapshot()
    })

    it('element', () => {
        const ast = baseParse('<div>hi,{{message}}</div>')
        transform(ast, {
            nodeTransforms: [transformExpression, transformElement, transformText]
        })
        const { code } = generate(ast)
        expect(code).toMatchSnapshot()
    })
})