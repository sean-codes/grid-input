# 2D-Range-Input
2 dimension range input

![demo imagge](https://github.com/sean-codes/2D-Range-Input/blob/master/demo.gif?raw=true)

## Include
```html
  <link href="2dRangeInput/css.css" rel="stylesheet"></link>
  <script src="2dRangeInput/js.js"></script>
```

## Turn a text input into a 2D range
```html
  <input type="grid"/>
```

```js
  var myInput = new InputGrid({
     input: document.querySelector('[type=grid]')
  })
```

## Input Attributes
> Add to the input elements html as attributes.

```
   valueX="0" - the starting x value
   valueY="0" - the starting y value
   min="0" - the min x/y value
   max="100" - the max x/y value
   step="10" - control the granularity
   grid="true" -  draw the lines of the grid
```
