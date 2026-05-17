//Link to documentation currently using: https://docs.anychart.com/Basic_Charts/Network_Graph

window.onload = async () => {
    let jsonResponse = await fetch("/data")
    let receivedData = await jsonResponse.json();
    let myNodes = []
    let myEdges = []
    let nodeData = receivedData.newData
    console.log(nodeData)


    //for loop that iterates through the entire length of the data
    for (let i = 0; i < nodeData.length; i++) {
        //pushes each individual id into the nodes array
        myNodes.push({
            id: nodeData[i]._id
        })

        //another for loop that iterates over the data, j+1 to prevent duplicates
        for (let j = i+1; j < nodeData.length; j++) {
            //if the id of the current node[i] is not equal to the id of current node[j], AND the categories for both nodes are the same, 


            //some() method checks if there is at least one category in nodeData[i] that is also in nodeData[j]
            let sameCategory = nodeData[i].categories.some(cat => nodeData[j].categories.includes(cat))

            //creates an edge between two nodes if they share a category
            if(sameCategory){
                myEdges.push({from: nodeData[i]._id, to: nodeData[j]._id})
                console.log('success')
            }
        }
    }

    console.log(myNodes.length)
    console.log(myEdges.length)

    let data = {
        nodes: myNodes,
        edges: myEdges
    }

    let chart = anychart.graph(data)
    let nodes = chart.nodes()


    nodes.normal().height(20)
    nodes.normal().shape("star5")
    nodes.normal().fill("lightblue")
    nodes.normal().stroke("white", 2)
    chart.bounds(0, 0, '100%', '100%')
    chart.background().fill("none")
    // chart.background().stroke("none")3

    chart.container("map-container")

    chart.draw()
}
