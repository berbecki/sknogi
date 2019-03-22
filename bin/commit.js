#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chalk = require('chalk')
const inquirer = require('inquirer')
const argv = require("yargs").argv;
const unzipper = require("unzipper");
const git = require("simple-git")();

const sourceFolder = "./source";
const trackedFolder = "./tracked";
const filenames = [];

console.log(chalk.blue('Hello world!'));
fs.readdirSync(sourceFolder).forEach(file => {
  if (file.split(".")[1] === "sketch") {
    filenames.push({ file, name: file.split(".")[0] });
  }
});

filenames.forEach(({ name, file }) => {
  fs.mkdirSync(`${trackedFolder}/${name}`, { recursive: true });
  fs.copyFileSync(
    path.resolve(`${sourceFolder}/${file}`),
    path.resolve(`${sourceFolder}/${name}.zip`)
  );
  fs.createReadStream(path.resolve(`${sourceFolder}/${name}.zip`)).pipe(
    unzipper.Extract({ path: path.resolve(`${trackedFolder}/${name}`) })
  );
});

inquirer
  .prompt([
    {
      type: 'input',
      name: 'commit_message',
      message: "Write your commit message:"
    }
  ])
  .then(answers => {
    console.log(answers);
    git.add('./*').commit(answers.commit_message)
    console.log(chalk.bgRgb(15, 100, 204).inverse('It works!'))
  });

//

//console.log("farr", filenames, argv.x);
