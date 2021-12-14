const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')
  });

let graph = new Map(), paths = 0;

function addEdge(from, to) {
    if (from != 'end' && to != 'start') {
        if (graph.has(from)) {
            graph.set(from, [...graph.get(from), to]);
        } else {
            graph.set(from, [to]);
        }
    }
}

lineReader.on('line', (line) => {
    const [from, to] = line.split('-');
    addEdge(from, to);
    addEdge(to, from);
});

lineReader.on('close', () => {
    function find(current, history, notAllowed = new Set(), limitSmall = false) {
        const turnOptions = graph.get(current);
        if (current.toLowerCase() === current) {
            if (notAllowed.has(current)) {
                limitSmall = true;
            }
            notAllowed.add(current);
        }
        if (turnOptions?.length == 0) {
            return null;
        } else if (current.toLowerCase() == 'end') {
            paths++;
            return null;
        } else {
            for (let destination of turnOptions) {
                if (!notAllowed.has(destination) || notAllowed.has(destination) && !limitSmall) {
                    find(destination, [...history, current], new Set(notAllowed), limitSmall);
                }
            }
        }
    }
    find('start', []);
    console.log(paths);
});