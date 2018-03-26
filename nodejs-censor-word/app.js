const brain = require('brain.js');
const Reader = require('line-by-line');
const lr = new Reader('data.txt');

let trainData = [];
let pattern = '';
let counter = 0;
lr.on('line', function(line) {
  ++ counter;
  if (counter % 2) {
    pattern = line;
  } else {
    const result = line;
    console.log(`${pattern} -> ${result}`);
    trainData.push({input: pattern, output: result});
  }
});

function processTrainintData() {
  trainData.forEach(function(d) {
    d.input = getInput(d.input);

    let output = {};
    output[d.output] = 1.0;
    d.output = output;
  });
}

lr.on('end', function() {
  processTrainintData();

  startTraining();

  testPred('十有**');
  testPred('大**量');
  testPred('惊**势');
  testPred('有**烦');
  testPred('蓝**焰');

  console.log('\nTrying patterns that are not in training set...\n');
  testPred('紫**焰');
  testPred('红**焰');
  testPred('巨**术');
  testPred('产生的**');
});

const net = new brain.NeuralNetwork({
  activation: 'sigmoid',
  hiddenLayers: [6],
  learningRate: 0.1,
});

function startTraining() {
  console.log('\nStrated training...');
  net.train(trainData);
  console.log('Training finished.\n');
}

function getHighest(o) {
  let p = '', max = 0, second = 0;
  for (let i in o) {
    if (o[i] > max) {
      second = max;
      max = o[i];
      p = i;
    }
  }
  return [p, o[p].toPrecision(3), second.toPrecision(3)];
}

function getInput(s) {
  let v = {};
  for (let i of s) {
    v[i] = 1.0;
  }
  return v;  
}

function testPred(s) {
  const out = net.run(getInput(s));
  console.log(`Predicting ${s} => ${getHighest(out)}`);
}
