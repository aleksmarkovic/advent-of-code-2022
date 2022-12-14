// --- Day 7: No Space Left On Device ---
// You can hear birds chirping and raindrops hitting leaves as the expedition proceeds. Occasionally, you can even hear much louder sounds in the distance; how big do the animals get out here, anyway?

// The device the Elves gave you has problems with more than just its communication system. You try to run a system update:

// $ system-update --please --pretty-please-with-sugar-on-top
// Error: No space left on device
// Perhaps you can delete some files to make space for the update?

// You browse around the filesystem to assess the situation and save the resulting terminal output (your puzzle input). For example:

// $ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
// $ cd a
// $ ls
// dir e
// 29116 f
// 2557 g
// 62596 h.lst
// $ cd e
// $ ls
// 584 i
// $ cd ..
// $ cd ..
// $ cd d
// $ ls
// 4060174 j
// 8033020 d.log
// 5626152 d.ext
// 7214296 k
// The filesystem consists of a tree of files (plain data) and directories (which can contain other directories or files). The outermost directory is called /. You can navigate around the filesystem, moving into or out of directories and listing the contents of the directory you're currently in.

// Within the terminal output, lines that begin with $ are commands you executed, very much like some modern computers:

// cd means change directory. This changes which directory is the current directory, but the specific result depends on the argument:
// cd x moves in one level: it looks in the current directory for the directory named x and makes it the current directory.
// cd .. moves out one level: it finds the directory that contains the current directory, then makes that directory the current directory.
// cd / switches the current directory to the outermost directory, /.
// ls means list. It prints out all of the files and directories immediately contained by the current directory:
// 123 abc means that the current directory contains a file named abc with size 123.
// dir xyz means that the current directory contains a directory named xyz.
// Given the commands and output in the example above, you can determine that the filesystem looks visually like this:

// - / (dir)
//   - a (dir)
//     - e (dir)
//       - i (file, size=584)
//     - f (file, size=29116)
//     - g (file, size=2557)
//     - h.lst (file, size=62596)
//   - b.txt (file, size=14848514)
//   - c.dat (file, size=8504156)
//   - d (dir)
//     - j (file, size=4060174)
//     - d.log (file, size=8033020)
//     - d.ext (file, size=5626152)
//     - k (file, size=7214296)
// Here, there are four directories: / (the outermost directory), a and d (which are in /), and e (which is in a). These directories also contain files of various sizes.

// Since the disk is full, your first step should probably be to find directories that are good candidates for deletion. To do this, you need to determine the total size of each directory. The total size of a directory is the sum of the sizes of the files it contains, directly or indirectly. (Directories themselves do not count as having any intrinsic size.)

// The total sizes of the directories above can be found as follows:

// The total size of directory e is 584 because it contains a single file i of size 584 and no other directories.
// The directory a has total size 94853 because it contains files f (size 29116), g (size 2557), and h.lst (size 62596), plus file i indirectly (a contains e which contains i).
// Directory d has total size 24933642.
// As the outermost directory, / contains every file. Its total size is 48381165, the sum of the size of every file.
// To begin, find all of the directories with a total size of at most 100000, then calculate the sum of their total sizes. In the example above, these directories are a and e; the sum of their total sizes is 95437 (94853 + 584). (As in this example, this process can count files more than once!)

// Find all of the directories with a total size of at most 100000. What is the sum of the total sizes of those directories?

const Tree = require("./tree");

const fs = require("fs");
const { dir } = require("console");
const data = fs.readFileSync("data").toString().split("\n");

console.log(data);

const tree = new Tree("/", null);

data.shift();

const PopulateTree = () => {
  let lsMode = false;
  let currentParent = "/";
  data.forEach((cmd) => {
    if (cmd[0] === "$") {
      const cmdParsed = cmd.slice(2, cmd.length);

      if (cmdParsed === "ls") {
        lsMode = true;
      } else if (cmdParsed.includes("cd")) {
        lsMode = false;
        if (cmdParsed.includes("..")) {
          currentParent = tree.find(currentParent);

          return;
        } else {
          const split = cmdParsed.split(" ");
          const treeParent = tree.find(split[1]);

          if (treeParent) {
            currentParent = split[1];
          }
        }
      } else {
        lsMode = false;
      }

      return;
    }

    if (lsMode) {
      const cmdSplit = cmd.split(" ");

      if (cmdSplit[0] === "dir") {
        tree.insert(currentParent, cmdSplit[1], null, true);
      } else if (!isNaN(cmdSplit[0])) {
        tree.insert(currentParent, cmdSplit[1], Number(cmdSplit[0]));
      }

      return;
    }
  });
};

// const directories = {};

// const GetDirectories = () => {
//   [...tree.preOrderTraversal()].map((x) => {
//     if (!x.value && x.key && x.key !== "/") {
//       if (x.parent && x.parent.key !== "/") {
//         directories[x.parent.key] = {
//           ...directories[x.parent.key],
//           [x.key]: {},
//         };
//       } else {
//         directories[x.key] = {};
//       }
//     }
//   });
// };

let dirSums = {};
const SumPerDirectory = () => {
  let sum = 0;
  [...tree.preOrderTraversal()].map((x) => {
    if (x.value) {
      sum += x.value;
    }
  });
};

const directories = [];
const GetDirectories = () => {
  [...tree.preOrderTraversal()].map((x) => {
    if (x.isDirectory) {
      directories.push(x.key);
    }
  });
  console.log({ directories });
};

const postOrder = (root) => {
  if (root.children.length > 0) {
    root.children.forEach((child) => {
      if (!child.key) {
        return root.sumOfTheChildren;
      }
      root.sumOfTheChildren += postOrder(child);
    });
  }

  // console.log(root.sumOfTheChildren ?? 0);
  if (isNaN(root.sumOfTheChildren)) {
    return root.value ?? 0;
  }
  if (isNaN(root.value)) {
    return root.sumOfTheChildren ?? 0;
  }
  console.log(root.sumOfTheChildren, root.value);
  return (root.sumOfTheChildren ?? 0) + (root.value ?? 0);
};

const SumPerDirectoryHC = (directory, sum = 0) => {
  let newSum = sum;
  const node = tree.find(directory);

  node?.children &&
    node.children.forEach((child) => {
      if (child.value) {
        newSum += child.value;
      }

      if (child.children.length > 0) {
        console.log(child.key);
        newSum += SumPerDirectoryHC(child.key, newSum);
      }
    });

  return newSum;
};

PopulateTree();
GetDirectories();
SumPerDirectory();

let finalSum = 0;
directories.forEach((directory) => {
  const sum = SumPerDirectoryHC(directory, 0);
  if (sum <= 100000) {
    console.log({ sum });
    finalSum += sum;
  }
});
console.log(directories.length);
console.log({ finalSum });
// console.log(postOrder(tree.find("/")));
// console.log(directories);
// console.log(tree);
// console.log(dirSums);

// tree.insert(1, 11, "AC");
// tree.insert(1, 12, "BC");
// tree.insert(12, 121, "BG");
// console.log(tree);
// console.log(tree.find(12));
// [...tree.preOrderTraversal()].map((x) => x.value);
// // ['AB', 'AC', 'BC', 'BCG']

// tree.root.value; // 'AB'
// tree.root.hasChildren; // true

// tree.find(12).isLeaf; // false
// tree.find(121).isLeaf; // true
// tree.find(121).parent.value; // 'BC'

// tree.remove(12);

// console.log([...tree.preOrderTraversal()].map((x) => x));
// // ['AC', 'AB']
