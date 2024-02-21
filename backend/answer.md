```javascript
function foo() {
  var age = 16;
  var age = 26;
  var age = 36;
  console.log(age);
}
foo(); // 36
```

## ECMAScript 与 javascript 的关系

> 完整的`JavaScript`包含`核心(ECMAScript)`,`文档对象模型(Dom)` `浏览器对象模型(Bom)`

` ECMAScript`: 即`ECMA-262 `定义的语言，并不局限于 Web 浏览器。

#### 变量、作用域与内存

1. `var`：
   - 函数内使用`var`定义的变量会称为该函数的局部变量，去除 var 则可以在函数外部访问到
   - 全局作用域声明的变量会在 window 对象的属性，`let`和`const`则不会

```javascript
function test() {
  var message = "hi"; // 局部变量
}
test();
console.log(message); // 出错！
```

```javascript
function test() {
  message = "hi"; // 局部变量
}
test();
console.log(message); // hi
```

- 反复声明同一个变量也没问题

```javascript
function foo() {
  var age = 16;
  var age = 26;
  var age = 36;
  console.log(age);
}
foo(); // 36
```

2. 基本数据类型

   - `Boolean()`方法，`""`空字符串会被当作`false`,带有空格的字符串则会转为`true`

   - `Number`类型

     - 八进制：必须以`0`开头,剩余为八进制数字(0~7),如`07`

     - 十六进制：必须以`0x`开头，剩余为十六进制数字（0-9,A-F）

     - 浮点值：

       - 永远不要测试某个浮点值 比如 `0.1 + 0.2`输出为`0.30000000000000004`
       - js 中浮点值能表示的最大值及最小值保存在`Number.MAX_VALUE , Number.MAX_VALUE`中

     - `Infinity(5/0)`与`-Infinity(5/-0)`表示无穷大无穷小的数值

     - `console.log(0/0); // NaN  console.log(-0/+0); // NaN `

     - `NaN(0/0,-0/+0)`

     - `isNaN()`方法可以判断该值是否不是一个数值

     - `Number()`方法可以将十六进制的数字（0xXXX）转为十进制数字返回

     - `parseInt`与`parseFloat`主要是将字符串转为数值
