// 依赖收集栈
const targetStack = []
// 打印栈
export function printTarget() {
    console.log(targetStack)
}
// 获取栈的元素数
export function getTargetNum() {
    return targetStack.length
}
// 获取栈
export function getTarget() {
    return [...targetStack]
}
// 推入当前target
export function pushTarget(target) {
    if (typeof target === 'object')
        targetStack.push(target)
    else 
        console.log("不是对象,不能入栈")
}

// 弹出当前target
export function popTarget() {
   return targetStack.pop()
}

