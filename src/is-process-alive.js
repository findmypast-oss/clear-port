const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

/**
 * @param {number} pid
 * @returns {Promise<boolean>} True if process is alive, false if process is dead
 */
async function isProcessAlive(pid) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return getIsProcessAliveFromShell(process.platform, pid);
}

/**
 * @param {string} platform
 * @param {number} pid
 * @returns {Promise<boolean>} True if process is alive, false if process is dead
 */
async function getIsProcessAliveFromShell(platform, pid) {
  try {
    const commandToRun = getShellCommandForPlatform(platform, pid);
    const { stdout } = await exec(commandToRun);
    return getIsProcessAliveFromShellOutput(platform, stdout);
  } catch (e) {
    return false;
  }
}

/**
 * @param {string} platform
 * @param {string} shellOutput
 * @returns {boolean} True if process is alive, false if process is dead
 */
function getIsProcessAliveFromShellOutput(platform, shellOutput) {
  switch (platform) {
    case 'win32':
      return !shellOutput.includes('No tasks');
    default:
      return shellOutput.split('\n').length > 1;
  }
}

/**
 * @param {string} platform
 * @param {number} pid
 * @returns {string} Shell command that gets PID information for platform
 */
function getShellCommandForPlatform(platform, pid) {
  switch (platform) {
    case 'win32':
      return `tasklist /FI "PID eq ${pid}"`;
    default:
      return `ps -p ${pid}`;
  }
}

module.exports = { getIsProcessAliveFromShellOutput, isProcessAlive };
