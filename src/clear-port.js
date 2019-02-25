const { pidForPort } = require('./pid-for-port');
const killProcess = require('./kill-process');

/**
 * Kills the process that is hogging the given port number
 *
 * @param {number} port
 * @returns {Promise<void>}
 */
module.exports = async function clearPort(port) {
  let pid;
  try {
    pid = await pidForPort(port);
  } catch (e) {
    return;
  }

  if (pid) {
    console.log(`PID ${pid} running on port ${port}. Attempting to kill.`);
    await killProcess(pid);
  }
};
