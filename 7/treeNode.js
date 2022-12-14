module.exports = class TreeNode {
  constructor(key, value = key, parent = null, isDirectory = false) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.children = [];
    this.isDirectory = isDirectory;
  }

  get isLeaf() {
    return this.children.length === 0;
  }

  get hasChildren() {
    return !this.isLeaf;
  }
};
