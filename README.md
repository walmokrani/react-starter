<div align="center">
  <h1>React starter</h1>
  <strong>A simple React boilerplate</strong>
</div>
<br/>  
<div align="center">
  <a href="https://travis-ci.org/iyucef/react-starter">
    <img alt="Build Status" src="https://travis-ci.org/iyucef/react-starter.svg?branch=master"/>
  </a>
  <a href="https://david-dm.org/iyucef/react-starter" title="dependencies status"><img src="https://david-dm.org/iyucef/react-starter/status.svg"/></a>
  <a href="https://david-dm.org/iyucef/react-starter?type=dev" title="devDependencies status"><img src="https://david-dm.org/iyucef/react-starter/dev-status.svg"/></a>
</div>


<div align="center">
  <h3>
   <a href="#getting started">Getting Started</a>
     <span> | </span>
   <a href="#quick-start">Quick Start</a>
   <span> | </span>
   <a href="#build-scripts">Build scripts</a>
   <span> | </span>
   <a href="#test-scripts">Test scripts</a>
    <span> | </span>
   <a href="#env-files">.env files</a>
  </h3>
</div>


## Getting Started

### Requirements

  * Mac OS X, Windows, or Linux
  * [Yarn](https://yarnpkg.com/) package + [Node.js](https://nodejs.org/) v6.5 or newer
  * Text editor or IDE pre-configured with React/JSX/Flow/ESlint

### Directory Layout

```
.
├── /build/                         # The folder for compiled output
├── /node_modules/                  # 3rd-party libraries and utilities
├── /public/                        # Static files which are copied into the /build/public folder
├── /dotenv/                        # .env variables to be loaded into Node process.env.
├── /src/                           # The source code of the application
│   ├── /index.js                   # startup script
│   └── ...                         # Other core framework modules
├── /tools/                         # Build automation scripts and utilities
│   ├── /lib/                       # Library for utility snippets
│   ├── /config/                    # Tools configurations
│   ├── /build.js                   # Builds the project from source to output (build) folder
│   └── /start.js                   # Launches the development web server with "live reload"
        /test-run.js                # A module that runs some code to configure jest before each test
├── package.json                    # The list of 3rd party libraries and utilities
└── yarn.lock                       # Fixed versions of all the dependencies
```


## Quick Start

### 1. Get the latest version

You can start by cloning the latest version of React Starter on your
local machine by running:

```shell
$ git clone https://github.com/iyucef/react-starter.git MyApp
$ cd MyApp
```

### 2. Run `yarn install`

This will install both run-time project dependencies and developer tools listed
in [package.json](package.json) file.



## Build scripts

#### `yarn start` (used for development)

This command will bundle the app from the source files (`/src`) and it will start te
[webpack-dev-server](https://github.com/webpack/webpack-dev-server)
with [HMR](https://webpack.github.io/docs/hot-module-replacement) on top of it.

#### `yarn build` (used for production)

 Compile the app without source map fro production with ([Webpack](http://webpack.github.io/)) module bundler.


#### `yarn build:map` (used for production)

Compile the app with source map fro production with ([Webpack](http://webpack.github.io/)) module bundler.

#### `yarn build:serve` (used for production)

Compile the app without source map fro production by using `yarn build` script and serve the production to see it in real time.

#### `yarn build:analyse` (used for production)

Compile the app without source map fro production by using `yarn build` script and open the [Webpack Analyser](https://github.com/webpack-contrib/webpack-bundle-analyzer) to analyse your build modules


The scripts above use some arugments :

  `--release`: Optimise and minimise the compiled output<br>
  `--map`: Generate source map<br>
  `--analyse`: Open the [Webpack Analyser](https://github.com/webpack-contrib/webpack-bundle-analyzer)



## Test scripts

#### `yarn test`
  
Run unit tests with [Jest](https://facebook.github.io/jest/).

By default, [Jest](https://facebook.github.io/jest/) test runner is looking for test files
matching the `src/**/*.test.js` pattern.

#### `yarn test:watch`
  
Launch unit test runner and start watching for changes.


#### `yarn test:cover`

Launch unit test runner and generate coverage

#### `yarn lint:js` and `yarn lint:css`
  
Check the source code for syntax errors and potential issues.

#### `yarn lint:js:fix` and `yarn lint:css:fix`
  
Formatting syntax errors automatically.

For more commands, please see the scripts in [package.json](package.json) file.


## .env files

It enables you to create custom Node environment variables that are embedded during the build time.<br>
By default the files are loaded from the  `/dotenv` folder.<br>
Please refer to [Adding Custom Environment Variables](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables) for more info.
