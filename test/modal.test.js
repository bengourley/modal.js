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

    it('should trigger the provided event')
    it('should hook up buttons to keyup events if provided')
    it('should have defaults')

  })

})