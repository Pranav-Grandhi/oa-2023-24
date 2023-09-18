document.addEventListener("DOMContentLoaded", () => {
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
        // Create and render the line chart
        renderLineChart(data, chartContainer);
      });
  });

  function renderLineChart(data, container) {
    const ctx = container.getContext("2d");
  
    new Chart(ctx, {
      type: "line", // Change chart type to "line"
      data: {
        labels: data.x,
        datasets: [
          {
            label: ySelect.options[ySelect.selectedIndex].text,
            data: data.y,
            // You can customize line properties here if needed
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        // You can add more line chart options as needed
      },
    });
  }
});
