const outputFile = require('output-file');
const gitsha = require('git-sha');

const config = require('./config');

function generateVersionInfo() {
    console.log('Generating Version Info...');

    return new Promise((resolve, reject) => {
        gitsha((err, sha) => {
            if (err) {
                reject(err);
            } else {
                const versionInfo = {
                    'source_commit': sha.trim(),
                    'build_number': process.env.BUILD_NUMBER,
                    'build_time': new Date().toISOString()
                };

                outputFile(
                    config.VERSION_COMPILED,
                    `${JSON.stringify(versionInfo, null, ' ')}`,
                    err => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }
                );
            }
        });
    }).then(
        () => console.log('Generated Version Info'),
        err => console.error('Unable to generate Version Info', err)
    );
}

module.exports = function () {
    return Promise.all([
        generateVersionInfo()
    ]);
};
