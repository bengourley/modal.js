require('./test-env')

var modal = require('..')
  , assert = require('assert')

describe('modal', function () {

  afterEach(function () {
    $('body').empty()
  })

  describe('modal()', function () {

    it('should be a function', function () {
      assert.equal(typeof modal, 'function')
    })

    it('should append one modal element to the DOM when called', function () {
      modal({ fx: false })
      assert.equal($('.modal-overlay').length, 1)
    })

  })

  describe('template()', function () {

    describe('title', function () {

      it('should render a title if supplied', function () {
        modal({ fx: false, title: 'This is a test' })
        assert.equal($('.modal-title').text(), 'This is a test')
      })

      it('should not render a title element it falsy (\'\')', function () {
        modal({ fx: false, title: '' })
        assert.equal($('.modal-title').length, 0)
      })

      it('should not render a title element it falsy (false)', function () {
        modal({ fx: false, title: false })
        assert.equal($('.modal-title').length, 0)
      })

      it('should render a default title if none supplied', function () {
        modal({ fx: false })
        assert.equal($('.modal-title').text(), 'Are you sure?')
      })

    })

    describe('content', function () {

      it('should render content wrapped in a <p> if passed as a string', function () {
        modal({ fx: false, content: 'This is a test' })
        var $el = $('.js-content p')
        assert.equal($el.length, 1)
        assert.equal($el.text(), 'This is a test')
      })

      it('should just append content that is not a string (e.g DOM)', function () {
        var $bq = $('<blockquote/>').text('This is a different test')
        modal({ fx: false, content: $bq })
        var $el = $('.js-content blockquote')
        assert.equal($el.length, 1)
        assert.equal($el.text(), 'This is a different test')
        assert.equal($bq[0], $el[0])
      })

    })

    describe('controls', function () {

      it('should not render the controls element if no buttons are passed', function () {
        var buttons = []
        modal({ fx: false, buttons: buttons })
        assert.equal($('.modal-controls').length, 0)
      })

      it('should render the correct number of buttons', function () {
        var buttons = [ { text: 'Confirm' }, { text: 'Cancel' } ]
        modal({ fx: false, buttons: buttons })
        assert.equal($('.js-button').length, 2)
      })

      it('should display the correct text', function () {
        var buttons = [ { text: 'Button 1' }, { text: 'Button 2' } ]
        modal({ fx: false, buttons: buttons })
        $('.js-button').each(function (i) {
          assert.equal($(this).text(), buttons[i].text)
        })
      })

      it('should add the correct button classes', function () {
        var buttons =
          [ { text: 'Button 1', className: 'one-class' }
          , { text: 'Button 2', className: 'multiple classes' }
          ]
        modal({ fx: false, buttons: buttons })
        assert($('.js-button').eq(0).hasClass('one-class'))
        assert($('.js-button').eq(1).hasClass('multiple'))
        assert($('.js-button').eq(1).hasClass('classes'))
      })

      it ('should have no button icon by default', function (done) {
        modal({ fx: false })
        assert.equal($('.modal-overlay').length, 1)
        setTimeout(function () {
          assert.equal($('i').length, 0)
          done()
        }, 0)
      })

      it ('should add button icons with the correct classes', function () {
        var buttons =
          [ { text: 'Button 1', iconClassName: 'one-class' }
          , { text: 'Button 2', iconClassName: 'multiple classes' }
          ]
        modal({ fx: false, buttons: buttons })
        assert($('i').eq(0).hasClass('one-class'))
        assert($('i').eq(1).hasClass('multiple'))
        assert($('i').eq(1).hasClass('classes'))
      })

    })

  })

  describe('close()', function () {

    it('should remove the modal', function (done) {
      var m = modal({ fx: false })
      assert.equal($('.modal-overlay').length, 1)
      m.close()
      setTimeout(function () {
        assert.equal($('.modal-overlay').length, 0)
        done()
      }, 0)
    })

    it('should emit a close event', function (done) {
      var m = modal({ fx: false })
      m.on('close', function () {
        done()
      })
      m.close()
    })

    it('should emit a beforeClose event', function (done) {
      var m = modal({ fx: false })
        , beforeCloseCalled = false
      m.on('beforeClose', function () {
        beforeCloseCalled = true
      })
      m.on('close', function () {
        assert(beforeCloseCalled)
        done()
      })
      m.close()
    })

    it('should not close until all beforeClose listeners that accept a callback complete', function (done) {
      var m = modal({ fx: false })
        , beforeCloseCbCount = 0
        , beforeCloseHandler = function (cb) {
            setTimeout(function() {
              beforeCloseCbCount++
              cb()
            }, 100)
          }

      m.on('beforeClose', beforeCloseHandler)
      m.on('beforeClose', beforeCloseHandler)
      m.on('beforeClose', beforeCloseHandler)

      m.on('close', function () {
        assert.equal(beforeCloseCbCount, 3)
        done()
      })
      m.close()
    })

    it('should not wait for beforeClose callbacks for listeners that don’t accept them', function (done) {
      var m = modal({ fx: false })
        , beforeCloseCbCount = 0
        , beforeCloseHandlerWithoutCallback = function () {
          setTimeout(function() {
            beforeCloseCbCount++
          }, 100)
        }
        , beforeCloseHandlerWithCallback = function (cb) {
          setTimeout(function() {
            beforeCloseCbCount++
            cb()
          }, 50)
        }

      m.on('beforeClose', beforeCloseHandlerWithCallback)
      m.on('beforeClose', beforeCloseHandlerWithCallback)
      m.on('beforeClose', beforeCloseHandlerWithoutCallback)
      m.on('beforeClose', beforeCloseHandlerWithoutCallback)

      m.on('close', function () {
        assert.equal(beforeCloseCbCount, 2)
        done()
      })
      m.close()
    })

    it('should use .detach() if specified as the "remove" method', function (done) {
      var $el = $('<div/>').on('click', function () { done() })
        , m = modal({ fx: false, removeMethod: 'detach', content: $el })

      m.on('close', function () {
        setTimeout(function () { $el.click() }, 1)
      })

      m.close()

    })

  })

  describe('centre()', function () {

    it('should centre to window height', function () {
      var m = modal({ fx: false })
      assert.equal(typeof m.centre, 'function')

      // jQuery requires a bit of persuasion the window really
      // is 1000px tall, hence these two assignments
      window.innerHeight = document.documentElement.clientHeight = 1000

      $('.modal-content').height(100)
      assert.equal($('.modal-content').outerHeight(), 100)
      $('.modal-content').css('top', 0)

      m.centre()

      assert.equal($('.modal-content').css('top'), '450px')
    })

  })

  describe('handeResize()', function () {

    it('should maintain postion in the centre of the screen')

  })

  describe('option: className', function () {

    it('should apply a class to the modal element if passed', function () {
      modal({ fx: false, className: 'my-custom-modal-class' })
      assert($('.js-modal').hasClass('my-custom-modal-class'))
    })

    it('should allow multiple classes (space delimited)', function () {
      modal({ fx: false, className: 'my-custom-modal-class my-other-class' })
      assert($('.js-modal').hasClass('my-custom-modal-class'))
      assert($('.js-modal').hasClass('my-other-class'))
    })

  })

  describe('option: clickOutsideToClose', function () {

    it ('should close the modal if set to true', function (done) {
      modal({ fx: false, clickOutsideToClose: true })
      assert.equal($('.modal-overlay').length, 1)
      $('.modal-overlay').click()
      setTimeout(function () {
        assert.equal($('.modal-overlay').length, 0)
        done()
      }, 0)
    })

    it('should not close the modal if set to false', function (done) {
      modal({ fx: false, clickOutsideToClose: false })
      assert.equal($('.modal-overlay').length, 1)
      $('.modal-overlay').click()
      setTimeout(function () {
        assert.equal($('.modal-overlay').length, 1)
        done()
      }, 1)
    })

    it ('should be true by default', function (done) {
      modal({ fx: false })
      assert.equal($('.modal-overlay').length, 1)
      $('.modal-overlay').click()
      setTimeout(function () {
        assert.equal($('.modal-overlay').length, 0)
        done()
      }, 0)
    })

  })

  describe('option: clickOutsideEvent', function () {

    it('should be fired when a click happens outside the modal', function (done) {
      modal({ fx: false, clickOutsideEvent: 'test' }).on('test', function () {
        done()
      })
      $('.modal-overlay').click()
    })

    it ('should be "cancel" by default', function (done) {
      modal({ fx: false }).on('cancel', function () {
        done()
      })
      $('.modal-overlay').click()
    })

  })

  describe('option: buttons', function () {

    it('should trigger the provided event', function (done) {

      modal(
        { fx: false
        , buttons: [ { text: 'Go', event: 'go' } ]
        }).on('go', function () {
          done()
        })
      $('.js-button').click()

    })

    it('should hook up buttons to keyup events if provided', function (done) {
      modal(
        { fx: false
        , buttons: [ { text: 'Stop', event: 'stop', keyCodes: [ 27 ] } ]
        }).on('stop', function () {
          done()
        })

      $(document).trigger({ type: 'keyup', keyCode: 27 })

    })

    it('should have defaults', function (done) {
      var i = 0
      function cb() {
        if (++i === 3) return done()
        setTimeout(fns[i], 10)
      }
      var fns =
      [ function () {
          modal({ fx: false }).on('cancel', cb)
          $('.js-button').eq(0).click()
        }
      , function () {
          modal({ fx: false }).on('confirm', cb)
          $('.js-button').eq(1).click()
        }
      , function () {
          modal({ fx: false }).on('cancel', cb)
          $(document).trigger({ type: 'keyup', keyCode: 27 })
        }
      ]

      fns[0]()

    })

  })

})
