//Link to documentation currently using: https://docs.anychart.com/Basic_Charts/Network_Graph

function closePopupContainer() {
    document.getElementById("popup-container").style.display = "none";
}

window.onload = async () => {

    let jsonResponse = await fetch("/data")
    let receivedData = await jsonResponse.json();
    let myNodes = []
    let myEdges = []
    let nodeData = receivedData.newData

    console.log(nodeData)

    //for loop that iterates through the entire length of the data
    for (let i = 0; i < nodeData.length; i++) {

        let color;
        let stroke;

        if (nodeData[i].categories[0] == 'sadness') {
            color = 'lightblue'
            strokeCol = 'darkblue'
        } else if (nodeData[i].categories[0] == 'joy') {
            color = 'yellow'
            strokeCol = 'white'
        } else if (nodeData[i].categories[0] == 'fear') {
            color = 'purple'
            strokeCol = '#CD9CFF'
        } else if (nodeData[i].categories[0] == 'content') {
            color = 'green'
            strokeCol = 'lightgreen'
        }

        //pushes each individual id into the nodes array
        myNodes.push({
            id: nodeData[i]._id,
            normal: { fill: color, stroke: strokeCol }
        })

        //another for loop that iterates over the data, j+1 to prevent duplicates
        for (let j = i + 1; j < nodeData.length; j++) {

            //if the id of the current node[i] is not equal to the id of current node[j], AND the categories for both nodes are the same,

            //some() method checks if there is at least one category in nodeData[i] that is also in nodeData[j]
            let sameCategory = nodeData[i].categories.some(cat =>
                nodeData[j].categories.includes(cat)
            )

            //creates an edge between two nodes if they share a category
            if (sameCategory) {
                myEdges.push({
                    from: nodeData[i]._id,
                    to: nodeData[j]._id
                })

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
    let edges = chart.edges()

    //CHART STYLING
    nodes.normal().height(30)
    nodes.normal().shape("star5")
    nodes.hovered().height(50)
    nodes.selected().fill('white')

    edges.hovered().stroke('yellow')
    edges.selected().stroke('white')

    chart.interactivity().hoverGap(0)
    chart.tooltip().enabled(false)
    chart.bounds(0, 0, '100%', '100%')
    chart.background().fill("none")
    // chart.background().stroke("none")3

    chart.container("map-container")
    chart.draw()

    chart.listen("click", async (clickedEvent) => {

        if (clickedEvent.domTarget && clickedEvent.domTarget.tag) {

            let nodeId = clickedEvent.domTarget.tag.id

            let x = clickedEvent.originalEvent.clientX;
            let y = clickedEvent.originalEvent.clientY;

            let response = await fetch(`/data/${nodeId}`)
            let nodeData = await response.json()

            if (nodeData) {
                document.getElementById("popup-content").innerHTML =
                    `<img src="${nodeData.filePath}" style="width: 100px; height: 100px;">
                     <p>${nodeData.categories[0]}, ${nodeData.categories[1]}</p>
                     <p>${nodeData.imgDesc}</p>`

                let popup = document.getElementById("popup-container")
                popup.style.display = "block"
                popup.style.visibility = "hidden"

                let popupWidth = popup.offsetWidth
                let popupHeight = popup.offsetHeight

                let left = x - popupWidth / 2
                let top = y - popupHeight - 20

                if (left < 0) left = 10
                if (left + popupWidth > window.innerWidth) left = window.innerWidth - popupWidth - 10
                if (top < 0) top = y + 20

                popup.style.left = left + "px"
                popup.style.top = top + "px"
                popup.style.visibility = "visible"
            }
        } else {
            closePopupContainer()
        }
    })

    chart.listen("mouseOver", async (hoverEvent) => {
        if (hoverEvent.domTarget && hoverEvent.domTarget.tag) {
            let nodeId = hoverEvent.domTarget.tag.id;
            let x = hoverEvent.originalEvent.clientX;
            let y = hoverEvent.originalEvent.clientY;
            let response = await fetch(`/data/${nodeId}`);
            let nodeData = await response.json();
    
            if (nodeData && nodeData.imgDesc) {
                document.getElementById("popup-content").innerHTML =
                    `<img src="${nodeData.filePath}" style="width: 100px; height: 100px;">
                     <p>${nodeData.categories[0]}, ${nodeData.categories[1]}</p>
                     <p>${nodeData.imgDesc}</p>`;
    
                let popup = document.getElementById("popup-container");
                popup.style.display = "block";
                popup.style.visibility = "hidden";
    
                let popupWidth = popup.offsetWidth;
                let popupHeight = popup.offsetHeight;
                let left = x - popupWidth / 2;
                let top = y - popupHeight - 20;
    
                if (left < 0) left = 10;
                if (left + popupWidth > window.innerWidth) left = window.innerWidth - popupWidth - 10;
                if (top < 0) top = y + 20;
    
                popup.style.left = left + "px";
                popup.style.top = top + "px";
                popup.style.visibility = "visible";
            }
        } else {
            closePopupContainer();
        }
    });
    
    chart.listen("mouseOver", async (hoverEvent) => {
        if (hoverEvent.domTarget && hoverEvent.domTarget.tag) {
            let nodeId = hoverEvent.domTarget.tag.id;
            let caption = await fetch(`/data/${nodeId}`);
            let nodeData = await caption.json();
    
            if (nodeData && nodeData.imgDesc) {
                document.getElementById("mapOverlay").innerHTML = nodeData.imgDesc;
                document.getElementById("mapOverlay").style.display = "flex";
            }
        } else {
            document.getElementById("mapOverlay").style.display = "none";
            document.getElementById("mapOverlay").innerHTML = "";
        }
    });
    
    chart.listen("mouseOut", (mouseOutEvent) => {
        if (mouseOutEvent.domTarget && mouseOutEvent.domTarget.tag) {
            document.getElementById("mapOverlay").style.display = "none";
            document.getElementById("mapOverlay").innerHTML = "";
        }
    });

    

}

// Async function to make sure AnyChart doesn't try to run on njk files that don't contain it
// Without this, other javascript files can not load on individual paged
// window.onload = async () => {

//     const container = document.getElementById("chartContainer");

//     if (!container) return; //Only runs the code above on pages that contain "chartContainer" 

//     var chart = anychart.line();
//     chart.container("chartContainer");
//     chart.draw();
// };
