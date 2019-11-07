// <!-- Load color palettes -->

import * as d3 from 'd3'

// set the dimensions and margins of the graph
const margin = { top: 150, right: 75, bottom: 25, left: 170 }
const width = 900 - margin.left - margin.right
const height = 900 - margin.top - margin.bottom

// append the svg object to the body of the page
const svg = d3
  .select('#matrix-graph')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

d3.csv(require('/data/nodes5.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

// Read the data
function ready(data) {
  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  const myGroups = d3
    .map(data, function(d) {
      return d.group
    })
    .keys()
  const myVars = d3
    .map(data, function(d) {
      return d.variable
    })
    .keys()

  console.log(data)

  // Build X scales and axis:
  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(myGroups)
    .padding(0.05)
  svg
    .append('g')
    .call(d3.axisTop(x).tickSize(0))
    .selectAll('text')
    .style('text-anchor', 'start')
    .attr('transform', 'rotate(-45)')
    .style('font-size', 8)
    .attr('dy', -3)
    .attr('id', function(d) {
      return d.toLowerCase().replace(/[^a-z]*/g, '')
    })
    .attr('class', 'x_label')
    .select('.domain')
    .remove()

  // Build Y scales and axis:
  const y = d3
    .scaleBand()
    .range([height, 0])
    .domain(myVars)
    .padding(0.05)
  svg
    .append('g')
    .call(d3.axisLeft(y).tickSize(0))
    .selectAll('text')
    .style('font-size', 8)
    .attr('class', function(d) {
      return d.toLowerCase().replace(/[^a-z]*/g, '') + ' ' + 'y_label'
    })
    .attr('dx', -3)
    .select('.domain')
    .remove()

  // Build color scale
  const myColor = d3.scaleSequential(d3.interpolateBuPu).domain([1, 0])

  // add the squares
  svg
    .selectAll()
    .data(data, function(d) {
      return d.group + ':' + d.variable
    })
    .enter()
    .append('rect')
    .attr('x', function(d) {
      return x(d.group)
    })
    .attr('y', function(d) {
      return y(d.variable)
    })
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .style('fill', function(d) {
      return myColor(d.value)
    })
    .style('stroke-width', 4)
    .style('stroke', 'none')
    .attr('class', function(d, i) {
      return d.variable.toLowerCase().replace(/[^a-z]*/g, '')
    })
    .attr('id', function(d, i) {
      return d.group.toLowerCase().replace(/[^a-z]*/g, '')
    })
    .on('mouseover', function(d) {
      d3.selectAll('text' + '.' + this.getAttribute('class')).style(
        'font-size',
        18
      )
      d3.selectAll('text' + '#' + this.getAttribute('id')).style(
        'font-size',
        18
      )
      const selectedClass = this.getAttribute('class')
      const selectedId = this.getAttribute('id')
      d3.selectAll('.x_label').style('opacity', function(e) {
        console.log('e:', e)
        e = e.toLowerCase().replace(/[^a-z]*/g, '')
        return e === selectedId ? 1 : 0.2
      })
      d3.selectAll('.y_label').style('opacity', function(e) {
        e = e.toLowerCase().replace(/[^a-z]*/g, '')
        return e === selectedClass ? 1 : 0.2
      })
      d3.select(this)
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('z-index', '9999')
    })

    .on('mouseout', function(d) {
      d3.selectAll('text' + '.' + this.getAttribute('class')).style(
        'font-size',
        8
      )
      d3.selectAll('text' + '#' + this.getAttribute('id')).style('font-size', 8)
      d3.select(this).style('stroke', 'none')
      d3.selectAll('text').attr('opacity', 1)
    })
    .on('mouseleave', function() {
      d3.selectAll('text').attr('opacity', 1)
    })

  svg
    .append('rect')
    .attr('x', 416.06264869151465)
    .attr('y', 58.06899286280727)
    .attr('width', 187)
    .attr('height', 206)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .higher()
}
