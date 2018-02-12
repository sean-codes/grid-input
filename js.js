function InputGrid(options){
   this.construct = function(options) {
      this.change = options.change || function(){}
      this.x = options.x
      this.y = options.y
      this.width = options.width || 100
      this.height = options.height || 100
      this.step = options.step || 1

      this.value = {}
      this.open = false
      this.html = {
         input: options.input,
         canvas: document.createElement('canvas'),
         point: document.createElement('point')
      }

      this.html.canvas.tabIndex = 1
      this.html.canvas.classList.add('gridinput-canvas')
      this.html.canvas.width = this.width
      this.html.canvas.height = this.height
      this.html.point.classList.add('gridinput-point')
      document.body.appendChild(this.html.canvas)
      document.body.appendChild(this.html.point)

      this.setupSize()
      if(options.gridLines) this.drawGrid()


      // Listen
      this.html.input.addEventListener('click', this.toggle.bind(this))
      this.html.canvas.addEventListener('mousedown', this.down.bind(this))
      this.html.canvas.addEventListener('blur', this.toggle.bind(this))
      document.addEventListener('mousemove', this.move.bind(this))
      document.addEventListener('mouseup', this.up.bind(this))
   }

   this.setupSize = function() {
      this.size = {}
      this.size.pointBox = this.html.point.getBoundingClientRect()
      this.size.gridBox = this.html.canvas.getBoundingClientRect()

      // Ahh?
      this.size.gridXMin = this.size.pointBox.width/2
      this.size.gridXMax = this.size.gridXMin + this.size.gridBox.width - this.size.pointBox.width
      this.size.gridXSize = this.size.gridXMax - this.size.gridXMin
      this.size.gridXRatio = this.size.gridXSize / this.size.gridBox.width
      this.size.gridYMin = this.size.pointBox.height/2
      this.size.gridYMax = this.size.gridYMin + this.size.gridBox.height - this.size.pointBox.height
      this.size.gridYSize = this.size.gridYMax - this.size.gridYMin
      this.size.gridYRatio = this.size.gridYSize / this.size.gridBox.height
   }

   this.drawGrid = function() {
      this.ctx = this.html.canvas.getContext('2d')
      var xStep = this.size.gridXSize/((this.x.max - this.x.min)/this.x.step)
      var x = this.size.gridXMin
      while(x <= this.size.gridXMax) {
         this.ctx.moveTo(x, 0)
         this.ctx.lineTo(x, this.height)
         this.ctx.stroke()
         x += xStep
      }
      console.log(xStep)
//       var count = this.size.grid
//       var lineCount = this.size.grid
//       while(x <= this.size.gridXSize + this.size.gridXMin) {
//
//          x += this.x.step*this.size.gridXRatio
//       }

//       var i = this.height; while(i-=this.y.step) {
//          this.ctx.moveTo(0, i)
//          this.ctx.lineTo(this.width, i)
//          this.ctx.stroke()
//       }
   }

   this.toggle = function() {
      this.open = this.open ? false : true
      this.html.canvas.classList.toggle('show', this.open)
      this.html.point.classList.toggle('show', this.open)
      var inputBox = this.html.input.getBoundingClientRect()
      this.html.canvas.style.top = inputBox.top + inputBox.height + 'px'
      this.html.canvas.style.left = inputBox.left + 10 + 'px'
      if(this.open) this.html.canvas.focus()
   }

   this.down = function(e) {
      this.holding = true
   }

   this.move = function(e) {
      if(!this.holding) return
      this.setupSize()
      var mouseX = e.clientX - this.size.gridBox.left
      var mouseY = e.clientY - this.size.gridBox.top

      if(mouseX < this.size.gridXMin || mouseX > this.size.gridXMax) {
         mouseX = (mouseX < this.size.gridXMin) ? this.size.gridXMin : this.size.gridXMax
      }

      if(mouseY < this.size.gridYMin || mouseY > this.size.gridYMax) {
         mouseY = (mouseY < this.size.gridYMin) ? this.size.gridYMin : this.size.gridYMax
      }

      // Stepping
      if(this.x.step && mouseX > this.size.gridXMin){
         var xStep = this.x.step * this.size.gridXRatio
         var xGrid = mouseX - this.size.gridXMin
         mouseX -= (xGrid % xStep)
      }
      if(this.y.step && mouseY > this.size.gridYMin){
         var yStep = this.y.step * this.size.gridYRatio
         var yGrid = mouseY - this.size.gridYMin
         mouseY -= (yGrid % yStep)
      }

      this.html.point.style.left = this.size.gridBox.left + mouseX+'px'
      this.html.point.style.top = this.size.gridBox.top + mouseY+'px'


      var percentX = (mouseX - this.size.gridXMin) / this.size.gridXSize
      var percentY = (mouseY - this.size.gridYMin) / this.size.gridYSize
      this.value[this.x.label || 'x'] = Math.round(percentX * (this.x.max-this.x.min+this.x.min))
      this.value[this.y.label || 'y'] = Math.round(percentY * (this.y.max-this.y.min+this.y.min))
      this.html.input.value = JSON.stringify(this.value)
      this.change()
   }

   this.up = function(e) {
      console.log('up')
      this.holding = false
   }

   this.movePoint = function(valueX, valueY) {

   }

   this.construct(options)
}
