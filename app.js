const width = 500;
const height = 500;
const padding = 40;

regionData = regionData.filter(d => d.adultLiteracyRate && d.subscribersPer100);
console.log(regionData);

const yScale = d3.scaleLinear()
                    .domain(d3.extent(regionData, d => d.subscribersPer100))
                    .range([height - padding, padding]);
const xScale = d3.scaleLinear()
                    .domain(d3.extent(regionData, d => d.adultLiteracyRate))
                    .range([padding, width - padding]);

const colorScale = d3.scaleLinear()
                    .domain(d3.extent(regionData, d => d.urbanPopulationRate))
                    .range(['lightgreen', 'darkblue']);

const radiusScale = d3.scaleLinear()
                    .domain(d3.extent(regionData, d => d.growthRate))
                    .range([2, 15]);

const xAxis = d3.axisBottom(xScale)
                    .tickSize(-height + 2 * padding) // 470
                    .tickSizeOuter(0);

const yAxis = d3.axisLeft(yScale)
                    .tickSize(-width + 2 * padding)
                    .tickSizeOuter(0);

d3.select('svg')
    .append('g')
        .attr('transform', `translate(0, ${height - padding - 4})`)
        .call(xAxis);

d3.select('svg')
    .append('g')
        .attr('transform', `translate(${padding + 8}, 0)`)
        .call(yAxis);

const svgG = d3.select('svg')
                .attr('width', width)
                .attr('height', height);
            //.selectAll('g')
            svgG
            .selectAll('circle')
            .data(regionData)
            .enter()
    .append('circle')
        .attr('cx', d => {
            let adultLiteracyRate = d.adultLiteracyRate;
            if (d.adultLiteracyRate <= 28) adultLiteracyRate += 2;
            if (d.adultLiteracyRate >= 97) adultLiteracyRate -= 2;
            return xScale(adultLiteracyRate)
        })
        .attr('cy', d => {
            let subscribersPer100 = d.subscribersPer100;
            if (d.subscribersPer100 <= 15) subscribersPer100 += 5;
            if (d.subscribersPer100 >= 175) subscribersPer100 -= 5;
            return yScale(subscribersPer100)
        })
        .attr('r', d => radiusScale(d.growthRate))
        .attr('fill', d => colorScale(d.urbanPopulationRate))
        .on('mouseover', handleMouseEnter)
        .on('mouseout', handleMouseOut);

d3.select('svg')
    .append('text')
        .attr('x', width / 2)
        .attr('y', height - padding)
        .attr('dy', '1.5em')
        .style('text-anchor', 'middle')
        .text('Literacy Rate, Aged 15 and Up');

d3.select('svg')
    .append('text')
    .attr('x', width / 2)
    .attr('y', padding - 10)
    .style('text-anchor', 'middle')
    .style('font-size', '1.5em')
    .text('Cellular Subscriptions vs. Literacy Rate');

d3.select('svg')
    .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', padding)
        .attr('x', -height / 2)
        .attr('dy', '-1.2em')
        .style('text-anchor', 'middle')
        .text('Cellular Subscriptions per 100 People');

function handleMouseEnter(d, i) {
    svgG.append('text')
        .attr('id', `region-${i}`)
        .attr('x', width / 2)
        .attr('y', height / 2)
        .style('text-anchor', 'middle')
        .style('padding', '0')
        .style('margin', '0')
        .style('position', 'fixed')
        .style('font-size', () => {
            if (d.region.length < 12) {
                return '60px';
            } else if (d.region.length >= 12 && d.region.length < 22) {
                return '40px';
            } else if (d.region.length >= 22 && d.region.length < 32) {
                return '20px';
            } else if (d.region.length >= 32 && d.region.length < 42) {
                return '15px';
            }
        })
        .classed('country', true)
        .text(d.region);
}

function handleMouseOut(d, i) {
    d3.select(`#region-${i}`).remove();
}