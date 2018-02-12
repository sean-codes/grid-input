function InputGrid(options){
   this.construct = function(options) {
      this.change = options.change || function(){}
      this.x = options.x
      this.y = options.y
      this.x.range = this.x.max - this.x.min
      this.y.range = this.y.max - this.y.min
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

      this.toggle(false)
      this.setupSize()
      this.drawGrid()
      this.movePointToValue(this.x.value, this.y.value)
      this.setInputValue(this.x.value, this.y.value)

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
      if(this.x.grid) {
         var xStep = this.size.gridXSize/((this.x.max - this.x.min)/this.x.step)
         var x = this.size.gridXMin
         while(x <= this.size.gridXMax) {
            this.ctx.moveTo(Math.floor(x)+0.5, 0)
            this.ctx.lineTo(Math.floor(x)+0.5, this.height)
            this.ctx.stroke()
            x += xStep
         }
      }
      if(this.y.grid) {
         // Duplicate. needs work just trying to pass
         var yStep = this.size.gridXSize/((this.y.max - this.y.min)/this.y.step)
         var y = this.size.gridXMin
         while(y <= this.size.gridXMax) {
            this.ctx.moveTo(0, Math.floor(y)+0.5)
            this.ctx.lineTo(this.height, Math.floor(y)+0.5)
            this.ctx.stroke()
            y += yStep
         }
      }
   }

   this.down = function(e) { this.holding = true }
   this.up = function(e) { this.holding = false }

   this.toggle = function() {
      this.open = this.open ? false : true
      this.html.canvas.classList.toggle('show', this.open)
      this.html.point.classList.toggle('show', this.open)
      var inputBox = this.html.input.getBoundingClientRect()
      this.html.canvas.style.top = inputBox.top + inputBox.height + 'px'
      this.html.canvas.style.left = inputBox.left + 'px'
      if(this.open) this.html.canvas.focus()
   }

   this.move = function(e) {
      if(!this.holding) return
      // Get coordinates
      var mouseX = e.clientX - this.size.gridBox.left
      var mouseY = e.clientY - this.size.gridBox.top
      // Get value
      var [valueX,valueY] = this.posToValue(mouseX, mouseY)
      // Move point
      this.movePointToValue(valueX, valueY)
      // Update Input
      this.setInputValue(valueX, valueY)
      // Trigger Change
      this.change()
   }

   this.posToValue = function(x, y) {
      this.setupSize()
      if(x < this.size.gridXMin || x > this.size.gridXMax) {
         x = (x < this.size.gridXMin) ? this.size.gridXMin : this.size.gridXMax
      }

      if(y < this.size.gridYMin || y > this.size.gridYMax) {
         y = (y < this.size.gridYMin) ? this.size.gridYMin : this.size.gridYMax
      }

      var percentX = (x - this.size.gridXMin) / this.size.gridXSize
      var percentY = (y - this.size.gridYMin) / this.size.gridYSize


      // Steping: hugely over bloated can combine above if step is always included ( it is )
      var stepZonesX = this.x.range / this.x.step
      var stepZoneX = Math.min(Math.floor((stepZonesX+1) * percentX), stepZonesX)
      percentX = stepZoneX / stepZonesX

      var stepZonesY = this.y.range / this.y.step
      var stepZoneY = Math.min(Math.floor((stepZonesY+1) * percentY), stepZonesY)
      percentY = stepZoneY / stepZonesY

      // set value first
      return [
         percentX * this.x.range + this.x.min,
         percentY * this.y.range + this.y.min
      ]
   }

   this.movePointToValue = function(valueX, valueY) {
      var percentX = (valueX - this.x.min) / this.x.range
      var percentY = (valueY - this.y.min) / this.y.range
      var posX = this.size.gridXMin + (this.size.gridXSize*percentX)
      var posY = this.size.gridYMin + (this.size.gridYSize*percentY)

      this.html.point.style.left = this.size.gridBox.left + posX +'px'
      this.html.point.style.top = this.size.gridBox.top + posY +'px'
   }

   this.setInputValue = function(valueX, valueY) {
      this.value[this.x.label || 'x'] = valueX
      this.value[this.y.label || 'y'] = valueY
      this.html.input.value = JSON.stringify(this.value)
   }

   this.construct(options)
}
