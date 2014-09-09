//RULES 
//1. Any live cell w/ fewer than 2 live neighbors dies (underpopulation)
//2. Any live cell w/ 2 or 3 live neighbors lives (survival)
//3. Any live cell w/ more than 3 live neightbors dies (overpopulation)
//4. Any dead cell w/ 3 live neighbors becomes alive (reproduction)

//Seed generation 

'use strict';
app.controller('GameController', function ($scope, $timeout, Colony) {
    //init colony
    $scope.colony = Colony.colony;
    //init rows and coloumns
    $scope.newRows = Colony.newRows();
    $scope.newColumns = Colony.newColumns();
    $scope.addColumn = function() {
        Colony.addColumn();
        $scope.newColumns = Colony.newColumns();
    };
    $scope.removeColumn = function() {
        Colony.removeColumn();
        $scope.newColumns = Colony.newColumns();
    };
    $scope.addRow = function() {
        Colony.addRow();
        $scope.newRows = Colony.newRows();
    };
    $scope.removeRow = function() {
        Colony.removeRow();
        $scope.newRows = Colony.newRows();
    };
    $scope.reset = function() {
        Colony.reset();
    };

    var colonyLife = function (cell) {
        var neighbors = cell.neighbors();

        // less than two neighbors dies
        if(neighbors<2) {
            return function() {
                cell.dies();
            }
        }
        // more than three neighbors dies
        if(neighbors>3) {
            return function() {
                cell.dies();
            }
        }
        // 2 or 3 neighbors lives
        if(neighbors == 2 || 3 && !cell.isAlive) {
            return function() {
                cell.lives();
            }
        }
        return null;
    }

    // next generations
    $scope.createColony = function() {
        var life = Colony.visit(colonyLife);
        for(var i=0; i<life.length; i++) {
               life[i].apply(this);
        //_.each(life, function() {
        // Colony.apply()
        // })
        }
    };

    // auto
    $scope.started = false;

    // one generation
    var oneGen = function () {
        if($scope.started) {
            $scope.createColony();
        }
        $timeout(oneGen, 300);
    };
    oneGen();

    // auto
    $scope.start = function() {
        $scope.started = true;
    };
    $scope.stop = function() {
        $scope.started = false;
    };
});

// app.controller('GameController', function ($scope, $timeout) {
//     $scope.gridSize = '';    
//     $scope.livingCell = function() {
//         var nextGen = function(livingNeighbors) {
//             if (livingNeighbors < 2) {
//                 return $scope.deadCell();
//             } else if (livingNeighbors > 3) {
//                 return $scope.deadCell();
//             } else {
//                 return $scope.livingCell();
//             }
//         };
//         return {isLiving: true,
//                 nextGenGivenNLivingNeighbors: nextGen};
//     };
    
//     $scope.deadCell = function() {
//         var nextGen = function(livingNeighbors) {
//             if (livingNeighbors === 3) {
//                 return $scope.livingCell();
//             } else {
//                 return $scope.deadCell();
//             }
//         };
//         return {isLiving: false,
//                 nextGenGivenNLivingNeighbors: nextGen};
//     };
    
//     $scope.firstGrid = function() {
//         $scope.currentGeneration = 0;
//         $scope.boards = [];
//         var size = $scope.gridSize;
//         $scope.boards[0] = $scope.resizedBoard(size);
//         for (var i = 0; i < size; i++) {
//             for (var j = 0; j < size; j++) {
//                 var isAlive = Math.round(Math.random());
//                 $scope.boards.last().grid[i][j] = isAlive ? $scope.livingCell() : $scope.deadCell();
//             }
//         }
//     };
    
//     $scope.livingNeighbors = function(board, row, column) {
//         var livingCells = 0;
//         for (var i = row - 1; i <= row + 1; i++) {
//             if (i < 0) {
//                 continue;
//             }
//             if (i >= board.grid.length) {
//                 continue;
//             }
//             for (var j = column - 1; j <= column + 1; j++) {
//                 if (j < 0) {
//                     continue;
//                 }
//                 if (j >= board.grid.length) {
//                     continue;
//                 }
//                 if (i === row && j === column) {
//                     continue;
//                 }
//                 if (board.grid[i][j].isLiving) {
//                     livingCells++;
//                 }
//             }
//         }
//         return livingCells;
//     };
    
