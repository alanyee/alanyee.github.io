(function() {
    const margin = {top: 20, right: 40, bottom: 30, left: 40},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const formatPercent = d3.format('.0%');

    const x0 = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

    const x1 = d3.scaleBand();

    const y = d3.scaleLinear()
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .range(['#d0743c', 'skyblue']);

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
        .html(d.value)
        .style("opacity", 1)

  }
  const mousemove = function(event) {
    var coords = d3.pointer( event );
    console.log(coords);
    tooltip.style("left",(coords[0])+"px")
           .style("top",(coords[1]) +"px")
  }
  const mouseleave = function(event, d) {
    tooltip
      .style("opacity", 0)
  }

    d3.csv('https://raw.githubusercontent.com/alanyee/alanyee.github.io/refs/heads/master/data/data2.csv')
      .then(data => {
        const ageNames = data.columns.filter(key => key !== 'State');

        data.forEach(d => {
          d.ages = ageNames.map(name => ({ name, value: +d[name] }));
        });

        x0.domain(data.map(d => d.State));
        x1.domain(ageNames).range([0, x0.bandwidth()]);
        y.domain([0, d3.max(data, d => d3.max(d.ages, d => d.value))]);

        chart2.append('g')
          .attr('class', 'x axis')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(x0));

        chart2.append('g')
          .attr('class', 'y axis')
          .call(d3.axisLeft(y).tickFormat(formatPercent))
          .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Sustainability');

        const state = chart2.selectAll('.state')
          .data(data)
          .enter().append('g')
            .attr('class', 'g')
            .attr('transform', d => `translate(${x0(d.State)},0)`);

        state.selectAll('rect')
          .data(d => d.ages)
          .enter().append('rect')
            .attr('class', 'rect')
            .attr('x', d => x1(d.name))
            .attr('y', d => y(d.value))
            .attr('width', x1.bandwidth())
            .attr('height', d => height - y(d.value))
            .attr('fill', d => color(d.name))
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        const legend = chart2.selectAll('.legend')
          .data(ageNames)
          .enter().append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(0,${i * 20})`);

        legend.append('rect')
          .attr('x', width - 18)
          .attr('width', 18)
          .attr('height', 18)
          .attr('fill', color);

        legend.append('text')
          .attr('x', width - 24)
          .attr('y', 9)
          .attr('dy', '.35em')
          .style('fill', 'black')
          .style('text-anchor', 'end')
          .text(d => d);
      })
      .catch(error => console.error('CSV loading error:', error));

  })();