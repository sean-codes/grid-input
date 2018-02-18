function GridInput(options){
   this.construct = function(options) {
		var options = options || {}
		this.input = options.input || document.querySelector('[type=grid]')
		if(!this.input.hasAttribute) throw "No input provided as option { input: inputElement} or found [type=grid]"
      this.grid = this.input.hasAttribute('grid') ? this.input.getAttribute('grid') : 'true'
      this.min = Number(this.input.getAttribute('min') || 0)
      this.max = Number(this.input.getAttribute('max') || 100)
      this.step = Number(this.input.getAttribute('step') || 10)
		this.valueX = Number(this.input.getAttribute('valueX') || 0)
		this.valueY = Number(this.input.getAttribute('valueY') || 0)
      this.labelX = this.input.getAttribute('labelX') || 'x'
      this.labelY = this.input.getAttribute('labelY') || 'y'
      this.range = this.max - this.min
      this.open = false

      this.setupHTML(this.input)
      this.movePointToValue(this.valueX, this.valueY)
      this.setInputValue(this.valueX, this.valueY)
   }


   this.setupHTML = function(input) {
      this.html = {
         input: input,
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

      // Listen
      this.html.input.addEventListener('click', this.inputClick.bind(this))
      this.html.canvas.addEventListener('blur', this.canvasBlur.bind(this))
      this.html.canvas.addEventListener('mousedown', this.down.bind(this))
      this.html.canvas.addEventListener('keyup', this.keyup.bind(this))
      document.addEventListener('mousemove', this.move.bind(this))
      document.addEventListener('mouseup', this.up.bind(this))
   }

   this.setupSize = function() {
      this.size = {}
      this.size.pointBox = this.html.point.getBoundingClientRect()
      this.size.gridBox = this.html.canvas.getBoundingClientRect()

      this.size.gridMin = this.size.pointBox.width/2
      this.size.gridMax = this.size.gridMin + this.size.gridBox.width - this.size.pointBox.width
      this.size.gridSize = this.size.gridMax - this.size.gridMin
      this.size.gridRatio = this.size.gridSize / this.size.gridBox.width
   }

   this.drawGrid = function() {
      if(this.grid == 'true') {
         var coords = [
            { 'class': 'gridinput-horizontal', 'prop': 'left' },
            { 'class': 'gridinput-vertical', 'prop': 'top' }
         ]
         for(var coord of coords){
            var pos = this.size.gridMin
            var step = this.size.gridSize/((this.max - this.min)/this.step)
            while(pos <= this.size.gridMax) {
               var horizontalGrid = document.createElement('div')
               horizontalGrid.classList.add(coord.class)
               horizontalGrid.style[coord.prop] = pos + 'px'
               this.html.canvas.appendChild(horizontalGrid)
               pos += step
            }
         }
      }
   }

   this.keyup = function(e) {
      this.value.x += this.step * { '37': -1, '39': 1 }[e.keyCode] || 0
      this.value.y += this.step * { '38': -1, '40': 1 }[e.keyCode] || 0
      this.value.x = Math.max(Math.min(this.value.x, this.max), this.min)
      this.value.y = Math.max(Math.min(this.value.y, this.max), this.min)
      this.movePointToValue(this.value.x, this.value.y)
      this.setInputValue(this.value.x, this.value.y)
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
      this.movePointToValue(this.value.x, this.value.y)
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
   }

   this.posToValue = function(x, y) {
      if(x < this.size.gridMin || x > this.size.gridMax) {
         x = (x < this.size.gridMin) ? this.size.gridMin : this.size.gridMax
      }

      if(y < this.size.gridMin || y > this.size.gridMax) {
         y = (y < this.size.gridMin) ? this.size.gridMin : this.size.gridMax
      }

      var percentX = (x - this.size.gridMin) / this.size.gridSize
      var percentY = (y - this.size.gridMin) / this.size.gridSize


      // Steping: hugely over bloated can combine above if step is always included ( it is )
      var stepZones = this.range / this.step
      var stepZoneX = Math.min(Math.floor((stepZones+1) * percentX), stepZones)
      var stepZoneY = Math.min(Math.floor((stepZones+1) * percentY), stepZones)
      percentX = stepZoneX / stepZones
      percentY = stepZoneY / stepZones

      // set value first
      return [
         percentX * this.range + this.min,
         percentY * this.range + this.min
      ]
   }

   this.movePointToValue = function(valueX, valueY) {
      var percentX = (valueX - this.min) / this.range
      var percentY = (valueY - this.min) / this.range
      var posX = this.size.gridMin + (this.size.gridSize*percentX)
      var posY = this.size.gridMin + (this.size.gridSize*percentY)

      this.html.point.style.left = posX +'px'
      this.html.point.style.top = posY +'px'
   }

   this.setInputValue = function(valueX, valueY) {
      this.value = {}
      this.value[this.labelX || 'x'] = Number(valueX)
      this.value[this.labelY || 'y'] = Number(valueY)
      this.html.input.value = JSON.stringify(this.value)
   }

   this.construct(options)
}

// ES6 Exporta
if(typeof module != 'undefined'){ module.exports = GridInput }
