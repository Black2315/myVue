/**
 * 依赖管理器，用于存放object关联的视图
 */
import { remove } from "../utils/index.js"
import { getTarget, getTargetNum } from "../utils/windowTarget.js"

export default class Dep {
    constructor () {
        // 依赖存储数组
        this.subs = []
    }

    // 增加一个依赖
    addSub (sub) {
        this.subs.push(sub)
    }

    // 删除一个依赖
    removeSub (sub) {
        remove(this.subs, sub)
    }

    // 从window.target中收集一个依赖—————无参数
    depend () {
        getTarget().forEach(element => {
            this.addSub(element)
        });
    }

    // 执行所有依赖的update()方法————无参数
    notify () {
        // slice()方法是数组深拷贝用的
        const subs = this.subs.slice()
        for (let i = 0; i < subs.length; i++) {
            // 每一个subs都是一个Watcher
            subs[i].update()
        }
    }
}
