// Fetching Data___________________________________

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(response => response.json())
    .then(dataRes => {

    // Variables_______________________________________
    let data = dataRes.map((item) => {
        return [item['Name'], item["Nationality"], item['Year'], item["Time"], item['Doping'], item['Seconds']];
    })

    let graphHeight = 600;
    let graphWidth = 900;
    let hPadding = 40;
    let wPadding = 75;
    const colors = ['hsl(185, 100%, 75%)', 'hsl(0, 100%, 75%)'];

    const tooltip = d3.select('#graph-container')
        .append('div')
        .attr('class', 'tooltip')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')
        .style('position', 'absolute');

        // Axes scales_____________________________
    const xScale = d3.scaleLinear()
        .domain([d3.min(data, (d) => d[2]) - 1, d3.max(data, (d) => d[2]) + 1])
        .range([wPadding, graphWidth + wPadding + (graphWidth / (d3.max(data, e => e[2]) - d3.min(data, e => e[2])))]);
    const yScale = d3.scaleLinear()
        .domain([d3.min(data, (d) => d[5]), d3.max(data, (d) => d[5])])
        .range([0, graphHeight]);
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScale)
        .tickFormat((x) => `${Math.floor(x / 60)}:${(x % 60).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false})}`);

        // Graph portion____________________________
    const svg = d3.select("#graph-container")
        .append('svg')
        .attr('width', graphWidth + 2 * wPadding + 5)
        .attr('height', graphHeight + 2 * hPadding + 5);

    // Adding data points___________________________
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => wPadding + (graphWidth / (d3.max(data, e => e[2]) - d3.min(data, e => e[2]))) + (d[2] - d3.min(data, e => e[2])) * (graphWidth / (d3.max(data, e => e[2]) - d3.min(data, e => e[2]))))
        .attr('cy', d => 5 + graphHeight * ((d[5] - d3.min(data, e => e[5])) / (d3.max(data, e => e[5]) - d3.min(data, e => e[5]))))
        .attr('r', '5px')
        .attr('fill', d => {if(d[4] === ""){return colors[0]} else{return colors[1]}})
        .attr('class', 'dot')
        // adding/removing tooltip
        .on('mouseover', (item, d) => {
            
            tooltip.html(
                `<p class='tooltip-text'>(${d[2]})</p>
                <p class='tooltip-text'>${d[0]}, ${d[1]}:</p>
                <p class='tooltip-text'>Time: ${d[3]}</p>
                ${d[4] == '' ? '' : `<p class='tooltip-text'>${d[4]}</p>`}`
            )
            return tooltip.style('visibility', 'visible');
        })
        .on('mousemove', (item, d) => {
            return tooltip.style("top", (item.layerY-15)+"px").style("left",(item.layerX+15)+"px");
        })
        .on('mouseout', (item, d) => {
            return tooltip.style('visibility', 'hidden');
        })

    // Adding Axes_________________________________
    svg.append("g")
       .attr("transform", "translate(0," + (graphHeight + 5) + ")")
       .call(xAxis)
       .attr("id", 'x-axis');

    svg.append("g")
       .attr("transform", "translate(" + (wPadding) + ", 5)")
       .call(yAxis)
       .attr('id', 'y-axis');

    // Adding Legend___________________________________

    let legend = svg.append('g')
        .attr('class', 'legend')
        .attr('id', 'legend')
        .attr('transform', `translate(${graphWidth}, ${graphHeight / 2})`);

    legend.selectAll('rect')
            .data(colors)
            .enter()
            .append('rect')
            .attr('height', '1rem')
            .attr('width', '1rem')
            .attr('fill', d => d)
            .attr('y', (d, i) => {return i * 20})

    legend.selectAll('text')
            .data(colors)
            .enter()
            .append('text')
            .attr('class', 'legend-text')
            .text(d => d === 'hsl(185, 100%, 75%)' ? 'No doping allegations' : 'Riders with doping allegations')
            .attr('x', '-.5rem')
            .attr('y', (d, i) => {return i * 20 + 8})
            .attr('dy', '.35em')
            .style('text-anchor', 'end')


    })

    
        
        


