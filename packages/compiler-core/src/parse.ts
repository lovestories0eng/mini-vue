import { NodeTypes, TagTypes } from "./ast"

export function baseParse(content: string) {
    const context = createParserContext(content)
    return createRoot(parseChildren(context, []))
}

function parseChildren(context, ancestors) {
    const nodes: any = []

    while (!isEnd(context, ancestors)) {
        let node
        const s = context.source
        if (s.startsWith('{{')) {
            node = parseInterpolation(context)
        } else if (s[0] === '<') {
            if (/[a-z]/i.test(s[1])) {
                node = parseElement(context, ancestors)
            }
        }
    
        if (!node) {
            node = parseText(context)
        }
    
        nodes.push(node)
    }

    return nodes
}

function isEnd(context, ancestors) {
    const s = context.source

    if (s.startsWith('</')) {
        for (let i = ancestors.length - 1; i >= 0; i--) {
            const tag = ancestors[i].tag
            if (startsWithEndTagOpen(s, tag)) {
                return true
            }
        }
    }

    return !s
}

function parseText(context: any) {

    let endIndex = context.source.length
    let endTokens = ['<', '{{']

    for (let i = 0; i < endTokens.length; i++) {
        const index = context.source.indexOf(endTokens[i])
        if (index !== -1 && endIndex > index) {
            endIndex = index
        }
    }

    // 1. 获取content
    const content = parseTextData(context, endIndex)

    return {
        type: NodeTypes.TEXT,
        content: content
    }
}

function parseTextData(context: any, length) {
    const rawContent = context.source.slice(0, length)
    advanceBy(context, length)
    return rawContent
}

function parseElement(context: any, ancestors) {
    // Implement
    // 1. 解析tag
    const element: any = parseTag(context, TagTypes.START)
    ancestors.push(element)

    let children = parseChildren(context, ancestors)
    children.length > 0 && (element.children = children)
    ancestors.pop()

    // 2. 删除处理完成的代码
    if (startsWithEndTagOpen(context.source, element.tag)) {
        parseTag(context, TagTypes.END)
    } else {
        throw new Error(`缺少结束标签: ${element.tag}`)
    }

    return element
}

function startsWithEndTagOpen(source, tag) {
    return source.startsWith('</') && source.slice(2, 2 + tag.length).toLowerCase() === tag
}

function parseTag(context: any, type: TagTypes) {
    const match: any = /^<\/?([a-z]*)/i.exec(context.source)

    const tag = match[1]
    advanceBy(context, match[0].length)
    advanceBy(context, 1)

    if (type === TagTypes.END) return

    return {
        type: NodeTypes.ELEMENT,
        tag
    }
}

function parseInterpolation(context) {

    const openDelimiter = '{{'
    const closeDelimiter = '}}'

    const closeIndex = context.source.indexOf(
        closeDelimiter,
        openDelimiter.length
    )

    advanceBy(context, openDelimiter.length)

    const rawContentLength = closeIndex -  openDelimiter.length
    const rawContent = parseTextData(context, rawContentLength)
    const content = rawContent.trim()

    advanceBy(context, closeDelimiter.length)

    return {
            type: NodeTypes.INTERPOLATION,
            content: {
                type: NodeTypes.SIMPLE_EXPRESSION,
                content: content
            }
        }
}

function advanceBy(context: any, length: number) {
    context.source = context.source.slice(length)
}

function createRoot(children) {
    return {
        children,
        type: NodeTypes.ROOT
    }
}

function createParserContext(content: string): any {
    return {
        source: content
    }
}