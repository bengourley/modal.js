# Modal

A modal window for the browser.

You need to 'require' this module in a commonJS style environment, and
you need to be able to require the things with the .jade extension.

----

This module provides generic modal dialog functionality
for blocking the UI and obtaining user input.

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

Events will be fired on the modal according to which button is clicked.
Defaults are confirm/cancel, but these can be overriden in your options.

### Example

```js
modal(
  { title: 'Delete object'
  , content: 'Are you sure you want to delete this object?'
  , buttons:
    [ { text: 'Don\'t delete', event: 'cancel', classname: '' } 
    , { text: 'Delete', event: 'confirm', classname: 'danger' } ]
  })
  .on('confirm', deleteItem)
```
