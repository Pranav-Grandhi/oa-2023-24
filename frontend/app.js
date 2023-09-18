document.addEventListener("DOMContentLoaded", () => {
  let chart = null; // Initialize chart as null

  const form = document.getElementById("graphConfig");
  const xSelect = document.getElementById("xAxis");
  const ySelect = document.getElementById("yAxis");
  const chartContainer = document.getElementById("myChart");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const xAxis = xSelect.value;
    const yAxis = ySelect.value;

    // Fetch data from the server with selected options
    fetch(`http://localhost:8080/data?x=${xAxis}&y=${yAxis}`)
      .then((response) => response.json())
      .then((data) => {
        // Clear the previous chart if it exists
        if (chart) {
          chart.destroy();
        }
        
        // Create and render the line chart
        chart = renderLineChart(data, chartContainer);
      });
  });

  function renderLineChart(data, container) {
    const ctx = container.getContext("2d");

    return new Chart(ctx, {
      type: "line",
      data: {
        labels: data.x,
        datasets: [
          {
            label: ySelect.options[ySelect.selectedIndex].text,
            data: data.y,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
});
