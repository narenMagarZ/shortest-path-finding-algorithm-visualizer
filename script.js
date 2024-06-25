
let visualize = 'dijkstra'
    const dijkstraInput = document.getElementById('dijkstra')
    const aStartInput = document.getElementById('a*')
    const visualizeBtn = document.getElementById('visualize-btn')
    const resetBtn = document.getElementById('reset-btn')
    if(dijkstraInput && aStartInput && visualizeBtn && resetBtn){
        dijkstraInput.addEventListener('click',(e)=>{
            if(e.target.checked){
                visualizeBtn.innerHTML = "visualize Dijkstra's"
                visualize = 'dijkstra'
                aStartInput.checked = false
            }
        })
        aStartInput.addEventListener('click',(e)=>{
            if(e.target.checked){
                visualizeBtn.innerHTML = "visualize A*"
                visualize = 'a*'
                dijkstraInput.checked = false
            }
        })
        visualizeBtn.addEventListener('click',(e)=>{
            if(visualize==="dijkstra")
                dijkstra(grid)
            else if(visualize==='a*')
                aStar(grid)
        })

        resetBtn.addEventListener('click',(e)=>{
            reset()
        })
    }


class Cell{
    constructor(i,j){
        this.i = i
        this.j = j
        this.elem = null
        this.isSource = false
        this.isTarget = false
    }
}

const print = console.log
const rows = 60
const cols = 60
const grid = new Array(cols)

function setup(){
    const gridC = document.getElementById('grid')
    for(let i = 0 ; i<cols;i++){
        grid[i] = new Array(rows)
    }
    for(let i = 0;i<rows ; i++){
        const row = document.createElement('div')
        row.classList.add('grid-row')
        for(let j = 0 ; j< cols;j++){
            grid[i][j]= new Cell(i,j)
            const cell = grid[i][j]
            const c = document.createElement('div')

            if(i === startCellX[0] && j === startCellX[1])
                cell.isSource = true
            else if(i===targetCellX[0] && j === targetCellX[1])
                cell.isTarget = true
                c.addEventListener('drag',e=>{
                    e.preventDefault()
                    print(cell.isSource,cell.isTarget)
                    // if(cell.isSource){
                    //     e.currentTarget.style.background="#0000ff"
                    // }
                    // else if(cell.isTarget){
                    //     e.currentTarget.style.background="#00ff00"
                    // }
                })
                c.addEventListener('dragend',e=>{
                    e.currentTarget.style.background = '#e4e4e4'
                })
            // }
            c.addEventListener('dragover',e=>{
                e.preventDefault()
                print(cell.isSource,cell.isTarget)

                // if(cell.isSource)
                //     e.currentTarget.style.background="#0000ff"
                // else if(cell.isTarget)
                //     e.currentTarget.style.background = '#00ff00'
            })
            c.addEventListener('dragleave',e=>{
                e.preventDefault()
                // e.currentTarget.style.background="#e4e4e4"
            })
            // c.addEventListener('dragleave',e=>{
            //     e.preventDefault()
            //     e.currentTarget.style.background="#e4e4e4"
            // })
            // c.addEventListener('dragend',e=>{
            //     print('end')
            //     e.currentTarget.style.background = '#0000ff'
            // })
            c.addEventListener('drop',e=>{
                console.log(i,j)
                startCellX[0] = i
                startCellX[1] = j
                
            })
            c.classList.add('cell')
            cell.elem = c
            row.appendChild(c)
        }
        gridC.appendChild(row)
    }  

}


const startCellX = [47,30]
const targetCellX = [9,53]
setup()
const startCell = grid[startCellX[0]][startCellX[1]]
const targetCell = grid[targetCellX[0]][targetCellX[1]]
startCell.elem.style.background = "#0000ff"
targetCell.elem.style.background = "#00ff00"

function dijkstra(grid){
    const distances = new Array(rows)
    const prevNodes = new Array(rows)
    for(let i = 0 ; i<rows;i++){
        distances[i] = new Array(cols)
        prevNodes[i] = new Array(cols)
        for(let j = 0 ; j<cols;j++){
            distances[i][j] = Infinity
            prevNodes[i][j] = null
        }
    }
    distances[startCellX[0]][startCellX[1]] = 0
    const visited = new Set()
    timer = 100
    while(true){
        let minDist = Infinity
        let minCell = null
        for(let i = 0 ;i<rows;i++){
            for(let j = 0 ;j<cols;j++){
                const cell = grid[i][j]
                if(distances[i][j] < minDist && !visited.has(cell) ){
                    minDist = distances[i][j];
                    minCell = cell
                }
            }
        }
        if(targetCell===minCell){
            break
        }
        if(!minCell || minDist===Infinity){
            break
        }
        visited.add(minCell)
        setTimeout(()=>{
            if(minCell!==startCell)
                minCell.elem.classList.toggle('visited')
        },timer)
        const row = minCell.i
        const col = minCell.j
        // find neighbors 
        let tM = row - 1
        let bM = row + 1
        let lM = col - 1
        let rM = col + 1

        const neighbors = []
        if(tM >= 0){
            neighbors.push(grid[tM][col])
        }
        if(bM<rows){
            neighbors.push(grid[bM][col])
        }
        if(lM>=0){
            neighbors.push(grid[row][lM])
        }
        if(rM<cols){
            neighbors.push(grid[row][rM])
        }
        for(let i = 0;i<neighbors.length;i++){
            const {i:r,j:c} = neighbors[i]
            const alt = minDist + 1
            if(alt < distances[r][c]){
                distances[r][c] = alt
                prevNodes[r][c] = {i:row,j:col}
            }
        }
        timer += 2
    }
    let currentCell = targetCell
    const paths = []
    while(currentCell){
        paths.push(currentCell)
        const i = currentCell.i 
        const j = currentCell.j
        const prevNode = prevNodes[i][j]
        if(prevNode){
            const {i:ix,j:jy} = prevNode
            currentCell = grid[ix][jy]
        }
        else{
            currentCell = null
        }
    }
    setTimeout(()=>{
        for(let i = 0 ; i<paths.length;i++){
            if(paths[i] !== startCell && paths[i] !== targetCell){
                paths[i].elem.classList.toggle('path')
            }
        }
    },timer)
}

