(function() {
    const margin = {top: 20, right: 40, bottom: 30, left: 40},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const formatPercent = d3.format('.2f');

    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .range(['#afa593']);

    const chart2 = d3.select('#area1').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
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
        .html(`${formatPercent(d.Present * 100)}%`)
        .style("opacity", 1)

  }
  const mousemove = function(event) {
    var coords = d3.pointer( event );
    tooltip.style("left",(coords[0])+"px")
           .style("top",(coords[1] + 160) +"px")
  }
  const mouseleave = function(event, d) {
    tooltip
      .style("opacity", 0)
  }

    d3.csv('https://raw.githubusercontent.com/alanyee/alanyee.github.io/refs/heads/master/data/data1.csv')
      .then(data => {

        const x = d3.scaleBand()
          .domain(data.map(d => d.State))
          .range([0, width])
          .padding(0.1);

        const y = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.Present)])
          .range([height, 0]);

        chart2.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x));

        chart2.append("g")
          .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".0%")))
          .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Sustainability');

        chart2.selectAll(".bar")
          .data(data)
          .enter()
          .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.State))
            .attr("width", x.bandwidth())
            .attr('y', height)
            .attr('height', 0)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .transition()
            .duration(1000)
            .attr("y", d => y(d.Present))
            .attr("height", d => height - y(d.Present));

      })
      .catch(error => console.error('CSV loading error:', error));
  
      function triggerTransition() {
        d3.selectAll(".bar")
          .transition()
          .duration(1000)
          .attr("y", height)
          .attr("height", 0);
        setTimeout(function(){
            window.location.href = "project1.html";
        }, 1000);
        
      }

    // Attach function to button
    d3.select("#next1Button").on("click", triggerTransition)
  })();