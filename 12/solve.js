const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data.txt')
  });

let graph = new Map();
let paths = 0;

function addEdge(from, to) {
    if (graph.has(from)) {
        graph.set(from, [...graph.get(from), to]);
    } else {
        graph.set(from, [to]);
    }
}

lineReader.on('line', (line) => {
    const [from, to] = line.split('-');
    addEdge(from, to);
    addEdge(to, from);
});

lineReader.on('close', () => {
    console.log(graph);
    function find(current, turnOptions, history, notAllowed) {
        if (turnOptions.length == 0) {
            return null;
        } else if (current.toLowerCase() == 'end') {
            paths++;
            console.log('Found end. History:', [...history, current]);
            return null;
        } else {
            for (let i = 0; i < turnOptions.length; i++) {

                if (!notAllowed.includes(turnOptions[i])) {
                    if (current.toLowerCase() === current) {
                        notAllowed = [...notAllowed, current];
                    }
                    find(turnOptions[i], graph.get(turnOptions[i]), [...history, current], notAllowed);
                }
            }
        }
    }
    find('start', graph.get('start'), [], []);
    console.log(paths);
});