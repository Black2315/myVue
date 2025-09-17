/**
 * 记录依赖的 Vue 实例和回调函数；
 * 把路径字符串转成取值函数
 * 执行一次取值，触发依赖收集，让对应数据知道这个 Watcher 在监听它；
 * 保存初始值，后续对比新旧值时使用。
 * ! 绑定目标 → 生成 getter → 注册依赖 → 初始化值
 * ! get过程是主动的,set过程时被动的
 */
import { popTarget, printTarget, pushTarget } from "../utils/windowTarget.js";
import { Observer } from "./Observer.js"

export default class Watcher {
    constructor (vm, expOrFn, cb) {
        // * 当前的Vue实例，响应式上下文， watcher会依附在这个实例上
        this.vm = vm;
        // * 字符串形式的路径（比如'a.b.c'），表示要观察的数据字段
        this.getter = parsePath(expOrFn)
        // * 当监听的值发生变化时，Watcher触发的回调函数
        this.cb = cb;
        this.value = this.get()
    }

    get () {
        // * 可以把 window.target 理解为一个 “全局指针”，指向当前正在收集依赖的 Watcher
        // * 首先把实例自身赋给了全局的一个唯一对象window.target上
        pushTarget(this)
        // * 然后获取一下被依赖的数据，获取被依赖数据的目的是触发该数据上面的getter
        // * this.getter.call的过程会执行observer过程，并把window.target这个值放入deps数组
        const vm = this.vm
        let value = this.getter.call(vm, vm)
        // * 挂载完成依赖后再将全局指针清空，并返回获取的值
        popTarget(this)
        return value
    }

    update () {
        console.log("我进来了")
        const oldValue = this.value
        this.value = this.get()
        // * 而当数据变化时，会触发Observer数据的setter方法，在setter中调用了dep.notify()方法
        // * 此时会触发Dep遍历所有依赖(即watcher实例)
        // * 最后执行到每一个Watcher类中的update()实例方法，在update()方法中调用数据变化的更新回调函数
        console.log("我进来了")
        this.cb.call(this.vm, this.value, oldValue)
    }
}
/**
 * 将一个形如'data.a.b.c'的字符串路径所表示的值从真实的data对象中取出来
 * 例如:
 * data = {a: {b: {c: 2}}}
 * parsePath('a.b.c')(data)  // 2
 * @param {String} path 路径形式的对象名
 * @returns 对象名对应的值
 */
export function parsePath (path) {
    if (/[^\w.$]/.test(path)) {
        return
    }
    const segments = path.split(".")
    return function (obj) {
        
        for (let i = 0; i < segments.length; i++) {
            if (!obj) return
            obj = obj[segments[i]]
        }
        // 将对象可观测化（只对对象类型进行观测）
        if (typeof obj === 'object' && obj !== null) {
            new Observer(obj)
        }
        return obj 
    }
}