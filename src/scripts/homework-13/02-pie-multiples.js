import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// At the very least you'll need scales, and
// you'll need to read in the file. And you'll need
// and svg, too, probably.

// Scales

const pie = d3.pie().value(function(d) {
  return d.minutes
})

const radius = 80

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

const colorScale = d3.scaleOrdinal().range(['#b3e2cd', '#cbd5e8', '#fff2ae'])

const xPositionScale = d3.scalePoint().range([0, width])

const tasks = ['Typing code', 'Rewriting code', 'Reading StackOverflow']

const angleScale = d3
  .scaleBand()
  .domain(tasks)
  .range([0, Math.PI * 2])

// Read in the data

d3.csv(require('/data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  const projects = datapoints.map(d => d.project)
  xPositionScale.domain(projects).padding(0.4)

  const nested = d3
    .nest()
    .key(d => d.project)
    .entries(datapoints)

  svg
    .selectAll('.graph')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      return 'translate(' + xPositionScale(d.key) + ',' + height / 2 + ')'
    })
    .each(function(d) {
      const container = d3.select(this)
      const datapoints = d.values

      container
        .selectAll('path')
        .data(pie(datapoints))
        .enter()
        .append('path')
        .attr('d', function(d) {
          return arc(d)
        })
        .style('fill', d => colorScale(d.data.task))

      container
        .append('text')
        .text(d => d.key)
        .attr('x', xPositionScale(d.projects))
        .attr('y', height / 3)
        .attr('font-size', 15)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
      })

      function render() {
        // Grabbing the div that our svg is inside of
        // and asking it wide it is
        // "hey <svg> that is really a <g>, go through
        // your parents until you find a div"
        const svgContainer = svg.node().closest('div')
        const svgWidth = svgContainer.offsetWidth
        console.log(svgWidth)
    
        // .node() means "no really give me the HTML element,
        //    not the weird d3 representation"
        // .parentNode means "give me the svg that's outside
        //    of the g," which we can actually change
        //    the size of with .attr
        // .closest('svg') means "go through your parents until
        //   you find an svg, in case we have a g in a g in a g"
        const actualSvg = d3.select(svg.node().closest('svg'))
        actualSvg.attr('width', svgWidth)
    
        // Remember how we do
        //    var width = 700 - margin.left - margin.right?
        // this is the same thing, since svgWidth is the FULL
        // SIZE of the svg, not the drawing area (the g)
        const newWidth = svgWidth - margin.left - margin.right
    
        // Update our axes
        // First, update the scale
        // Then, update the axis
        xPositionScale.range([0, newWidth])
    
        // What's the right number of ticks?
        if (svgWidth < 400) {
          xAxis.ticks(2)
        } else if (svgWidth < 550) {
          xAxis.ticks(4) // only have 3 ticks
        } else {
          xAxis.ticks(null) // resets it to the default number of ticks
        }
    
        svg.select('.x-axis').call(xAxis)
    
        svg
          .selectAll('.country-circle')
          .attr('cx', d => xPositionScale(d.gdp_per_capita))
    
        console.log('resized to 500')
      }
    
      // When the window resizes, run the function
      // that redraws everything
      d3.select(window).on('resize', render)
    
      // And now that the page has loaded, let's just try
      // to do it once before the page has resized
      render()
}
