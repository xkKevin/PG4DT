export function extractCols(inputCols,inExpOrImpCols,outExpOrImpCols){
    //输入的是value，不是index
    let inGroups = []
    let inStart = 0
    let inEnd = 0
    let inPos = 0
    let ITL = inputCols.length
    let res = []
    //如果transformation不涉及任何explicit/implicit column，返回前min(ITL, 3) 列
    if(inExpOrImpCols.length == 0){
        res = inputCols.slice(0,Math.min(ITL,3))
        return res
    }

    //依据explicit/implicit col分组
    //还要考虑input table中没有contextual cols的情况
    let contextualLen = inputCols.length - inExpOrImpCols.length
    if(contextualLen == 0)return []
    while(inStart <= inEnd && inEnd < inputCols.length){
        if(inputCols[inEnd] == inExpOrImpCols[inPos]){
            if(inStart != inEnd)inGroups.push(inputCols.slice(inStart,inEnd))
            inStart = inEnd + 1
            inPos += 1
        }
        inEnd += 1
    }
    if(inStart != inEnd){
        inGroups.push(inputCols.slice(inStart,inEnd))
    }

    let IGL = inExpOrImpCols.length,OGL = outExpOrImpCols.length
    let pos = 0,groupLen = inGroups.length
    let loop = 0
    while(Math.max(IGL, OGL) < 3 || Math.min(IGL, OGL) < 2 && contextualLen > 0){
        if(inGroups[pos].length > loop){
            res.push(inGroups[pos][loop])
            contextualLen -= 1
            IGL += 1
            OGL += 1
        }
        pos = (pos + 1) % groupLen
        if(pos == 0) loop += 1
    }
    return res
}
