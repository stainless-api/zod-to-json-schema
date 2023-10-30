const { copyFileSync, readFileSync, writeFileSync } = require("fs");

for (const file of ["README.md", "package.json", "LICENSE", "changelog.md"]) {
  copyFileSync(`./${file}`, `./dist/${file}`);
}

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
pkg.main = "index.js";
writeFileSync("./dist/package.json", JSON.stringify(pkg, null, 2), 'utf8');
