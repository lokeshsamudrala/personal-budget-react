import React, { useEffect, useRef } from 'react';
import { axiosGet } from './../AxiosService';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';

function HomePage() {

    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosGet('/budget');

                if (response && response.data && response.data.myBudget) {
                    const myBudgetData = response.data.myBudget;

                    const labels = myBudgetData.map((item) => item.title);
                    const data = myBudgetData.map((item) => item.budget);

                    if (chartInstanceRef.current) {
                        chartInstanceRef.current.destroy();
                    }

                    const chartContext = chartRef.current.getContext('2d');
                    const newChartInstance = new Chart(chartContext, {
                        type: 'pie',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    data: data,
                                    backgroundColor: [
                                        '#ffcd56',
                                        '#ff6384',
                                        '#36a2eb',
                                        '#fd6b19',
                                        '#CC0000',
                                        '#45818e',
                                        '#c90076',
                                        '#783f04',
                                        '#f6b26b'
                                    ],
                                },
                            ],
                        },
                    });

                    chartInstanceRef.current = newChartInstance;

                    drawD3DonutChart(myBudgetData);

                }
            } catch (error) {
                console.error('Fetching error data:', error);
            }
        };

        fetchData();
    }, []);





    return (
        <section className="container center" role="main" aria-label="Features">

        <div className="page-area">
            <article className="text-box">
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </article>
    
            
            <article className="text-box">
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </article>
    
            
            <article className="text-box">
                <h1>Results</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </article>
    
            
            <article className="text-box">
                <h1>Free</h1>
                <p>
                    This app is free!!! And you are the only one holding your data!
                </p>
            </article>
    
            
            <article className="text-box">
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </article>
    
            
            <article className="text-box">
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </article>
    
            
            <article className="text-box">
                <h1>Results</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </article>
    
            
            <article className="text-box">
                <h1>Chart</h1>
                <p>
                    <canvas id="myChart" width="400" height="400" ref={chartRef}></canvas>
                </p>
            </article>

            <article className="text-box">
                <h1>D3JS Chart</h1>
                <p>
                    <div id="d3DonutChart"></div>
                </p>
            </article>
        </div>
        
    </section>
    );
  }
  
  function drawD3DonutChart(data) {
    const width = 700;
    const height = 700;
    const radius = (Math.min(width, height) / 3);

    const existingChart = d3.select('#d3DonutChart svg');
    if (!existingChart.empty()) {

        return;
    }

    const svg = d3.select('#d3DonutChart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.title))
        .range(['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19','#CC0000','#45818e','#c90076','#783f04','#f6b26b']);

    const pie = d3.pie()
        .value(d => d.budget);

    const arc = d3.arc()
        .outerRadius(radius * 0.9)
        .innerRadius(radius * 0.4);

    const outerArc = d3.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.3);

    const arcs = svg.selectAll('arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc');

    arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.title));

    const labelLines = arcs.append('line')
        .attr('x1', d => outerArc.centroid(d)[0])
        .attr('y1', d => outerArc.centroid(d)[1])
        .attr('x2', d => {
            const pos = outerArc.centroid(d);
            const midAngle = Math.atan2(pos[1], pos[0]);
            return Math.cos(midAngle) * (radius + 10);
        })
        .attr('y2', d => {
            const pos = outerArc.centroid(d);
            const midAngle = Math.atan2(pos[1], pos[0]);
            return Math.sin(midAngle) * (radius + 10);
        })
        .attr('stroke', 'black');

    arcs.append('text')
        .attr('transform', d => {
            const pos = outerArc.centroid(d);
            const midAngle = Math.atan2(pos[1], pos[0]);
            return `translate(${Math.cos(midAngle) * (radius + 20)},${Math.sin(midAngle) * (radius + 20)})`;
        })
        .attr('dy', '0.75em')
        .style('text-anchor', d => {
            const pos = outerArc.centroid(d);
            return (Math.cos(Math.atan2(pos[1], pos[0])) > 0) ? 'start' : 'end';
        })
        .text(d => `${d.data.title} (${d.data.budget})`);
}

  export default HomePage;