
export const selectedArr = (libData:string[][],removeEl:number[]=[],advanceVal:object) => {
    const results:object[] = []
    libData.map((data,index) => {
        if(!removeEl.includes(index))
        {
            results.push({'id':data[0],'value':data[0],'content':data[1],...advanceVal})
        }
    })
    return results
}

