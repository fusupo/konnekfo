/**
 *
 * Implement a `DFSelect` method on this Tree class.
 *
 * DFSelect accepts a filter function, calls that function on each of the nodes
 * in Depth First order, and returns a flat array of node values of the tree
 * for which the filter returns true.
 *
 * Example:
 *   var root1 = new Tree(1);
 *   var branch2 = root1.addChild(2);
 *   var branch3 = root1.addChild(3);
 *   var leaf4 = branch2.addChild(4);
 *   var leaf5 = branch2.addChild(5);
 *   var leaf6 = branch3.addChild(6);
 *   var leaf7 = branch3.addChild(7);
 *   root1.DFSelect(function (value, depth) {
 *     return value % 2;
 *   })
 *   // [1, 5, 3, 7]
 *
 *   root1.DFSelect(function (value, depth) {
 *     return depth === 1;
 *   })
 *   // [2, 3]
 *
 */

/*
 * Basic tree that stores a value.
 */

var Tree = function(value) {
  this.value = value;
  this.children = [];
};

Tree.prototype.DFSelect = function(filter) {

  var depth = arguments[1] === undefined ? 0 : arguments[1];
  var res = [];

  if (this.children.length > 0) {
    for (var i = 0; i < this.children.length; i++) {
      res = res.concat(this.children[i].DFSelect(filter, depth + 1));
    }
  }

  if (filter(this.value, depth)) {
    res.unshift(this.value);
  }

  return res;

};

Tree.prototype.DFTraverse = function(filter) {

  if (this.children.length > 0) {
    var i = 0;
    while (i < this.children.length) {
      // for(var i = 0; i < this.children.length; i++){
      //   //path = path.concat(this.children[i].DFTraverse(filter, i));
      //   this.children[i].DFTraverse(filter, path);
      // }
        //console.table(this.children[i].value.cells);
      var p = this.children[i].DFTraverse(filter);//.slice(0);
      if (p !== undefined) {
        p.unshift(i);
        return p;
      }
      i++;
    }

  }

  if (filter(this.value)) {
    console.log('--> ');
    return [];
  }
  
  return undefined;
};

////////////////////////////////////////////////////////////////////////////////  SOLUTION

// Tree.prototype.DFSelect = function (filter, depth){
//   depth = depth || 0;
//   var rootSelection = filter(this.value, depth) ? [this.value] : [];
//   var childSelections = this.children.map(function(child){
//     return child.DFSelect(filter, depth + 1);
//   });
//   return [].concat.apply(rootSelection, childSelections);
// };


/**
 * You shouldn't need to change anything below here, but feel free to look.
 */

/**
 * add an immediate child
 * (wrap values in Tree nodes if they're not already)
 */
Tree.prototype.addChild = function(child) {
  if (!child || !(child instanceof Tree)) {
    child = new Tree(child);
  }

  if (!this.isDescendant(child)) {
    this.children.push(child);
  } else {
    throw new Error("That child is already a child of this tree");
  }
  // return the new child node for convenience
  return child;
};

/**
 * check to see if the provided tree is already a child of this
 * tree __or any of its sub trees__
 */
Tree.prototype.isDescendant = function(child) {
  if (this.children.indexOf(child) !== -1) {
    // `child` is an immediate child of this tree
    return true;
  } else {
    for (var i = 0; i < this.children.length; i++) {
      if (this.children[i].isDescendant(child)) {
        // `child` is descendant of this tree
        return true;
      }
    }
    return false;
  }
};

/**
 * remove an immediate child
 */
Tree.prototype.removeChild = function(child) {
  var index = this.children.indexOf(child);
  if (index !== -1) {
    // remove the child
    this.children.splice(index, 1);
  } else {
    throw new Error("That node is not an immediate child of this tree");
  }
};
