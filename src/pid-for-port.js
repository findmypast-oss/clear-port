const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

async function pidForPort(port) {
  return getPidFromNetstat(process.platform, port);
}

async function getPidFromNetstat(platform, port) {
  try {
    const commandToRun = getNetstatCommandForPlatform(platform, port);
    const { stdout } = await exec(commandToRun);
    return getPidFromNetstatOutput(platform, stdout);
  } catch (e) {
    return undefined;
  }
}

function getPidFromNetstatOutput(platform, commandOutput) {
  const netstatFormat = netstatFormatPerPlatform(platform);
  const lines = commandOutput.split('\n');
  const line = lines[netstatFormat.rowIndex];
  const columns = line
    .split(/\s+/)
    .map(c => c.trim())
    .filter(c => {
      return c != '';
    });
  const column = columns[netstatFormat.columnIndex];
  return parseInt(column);
}

function getNetstatCommandForPlatform(platform, port) {
  switch (platform) {
    case 'win32':
      return `netstat -aon | find ":${port} "`;
    case 'darwin':
      return `lsof -i tcp:${port}`;
    default:
      return `netstat -nlp | grep ":${port}[[:space:]]"`;
  }
}

function netstatFormatPerPlatform(platform) {
  switch (platform) {
    case 'win32':
      return {
        columnIndex: 4,
        rowIndex: 0,
      };
    case 'darwin':
      return {
        columnIndex: 1,
        rowIndex: 1,
      };
    default:
      return {
        columnIndex: 6,
        rowIndex: 0,
      };
  }
}

module.exports = { getPidFromNetstatOutput, pidForPort };