//     $scope.resizedBoard = function(size) {
//         var newGrid = [];
//         for (var i = 0; i < size; i++) {
//             newGrid[i] = [];
//         }
//         var boardEqualsBoard = function(board) {
//             for (var i = 0; i < size; i++) {
//                 for (var j = 0; j < size; j++) {
//                     if (newGrid[i][j].isLiving !== board.grid[i][j].isLiving) {
//                         return false;
//                     }
//                 }
//             }
//             return true;
//         };
//         return { grid: newGrid,
//                  equals: boardEqualsBoard,
//                  generation: $scope.currentGeneration };
//     };
//     $scope.next = function() {
//         $scope.currentGeneration++;
//         var oldBoard = $scope.boards.last();
//         var size = oldBoard.grid.length;
//         $scope.boards.push($scope.resizedBoard(size));
//         for (var i = 0; i < size; i++) {
//             for (var j = 0; j < size; j++) {
//                 livingNeighbors = $scope.livingNeighbors(oldBoard, i, j);
//                 $scope.boards.last().grid[i][j] = oldBoard.grid[i][j].nextGenGivenNLivingNeighbors(livingNeighbors);
//             }
//         }
//         if ($scope.boards.last().equals(oldBoard)) {
//             $scope.boards.pop();
//         }
//     }
//     //set initial methods
//     //on load, game is inactive, population growth evolves at speed of '500', zero live cells, default size is 15 x 20
//     //user modifies grid via inputs ('ng-model' directives used)
//     //seed generation
//     $scope.paused = true;
//     $scope.interval = 500;
//     $scope.population = 0;
//     $scope.generation = 0;
//     $scope.gridSize = {'rows': 15, 'cols': 20};
//     // 'minimum': 10, 'maximum':40}
//     $scope.grid = [
//         []
//     ];

//     $scope.pause = function () {
//         $scope.paused = true;
//     };

//     $scope.start = function () {
//         $scope.paused = false;
//         $timeout($scope.loop, $scope.interval);
//     };
//     //newGrid() called on click of new grid button
//     //pass in function that returns value if value is less than max or greather than min
//     //if user inputs more than the max allowed, return the max - less than the min, return the min
//     $scope.newGrid = function () {
//         // function limitGridSize(value, min, max) {
//         //     return value > max ? max : value < min ? min : value;
//         // }
//     //when user changes grid size, rows and cols variables set to value of limitGridSize function
//     //within the parameters (max and min)
//         function gridSize(rows, cols) {
//         var rows = gridSize($scope.gridSize.rows); 
//         // $scope.gridSize.minimum, $scope.gridSize.maximum);
//         var cols = gridSize($scope.gridSize.cols); 
//         // $scope.gridSize.minimum, $scope.gridSize.maximum);


//         $scope.gridSize.rows = rows;
//         $scope.gridSize.cols = cols;
//         //_size will return the number of old rows and cols
//         var oldRows = _.size($scope.grid);
//         var oldCols = _.size(_.first($scope.grid));

//         function newRow(cols, row) {
//             //will create a list of numbered columns //produces a new list of values
//             return _.range(cols).map(function (col) {
//                 if (row >= oldRows || col >= oldCols)
//                     return { currentGeneration: false, nextGeneration: false };
//                 else
//                     return { currentGeneration: $scope.grid[row][col].currentGeneration,
//                         nextGeneration: $scope.grid[row][col].nextGeneration};
//             })
//         }

//         $scope.grid = _.range(rows).map(function (row) {
//             return newRow(cols, row);
//         });
//     };

//     $scope.toggle = function (cell) {
//         cell.currentGeneration = !cell.currentGeneration;
//         $scope.population = $scope.getPopulation();
//     };

//     $scope.generate = function (row, col) {
//         var cell = $scope.grid[row][col];
//         var neighbors = [
//             {dx: -1, dy: -1},
//             {dx: 0, dy: -1},
//             {dx: 1, dy: -1},
//             {dx: 1, dy: 0},
//             {dx: 1, dy: 1},
//             {dx: 0, dy: 1},
//             {dx: -1, dy: 1},
//             {dx: -1, dy: 0}
//         ];

//         var ln = _.reduce(neighbors, function (history, n) {
//             var nx = col + n.dx;
//             var ny = row + n.dy;
//             var rows = _.size($scope.grid);
//             var cols = _.size(_.first($scope.grid));

//             if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
//                 return history + ($scope.grid[ny][nx].currentGeneration ? 1 : 0);
//             } else {
//                 return history;
//             }
//         }, 0);

//         cell.nextGeneration= (cell.currentGeneration && ln >= 2 && ln <= 3)
//             || (!cell.currentGeneration && ln == 3);
//     };

//     function gridTraverse(grid, fn) {
//         var rows = _.size($scope.grid);
//         var cols = _.size(_.first($scope.grid));

//         _.each(_.range(rows), function (row) {
//             _.each(_.range(cols), function (col) {
//                 fn(row, col);
//             })
//         })
//     }
//     $scope.buildGrid = function () {
//         gridTraverse($scope.grid, function (row, col) {
//             $scope.generate(row, col);
//         });
//     };

//     $scope.updateGrid = function () {
//         gridTraverse($scope.grid, function (row, col) {
//             $scope.grid[row][col].currentGeneration = $scope.grid[row][col].nextGeneration;
//         });
//     };
//     $scope.getPopulation = function () {
//         population = 0;

//         gridTraverse($scope.grid, function (row, col) {
//             population += $scope.grid[row][col].currentGeneration ? 1 : 0;
//         });

//         return population;
//     };

//     $scope.loop = function () {
//         if (!$scope.paused) {
//             $scope.generate();
//             $scope.updateGrid();
//             $scope.population = $scope.getPopulation();

//             $scope.paused = $scope.population == 0;

//             $timeout($scope.loop, $scope.interval);
//         }
//     };

//     $scope.newGrid();
// });
