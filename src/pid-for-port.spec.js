const { getPidFromNetstatOutput } = require('./pid-for-port');

describe('getPidFromNetstatOutput', () => {
  it('when passed the output from win32 netstat finds the process id', () => {
    const output =
      `TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       16272\n` +
      `TCP    [::]:3000              [::]:0                 LISTENING       16272`;

    expect(getPidFromNetstatOutput('win32', output)).toBe(16272);
  });
  it('when passed the output from linux netstat finds the process id', () => {
    const output = `tcp6       0      0 :::6666                 :::*                    LISTEN      5964/node\n`;

    expect(getPidFromNetstatOutput('linux', output)).toBe(5964);
  });
  it('when passed the output from mac netstat finds the process id', () => {
    const output =
      `COMMAND   PID     USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME\n` +
      `node    76130 emcdonald   13u  IPv6 0x525d4c7b2fc78921      0t0  TCP *:hbci (LISTEN)`;

    expect(getPidFromNetstatOutput('darwin', output)).toBe(76130);
  });
});
