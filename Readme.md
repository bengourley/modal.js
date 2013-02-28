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
  - classname (string) the classname to apply to the button
  - keyCode (number) the keycode of a shortcut key for the button
  - clickOutsideToClose (boolean) whether a click event outside of the modal should close it
  - clickOutsideEvent (string) the name of the event to be triggered on clicks outside of the modal

Events will be fired on the modal according to which button is clicked.
Defaults are confirm/cancel, but these can be overriden in your options.

### Example

```js
modal(
  { title: 'Delete object'
  , content: 'Are you sure you want to delete this object?'
  , buttons:
    [ { text: 'Don\'t delete', event: 'cancel', classname: '' }
    , { text: 'Delete', event: 'confirm', classname: 'danger' }
    ]
  })
  .on('confirm', deleteItem)
```
