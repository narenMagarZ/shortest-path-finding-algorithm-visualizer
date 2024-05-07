

class Cell{
    constructor(i,j){
        this.i = i
        this.j = j
        this.elem = null
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
            c.setAttribute('class','cell')
            cell.elem = c
            row.appendChild(c)
        }
        gridC.appendChild(row)
    }  

}

setup()
const startCell = grid[24][24]
const targetCell = grid[40][10]
startCell.elem.style.background = "#0000ff"
targetCell.elem.style.background = "#00ff00"

function fun1(grid){
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
    distances[24][24] = 0
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
                minCell.elem.style.background='#ff0000'
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
    // findShortestPath(prevNodes)
    print(prevNodes[24])
    print(prevNodes[40])
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
                paths[i].elem.style.background = "#000000"
            }
        }
    },timer)
}
fun1(grid)
