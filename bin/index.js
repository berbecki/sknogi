#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const figlet = require("figlet");
const argv = require("yargs").argv;
const unzipper = require("unzipper");
const git = require("simple-git")();
const shell = require("shelljs");

const sourceFolder = "./source";
const trackedFolder = "./tracked";
const filenames = [];
const homeRemote = "git@github.com:berbecki/sknogi.git";

const init = () => {
  console.log(
    chalk.green(
      figlet.textSync("sknogi", {
        font: "Rectangles",
        horizontalLayout: "default",
        verticalLayout: "default"
      })
    )
  );
};

const whatUserWant = () => {
  const questions = [
    {
      type: "list",
      name: "USERWANTS",
      message: "What do you want to do?",
      choices: [
        "commit",
        "push",
        "pull",
        "make a branch",
        "switch to branch",
        "advanced options"
      ]
    }
  ];
  return inquirer.prompt(questions);
};

const commitMessage = () => {
  const questions = [
    {
      type: "input",
      name: "MESSAGE",
      message: "Write your commit message:"
    }
  ];
  return inquirer.prompt(questions);
};

const buildRemoteList = remoteV => {
  const remoteList = [];
  let subIter = -1;
  remoteV
    .replace(/\n/g, " ")
    .replace(/\t/g, " ")
    .replace(/\s+$/, "")
    .split(" ")
    .forEach((element, index) => {
      if (index % 3 === 0) {
        subIter += 1;
        remoteList.push({});
      }
      switch (index) {
        case 0:
          remoteList[subIter].name = element;
          break;
        case 1:
          remoteList[subIter].source = element;
          break;
        case 2:
          remoteList[subIter].action = element;
          break;
      }
      console.log(index % 3, subIter, element);
    });
  console.log("remoteList", remoteList);
  return remoteList;
};

const run = async () => {
  // intro
  init();

  // check  git exists
  if (shell.which("git")) {
    shell.echo("Sorry, this script requires git");
    // shell.exit(1);
  }

  const answers = await whatUserWant();
  const remote = shell.exec("git remote -v", { silent: true }).stdout;
  // buildRemoteList(remote);

  switch (answers.USERWANTS) {
    case "commit":
      const message = await commitMessage();
      git.add('./*').commit(message.MESSAGE)
      console.log(chalk.blue("message:", message.MESSAGE));
      break;
    case "push":
      console.log("I want push");
      const answers2 = await whatUserWant()
      break;
    case "pull":
      console.log("I want pull");
      break;
  }

  // success
  console.log(chalk.bgBlue.bold(" SUCCESS :) "));
};

run();

// fs.readdirSync(sourceFolder).forEach(file => {
//   if (file.split(".")[1] === "sketch") {
//     filenames.push({ file, name: file.split(".")[0] });
//   }
// });
//
// filenames.forEach(({ name, file }) => {
//   fs.mkdirSync(`${trackedFolder}/${name}`, { recursive: true });
//   fs.copyFileSync(
//     path.resolve(`${sourceFolder}/${file}`),
//     path.resolve(`${sourceFolder}/${name}.zip`)
//   );
//   fs.createReadStream(path.resolve(`${sourceFolder}/${name}.zip`)).pipe(
//     unzipper.Extract({ path: path.resolve(`${trackedFolder}/${name}`) })
//   );
// });
//
// inquirer
//   .prompt([
//     {
//       type: 'input',
//       name: 'commit_message',
//       message: "Write your commit message:"
//     }
//   ])
//   .then(answers => {
//     console.log(answers);
//     git.add('./*').commit(answers.commit_message)
//     console.log(chalk.bgRgb(15, 100, 204).inverse(' It works! '))
//   });

//

//console.log("farr", filenames, argv.x);
