const tape = require('tape')
const GridInput = require('./GridInput.js')

// Add HTML
document.body.innerHTML += '<input type="grid"/>'
document.body.innerHTML += '<input type="grid" id="options" min="-100" max="100" step="20" labelX="red" labelY="blue" valueX="20" valueY="20"/>'
var inputDefault = document.querySelector('input')
var inputOptions = document.querySelector('input#options')

// Test some manuevers!
tape('default options set', (test) => {
	var grid = new GridInput()

	test.equal(grid.input, inputDefault, 'Finds an input with type="grid"')
	test.equal(grid.grid, true, 'Grid is true')
	test.equal(grid.min, 0, 'Min is 0')
	test.equal(grid.max, 100, 'Max is 100')
	test.equal(grid.step, 10, 'Step is 10')
	test.equal(grid.labelX, 'x', 'labelX is "x"')
	test.equal(grid.labelY, 'y', 'labelX is "y"')
	test.equal(grid.valueX, 0, 'valueX is 0')
	test.equal(grid.valueY, 0, 'valueX is 0')
	test.equal(grid.range, 100, 'range is 100')
	test.end()
})

tape('changing options', (test) => {
	var grid = new GridInput({ input: inputOptions })

	test.equal(grid.input, inputOptions, 'Finds an input with type="grid"')
	test.equal(grid.grid, true, 'Grid is true')
	test.equal(grid.min, -100, 'Min is 0')
	test.equal(grid.max, 100, 'Max is 100')
	test.equal(grid.step, 20, 'Step is 10')
	test.equal(grid.labelX, 'red', 'labelX is "red"')
	test.equal(grid.labelY, 'blue', 'labelX is "blue"')
	test.equal(grid.valueX, 20, 'valueX is 20')
	test.equal(grid.valueY, 20, 'valueX is 20')
	test.equal(grid.range, 200, 'range is 200')
	test.end()
})

tape('changing options', (test) => {
	try {
		var grid = new GridInput({ input: 'break' })
	} catch(e) {
		console.log(e)
		test.pass('throws when input does not exist')
		test.end();
	}
})
