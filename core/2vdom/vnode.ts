import type { Component } from 'types/component'
import type { ComponentOptions } from 'types/options'
import type { VNodeComponentOptions, VNodeData } from 'types/vnode'

/**
 * 虚拟DOM节点类
 * 用于表示Vue组件树中的每个节点，是Vue虚拟DOM系统的核心数据结构
 * @internal
 */
export default class VNode {
  // 基础属性
  tag?: string // 标签名，如 'div', 'span' 等
  data: VNodeData | undefined // 节点数据，包含属性、事件、指令等
  children?: Array<VNode> | null // 子节点数组
  text?: string // 文本内容（仅文本节点使用）
  elm: Node | undefined // 对应的真实DOM节点
  ns?: string // 命名空间（主要用于SVG和MathML）
  context?: Component // 组件上下文，即创建此VNode的Vue实例
  key: string | number | undefined // 用于列表渲染的key值，优化diff算法
  componentOptions?: VNodeComponentOptions // 组件选项
  componentInstance?: Component // 组件实例
  parent: VNode | undefined | null // 父节点（组件占位符节点）

  // 内部标识属性
  raw: boolean // 是否包含原始HTML（仅服务端渲染使用）
  isStatic: boolean // 是否为静态节点（提升的静态节点）
  isRootInsert: boolean // 是否为根插入节点（进入过渡检查必需）
  isComment: boolean // 是否为空注释占位符
  isCloned: boolean // 是否为克隆节点
  isOnce: boolean // 是否为v-once节点
  asyncFactory?: Function // 异步组件工厂函数
  asyncMeta: Object | void // 异步组件元数据
  isAsyncPlaceholder: boolean // 是否为异步占位符
  ssrContext?: Object | void // 服务端渲染上下文
  fnContext: Component | void // 函数式节点的真实上下文vm
  fnOptions?: ComponentOptions | null // 用于SSR缓存
  devtoolsMeta?: Object | null // 用于存储函数式渲染上下文，供开发者工具使用
  fnScopeId?: string | null // 函数式作用域ID支持
  isComponentRootElement?: boolean | null // 用于SSR指令

  /**
   * VNode构造函数
   * @param tag 标签名
   * @param data 节点数据（属性、事件、指令等）
   * @param children 子节点数组
   * @param text 文本内容
   * @param elm 对应的真实DOM节点
   * @param context 组件上下文
   * @param componentOptions 组件选项
   * @param asyncFactory 异步组件工厂函数
   */
  constructor(
    tag?: string,
    data?: VNodeData,
    children?: Array<VNode> | null,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    // 设置基础属性
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key // 从data中提取key值
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    
    // 初始化内部标识属性
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  /**
   * 已废弃：componentInstance的别名，用于向后兼容
   * @deprecated 请直接使用 componentInstance 属性
   */
  /* istanbul ignore next */
  get child(): Component | void {
    return this.componentInstance
  }
}

/**
 * 创建空VNode（注释节点）
 * 用于占位或标记位置，在DOM中表现为注释节点
 * @param text 注释文本内容，默认为空字符串
 * @returns 空的VNode实例
 */
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}

/**
 * 创建文本VNode
 * 用于表示纯文本内容，在DOM中表现为文本节点
 * @param val 文本值，可以是字符串或数字
 * @returns 文本VNode实例
 */
export function createTextVNode(val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}

/**
 * 优化的浅克隆VNode
 * 用于静态节点和插槽节点，因为它们可能在多次渲染中重复使用
 * 克隆它们可以避免当DOM操作依赖于elm引用时出现错误
 * 
 * 注意：会克隆children数组以避免在克隆子节点时修改原始数组
 * @param vnode 要克隆的VNode
 * @returns 克隆后的VNode实例
 */
export function cloneVNode(vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // 克隆children数组以避免在克隆子节点时修改原始数组
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  // 复制额外的属性
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true // 标记为克隆节点
  return cloned
}
