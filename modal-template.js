var jade = require('jade/lib/runtime.js');module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="modal-overlay"><div class="modal-content js-modal">');
if ( (title))
{
buf.push('<h1 class="modal-title">' + escape((interp = title) == null ? '' : interp) + '</h1>');
}
buf.push('<div class="js-content"></div>');
if ( (buttons.length))
{
buf.push('<div class="modal-controls">');
// iterate buttons
;(function(){
  if ('number' == typeof buttons.length) {

    for (var $index = 0, $$l = buttons.length; $index < $$l; $index++) {
      var button = buttons[$index];

buf.push('<button');
buf.push(attrs({ "class": ('btn') + ' ' + ('js-button') + ' ' + (button.className) }, {"class":true}));
buf.push('>' + escape((interp = button.text) == null ? '' : interp) + '</button>');
    }

  } else {
    var $$l = 0;
    for (var $index in buttons) {
      $$l++;      var button = buttons[$index];

buf.push('<button');
buf.push(attrs({ "class": ('btn') + ' ' + ('js-button') + ' ' + (button.className) }, {"class":true}));
buf.push('>' + escape((interp = button.text) == null ? '' : interp) + '</button>');
    }

  }
}).call(this);

buf.push('</div>');
}
buf.push('</div></div>');
}
return buf.join("");
}