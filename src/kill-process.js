const { promisify } = require('util');
const { isProcessAlive } = require('./is-process-alive');
const kill = promisify(require('tree-kill'));

/**
 * Kills the process with the given identifier
 *
 * @param {number} pid
 * @returns {Promise<void>}
 */
module.exports = async function killProcess(pid) {
  if (pid === 0) {
    return; // pid 0 is just an idle connection, we can't kill it!
  } else {
    try {
      // @ts-ignore This is correct
      await kill(pid, 'SIGTERM');
      if (await isProcessAlive(pid)) {
        // @ts-ignore This is correct
        await kill(pid, 'SIGKILL');
        if (await isProcessAlive(pid)) {
          throw new Error();
        }
      }
    } catch (e) {
      throw new Error(
        `Failed to terminate or kill process ${pid}. Please terminate this process and try again`
      );
    }
  }
};
