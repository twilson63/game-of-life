var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();
var running = false;

// default rules
// this can be configured by passing in a 
// replacement via the config object
// but the passed in rules replacement
// must use the (cell, neighbors) pattern
var rules = function(cell, neighbors) {
  if (cell) {
    if (neighbors < 2) cell = false;
    if (neighbors > 3) cell = false;
  } else {
    if (_.isEqual(neighbors, 3)) cell = true;
  }
  return cell;
}

// main gol module
module.exports = gol = function(config) {
  var board = seed(config.size);
  rules = _.isFunction(config.rules) ? config.rules : rules;
  return {
    stop: function() {
      running = false;
    },
    start: function() {
      running = true;
      setTimeout(_.partial(tick, board, rules), 200);
    },
    emitter: ee
  }
}

// game tick event
function tick(board, rules) {
  ee.emit('repaint', board);
  var newBoard = [];
  _.each(board, function(columns, row) {
    var cols = []; 
    _.each(columns, function(cell, col) {
     cell = rules(cell, neighbors(col, row, board));
     cols.push(cell);
    });
    newBoard.push(cols);
  });
  if (running) {
    setTimeout(_.partial(tick, newBoard, rules), 200);
  }
}

// game random seed
function seed(size) {
  var rows = [];
  _.times(size, function(y) {
    cols = [];
    _.times(size, function(x) {
     var v = _.random(1) === 1;
     cols.push(v);
    });
    rows.push(cols);
  });
  return rows;
 }

var p = _.partial;
var top = left = function(n) { return n - 1; }
var bottom = right = function(n) { return n + 1; }
var middle = center = _.identity;
var cell = function(b, fn, fn2) {
  try {
    return b[fn()][fn2()];
  } catch(err) {
    return false;
  }
}

// get neighbor count
function neighbors(x,y,b) {
  return _([
    cell(b, p(top, y), p(left, x)),
    cell(b, p(top, y), p(middle, x)),
    cell(b, p(top. y), p(right, x)),
    cell(b, p(center, y), p(left, x)),
    cell(b, p(center, y), p(right, x)),
    cell(b, p(bottom, y), p(left, x)),
    cell(b, p(bottom, y), p(center, x)),
    cell(b, p(bottom, y), p(right, x))
    ]).filter(_.identity).length;
}

// example
//
//var game = gol({size: 10});
//game.emitter.on('repaint', function(board) {
//  _.each(board, function(cols, y) { 
//    _.each(cols, function(cell, x) {
//      board[y][x] = cell ? '.' : '';
//    });
//  });
//  console.log(board);
//});
//game.start();

