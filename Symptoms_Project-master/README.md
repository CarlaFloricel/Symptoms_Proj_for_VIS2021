# CS 529 VDS Final Project Starter

This project uses [ES6](http://es6-features.org/) syntax with [Babel](https://babeljs.io/docs/en/) and is bundled by [parcel](https://parceljs.org/). It also supports use of SCSS if preferred.

## Project Resources

- [Workbook](https://cs529.naveen.cloud/workbook/)

## Getting Started

- Install Node.js on your machine
- Run `npm install` to install dependencies for this project.
- Run `npm start` to start development server with hot module reloading.
- Visit http://localhost:1234 to view the site.

## Layout of project

```
.
├── assets
│   ├── imgs
│   │   └── createlydatasci.jpg
│   └── styles
│       └── main.scss
├── index.html
├── LICENSE
├── package.json
├── package-lock.json
├── README.md
└── src
    └── index.js
```

- `assets/` - where all static files live
- `assets/styles` - where all stylesheets live
- `src/` - where all javascript code lives

## FAQ

Q1: I opened `index.html` with my browser and nothing happens.

Ans: A typical node.js project doesn't work that way. You need to use the tools suited for this specific project. Refer [Getting started](#getting-started) section.

Q2: Why is there just one script tag?

Ans: This project uses ES6 modules. i.e. It uses imports to fetch other dependencies installed in `node_modules`. This is analogous to compilation in other languages.

Q3: How do I submit my code?

Ans: Please follow the steps below.

1. Always create a new branch for whatever changes you intend to make.

```bash
git checkout -b <your new branch name>
```

2. Make your changes.

3. Add your files to the staging area.

```bash
git add .
```

4. Commit your changes.

```bash
git commit -m "Your commit message goes here"
```

5. Push your changes to remote branch.

```bash
git push -u origin <your branch name>
```

6. Follow the link in your terminal and create a new pull request and wait for
approvals before merging it.
