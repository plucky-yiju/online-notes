# JavaScript 基础

JavaScript是一种轻量级的编程语言，广泛用于Web开发。

## 变量声明

```javascript
// ES6+ 推荐使用 let 和 const
let name = '张三';
const PI = 3.14159;

// 避免使用 var
var oldStyle = '不推荐';
```

## 数据类型

JavaScript有以下基本数据类型：

- **String** - 字符串
- **Number** - 数字
- **Boolean** - 布尔值
- **null** - 空值
- **undefined** - 未定义
- **Symbol** - 符号（ES6+）
- **BigInt** - 大整数（ES2020+）

## 函数

```javascript
// 函数声明
function greet(name) {
    return `Hello, ${name}!`;
}

// 箭头函数
const add = (a, b) => a + b;
```

## 数组方法

```javascript
const numbers = [1, 2, 3, 4, 5];

// map - 映射
const doubled = numbers.map(n => n * 2);

// filter - 过滤
const evens = numbers.filter(n => n % 2 === 0);

// reduce - 归约
const sum = numbers.reduce((acc, n) => acc + n, 0);
