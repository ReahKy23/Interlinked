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

        //another for loop that iterates over the data
        for (let j = 0; j < nodeData.length; j++) {
            //if the id of the current node[i] is not equal to the id of current node[j], AND the categories for both nodes are the same, 
            if (nodeData[i]._id != nodeData[j]._id && nodeData[i]._id < nodeData[j]._id && nodeData[i].categories[0] == nodeData[j].categories[0]) {
                //execute the following if statement for each category 

                //if the count of sadness for node[i] is 1 less than the count of sadness for node[j], then push an edge from node[j] to node[i]. this means that since they both share the same category and are not the same node, they can share a connection, hence allowing it to be pushed into the edges array.
                if (nodeData[i].sadnessCount - 1 == nodeData[j].sadnessCount) {
                    myEdges.push({ from: nodeData[j]._id, to: nodeData[i]._id })
                    console.log('success')
                }

                //same logic applies for the rest of the categories
                else if (nodeData[i].joyCount - 1 == nodeData[j].joyCount) {
                    myEdges.push({ from: nodeData[j]._id, to: nodeData[i]._id })
                    console.log('success')
                }

                else if (nodeData[i].fearCount - 1 == nodeData[j].fearCount) {
                    myEdges.push({ from: nodeData[j]._id, to: nodeData[i]._id })
                    console.log('success')
                }

                else if (nodeData[i].contentCount - 1 == nodeData[j].contentCount) {
                    myEdges.push({ from: nodeData[j]._id, to: nodeData[i]._id })
                    console.log('success')
                }
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


// Async function to make sure AnyChart doesn't try to run on njk files that don't contain it
// Without this, other javascript files can not load on individual paged
window.onload = async () => {

  const container = document.getElementById("chartContainer");

  if (!container) return; //Only runs the code above on pages that contain "chartContainer" 

  var chart = anychart.line();
  chart.container("chartContainer");
  chart.draw();
};
