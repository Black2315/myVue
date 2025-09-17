// 导入Observer类
import { Observer } from '../Observer.js'

// 使用Observer
let data = {
    name: '张三',
    age: 25,
    address: {
        city: '北京',
        street: '长安街'
    }
}

// 创建Observer实例，将data转换为响应式
new Observer(data)

console.log("=== 测试响应式系统 ===")
console.log("访问name:", data.name)
console.log("访问age:", data.age)
console.log("访问address:", data.address)

console.log("\n=== 修改属性 ===")
data.name = '李四'
data.age = 30
data.address.city = '上海'

console.log("\n=== 再次访问 ===")
console.log("name:", data.name)
console.log("age:", data.age)
console.log("address.city:", data.address.city)
