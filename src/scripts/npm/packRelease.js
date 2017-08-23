const archiver = require('archiver')
const fs = require('fs')
const config = require('./config')
const generateFiles = require('./generateFiles')

function buildArtifacts () {
  const archive = archiver('tar', {
    gzip: true,
    gzipOptions: {
      level: 1
    }
  })

  console.log('Building artifacts...')

  archive.on('error', err => console.error('Failed to build artifact: ', err))
  archive.on('end', () => console.log('Artifacts successfully built.'))

  config.TGZ.FILES.forEach(file => {
    if (file.src) {
      archive.file(file.src, {name: file.dst})
    } else if (file.glob) {
      archive.glob(file.glob, {cwd: config.DIST_DIR})
    } else {
      throw new Error('Invalid configuration file. Please check config.js.')
    }
  })

  config.TGZ.DIRECTORIES.forEach(directory =>
    archive.directory(directory.src, directory.dst)
  )

  archive.pipe(fs.createWriteStream(config.TGZ.OUTPUT_FILE_PATH))

  archive.finalize()
}

generateFiles()
  .then(buildArtifacts)
