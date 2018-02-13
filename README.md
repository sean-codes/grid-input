# 2D-Range-Input
2 dimension range input 

![demo imagge](https://github.com/sean-codes/2D-Range-Input/blob/master/demo.gif?raw=true)

## Include
```html
  <link href="2dRangeInput/css.css" rel="stylesheet"></link>
  <script src="2dRangeInput/js.js"></script>
```

## Turn a text input into a 2D range
```js
  new InputGrid({
     input: document.querySelector('input'),
     x: { label: 'x', min: -100, max: 100, step: 40, value: -100, grid:true },
     y: { label: 'y', min: -100, max: 100, step: 40, value: 20, grid:true },
     change: function() {
        console.log(this.value)
     }
  })
```
