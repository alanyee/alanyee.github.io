(function() {
    const width = 960,
          height = 500,
          radius = Math.min(width, height) / 2;

    const formatPercent = d3.format('.2f');      

    const color = d3.scaleOrdinal()
      .range(['#d0743c', '#b0743c', '#a0743c']);

    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const pie = d3.pie()
      .sort(null)
      .value(d => d.percentage);

    const chart3 = d3.select('#area3')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

  const tooltip = d3.select("#area3")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

    const annotation = d3.select("#area3")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("width", "220px")
      .style("left",(10)+"px")
      .style("top",(520) +"px")
      .html("In most common endgame, having more pieces is a sizable advantage, but the difference usually comes down to 1 or 2 pawns. You are likely not to win if you are in a point disadvantage.")
      .transition()
      .duration(1000)
      .style("opacity", 1);

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function(event, d) {
    tooltip
        .html(`${formatPercent(d.data.percent * 100)}%`)
        .style("opacity", 1)

  }
  const mousemove = function(event) {
    var coords = d3.pointer( event );
    tooltip.style("left",(coords[0] + 400)+"px")
           .style("top",(coords[1] + 390) +"px")
  }
  const mouseleave = function(event, d) {
    tooltip
      .style("opacity", 0)
  }

    d3.csv('https://raw.githubusercontent.com/alanyee/alanyee.github.io/refs/heads/master/data/data3.csv')
      .then(data => {
        data.forEach(d => d.percentage = +d.percentage);

        const arcs = chart3.selectAll('.arc')
          .data(pie(data))
          .enter().append('g')
            .attr('class', 'arc')
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);


        arcs.append('path')
          .attr('class', 'patharc')
          .attr('d', arc)
          .attr('stroke', '#fff')
          .attr('fill', d => color(d.data.adv));

        arcs.append('text')
          .attr('transform', d => `translate(${arc.centroid(d)})`)
          .attr('dy', '.35em')
          .style('text-anchor', 'middle')
          .text(d => d.data.adv);
      })
      .catch(error => console.error('CSV loading error:', error));
      function prevTransition() {
        window.location.href = "project1.html";
      }

    // Attach function to button
    d3.select("#prev2Button").on("click", prevTransition)
})();
