var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

module.exports = gol = function(config) {
  var board = seed(config.size);
  return {
    start: function() {
      setTimeout(_.partial(tick, board), 200);
    },
    emitter: ee
  }
}

function tick(board) {
  ee.emit('repaint', board);
  _.each(board, function(columns, row) {
    _.each(columns, function(cell, col) {
     var count = neighbors(col, row, board);
     if (cell) {
       if (count < 2) cell = false;
       if (count > 3) cell = false;
     } else {
       if (_.isEqual(count, 3)) cell = true;
     }
     board[row][col] = cell;
    });
  });
  setTimeout(_.partial(tick, board), 200);
}

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

var game = gol({size: 10});
game.emitter.on('repaint', function(board) {
  console.log(board);
});
game.start();

