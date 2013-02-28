var jade = require('jade')
  , fs = require('fs')

require.extensions['.jade'] = function (module, filename) {
  module.exports = jade.compile(fs.readFileSync(filename).toString(), { filename: filename })
}