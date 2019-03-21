#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const git = require('simple-git')()

const sourceFolder = "./source";
const trackedFolder = "./tracked";
const filenames = [];

fs.readdirSync(sourceFolder).forEach(file => {
  if(file.split(".")[1] === 'sketch') {
    filenames.push({ file, name: file.split(".")[0] });
  }
});

filenames.forEach(({ name, file }) => {
  fs.mkdirSync(`${trackedFolder}/${name}`, { recursive: true });
  fs.copyFileSync(
    path.resolve(`${sourceFolder}/${file}`),
    path.resolve(`${sourceFolder}/${name}.zip`)
  );
  fs.createReadStream(path.resolve(`${sourceFolder}/${name}.zip`))
    .pipe(unzipper.Extract({ path: path.resolve(`${trackedFolder}/${name}`) }));
});

git.add('./*').commit("first commit from simple-git!")

console.log("farr", filenames);
