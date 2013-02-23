module.exports = modal

var template = require('./modal-template')

/*
 * This module provides generic modal dialog functionality
 * for blocking the UI and obtaining user input.
 *
 * Usage:
 *
 *   modal([options])
 *     [.on('event')]...
 *
 *   options:
 *     - title (string)
 *     - content (jQuery DOM element / raw string)
 *     - buttons (array)
 *       - text (string) the button text
 *       - event (string) the event name to fire when the button is clicked
 *       - classname (string) the classname to apply to the button
 *       - keyCode (number) the keycode of a shortcut key for the button
 *
 *  Events will be fired on the modal according to which button is clicked.
 *  Defaults are confirm/cancel, but these can be overriden in your options.
 *
 *  Example:
 *
 *   modal(
 *     { title: 'Delete object'
 *     , content: 'Are you sure you want to delete this object?'
 *     , buttons:
 *       [ { text: 'Don\'t delete', event: 'cancel', classname: '' } ]
 *       , { text: 'Delete', event: 'confirm', classname: 'danger' } ]
 *     })
 *     .on('confirm', deleteItem)
 */

var Emitter = require('events').EventEmitter

  , defaults =
    { title: 'Are you sure?'
    , content: 'Please confirm this action.'
    , buttons:
      [ { text: 'Cancel', event: 'cancel', classname: '', keyCodes: [ 27 ] }
      , { text: 'Confirm', event: 'confirm', classname: 'btn-primary' }
      ]
    , clickOutsideToClose: true
    , clickOutsideEvent: 'cancel'
    , modalClass: ''
    }

function modal(options) {
  return new Modal($.extend({}, defaults, options))
}

function Modal(settings) {

  var el = $(template(settings))
    , dialog = el.find('.js-modal-content')
    , content = el.find('.js-content')
    , buttons = el.find('.js-button')
    , keys = {}

  if (typeof settings.content === 'string') {
    content.append($('<p/>', { text: settings.content }))
  } else {
    content.append(settings.content)
  }

  dialog.addClass(settings.modalClass)

  // Cache the button shortcut keycodes
  $.each(settings.buttons, function (i, button) {
    if (!button.keyCodes) return
    $.each(button.keyCodes, function (keyCode) {
      keys[keyCode.toString()] = i
    })
  })

  /*
   * Remove a modal from the DOM
   * and tear down its related events
   */
  var removeModal = $.proxy(function () {
    el.transition({ opacity: 0 }, 200, function () {
      el.remove()
    })
    dialog.transition({ top: '100%' }, 200)
    this.removeAllListeners()
    $(document).off('keyup', keyup)
  }, this)
  
  // Expose so you can control externally
  this.close = removeModal

  /*
   * Respond to a key event
   */
  var keyup = $.proxy(function (e) {
    var button = keys[e.keyCode]
    if (typeof button !== 'undefined') {
      this.emit(settings.buttons[button].event)
      removeModal()
    }
  }, this)

  // Assign button event handlers
  buttons.each($.proxy(function (i, el) {
    $(el).on('click', $.proxy(function () {
      this.emit(settings.buttons[i].event)
      removeModal()
    }, this))
  }, this))

  $(document).on('keyup', keyup)

  // Listen for clicks outside the modal?
  if (settings.clickOutsideToClose) {
    el.on('click', $.proxy(function (e) {
      if ($(e.target).is(el)) {
        this.emit(settings.clickOutsideEvent)
        removeModal()
      }
    }, this))
  }

  // Set initial styles
  el.css({ opacity: 0 })
  dialog.css({ top: '0%' })

  // Append to DOM
  $('body').append(el)

  // transition in
  el.transition({ opacity: 1 }, 100)
  dialog.transition({ top: '52%' }, 200, function () {
    dialog.transition({ top: '50%' }, 150)
  })

}

// Be an emitter
Modal.prototype = new Emitter()
