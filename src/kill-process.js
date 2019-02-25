const { promisify } = require('util');
const { isProcessAlive } = require('./is-process-alive');
const kill = promisify(require('tree-kill'));

module.exports = async function killProcess(pid) {
  if (pid === 0) {
    return; // pid 0 is just an idle connection, we can't kill it!
  } else {
    try {
      await kill(pid, 'SIGTERM');
      if (await isProcessAlive(pid)) {
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
