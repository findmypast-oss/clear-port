const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

/**
 * @param {number} port
 * @returns {Promise<number|undefined>} The process ID that is hogging given port, or undefined if no process is hogging that port
 */
async function pidForPort(port) {
  return getPidFromNetstat(process.platform, port);
}

/**
 * @param {string} platform
 * @param {number} port
 * @returns {Promise<number|undefined>} The process ID that is hogging given port, or undefined if no process is hogging that port
 */
async function getPidFromNetstat(platform, port) {
  try {
    const commandToRun = getNetstatCommandForPlatform(platform, port);
    const { stdout } = await exec(commandToRun);
    return getPidFromNetstatOutput(platform, stdout);
  } catch (e) {
    return undefined;
  }
}

/**
 * @param {string} platform
 * @param {string} commandOutput
 * @returns {number} The process ID that is hogging given port, according to netstat
 */
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

/**
 * @param {string} platform
 * @param {number} port
 * @returns {string} The netstat command that contains process information for given port
 */
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

/**
 * @typedef {Object} NetstatFormat
 * @property {number} columnIndex The column index that pid appears
 * @property {number} rowIndex The row index that pid appears
 */

/**
 * @param {string} platform
 * @returns {NetstatFormat} The location of the PID information for given platform
 */
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
