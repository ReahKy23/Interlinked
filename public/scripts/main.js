//Link to documentation currently using: https://docs.anychart.com/Basic_Charts/Network_Graph
let data = {
    nodes: [await fetch("/data").then(response => response.json())],
    edges: []
}


let chart = anychart.graph(data)

chart.container("map-container")

chart.draw()