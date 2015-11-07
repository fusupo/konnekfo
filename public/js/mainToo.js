// if I can wan win in the next move, win
// if my opp win in the next move (ie does my opp have 3 in a row/col/diag, etc),
// if yes, can I stop opp from winning on their next move?
// if yes, block
// else, in checkmate. opp will win. this move doesn't matter 
// else play best offensive move

// plan for best offensive move //////////////////////////////////
// start with current board
// figure out which move (ie which column) will give us the highest possiblity of winning by calculating all games states with a recursive fxn
// recursive fxn (input includes: current player)
// initialize our tally ([w,l,d]) note: tally is stats for computer
// make each of the hypothetical moves for the current player (ie chose a column, go from left to right)
// is the game over?
// if so return win/lose/draw (base case) [1,0,0]
// if not then recurse() and fold results into tally
// return tally

var makeMove = function(b, p, d) {

  var tree = new Tree(b);

  if (d - 1 > 0) {
    for (var i = 0; i < 7; i++) {
      var board = new Board(b.cloneCells());
      board.move(i, p);
      tree.addChild(makeMove(board, p^0b11, d - 1));
    }
  }

  return tree;

};

window.onload = function() {

  // var board = new Board();
  // for (var i = 0; i < 7; i++) {
  //   for (var j = 0; j < 6; j++) {
  //     var m = Math.floor(Math.random() * 3);
  //     switch (m) {
  //       case 1:
  //         board.move(i, "x");
  //         break;
  //       case 2:
  //         board.move(i, "o");
  //         break;
  //     }
  //   }
  // }

  var baseHeight = 18000;
  var margin = {
    top: 20,
    right: 120,
    bottom: 20,
    left: 120
  },
      width = 960 - margin.right - margin.left,
      height = baseHeight - margin.top - margin.bottom;
  
  var i = 0,
    duration = 750,
    root;

  var tree = d3.layout.tree()
    .size([height, width]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.y, d.x];
    });

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // d3.json("flare.json", function(error, flare) {
  //   if (error) throw error;

  //   root = flare;
  //   root.x0 = height / 2;
  //   root.y0 = 0;

  //   function collapse(d) {
  //     if (d.children) {
  //       d._children = d.children;
  //       d._children.forEach(collapse);
  //       d.children = null;
  //     }
  //   }

  //   root.children.forEach(collapse);
  //   update(root);
  // });

  d3.select(self.frameElement).style("height", baseHeight + "px");

  // var foo = svg.selectAll("g.foo")
  //       .data([board]);
  // var fooEnter = foo.enter().append("g")
  //       .attr("class", "foo")
  //       .attr("transform", function(d) {
  //         return "translate(180, 180)";
  //       });

  // for (var j = 5; j >= 0; j--) {
  //   for (var i = 0; i < 7; i++) {
  //     var marker = fooEnter.append("rect")
  //           .attr("width", 10)
  //           .attr("height", 10)
  //           .attr("x", 10 * i)
  //           .attr("y", 10 * (6 - j))
  //           .style("fill", function(d) {
  //             var c = d.cells[j][i];
  //             switch (c) {
  //               case null:
  //                 return "white";
  //                 break;
  //               case 'x':
  //                 return "red";
  //                 break;
  //               case 'o':
  //                 return "yellow";
  //                 break;
  //             }
  //             return d._children ? "lightsteelblue" : "#fff";
  //           });
  //   }
  // }

  function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
      d.y = d.depth * 180;
    });

    var node = svg.selectAll("g.foo")
      .data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });

    var nodeEnter = node.enter().append("g")
          .attr("class", "node")
    // .attr("transform", function(d) {
    //   return "translate(180, 180)";
    // });
      .on("click", click);

    // var c = nodeEnter.append("g");
    // .attr("r", 1e-6)
    // .style("fill", function(d) {
    //   return d._children ? "lightsteelblue" : "#fff";
    // });

    var cellwidth = 7;
    for (var j = 5; j >= 0; j--) {
      for (var ii = 0; ii < 7; ii++) { 
        var marker = nodeEnter.append("rect")
              .attr("width", cellwidth)
              .attr("height", cellwidth)
              .attr("x", cellwidth * ii)
              .attr("y", cellwidth * (6 - j))
              .style("fill", function(d) {
                var row = d.value.rows[j];
                var c = row >> (ii * 2);
                //console.log(console.table(d.value.cells));
                switch (c) {
                  case null:
                    return "white";
                    break;
                  case 1:
                    return "red";
                    break;
                  case 2:
                    return "yellow";
                    break;
                }
                //return d.children ? "lightsteelblue" : "#fff";
              });
      }
    }

    // // Update the nodes…
    // var node = svg.selectAll("g.node")
    //       .data(nodes, function(d) {
    //         return d.id || (d.id = ++i);
    //       });

    // // Enter any new nodes at the parent's previous position.
    // var nodeEnter = node.enter().append("g")
    //       .attr("class", "node")
    //       // .attr("transform", function(d) {
    //       //   return "translate(" + source.y0 + "," + source.x0 + ")";
    //       // })
    //       .on("click", click);

    // nodeEnter.append("circle")
    //   .attr("r", 1e-6)
    //   .style("fill", function(d) {
    //     return d._children ? "lightsteelblue" : "#fff";
    //   });

    // nodeEnter.append("text")
    //   .attr("x", function(d) {
    //     return d.children || d._children ? -10 : 10;
    //   })
    //   .attr("dy", ".35em")
    //   .attr("text-anchor", function(d) {
    //     return d.children || d._children ? "end" : "start";
    //   })
    //   .text(function(d) {
    //     return d.name;
    //   })
    //   .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
          });

    nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
      });

    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
          })
          .remove();

    nodeExit.select("circle")
      .attr("r", 1e-6);

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
          .data(links, function(d) {
            return d.target.id;
          });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link");
    // .attr("d", function(d) {
    //   var o = {
    //     x: source.x0,
    //     y: source.y0
    //   };
    //   return diagonal({
    //     source: o,
    //     target: o
    //   });
    // });

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {
          x: source.x,
          y: source.y
        };
        return diagonal({
          source: o,
          target: o
        });
      })
      .remove();

    // Stash the old positions for transition.
    // nodes.forEach(function(d) {
    //   d.x0 = d.x;
    //   d.y0 = d.y;
    // });
  }

  //  Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }

  // console.table(board.cells);
  var t = makeMove(new Board(), 1, 4);
  root = t;
  update(t);
  console.log("calculations complete");
};
