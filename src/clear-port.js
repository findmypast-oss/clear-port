const { pidForPort } = require('./pid-for-port');
const killProcess = require('./kill-process');

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
