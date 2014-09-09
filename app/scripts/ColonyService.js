'use strict';

app.factory('Colony', function(){
    //make sure no colony exists
        function checkColonySize(colony, x, y) {
            return colony[x] != null && colony[y] != null;
        };
    //build grid cell by cell;
        function buildCell(colony, x, y) {
             return {
                 'colony': colony,
                 'isAlive': false,
                 'posX': x,
                 'posY': y,
                 //toggle on dead cells to make life
                  //called when the user clicks - If the cell was empty, a cell is
                    //created, otherwise it's killed.
                 'toggle': function() {
                     this.isAlive ? this.isAlive = false : this.isAlive = true;
                 },
                 //dies = dead
                 'dies' : function() {
                     this.isAlive = false;
                 },
                 //lives = alive
                 'lives' : function() {
                     this.isAlive = true;
                 },
                 //check neighbors (no cell originally has neighbors) returns number of neighbors
                 'neighbors': function() {
                    var neighbors = 0;
                    //loop through rows and columns
                        for(var i=-1;i<=1; i++) {
                            for(var j=-1;j<=1; j++) {
                                // ignore current cell because only concerned about neighbors here
                                if(i == 0 && j == 0) {
                                    continue;
                                }
                                //cell position
                                var x = this.posX + i;
                                var y = this.posY + j;
                                if(checkColonySize(this.colony, x, y) && this.colony[x][y].isAlive) {
                                    neighbors++;
                                }
                            }
                        }
                    return neighbors;
                }
            }
        };
        function buildColony(row, column) {
            var newColony = [];
            for (var i=0; i< row; i++) {
                newColony[i]=[];
                for(var j=0;j <column; j++) {
                    newColony[i].push(buildCell(newColony,i,j));
                }
            }
            return newColony;
        };

        return {
            'colony': buildColony('15','15'),
            'newRows': function() {
                    return this.colony.length;
            },
            'newColumns': function() {
                if(this.colony.length > 0) {
                    return this.colony[0].length;
                } else {
                    return 0;
                }
            },
            'visit': function(visitor) {
                var result=[];
                for (var x=0; x< this.colony.length; x++) {
                    for(var y=0;y <this.colony[x].length; y++) {
                        var rule = visitor.call(this, this.colony[x][y]);
                        if(rule != null) {
                            result.push(rule);
                        }
                    }
                }
                return result;
            },
            'reset': function() {
                this.visit(function(cell) {cell.isAlive = false})
            },
            'addColumn': function() {
                for (var x=0; x< this.colony.length; x++) {
                    this.colony[x].push(buildCell(this.colony,x,this.colony[x].length))
                }
            },
            'removeColumn': function() {
                for (var x=0; x< this.colony.length; x++) {
                    this.colony[x].pop();
                }
            },
            'addRow': function() {
                var newRow = [];
                for (var x=0; x< this.colony[0].length; x++) {
                    newRow.push(buildCell(this.colony,x,this.colony.length))
                }
                this.colony.push(newRow);
            },
            'removeRow': function() {
                this.colony.pop();
            }
        };
    });