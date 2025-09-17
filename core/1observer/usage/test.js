// 示例1：基础响应式实现
let val1 = 3000
let obj = { 
  
}

Object.defineProperty(obj, 'price', {
    enumerable: true,
    configurable: true,
    get() {
        console.log("price属性被读取了")
        return val1
    },
    set(newVal) {
        console.log("price属性被修改了")
        val1 = newVal
    }
})
console.log(obj.price)
obj.price = 2
console.log(obj.price)


// 这是一个闭包保护数据的方法，val是私有变量外部无法访问
// 闭包要额外开一个变量空间,这就意味着把数据变成响应式要额外开一个变量的空间
// getter和setter修改的实际是都是val,并没有直接访问price
// 如果直接在getter/setter中操作 obj.price，会导致无限递归
// ❌ 错误示例 - 会导致无限递归
// Object.defineProperty(obj, 'price', {
//     get() {
//         return obj.price  // 又会触发getter，无限循环
//     },
//     set(newVal) {
//         obj.price = newVal  // 又会触发setter，无限循环
//     }
// })


// ✔ 正确实例 - 把闭包结构放在对象内部
let newObj = {
    price: 0
}
let val = newObj.price
Object.defineProperty(newObj, 'price', {
    enumerable: true,
    configurable: true,
    get() {
        console.log("price属性被读取了")
        return val
    },
    set(newVal) {
        console.log("price属性被修改了")
        val = newVal
    }
})

console.log(newObj.price)
newObj.price = 222
console.log(newObj.price)



// 数据响应化操作
import { Observer } from "./demo/index"   
// 使用
let car = {
    brand: 'BMD',
    price: 3, 
    black: {
        age: 11,
        name: 'huang'
    }
}
console.log(car.brand)
console.log(car.price)
console.log(car.black.age)
console.log(car.black.name)

new Observer(car)  // 这就是数据响应化操作

console.log(car.brand)
console.log(car.price)
console.log(car.black.age)
console.log(car.black.name)

car.brand = 'black'
car.price = 4
car.black.age = 25
car.black.name = "hhhhhhhh"
console.log(car.brand)
console.log(car.price)
console.log(car.black.age)
console.log(car.black.name)
