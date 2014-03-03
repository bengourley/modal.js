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
 *       - keyCodes ([numbers]) the keycodes of shortcuts key for the button
 *       - clickOutsideToClose (boolean) whether a click event outside of the modal should close it
 *       - clickOutsideEvent (string) the name of the event to be triggered on clicks outside of the modal
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

var Emitter = require('events').EventEmitter
  , template = require('./modal-template')

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
    , fx: true // used for testing
    }

function modal(options) {
  return new Modal($.extend({}, defaults, options))
}

function Modal(settings) {

  Emitter.call(this)

  var el = $(template(settings))
    , modal = el.find('.js-modal')
    , content = el.find('.js-content')
    , buttons = el.find('.js-button')
    , keys = {}
    , transitionFn = $.fn.transition ? 'transition' : 'animate'

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
  function centre() {
    if (modal.outerHeight(true) < $(window).height()) {
      var diff = $(window).height() - modal.outerHeight(true)
      modal.css({ top: diff / 2 })
    }
  }

  /*
   * Remove a modal from the DOM
   * and tear down its related events
   */
  var removeModal = $.proxy(function () {
    var listenersWithCallback = 0

    $.each(this.listeners('beforeClose'), function(i, fn) {
      if (isFunctionWithArguments(fn)) {
        listenersWithCallback++
      }
    })

    if (listenersWithCallback > 0) {
      var currentCallsCount = 0
        , performClose = function() {
          if (++currentCallsCount === listenersWithCallback) {
            performRemoveModal()
          }
        }
      this.emit('beforeClose', performClose)
    } else {
      this.emit('beforeClose')
      performRemoveModal()
    }
  }, this)

  function isFunctionWithArguments(fn) {
    return fn.length > 0
  }

  var performRemoveModal = $.proxy(function () {
    el[transitionFn]({ opacity: 0 }, settings.fx ? 200 : 0)
    // Do setTimeout rather than using the transition
    // callback as it potentially fails to get called in IE10
    setTimeout(function () {
      el.remove()
    }, settings.fx ? 200 : 0)
    modal[transitionFn]({ top: $(window).height() }, settings.fx ? 200 : 0)
    this.emit('close')
    this.removeAllListeners()
    $(document).off('keyup', keyup)
    $(window).off('resize', centre)
  }, this)

  // Expose so you can control externally
  this.close = function() {
    removeModal()
  }

  // Expose so you can recentre externally
  this.centre = centre

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

  // Listen for clicks outside the modal
  el.on('click', $.proxy(function (e) {
    if ($(e.target).is(el)) {
      this.emit(settings.clickOutsideEvent)
      // Clicks outside should close?
      if (settings.clickOutsideToClose) {
        removeModal()
      }
    }
  }, this))

  // Set initial styles
  el.css({ opacity: 0 })
  modal.css({ top: '0%' })

  // Append to DOM
  $('body').append(el)

  // transition in
  el[transitionFn]({ opacity: 1 }, settings.fx ? 100 : 0)

  if (modal.outerHeight(true) < $(window).height()) {
    var diff = $(window).height() - modal.outerHeight(true)
    modal[transitionFn]({ top: (diff / 2) + 10 }, settings.fx ? 200 : 0, function () {
      modal[transitionFn]({ top: diff / 2 }, settings.fx ? 150 : 0)
    })
  }

  $(window).on('resize', centre)

}

// Be an emitter
Modal.prototype = Emitter.prototype
