function InputGrid(options){
   this.construct = function(options) {
      this.change = options.change || function(){}
      this.x = options.x
      this.y = options.y
      this.grid = options.grid || true
      this.x.range = this.x.max - this.x.min
      this.y.range = this.y.max - this.y.min
      this.width = options.width || 100
      this.height = options.height || 100
      this.step = options.step || 1
      this.value = {}
      this.open = false
      this.html = {
         input: options.input,
         wrapper: document.createElement('wrapper'),
         canvas: document.createElement('div'),
         point: document.createElement('point')
      }

      this.html.canvas.tabIndex = 1
      this.html.wrapper.classList.add('gridinput-wrapper')
      this.html.canvas.classList.add('gridinput-canvas')
      this.html.point.classList.add('gridinput-point')
      this.html.wrapper.appendChild(this.html.canvas)
      this.html.canvas.appendChild(this.html.point)
      document.body.appendChild(this.html.wrapper)

      this.setupSize()
      this.drawGrid()
      this.movePointToValue(this.x.value, this.y.value)
      this.setInputValue(this.x.value, this.y.value)

      // Listen
      this.html.input.addEventListener('click', this.inputClick.bind(this))
      this.html.canvas.addEventListener('blur', this.canvasBlur.bind(this))
      this.html.canvas.addEventListener('mousedown', this.down.bind(this))
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
      //this.ctx = this.html.canvas.getContext('2d')
      if(this.grid) {
         var x = this.size.gridXMin
         var xStep = this.size.gridXSize/((this.x.max - this.x.min)/this.x.step)
         while(x <= this.size.gridXMax) {
            var horizontalGrid = document.createElement('div')
            horizontalGrid.classList.add('gridinput-horizontal')
            horizontalGrid.style.left = x + 'px'
            this.html.canvas.appendChild(horizontalGrid)
            x += xStep
         }

         // Duplicate. needs work just trying to pass
         var y = this.size.gridXMin
         var yStep = this.size.gridXSize/((this.y.max - this.y.min)/this.y.step)
         while(y <= this.size.gridXMax) {
            var verticalGrid = document.createElement('div')
            verticalGrid.classList.add('gridinput-vertical')
            verticalGrid.style.top = y + 'px'
            this.html.canvas.appendChild(verticalGrid)
            y += yStep
         }
      }
   }

   this.down = function(e) { this.holding = true }
   this.up = function(e) { this.holding = false }

   this.inputClick = function() {
      this.toggle(!this.open)
   }

   this.canvasBlur = function(e) {
      if(e.relatedTarget == this.html.input) return
      this.toggle(false)
   }

   this.toggle = function(open) {
      this.open = open
      this.html.wrapper.classList.toggle('show', this.open)
      var inputBox = this.html.input.getBoundingClientRect()
      this.html.wrapper.style.top = inputBox.top + inputBox.height + 'px'
      this.html.wrapper.style.left = inputBox.left + 'px'
      if(this.open) this.html.canvas.focus()
      this.setupSize()
      this.movePointToValue(this.x.value, this.y.value)
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

      this.html.point.style.left = posX +'px'
      this.html.point.style.top = posY +'px'
   }

   this.setInputValue = function(valueX, valueY) {
      this.value[this.x.label || 'x'] = valueX
      this.value[this.y.label || 'y'] = valueY
      this.html.input.value = JSON.stringify(this.value)
   }

   this.construct(options)
}
