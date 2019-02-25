const { getIsProcessAliveFromShellOutput } = require('./is-process-alive');

describe('getIsProcessAliveFromShellOutput', () => {
  it('when passed the output from win32 shell determines process is alive', () => {
    const output =
      `Image Name                     PID Session Name        Session#    Mem Usage` +
      `========================= ======== ================ =========== ============` +
      `WmiPrvSE.exe                  8736 Services                   0      9,896 K`;
    expect(getIsProcessAliveFromShellOutput('win32', output)).toBe(true);
  });
  it('when passed the output from win32 shell determines process is dead', () => {
    const output = `INFO: No tasks are running which match the specified criteria.`;
    expect(getIsProcessAliveFromShellOutput('win32', output)).toBe(false);
  });
  it('when passed the output from linux shell determines process is alive', () => {
    const output =
      `  PID TTY           TIME CMD\n` + `63231 ttys002    0:00.00 (node)`;
    expect(getIsProcessAliveFromShellOutput('linux', output)).toBe(true);
  });
  it('when passed the output from linux shell determines process is dead', () => {
    const output = `  PID TTY           TIME CMD`;
    expect(getIsProcessAliveFromShellOutput('linux', output)).toBe(false);
  });
  it('when passed the output from darwin shell determines process is alive', () => {
    const output =
      `  PID TTY           TIME CMD\n` + `63231 ttys002    0:00.00 (node)`;
    expect(getIsProcessAliveFromShellOutput('darwin', output)).toBe(true);
  });
  it('when passed the output from darwin shell determines process is dead', () => {
    const output = `  PID TTY           TIME CMD`;
    expect(getIsProcessAliveFromShellOutput('darwin', output)).toBe(false);
  });
});
