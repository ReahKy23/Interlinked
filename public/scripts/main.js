//Link to documentation currently using: https://docs.anychart.com/Basic_Charts/Network_Graph
let jsonResponse = await fetch ("/data")
let myNodes = []
let myEdges = []

for(let individualSubmission of jsonResponse){
    myNodes.push({id: individualSubmission._id})


    myEdges.push({from: individualSubmission.sadnessCount, to: individualSubmission.joyCount})
}
let data = {
    nodes: [myNodes],
    edges: [myEdges]
}

let chart = anychart.graph(data)

chart.container("map-container")

chart.draw()