# Modal

A modal window for the browser.

This module provides generic modal dialog functionality
for blocking the UI and obtaining user input.

## Note:
You need to 'require' this module in a commonJS style environment, and
you need to be able to require the things with the .jade extension. I use
[browserify](https://github.com/substack/browserify) to do this.


## Usage

```
modal([options])[.on('event')]
```

### Options

- title (string)
- content (jQuery DOM element / raw string)
- buttons (array)
  - text (string) the button text
  - event (string) the event name to fire when the button is clicked
  - className (string) the className to apply to the button
  - iconClassName (string) adds an `i` element before button text with the given class(es)
  - keyCodes ([numbers]) the keycodes of shortcuts keys for the button
- clickOutsideToClose (boolean) whether a click event outside of the modal should close it
- clickOutsideEvent (string) the name of the event to be triggered on clicks outside of the modal
- className (string) optional class to apply to the modal element
- removeMethod (string) which jQuery method to remove the modal contents with (default: remove)
    This is useful when you want to append the contents to the DOM again later. In which case
    set this to 'detach' so that bound event handlers on your content area aren't removed.

Events will be fired on the modal according to which button is clicked.
Defaults are confirm/cancel, but these can be overriden in your options.

### Example

```js
modal(
  { title: 'Delete object'
  , content: 'Are you sure you want to delete this object?'
  , buttons:
    [ { text: 'Don’t delete', event: 'cancel', keyCodes: [ 27 ] }
    , { text: 'Delete', event: 'confirm', className: 'button-danger', iconClassName: 'icon-delete' }
    ]
  })
  .on('confirm', deleteItem)
```
