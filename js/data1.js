(function() {
    const margin = {top: 18, right: 10, bottom: 10, left: 60},
          width = 960 - margin.left - margin.right,
          height = 700 - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .range([0, 625]);

    const y = d3.scaleBand()
      .range([0, height])
      .padding(0.05);

    const chart1 = d3.select('#area1')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom + 10)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  const tooltip = d3.select("#area1")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function(event, d) {
    tooltip
        .html(d.value)
        .style("opacity", 1)

  }
  const mousemove = function(event) {
    var coords = d3.pointer( event );
    tooltip.style("left",(coords[0] + margin.left)+"px")
           .style("top",(coords[1] + 200) +"px")
  }
  const mouseleave = function(event, d) {
    tooltip
      .style("opacity", 0)
  }


    d3.tsv('https://raw.githubusercontent.com/alanyee/chessendgames/refs/heads/master/data1.tsv')
      .then(data => {
        data.forEach(d => d.value = +d.value);

        x.domain(d3.extent(data, d => d.value)).nice();
        y.domain(data.map(d => d.name));

        chart1.selectAll('.bar')
          .data(data)
          .enter().append('rect')
            .attr('class', d => d.value < 0 ? 'bar negative' : 'bar positive')
            .attr('y', d => y(d.name))
            .attr('width', d => Math.abs(x(d.value) - x(0) + x(margin.left)))
            .attr('height', y.bandwidth())
            .attr('transform', `translate(${margin.left},0)`)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        chart1.append('g')
          .attr('class', 'x axis')
          .attr('transform', `translate(${margin.left},${height})`)
          .call(d3.axisBottom(x).ticks(5))
          .append('text')
            .attr('x', 500)
            .attr('y', -10)
            .style('text-anchor', 'end')
            .text('Number of Games');

        chart1.append('g')
          .attr('class', 'y axis')
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(y));
      })
      .catch(error => console.error('Error loading or rendering data:', error));
})();