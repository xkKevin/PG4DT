import {nodeSize} from '@/assets/js/config/config'
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
            "elk.padding": "[top=300.0,left=50.0,bottom=0.0,right=35.0]",
            "spacing.nodeNodeBetweenLayers": "300.0",
            "spacing.edgeNodeBetweenLayers": "200.0",
            "nodePlacement.strategy": "NETWORK_SIMPLEX",
            "algorithm": "layered",
            "spacing.edgeEdgeBetweenLayers": "300.0",
            "crossingMinimization.semiInteractive": "true",
            "spacing.edgeNode": "25.0",
            "spacing.edgeEdge": "20.0",
            "spacing.nodeNode": "200.0",
            "separateConnectedComponents": "true",
            "spacing.componentComponent": "200.0",
            "width": '2000',
            "height": '900'
        },
    }
    graph['children'] = children
    graph['edges'] = edges
    return graph
}

export {getLayout}
