try {
      const margin = {top: 50, right: 150, bottom: 50, left: 50},
            width = 800 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

const svg = d3.select("#my_dataviz1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

      d3.csv("https://raw.githubusercontent.com/alanyee/alanyee.github.io/refs/heads/master/data/death.csv").then(rawData => {
        try {
          const data = rawData.map(d => ({
            Year: +d.Year,
            Rate: +parseInt(d.Deaths),
            State: d.State,
            Cause: d["Cause Name"]
          })).filter(d => d.State === "United States");

          const causes = Array.from(new Set(data.map(d => d.Cause)));

          const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.Year))
            .range([0, width]);

          const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Rate)])
            .range([height, 0]);

          const color = d3.scaleOrdinal(d3.schemeCategory10).domain(causes);

          svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

          svg.append("g").call(d3.axisLeft(y));

          const line = d3.line()
            .x(d => x(d.Year))
            .y(d => y(d.Rate));

          const nested = d3.group(data, d => d.Cause);

          for (const [cause, values] of nested.entries()) {
            svg.append("path")
              .datum(values)
              .attr("fill", "none")
              .attr("stroke", color(cause))
              .attr("stroke-width", 2)
              .attr("d", line);

            svg.append("text")
              .datum(values[values.length - 1])
              .attr("x", d => x(d.Year) + 5)
              .attr("y", d => y(d.Rate))
              .text(cause)
              .style("fill", color(cause))
              .style("font-size", "10px");
          }
        } catch (innerError) {
          console.error("Error during data processing or rendering:", innerError);
        }
      }).catch(loadError => {
        console.error("Error loading CSV file:", loadError);
      });
    } catch (setupError) {
      console.error("Setup error:", setupError);
    }


