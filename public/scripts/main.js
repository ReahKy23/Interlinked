//Link to documentation currently using: https://docs.anychart.com/Basic_Charts/Network_Graph

window.onload = async () => {
    let jsonResponse = await fetch("/data")
    let receivedData = await jsonResponse.json();
    let myNodes = []
    let myEdges = []
    let nodeData = receivedData.newData
    console.log(nodeData)


    for (let i = 0; i < nodeData.length; i++) {
        myNodes.push({
            id: nodeData[i]._id
        })

        //check which one is currently submitted
        for (let j = 0; j < nodeData.length; j++) {
            if (nodeData[i]._id != nodeData[j]._id && nodeData[i].categories[0] == nodeData[j].categories[0]) {
                if (nodeData[i].sadnessCount - 1 == nodeData[j].sadnessCount) {
                    myEdges.push({ from: nodeData[j]._id, to: nodeData[i]._id })
                    console.log('success')
                }


            }
        }
    }

    let data = {
        nodes: myNodes,
        edges: myEdges
    }

    let chart = anychart.graph(data)

    chart.container("map-container")

    chart.draw()
}
