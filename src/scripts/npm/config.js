const path = require('path')

const ROOT_DIR = path.resolve(__dirname, '../../..')
const DIST_DIR = `${ROOT_DIR}/dist`
const ASSETS_DIR = `${ROOT_DIR}/src/assets`
const NODE_MODULES = `${ROOT_DIR}/node_modules`

const INDEX = `${ROOT_DIR}/src/index.html`
const INDEX_NAME = 'index.html'
const BUNDLE_COMPILED_NAME = 'swagger-ui-bundle.js'
const STANDALONE_PRESET_COMPILED_NAME = 'swagger-ui-standalone-preset.js'
const STYLES_COMPILED_NAME = 'swagger-ui.css'

module.exports = {
  ROOT_DIR,
  DIST_DIR,
  ASSETS_DIR,
  NODE_MODULES,

  INDEX,
  INDEX_NAME,
  BUNDLE_COMPILED_NAME,
  STANDALONE_PRESET_COMPILED_NAME,
  STYLES_COMPILED_NAME,

  VERSION_COMPILED: `${DIST_DIR}/assets/version/info.json`,

  TGZ: {
    FILES: [
      {
        src: INDEX,
        dst: INDEX_NAME
      },
      {
        glob: `${BUNDLE_COMPILED_NAME}?(.map)`
      },
      {
        glob: `${STANDALONE_PRESET_COMPILED_NAME}?(.map)`
      },
      {
        glob: `${STYLES_COMPILED_NAME}?(.map)`
      }
    ],
    DIRECTORIES: [
      {
        src: ASSETS_DIR,
        dst: '.'
      }
    ],
    OUTPUT_FILE_PATH: `${DIST_DIR}/swagger-ui.tgz`
  }
}
