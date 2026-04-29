const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'startup_log.txt');
const stream = fs.createWriteStream(logPath);

console.log('Starting Node Server...');
const proc = exec('node server.js', { cwd: __dirname });

proc.stdout.on('data', (data) => {
    stream.write(`STDOUT: ${data}\n`);
    console.log(data);
});

proc.stderr.on('data', (data) => {
    stream.write(`STDERR: ${data}\n`);
    console.error(data);
});

proc.on('close', (code) => {
    stream.write(`Process exited with code ${code}\n`);
    stream.end();
});
