// 完整的使用示例：Vue响应式系统
import { Observer } from '../Observer.js'
import Watcher from '../watcher.js'

console.log("=== Vue响应式系统使用示例 ===\n")

// 1. 基础响应式数据
console.log("1. 基础响应式数据:")
let user = {
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com'
}

// 将对象转换为响应式
new Observer(user)

console.log("访问数据:")
console.log("姓名:", user.name)
console.log("年龄:", user.age)

console.log("\n修改数据:")
user.name = '李四'
user.age = 30

// 2. 嵌套对象响应式
console.log("\n2. 嵌套对象响应式:")
let company = {
    name: '科技公司',
    address: {
        city: '北京',
        district: '朝阳区',
        street: '中关村大街'
    },
    employees: {
        count: 100,
        departments: {
            tech: 50,
            sales: 30,
            hr: 20
        }
    }
}

new Observer(company)

console.log("访问嵌套数据:")
console.log("公司:", company.name)
console.log("城市:", company.address.city)
console.log("技术部门人数:", company.employees.departments.tech)

console.log("\n修改嵌套数据:")
company.address.city = '上海'
company.employees.departments.tech = 60

// 3. 使用Watcher监听数据变化
console.log("\n3. 使用Watcher监听数据变化:")

let product = {
    name: 'iPhone',
    price: 5000,
    stock: 100,
    category: {
        type: '手机',
        brand: 'Apple'
    }
}

new Observer(product)

// 创建Watcher监听价格变化
let priceWatcher = new Watcher(
    product,           // 监听的对象
    'price',          // 监听的属性路径
    function(newVal, oldVal) {
        console.log(`💰 价格变化: ¥${oldVal} -> ¥${newVal}`)
    }
)

// 创建Watcher监听库存变化
let stockWatcher = new Watcher(
    product,
    'stock',
    function(newVal, oldVal) {
        console.log(`📦 库存变化: ${oldVal} -> ${newVal}`)
    }
)

// 创建Watcher监听品牌变化
let brandWatcher = new Watcher(
    product,
    'category.brand',
    function(newVal, oldVal) {
        console.log(`🏷️ 品牌变化: ${oldVal} -> ${newVal}`)
    }
)

console.log("\n触发数据变化:")
product.price = 4500
product.stock = 80
product.category.brand = 'Apple Inc.'

// 4. 复杂场景：购物车示例
console.log("\n4. 复杂场景：购物车示例:")

let cart = {
    items: [
        { id: 1, name: '商品A', price: 100, quantity: 2 },
        { id: 2, name: '商品B', price: 200, quantity: 1 }
    ],
    total: 0,
    discount: 0.1
}

new Observer(cart)

// 监听总价变化
let totalWatcher = new Watcher(
    cart,
    'total',
    function(newVal, oldVal) {
        console.log(`🛒 购物车总价变化: ¥${oldVal} -> ¥${newVal}`)
    }
)

// 计算总价
function calculateTotal() {
    cart.total = cart.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity)
    }, 0)
}

// 初始计算
calculateTotal()

console.log("初始总价:", cart.total)

// 修改商品数量
cart.items[0].quantity = 3
calculateTotal()

// 添加新商品
cart.items.push({ id: 3, name: '商品C', price: 150, quantity: 1 })
calculateTotal()

console.log("\n=== 示例结束 ===")
