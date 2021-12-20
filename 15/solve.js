// Used tutorial at https://levelup.gitconnected.com/finding-the-shortest-path-in-javascript-dijkstras-algorithm-8d16451eea34
// but adapted this to use Set and Map data-structures.
// Problem 2 (500x500 array) has a long run-time (around 2 hrs on average computer) and could be optimized.

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')
  });

const mapArr = [];

lineReader.on('line', (line) => {
    const row = line.split('').map((nr) => Number(nr));
    mapArr.push(row);
});

function buildLargeArr(arr) {
    let largeArr = [];
    for (let y = 0; y < arr.length; y++) {
        let largeRowArr = [];
        for (let i = 0; i < 5; i++) {
            const incHorArr = arr[y].map((nr) => {
                const newNr = nr + i;
                return newNr <= 9 ? newNr : newNr - 9; 
            });
            largeRowArr = largeRowArr.concat(incHorArr);
        }
        largeArr.push(largeRowArr);
    }
    const newLargeArr = [];
    for (let i = 0; i < 5; i++) {
        for (let y = 0; y < largeArr.length; y++) {
            const incVertArr = largeArr[y].map((nr) => nr + i <= 9 ? nr + i : nr + i - 9);
            newLargeArr.push(incVertArr);
        }
    }
    return newLargeArr;
}

function buildGraph(arr) {
    const graph = new Map();
    for (let y = 0; y < arr.length; y++) {
        for (let x = 0; x < arr[y].length; x++) {
            const roads = new Map();
            if (y >= 1) roads.set(`${y-1},${x}`, Number(arr[y-1][x])); // Above
            if (x <= arr[y].length - 2) roads.set(`${y},${x+1}`, Number(arr[y][x+1])); // Right
            if (y <= arr.length - 2) roads.set(`${y+1},${x}`, Number(arr[y+1][x])) // Below
            if (x >= 1) roads.set(`${y},${x-1}`, Number(arr[y][x-1])); // Left
            graph.set(`${y},${x}`, roads);
        }
    }
    return graph;
}

function shortestDistanceNode(distances, visited) {
    let shortest = null;
    for (let [node] of distances) {
            let currentIsShortest = shortest === null || distances.get(node) < distances.get(shortest);

            if (currentIsShortest && !visited.has(node)) {
                shortest = node;
        }
    }
    return shortest;
}

function findShortestPath(graph, startNode, endNode) {
    const distances = new Map(graph.get(startNode));
    distances.set(endNode, "Infinity");

    // track paths
    const parents = new Map();
    parents.set(endNode, null);
    for (let [child] of graph.get(startNode)) {
        parents.set(child, startNode);
    }

    const visited = new Set();
    
    // find the nearest node
    let node = shortestDistanceNode(distances, visited);

    while (node) {
        let distance = distances.get(node);
        let children = graph.get(node);

        for (let [child] of children) {
            if (child === startNode) {
                continue;
            } else {
                let newdistance = distance + children.get(child);
                if (!distances.get(child) || distances.get(child) > newdistance) {
                    distances.set(child, newdistance);
                    parents.set(child, node);
                }
            }
        }
        visited.add(node);
        node = shortestDistanceNode(distances, visited);
    }
    let shortestPath = [endNode];
    let parent = parents.get(endNode);
    while (parent) {
        shortestPath.push(parent);
        parent = parents.get(parent);
    }
    const results = {
        distance: distances.get(endNode),
    };
    return results;
}


lineReader.on('close', () => {
    const graph = buildGraph(mapArr);
    console.log('Problem 1:', findShortestPath(graph, `0,0`, `${mapArr.length - 1},${mapArr[0].length - 1}`));
    const largeArr = buildLargeArr(mapArr);
    const mapGraph = buildGraph(largeArr);
    console.log('Problem 2:', findShortestPath(mapGraph, `0,0`, `${largeArr.length - 1},${largeArr[0].length - 1}`));
});