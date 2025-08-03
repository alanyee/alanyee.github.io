(function() {
    const width = 960,
          height = 500,
          radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal()
      .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b',
              '#a05d56', '#d0743c', '#ff8c00']);

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

    d3.csv('https://raw.githubusercontent.com/alanyee/alanyee.github.io/refs/heads/master/data/data3.csv')
      .then(data => {
        data.forEach(d => d.percentage = +d.percentage);

        const arcs = chart3.selectAll('.arc')
          .data(pie(data))
          .enter().append('g')
            .attr('class', 'arc');

        arcs.append('path')
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

})();
