# CSS Flexbox 布局

Flexbox是CSS3中强大的布局模式，用于创建灵活的响应式布局。

## 基本概念

Flexbox布局由两部分组成：
- **Flex容器** (flex container) - 父元素
- **Flex项目** (flex items) - 子元素

## 容器属性

```css
.container {
    display: flex;
    
    /* 主轴方向 */
    flex-direction: row | row-reverse | column | column-reverse;
    
    /* 换行 */
    flex-wrap: nowrap | wrap | wrap-reverse;
    
    /* 主轴对齐 */
    justify-content: flex-start | flex-end | center | space-between | space-around;
    
    /* 交叉轴对齐 */
    align-items: stretch | flex-start | flex-end | center | baseline;
}
```

## 项目属性

```css
.item {
    /* 排序 */
    order: 0;
    
    /* 放大比例 */
    flex-grow: 0;
    
    /* 缩小比例 */
    flex-shrink: 1;
    
    /* 基础大小 */
    flex-basis: auto;
    
    /* 简写 */
    flex: 0 1 auto;
}
```

## 常见布局示例

### 水平垂直居中

```css
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

### 等分布局

```css
.equal {
    display: flex;
}
.equal > * {
    flex: 1;
}
