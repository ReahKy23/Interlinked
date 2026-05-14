//Link to documentation currently using: https://docs.anychart.com/Basic_Charts/Network_Graph
let jsonResponse = await fetch("/data")
let myNodes = []
let myEdges = []

for (let i = 0; i < jsonResponse.newData.length; i++) {
    myNodes.push({
        id: jsonResponse.newData[i]._id
    })

    myEdges.push(
    {from: jsonResponse.newData[i].newDoc._id.sadnessCount,
    to: jsonResponse.newData[i].newDoc._id.joyCount
    }, { from: jsonResponse.newData[i].newDoc._id.joyCount, to: jsonResponse.newData[i].newDoc._id.fearCount }, { from: jsonResponse.newData[i].newDoc._id.fearCount, to: jsonResponse.newData[i].newDoc._id.contentCount }, 
    {from: jsonResponse.newData[i].newDoc._id.contentCount, to: jsonResponse.newData[i].newDoc._id.sadnessCount })
}

let data = {
    nodes: [myNodes],
    edges: [myEdges]
}

let chart = anychart.graph(data)

chart.container("map-container")

chart.draw()