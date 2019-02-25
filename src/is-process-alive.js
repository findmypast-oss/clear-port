const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

async function isProcessAlive(pid) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return getIsProcessAliveFromShell(process.platform, pid);
}

async function getIsProcessAliveFromShell(platform, pid) {
  try {
    const commandToRun = getShellCommandForPlatform(platform, pid);
    const { stdout } = await exec(commandToRun);
    return getIsProcessAliveFromShellOutput(platform, stdout);
  } catch (e) {
    return false;
  }
}

function getIsProcessAliveFromShellOutput(platform, shellOutput) {
  switch (platform) {
    case 'win32':
      return !shellOutput.includes('No tasks');
    default:
      return shellOutput.split('\n').length > 1;
  }
}

function getShellCommandForPlatform(platform, pid) {
  switch (platform) {
    case 'win32':
      return `tasklist /FI "PID eq ${pid}"`;
    default:
      return `ps -p ${pid}`;
  }
}

module.exports = { getIsProcessAliveFromShellOutput, isProcessAlive };
