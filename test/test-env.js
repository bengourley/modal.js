var jsdom = require('jsdom')
require('./register-jade-extension')

var window = global.window = jsdom.jsdom().createWindow('<html><body></body></html>')

window.jQuery = global.jQuery = global.$ = require('jquery').create(window)
window._ = global._ = require('underscore')
global.document = window.document
window.Backbone = global.Backbone = require('backbone')
window.Backbone.$ = window.jQuery
window.Backbone._ = window._

global.addEventListener = window.addEventListener
