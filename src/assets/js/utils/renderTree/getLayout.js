import {nodeSize,svgSize} from '@/assets/js/config/config'
function getLayout(specs){

    let nodeName = [],edges = []
    let edgeCount = 1
    for(let idx = 0;idx < specs.length;idx++){

        if(typeof(specs[idx].input_table_file) === "string"){
            nodeName.push(specs[idx].input_table_file)
        }else{
            specs[idx].input_table_file.forEach(element => {
                nodeName.push(element)
            })
        }
        
        if(typeof(specs[idx].output_table_file) === "string"){
            nodeName.push(specs[idx].output_table_file)
        }else{
            specs[idx].output_table_file.forEach(element => {
                nodeName.push(element)
            });
        }
       
        if(typeof(specs[idx].input_table_file) === "string" && typeof(specs[idx].output_table_file) === "string"){
            let tempEdge = {id:`e${edgeCount}`,sources:[specs[idx].input_table_file],targets:[specs[idx].output_table_file]}
            edges.push(tempEdge)
            edgeCount += 1
        }else if(typeof(specs[idx].input_table_file) === "string"){
            specs[idx].output_table_file.forEach(outFileName => {
                let tempEdge = {id:`e${edgeCount}`,sources:[specs[idx].input_table_file],targets:[outFileName]}
                edges.push(tempEdge)
                edgeCount += 1
            })
        }else{
            specs[idx].input_table_file.forEach(inFileName => {
                let tempEdge = {id:`e${edgeCount}`,sources:[inFileName],targets:[specs[idx].output_table_file]}
                edges.push(tempEdge)
                edgeCount += 1
            })
        } 
    }
    nodeName = Array.from(new Set(nodeName))
    let children = []
    nodeName.forEach(nodeName => {
        children.push({id: nodeName, width: nodeSize.width, height: nodeSize.height})
    })

    let graph = {
        id: "root",
        "layoutOptions": {
            "elk.padding": `[top=${parseInt(svgSize.height) + 20},left=50.0,bottom=0.0,right=35.0]`,
            "spacing.nodeNodeBetweenLayers": parseInt(svgSize.width) + 40,
            "spacing.edgeNodeBetweenLayers": "200.0",
            "nodePlacement.strategy": "NETWORK_SIMPLEX",
            "algorithm": "layered",
            "spacing.edgeEdgeBetweenLayers": "300.0",
            "crossingMinimization.semiInteractive": "true",
            "spacing.edgeNode": "25.0",
            "spacing.edgeEdge": "20.0",
            "spacing.nodeNode": parseInt(svgSize.height) + 20,//control the gap in direction of y 
            "separateConnectedComponents": "true",
            "spacing.componentComponent": "200.0",
            // "width": '2000',
            // "height": '700'
        },
    }
    graph['children'] = children
    graph['edges'] = edges
    return graph
}

function getGraphs(nodeGroups,edgeGroups){
    let graphs = []
    for(let node = 0; node < nodeGroups.length; node++){
        let edgeCount = 1
        let graph = {
            id: "root",
            "layoutOptions": {
                "elk.padding": `[top=${parseInt(svgSize.height) + 20},left=50.0,bottom=0.0,right=35.0]`,
                "spacing.nodeNodeBetweenLayers": (parseInt(svgSize.width) + 40) * 1.2,
                // "spacing.edgeNodeBetweenLayers": "200.0",
                "nodePlacement.strategy": "NETWORK_SIMPLEX",
                "algorithm": "layered",
                "spacing.nodeNode": parseInt(svgSize.height) + 20,//control the gap in direction of y 
            },
        }
        let children = [],edges = []
        nodeGroups[node].nodeGroup.forEach(nodeName =>{
            children.push({id: nodeName, width: nodeSize.width, height: nodeSize.height})
        })
        edgeGroups[nodeGroups[node].key].forEach(edge =>{
            let tempEdge = {id:`e${edgeCount}`,sources:[edge[0]],targets:[edge[1]]}
            edges.push(tempEdge)
            edgeCount += 1
        })
        graph['children'] = children
        graph['edges'] = edges

        graphs.push(graph)
    }
    return graphs    
}


export {getLayout,getGraphs}
