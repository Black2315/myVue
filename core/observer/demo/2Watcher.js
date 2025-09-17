import Watcher from "../watcher.js";

// 模拟一个简单的 vm 对象
const vm = {
    data: {
      a: {
        b: {
          c: 2
        }
      }
    }
  }
  // 创建一个 Watcher，监听 data.a.b.c
  let watcher = new Watcher(
    vm.data,         // 传入要监听的数据对象
    'a.b',         // 路径
    function (newVal, oldVal) {   // 回调
      console.log(`data.a.b.c 发生变化: ${oldVal} -> ${newVal}`)
    }
  )

  console.log(vm.data.a.b.c)
  vm.data.a.b.c = 52
  // 再次修改
  vm.data.a.b.c = 10

  