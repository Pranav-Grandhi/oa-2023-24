const graphDiv = document.getElementById("graph");

fetch(
    "http://localhost:8080"
).then(async res => {
    Plotly.newPlot(graphDiv, [await res.json()]);
})

