import { baseParse } from "../src/parse";
describe('parse', () => {
    describe('interpolation', () => {
        test('simple interpolation', () => {
            const ast = baseParse('{{message}}');
            // root
            expect(ast.children[0]).toStrictEqual({
                type: 0 /* NodeTypes.INTERPOLATION */,
                content: {
                    type: 1 /* NodeTypes.SIMPLE_EXPRESSION */,
                    content: 'message'
                }
            });
        });
    });
    describe('element', () => {
        it('simple element div', () => {
            const ast = baseParse('<div></div>');
            expect(ast.children[0]).toStrictEqual({
                type: 2 /* NodeTypes.ELEMENT */,
                tag: 'div'
            });
        });
    });
    describe('text', () => {
        it('simple text', () => {
            const ast = baseParse('some text');
            expect(ast.children[0]).toStrictEqual({
                type: 3 /* NodeTypes.TEXT */,
                content: 'some text'
            });
        });
    });
    test('hello world', () => {
        const ast = baseParse('<div>hi,{{message}}</div>');
        expect(ast.children[0]).toStrictEqual({
            type: 2 /* NodeTypes.ELEMENT */,
            tag: 'div',
            children: [
                {
                    type: 3 /* NodeTypes.TEXT */,
                    content: 'hi,'
                },
                {
                    type: 0 /* NodeTypes.INTERPOLATION */,
                    content: {
                        type: 1 /* NodeTypes.SIMPLE_EXPRESSION */,
                        content: 'message'
                    }
                }
            ]
        });
    });
    test('nested element', () => {
        const ast = baseParse('<div><p>hi</p>{{ message }}</div>');
        expect(ast.children[0]).toStrictEqual({
            type: 2 /* NodeTypes.ELEMENT */,
            tag: 'div',
            children: [
                {
                    type: 2 /* NodeTypes.ELEMENT */,
                    tag: 'p',
                    children: [
                        {
                            type: 3 /* NodeTypes.TEXT */,
                            content: 'hi'
                        }
                    ]
                },
                {
                    type: 0 /* NodeTypes.INTERPOLATION */,
                    content: {
                        type: 1 /* NodeTypes.SIMPLE_EXPRESSION */,
                        content: 'message'
                    }
                }
            ]
        });
    });
    test('should throw error when lack end tag', () => {
        expect(() => {
            baseParse('<div><span></div>');
        }).toThrow(`缺少结束标签: span`);
    });
});
