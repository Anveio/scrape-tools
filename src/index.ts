import { fork } from 'child_process';

process.argv.slice(2).forEach(url => {
  const childProcess = fork('./src/processes/argvHandler.ts');
  childProcess.send(url);
  childProcess.on('disconnect', () => `Finished downloading ${url}`);
});
