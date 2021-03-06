export function getComponents(specs){
    let fatherRec = makeFatherRec(specs)
    for(let idx = 0;idx < specs.length; idx++){
        if(typeof(specs[idx].input_table_file) === 'string' && typeof(specs[idx].output_table_file) === 'string'){
            fatherRec = mergeNode(fatherRec,specs[idx].input_table_file,specs[idx].output_table_file)
        }else if(typeof(specs[idx].input_table_file) === 'string'){
            for(let fileIdx = 0; fileIdx < specs[idx].output_table_file.length; fileIdx++){
                fatherRec = mergeNode(fatherRec,specs[idx].input_table_file,specs[idx].output_table_file[fileIdx])
            }
        }else{
            for(let fileIdx = 0; fileIdx < specs[idx].input_table_file.length; fileIdx++){
                fatherRec = mergeNode(fatherRec,specs[idx].input_table_file[fileIdx],specs[idx].output_table_file)
            }
        }
    }
    let nodes = {}
    let edges = {}
    //收集节点
    for(let key in fatherRec){
        let root = findRoot(fatherRec, key)
        if(!nodes[root])nodes[root] = []
        nodes[root].push(key)
    }
    //收集边
    for(let idx = 0;idx < specs.length; idx++){
        //经过上面的并查集操作之后，同一个spec的input和output file一定在有同一个root
        if(typeof(specs[idx].input_table_file) === 'string' && typeof(specs[idx].output_table_file) === 'string'){
            let root = findRoot(fatherRec, specs[idx].input_table_file)
            if(!edges[root])edges[root] = []
            edges[root].push([specs[idx].input_table_file,specs[idx].output_table_file])
        }else if(typeof(specs[idx].input_table_file) === 'string'){
            let root = findRoot(fatherRec, specs[idx].input_table_file)
            if(!edges[root])edges[root] = []
            for(let fileIdx = 0; fileIdx < specs[idx].output_table_file.length; fileIdx++){
                edges[root].push([specs[idx].input_table_file,specs[idx].output_table_file[fileIdx]])
            }
        }else{
            let root = findRoot(fatherRec, specs[idx].output_table_file)
            if(!edges[root])edges[root] = []
            for(let fileIdx = 0; fileIdx < specs[idx].input_table_file.length; fileIdx++){
                edges[root].push([specs[idx].input_table_file[fileIdx],specs[idx].output_table_file])
            }
        }
    }
    let groups = []
    for(let keyNode in nodes){
        groups.push({'key':keyNode,'nodeGroup':nodes[keyNode]})
    }
    groups.sort(componentCmp)
    return {groups,edges}
}
function makeFatherRec(specs){
    let fatherRec = {}
    for(let idx = 0;idx < specs.length;idx++){
        if(typeof(specs[idx].input_table_file) === 'string'){
            if(!fatherRec[specs[idx].input_table_file])fatherRec[specs[idx].input_table_file] = specs[idx].input_table_file
        }else {
            for(let fileIdx = 0; fileIdx < specs[idx].input_table_file.length; fileIdx++){
                if(!fatherRec[specs[idx].input_table_file[fileIdx]])fatherRec[specs[idx].input_table_file[fileIdx]] = specs[idx].input_table_file[fileIdx]
            }
        }
        if(typeof(specs[idx].output_table_file) === 'string'){
            if(!fatherRec[specs[idx].output_table_file])fatherRec[specs[idx].output_table_file] = specs[idx].output_table_file
        }else {
            for(let fileIdx = 0; fileIdx < specs[idx].output_table_file.length; fileIdx++){
                if(!fatherRec[specs[idx].output_table_file[fileIdx]])fatherRec[specs[idx].output_table_file[fileIdx]] = specs[idx].output_table_file[fileIdx]
            }
        }
    }
    return fatherRec
}

function findRoot(fatherRec,table_file){
    while(fatherRec[table_file] !== table_file){
        table_file = fatherRec[table_file]
    }
    return table_file
}

function mergeNode(fatherRec,table_file1,table_file2){
    let root1 = findRoot(fatherRec,table_file1)
    let root2 = findRoot(fatherRec,table_file2)
    if(root1 !== root2){
        fatherRec[root2] = root1
    }
    return fatherRec
}

function componentCmp(group1,group2){
    let nodes1 = group1.nodeGroup
    let nodes2 = group2.nodeGroup
    return findMinRow(Object.values(nodes1)) < findMinRow(Object.values(nodes2))
}

function findMinRow(nodeArr){
    let minRow = 0
    nodeArr.forEach(tableName => {
        let rowNumber = parseInt(tableName.replace(/[^0-9]/ig,""),10)
        if(rowNumber){
            if(minRow === 0 || minRow > rowNumber){
                minRow = rowNumber
            }
        }
    });
    return minRow
}