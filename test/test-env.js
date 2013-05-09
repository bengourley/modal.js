var jsdom = require('jsdom')

var window = global.window = jsdom.jsdom().createWindow('<html><body></body></html>')

window.jQuery = global.jQuery = global.$ = require('jquery').create(window)
global.document = window.document