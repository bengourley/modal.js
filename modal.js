module.exports = modal

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
 *       - className (string) the className to apply to the button
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
 *       [ { text: 'Don\'t delete', event: 'cancel', className: '' }
 *       , { text: 'Delete', event: 'confirm', className: 'danger' }
 *       ]
 *     })
 *     .on('confirm', deleteItem)
 */


var template = require('./modal-template')
  , Emitter = require('events').EventEmitter
  , defaults =
    { title: 'Are you sure?'
    , content: 'Please confirm this action.'
    , buttons:
      [ { text: 'Cancel', event: 'cancel', className: '', keyCodes: [ 27 ] }
      , { text: 'Confirm', event: 'confirm', className: 'btn-primary' }
      ]
    , clickOutsideToClose: true
    , clickOutsideEvent: 'cancel'
    , className: ''
    }

function modal(options) {
  return new Modal($.extend({}, defaults, options))
}

function Modal(settings) {

  var el = $(template(settings))
    , modal = el.find('.js-modal')
    , content = el.find('.js-content')
    , buttons = el.find('.js-button')
    , keys = {}

  if (typeof settings.content === 'string') {
    content.append($('<p/>', { text: settings.content }))
  } else {
    content.append(settings.content)
  }

  modal.addClass(settings.className)

  // Cache the button shortcut keycodes
  $.each(settings.buttons, function (i, button) {
    if (!button.keyCodes) return
    $.each(button.keyCodes, function (n, keyCode) {
      keys[keyCode + ''] = i
    })
  })

  /*
   * Reposition the modal in the middle of the screen
   */
  function handleResize() {
    if (modal.outerHeight(true) < window.innerHeight) {
      var diff = window.innerHeight - modal.outerHeight(true)
      modal.css({ top: diff / 2 })
    }
  }

  /*
   * Remove a modal from the DOM
   * and tear down its related events
   */
  var removeModal = $.proxy(function () {
    el.transition({ opacity: 0 }, 200, function () {
      el.remove()
    })
    modal.transition({ top: window.innerHeight }, 200)
    this.removeAllListeners()
    $(document).off('keyup', keyup)
    $(window).off('resize', handleResize)
  }, this)
  
  // Expose so you can control externally
  this.close = removeModal

  /*
   * Respond to a key event
   */
  var keyup = $.proxy(function (e) {
    var button = keys[e.keyCode + '']
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
  modal.css({ top: '0%' })

  // Append to DOM
  $('body').append(el)

  // transition in
  el.transition({ opacity: 1 }, 100)

  if (modal.outerHeight(true) < window.innerHeight) {
    var diff = window.innerHeight - modal.outerHeight(true)
    modal.transition({ top: (diff / 2) + 10 }, 200, function () {
      modal.transition({ top: diff / 2 }, 150)
    })
  }

  $(window).on('resize', handleResize)

}

// Be an emitter
Modal.prototype = new Emitter()
