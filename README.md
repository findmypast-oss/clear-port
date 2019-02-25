# clear-port

This package will kill any process hogging the given port.

## Installation

This package is available on [npm](https://www.npmjs.com/package/clear-port). It
can be installed using the package manager of your choice:

```bash
# via npm
npm i clear-port

# via yarn
yarn add clear-port
```

## Usage

There is a single exported function for this package. It simply takes the port
number you wish to clear, as such:

```js
const clearPort = require("clear-port");

// where you wish to clear port number 1234
await clearPort(1234);
```