function calculateH(){
    const hScore = new Array(rows)
    for(let i = 0 ; i<rows;i++){
        hScore[i] = new Array(cols)
        for(let j = 0 ; j<cols;j++){
            hScore[i][j] = Math.abs(i - targetCellX[0]) + Math.abs(j - targetCellX[1])

        }
    }
    return hScore
}
class C{
    constructor(){
       this.parentI = 0
       this.parentJ = 0
    }
}
function aStar(grid){
    const srcX = startCellX[0]
    const srcY = startCellX[1]
    const tarX = targetCellX[0]
    const tarY = targetCellX[1]

    // validate src pos
    if(srcX < 0 && 
        srcX > rows && 
        srcY < 0 &&  
        srcY > cols)
        return 
    // validate target pos
    if(tarX < 0 && 
        tarX> rows && 
        tarY < 0 &&  
        tarY > cols)
        return
    // check if src === target
    if(srcX === tarX && srcY === tarY)
        return 

    const closedList = new Array(rows)
    for(let i = 0 ;i<closedList.length;i++){
        closedList[i] = new Array(cols).fill(false)
    }

    const cameFrom = new Array(rows)
    for(let i = 0 ; i < rows;i++){
        cameFrom[i] = new Array(cols)
        for(let j = 0 ; j < cols;j++){
            cameFrom[i][j] = new C()
        }
    }
    cameFrom[srcX][srcY].parentI = srcX
    cameFrom[srcX][srcY].parentJ = srcY
    const openList = []
    openList.push({i:srcX,j:srcY,f:0})
    

    const gScore = new Array(rows)
    for(let i = 0 ; i<rows;i++){
        gScore[i] = new Array(cols)
        for(let j = 0 ; j<cols;j++){
            gScore[i][j] = Infinity
        }
    }
    gScore[srcX][srcY] = 0
    const fScore = new Array(rows)
    for(let i = 0 ; i<rows;i++){
    fScore[i] = new Array(cols)
        for(let j = 0 ; j<cols;j++){
            fScore[i][j] = Infinity
        }
    }
    const hScore = calculateH()
    fScore[srcX][srcY] = hScore[srcX][srcY]
    while(openList.length > 0){
        const current = openList.reduce((lc,n,index)=>{
            if(n.f<lc.f){
                return {...n,pos:index}
            }
            return lc
        },{i:-1,j:-1,f:Infinity,pos:-1})
        const i = current.i
        const j = current.j
        if(grid[i][j] === targetCell){
            break 
        }
        openList.splice(current.pos,1)
        // find neighbors
        const neighbors = []

        if( (i+1) < rows ){
            neighbors.push(grid[i+1][j])
        }
        if((i-1) >= 0){
            neighbors.push(grid[i-1][j])
        }
        if((j+1) < cols){
            neighbors.push(grid[i][j+1])
        }
        if((j-1) >= 0){
            neighbors.push(grid[i][j-1])
        }
        for(let n = 0 ; n < neighbors.length;n++){
            const tentativeGScore = gScore[i][j] + 1
            if(tentativeGScore < gScore[neighbors[n].i][neighbors[n].j]){
                cameFrom[neighbors[n].i][neighbors[n].j].parentI = i
                cameFrom[neighbors[n].i][neighbors[n].j].parentJ = j
                gScore[neighbors[n].i][neighbors[n].j] = tentativeGScore
                const f = fScore[neighbors[n].i][neighbors[n].j] = tentativeGScore + hScore[neighbors[n].i][neighbors[n].j]
                const neighbor = neighbors[n]
                const isThere =openList.findIndex(({i,j})=>i===neighbor.i && j === neighbor.j)
                if(isThere===-1){
                    openList.push({i:neighbor.i,j:neighbor.j,f})
                }
            }
        } 
    }
    constructPath(cameFrom)
}
function reset(){
    for(let i = 0;i<rows;i++){
        for(let j = 0;j<cols;j++){
            grid[i][j].elem.classList.remove('visited')
            grid[i][j].elem.classList.remove('path')
        }
    }
}


function constructPath(cameFrom){
    const path = []
    let r = targetCellX[0]
    let c = targetCellX[1]
    let timer = 100
    while(!(cameFrom[r][c].parentI === r && cameFrom[r][c].parentJ=== c)){
        path.push({r,c})
        const tempR = cameFrom[r][c].parentI
        const tempC = cameFrom[r][c].parentJ
        r = tempR
        c = tempC
    }
    print(startCellX)
    print(r,c)
    for(let i = 0 ; i < path.length;i++){
        setTimeout(()=>{
            const r = path[i].r
            const c = path[i].c
            grid[r][c].elem.classList.add('path')
        },timer)
        timer += 40
    }
}