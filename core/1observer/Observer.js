/**
 * Observer类可以递归的把一个对象的所有属性都变成响应式的
 */
import { def } from "../utils/index.js"
import Dep from "./dep.js"

export class Observer {
    constructor(value) {
        this.value = value
        // 给value增加一个 __ob__属性,值为该value的Oberver实例
        // 相当于给value打上一个标记,表示它已经是响应式的了
        def(value, '__ob__', this)
        // 开始对value进行响应式转换
        // * 数组类型的响应式变换比较特殊
        if (Array.isArray(value)) {
            // 当value为数组时的逻辑
        } else {
            this.walk(value)
        }
    }

    walk(obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
        }
    }
}

/**
 * 把待转换对象obj的键key变成可观测的,val为闭包值,不传就采用自身的
 * @param { Object } obj 待转换的对象
 * @param { String } key 对象的键
 * @param { Any } val 对象的值
 */
function defineReactive(obj, key, val) {
    // 如果只传了obj和key，那就 val = obj[key]
    // ! 这一步必须要走，必须要有val这个变量，不然会出现无限递归的
    if (arguments.length == 2) {
        val = obj[key]
    } 
    // 递归调用可转换对象，但不要让__ob__参与进来
    if (typeof val === 'object' && key !== '__ob__') {
        new Observer(val)
    }

    // 实例化一个依赖管理器，生成一个依赖管理数组
    const dep = new Dep()

    // 核心语法
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get(){
            console.log(`${key}属性被读取了`);

            // 在getter中收集依赖
            // * 实际上就是把window.target放入dep的subs数组
            dep.depend()
            return val;
        },
        set(newVal){
            if(val === newVal){
                return
            }
            console.log(`${key}属性被修改了`);
            // 在 setter 中通知依赖更新
            // * 实际上就是遍历dep的subs数组，挨个执行 update函数
            dep.notify()
            val = newVal;
        }
    })
}


