module.exports = tasks

var jadeify = require('jadeify2')
  , join = require('path').join
  , fs = require('fs')

function tasks(pliers) {

  pliers('build', function () {

    var readStream = fs.createReadStream(join(__dirname, 'modal-template.jade'))
      , writeSteam = fs.createWriteStream(join(__dirname, 'modal-template.js'))

    readStream.pipe(jadeify(join(__dirname, 'modal-template.jade'))).pipe(writeSteam)

  })

}