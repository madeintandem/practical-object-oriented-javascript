Practical Object Oriented Javascript - CWC 2015 Workshop
========================================================

... or getting closure on thissues™.



What We Will Cover
------------------

 * JavaScript primer, is it functional? is it object oriented? is it funcject orientional?
 * First class functions
 * Closures
 * WTF is `this`?
 * Why is `this` that?
 * Seriously WTF is `this` and how do I force it to make sense
 * Managing scope
 * Building an autocomplete widget with the OO building blocks


First Class Functions
---------------------

 * Functions are values just like strings, numbers, arrays, and objects
 * Functions can be assigned to variables and passed as arguments
 * Functions can be manipulated as values
 * Functions can be dynamically created by other functions

Function Assignment

```js
var myFunction = function() {
  console.log("Hello World");
};

var myObject = {
  myMethod: function() {
    console.log("I'm a property of an object");
  }
};

myFunction();
myObject.myMethod();
```

Dynamic Function Assignment

```js
var greeterCreator = function(greeting) {
    return function(name) {
        console.log(greeting + " " + name);
    };
};

var helloGreeter = greeterCreator("Hello");

helloGreeter("Chicago Web Conf");
```

![Obligatory Mind Blown .gif](https://raw.githubusercontent.com/devmynd/practical-object-oriented-javascript/master/images/mind-blown.gif)

Scope
-----

`window` is the implicit global namespace. Leaked globals can be accessed on window.

Global variables are implied when assigned without the `var` keyword. Basically, you should **NEVER** assign a variable without the `var` keyword. It is otherwise very easy to leak a function's member variable to the global scope:

Leaked globals

```js
var foo = 5;
var bar = 10;

function logFoo() {
  foo = 15;
  var bar = 20;

  console.log("logFoo scope")
  console.log(foo, bar);
}

logFoo(); // 15, 20

console.log("global scope (window)")
console.log(foo, bar); // 15, 10
console.log(window.foo, window.bar); // 15, undefined
```

### Closures

 Closures are an immediately invoked function, which usually return a function that has access to privately scoped members of the containing function. The outer function “closes over” the returned function, hence the term closure. The only way to create private methods/variables in JavaScript is to use a closure (for now).


#### examples:

```js
var tellSecrets = function() {
  var secret = "shh, don’t tell anyone";
  return function() {
    console.log(secret);
  };
}();

tellSecrets();
console.log(secret); // undefined
```

Objects
-------

When we talk about Objects in JavaScript, we can be talking about 2 different things. The `Object` data type refers to a key-value pair; much like hashes, associative arrays, or maps in other languages. They are also refered to as JSON (javascript object notation) objects. Here are a few examples of simple JavaScript objects:

#### examples:

A basic object is a simple key-value store that can be arbitrarily nested:

```js
var person = {
  firstName: "Bob",
  lastName: "Ject",
  age: 33,
  address: {
    street: "123 Memory Ln",
    apt: "0x7fff9575c05f",
    zip: "01101",
    city: "Browser Town",
    state: "Mozilla"
  }
};
```

An object can have functions for properties (remember first class functions). When the property of an object is a function, we refer to these as methods:

```js
var person = {
  firstName: "Bob",
  lastName: "Ject",
  age: 33,
  address: {
    street: "123 Memory Ln",
    apt: "0x7fff9575c05f",
    zip: "01101",
    city: "Browser Town",
    state: "Mozilla"
  },
  sayHello: function() {
    console.log("Hi, my name is " + this.firstName + ". I live in " + this.address.city + ", on " + this.address.street + ".")
  }
};
```

### Instantiated Objects

When we talk about objects in traditional object-oriented programming, we are talking about classes and instances. JavaScript *does not have* a traditional Class model. In fact, it does not have a "Class" at all (until recently). "Classes" in JavaScript are created by taking advantage of some interesting features of functions in JavaScript. The `new` keyword and the `this` keyword allow us to mimic the functionality of traditional Classes and inheritance patterns.

To create a "Class" in javascript, you must first define a function. Since there are no formal "Classes", always capitalize a function intended to be used as a "Class". This function is considered the `constructor`, which means this function will be executed every time a new instance of this "Class" is created, with a new context. "Instance variables" for each instance of the object can be assinged by using the `this` keyword. These are really just properties of the instantiated object.

#### examples:

To instantiate a new instance of a "Class" use the `new` keyword:

```js
function Person(attributes) {
  this.firstName = attributes.firstName;
  this.lastName = attributes.lastName;
  this.age = attributes.age;
  this.address = attributes.address;
}

var bob = new Person({
  firstName: "Bob",
  lastName: "Ject",
  age: 33,
  address: {
    street: "123 Memory Ln",
    apt: "0x7fff9575c05f",
    zip: "01101",
    city: "Browser Town",
    state: "Mozilla"
  }
});
```

*Warning if you do not use the `new` keyword when you instantiate a new object, the function will still be executed, returning undefined and leaking any properties assigned to the global scope*:

```js
function Person(attributes) {
  this.firstName = attributes.firstName;
  this.lastName = attributes.lastName;
  this.age = attributes.age;
  this.address = attributes.address;
}

var bob = Person({
  firstName: "Bob",
  lastName: "Ject",
  age: 33,
  address: {
    street: "123 Memory Ln",
    apt: "0x7fff9575c05f",
    zip: "01101",
    city: "Browser Town",
    state: "Mozilla"
  }
});

console.log(bob); // undefined
console.log(window.firstName); // "Bob"
console.log(window.lastName); // "Ject"
console.log(window.age); // 33
console.log(window.address); // [object Object] (address object)
```

### Instance Methods

To define instance methods the right way, we assign functions to the "Class" `prototype`. The `prototype` is an `Object` (the JSON kind) that contains the methods that each instance will share. Every instance can share these same methods because when called, they will be called in the context of that instance:

```js
function Person(attributes) {
  this.firstName = attributes.firstName;
  this.lastName = attributes.lastName;
  this.age = attributes.age;
  this.address = attributes.address;
}

Person.prototype.sayHello = function() {
  console.log("Hi, my name is " + this.firstName + ". I live in " + this.address.city + ", " + this.address.state + " on " + this.address.street + ".");
};

var bob = new Person({
  firstName: "Bob",
  lastName: "Ject",
  age: 33,
  address: {
    street: "123 Memory Ln",
    apt: "0x7fff9575c05f",
    zip: "01101",
    city: "Browser Town",
    state: "Mozilla"
  }
});

var ella = new Person({
  firstName: "Ella",
  lastName: "Siff",
  age: 1,
  address: {
    street: "8362 Ram Rd",
    apt: "0x7fff8637c02f",
    zip: "10101",
    city: "Tab City",
    state: "Webkitesota"
  }
});

bob.sayHello(); // "Hi, my name is Bob. I live in Browser Town, Mozilla on 123 Memory Ln."
ella.sayHello(); // "Hi, my name is Ella. I live in Tab City, Webkitesota on 8362 Ram Rd."
```

There is a naive way to define instance methods which has an impact on performace. DO NOT define instance methods as `this` properties in a "Class" `constructor`. This will create a new function in memory for each instance, which is expensive and unnecessary.

```js
// DO NOT define instance methods in this way

function Person(attributes) {
  this.firstName = attributes.firstName;
  this.lastName = attributes.lastName;
  this.age = attributes.age;
  this.address = attributes.address;
  this.sayHello = function() {
    console.log("Hi, my name is " + this.firstName + ". I live in " + this.address.city + ", on " + this.address.street + ".")
  };
}
```

### Static or Class Methods

Sometimes, methods should not belong to any specific instance and instead belong to the "Class" itself. Traditionally we call these static or class methods. Since a "Class" in JavaScript is simply a function and functions are first-class and can have properties, we simply define a property on the "Class" function itself:

```js
function Person(attributes) {
  this.firstName = attributes.firstName;
  this.lastName = attributes.lastName;
  this.age = attributes.age;
  this.address = attributes.address;
}

Person.marry = function(bride, groom) {
  bride.spouse = groom;
  groom.spouse = bride;
}

Person.prototype.sayHello = function() {
  console.log("Hi, my name is " + this.firstName + ". I live in " + this.address.city + ", " + this.address.state + " on " + this.address.street + ".");
};

var bob = new Person({
  firstName: "Bob",
  lastName: "Ject",
  age: 33,
  address: {
    street: "123 Memory Ln",
    apt: "0x7fff9575c05f",
    zip: "01101",
    city: "Browser Town",
    state: "Mozilla"
  }
);

var ella = new Person({
  firstName: "Ella",
  lastName: "Siff",
  age: 1,
  address: {
    street: "8362 Ram Rd",
    apt: "0x7fff8637c02f",
    zip: "10101",
    city: "Tab City",
    state: "Webkitesota"
  }
);

Person.marry(ella, bob);

bob.spouse === ella; // true
ella.spouse === bob; // true
```

Thissues™
---------

`this` is a reference to the current context (object). The current context (object) is is not always what you expect. It can change what it references when a function is passed to other objects.Without a containing object, `this` refers to the global scope (window). Understanding `this` is crucial to writing solid object oriented JavaScript and will punish those who don’t understand it.

#### examples:

When there is no other containing scope `this` is `window`:

```js
function someFunction() {
  console.log(this);
}

someFunction(); // window
```

In nested anonymous functions `this` is still `window`:

```js
(function() {
    console.log(this); // logs window

    (function() {
        console.log(this); // logs window
    })();

})();
```

In an Object: `this` refers to the containing object:

```js
var object = {
    someMethod: function() {
        console.log(this)
    }
};

object.someMethod(); // logs object
object["someMethod"](); // logs object
```

When functions change scope: `this` becomes the new scope:

```js
var object = {
    someMethod: function() {
        console.log(this)
    }
};

var someMethod = object.someMethod;
someMethod(); // logs window
```

You can force a function to use a give context use call or apply and pass the context:

```js
var object = {};
var someFunction = function() {
  console.log(this);
  console.log(arguments);
};
someFunction.call(object, 'arg1', 'arg2'); // logs object then arg1 and arg2

// is the same as

someFunction.apply(object, ['arg1', 'arg2']); // logs object then arg1 and arg2
```

You can pass on object to apply to bind the function's context to that object:

```js
var object = {};
var someFunction = function() { console.log(this); };

var boundFunction = function() {
  return someFunction.apply(object, arguments);
};

boundFunction(); // logs object
```

Most modern browsers support binding functions natively with the bind method:

```js
var object = {};
var someFunction = function() { console.log(this); };

var boundFunction = someFunction.bind(object);

boundFunction(); // logs object
```

Lodash and other libraries provide context binding for browsers that don't support binding:

```js
var object = {};
var someFunction = function() { console.log(this); };

var boundFunction = _.bind(someFunction, object);
var proxyBound = $.proxy(someFunction, object);

boundFunction(); // logs object
proxyBound(); // logs object
```

![Obligatory Mind Blown .gif](https://raw.githubusercontent.com/devmynd/practical-object-oriented-javascript/master/images/mind-blown.gif)

Building An Autocomplete Widget
-------------------------------

Creating object-oriented widgets in JavaScript requires breaking down the desired functionality down into separate objects. We should think of an autocomplete widget as a collection of several objects. It helps to identify each object by visualizing the widget:

![Autocomplete Diagram](https://raw.githubusercontent.com/devmynd/practical-object-oriented-javascript/master/images/autocomplete-diagram.png)

 * **Autocomplete** handles coordinating the objects
 * **Input** handles accepting text input and determining whether to handle text entry or commands
 * **List** handles showing, hiding, activating, and selecting list items
 * **List Item** handles interaction with the item

The benefits of this type of architecture is that it is easy to test, easy to extend and does not require traversing or reading the DOM. This helps hedge against unforseen errors when things in the markup change.

AutocompleteInput
-----------------

### Starting Small
It's best to start with the smallest piece possible and then work your way up to the larger pieces. We'll start with the `AutocompleteInput`.

Every good start involves a test:

```js
describe("AutocompleteInput", function() {
  var subject;
  var name;
  var value;
  var onTextEntrySpy;
  var onCommandEntrySpy;
  beforeEach(function() {
    name = "test";
    value = "test value";
    onTextEntrySpy = sinon.spy();
    onCommandEntrySpy = sinon.spy();
    subject = new AutocompleteInput({
      name: name,
      value: value,
      onTextEntry: onTextEntrySpy,
      onCommandEntry: onCommandEntrySpy
    });
  });

});
```

#### describe

Each `describe` block is a way to group a set of tests under a given description. This helps keep the tests organized and readable.

#### beforeEach

The `beforeEach` block is for shared test setup. Here we setup a new instance of our test subject for each test to prevent polluting the instance's state between tests. Notice the variable declarations are outside of the `beforeEach`block so the variables will be available to each test.

#### afterEach

If we needed to do some clean up after each test we could use [`afterEach`](https://gist.github.com/crismali/2c284bd7f07cd3f8c68a).

#### it

Each `it` block consists of a descriptive string and a function containing our test assertions. Each `it` block is one test in our suite.

To begin, our `AutocompleteInput` requires a name and value to use for the input element. Although we could use separate arguments for the name and value, we'll instead use an object to keep our API clean and simple.

Let's write our first test:

```js
it("requires a name attribute", function() {
  expect(function() {
    new AutocompleteInput({ value: value });
  }).to.throw("AutocompleteInput: name is undefined");
});
```

This test asserts that we always pass in a name. Because JavaScript doesn't have default arguments, we need to make sure the attributes object exists before we test the properties on it. We can do this by setting the attributes to what was passed or an empty object: `attributes = attributes || {};` Now we can test that our `AutocompleteInput` requires certain attributes.

We don't want to rely on JavaScript throwing a vague error when a required attribute isn't given. The key to a solid API is being explicit and obvious with our requirements. Since our `AutocompleteInput` needs a name to do its job we need to throw an explicit error when none is given. To do this, we simply check for the property and throw a new `Error` when it is not present.

Although we CAN throw any standard JavaScript error (ie. `ArgumentError`, `TypeError`), older Internet Explorer versions will quietly swallow any type of error except the plain old `Error`.

```js
function AutocompleteInput(attributes) {
  ...

  attributes = attributes || {};

  if (_.isUndefined(attributes.name)) {
    throw new Error("AutocompleteInput: name is undefined");
  }

  ...
}
```

This should get our first test passing. Now we want to do the same thing with value.

```js
it("requires a value", function() {
  expect(function() {
    new AutocompleteInput({ name: name });
  }).to.throw("AutocompleteInput: value is undefined");
});
```

Now to make it pass:

```js
function AutocompleteInput(attributes) {
  ...

  attributes = attributes || {};

  if (_.isUndefined(attributes.name)) {
    throw new Error("AutocompleteInput: name is undefined");
  }

  if (_.isUndefined(attributes.value)) {
    throw new Error("AutocompleteInput: value is undefined");
  }

  ...
}
```

Now we want to make sure it sets the attributes correctly on the object itself:

```js
it("has a name with `_autocomplete_input` appended", function() {
  expect(subject.name).to.equal(name + "_autocomplete_input");
});

it("has a value", function() {
  expect(subject.value).to.equal(value);
});
```

```js
function AutocompleteInput(attributes) {
  ...

  this.name = attributes.name + "_autocomplete_input";
  this.value = attributes.value;

  ...
}
```

Now we want to make sure our `AutocompleteInput` creates and saves a reference to the jQuery wrapped element that will represent it on the page.

```js
it("has an element", function() {
  expect(subject.$el).to.exist;
  expect(subject.$el).to.have.class("autocomplete-input");
  expect(subject.$el).to.have.attr("name", name + "_autocomplete_input");
  expect(subject.$el).to.have.attr("value", value);
});
```

And to make this pass:

```js
function AutocompleteInput(attributes) {
  ...

  this.$el = $("<input name='" + this.name + "' value='" + this.value + "' />");

  ...
}
```

Our input's main responsibility is determining whether or not a key press was a query or a command, but it doesn't need to know what happens after that in either case. Our input will accept callbacks to handle each case.

Up in our `beforeEach` block we set up some spies, now we can take advantage of them. Spies allows us to test whether or not these functions are called and what arguments were passed to them. Since we don't know whether or not the calling code cares about what happens in either case. We create default callbacks that do nothing.

```js
...

it("accepts a callback for text entry", function() {
  expect(subject.onTextEntry).to.equal(onTextEntrySpy);
});

it("accepts a callback for command entry", function() {
  expect(subject.onCommandEntry).to.equal(onCommandEntrySpy);
});

describe("default callbacks", function() {
  beforeEach(function() {
    subject = new AutocompleteInput({
      name: name,
      value: value
    });
  });

  it("has a default onTextEntry handler", function() {
    expect(subject.onTextEntry).to.be.a("function");
  });

  it("has a default onCommandEntry handler", function() {
    expect(subject.onCommandEntry).to.be.a("function");
  });
});

...
```

```js
function AutocompleteInput(attributes) {
  ...

  _.defaults(attributes, {
    onTextEntry: function() {},
    onCommandEntry: function() {}
  });

  this.onTextEntry = attributes.onTextEntry;
  this.onCommandEntry = attributes.onCommandEntry;

  ...
}
```

To determine if the user has typed in a text character or a command key, we'll need a list of key codes that match up to keypresses we consider commands. The "commands" we accept are:

 * The `esc` key to cancel completion and hide the list
 * The `enter` key to select a currently active completion
 * The `up` key to navigate up the completion list
 * The `down` key to navigate down the completion list

To do this, we're going to create a map of key codes and their corresponding key. Because the key codes are not unique to each instance, we're going to store this map on the `AutocompleteInput` "Class" itself:

```js
it("has a command keycodes constant", function() {
  expect(AutocompleteInput.CMD_KEYCODES.up).to.equal(38);
  expect(AutocompleteInput.CMD_KEYCODES.down).to.equal(40);
  expect(AutocompleteInput.CMD_KEYCODES.escape).to.equal(27);
  expect(AutocompleteInput.CMD_KEYCODES.enter).to.equal(13);

  expect(AutocompleteInput.CMD_KEYCODES[38]).to.equal("up");
  expect(AutocompleteInput.CMD_KEYCODES[40]).to.equal("down");
  expect(AutocompleteInput.CMD_KEYCODES[27]).to.equal("escape");
  expect(AutocompleteInput.CMD_KEYCODES[13]).to.equal("enter");
});
```

We expect an object defined on the `AutocompleteInput` itself to define a map of key codes to keys and vice versa so it's easy to get a key name referenced by key code and a key code referenced by key name:

```js
function AutocompleteInput() {
  ...
}

AutocompleteInput.CMD_KEYCODES = {
  up: 38,
  down: 40,
  escape: 27,
  enter: 13
};

AutocompleteInput.CMD_KEYCODES = _.merge(AutocompleteInput.CMD_KEYCODES, _.invert(AutocompleteInput.CMD_KEYCODES));
```

Now we have a way to know when a command key is entered into the input.

It's time to start defining instance methods and properties on our `AutocompleteInput`. Instead of typing `AutocompleteInput.prototype.someFunction = ...` for every method. We'll use lodash's `merge` method to cut down on the noise.

The `merge` method takes the properties of one object, and copies them over to another object. This means we can `merge` a plain object containing our instance methods onto the `AutocompleteInut`'s prototype:

```js
_.merge(AutocompleteInput.prototype, {
  someMethod: function() {
    ...
  }
});
```

It looks a bit strange at first but it's better than all the extra noise.

It's time to do a slight refactor. Since we're using lodash, we'd like a cleaner way to create template strings than concatenating strings together. Lodash's `template` method is perfect for this. The `template` method accepts a string with specially formatted placeholders for interpolation when the template is rendered. The `template` method returns a function that accepts an object with keys corresponding to it's placeholders. Let's refactor our element to use a lodash `template`:

```js
describe("#template", function() {
  var templateValues;
  var renderedTemplate;
  beforeEach(function() {
    templateValues = {
      name: "test_name",
      value: "test_value"
    };
    renderedTemplate = subject.template(templateValues);
  });

  it("is an input", function() {
    expect(renderedTemplate).to.match(/^\<input/);
  });

  it("has a name parameter", function() {
    expect(renderedTemplate).to.match(/name=\'test_name\'/);
  });

  it("has a value parameter", function() {
    expect(renderedTemplate).to.match(/value=\'test_value\'/);
  });

  it("has an autocomplete-input class", function() {
    expect(renderedTemplate).to.match(/class=\'autocomplete-input\'/);
  });
});
```

Now we need to create a template to make these pass:

```js
_.merge(AutocompleteInput.prototype, {
  template: _.template("<input name='<%= name %>' class='autocomplete-input' value='<%= value %>' />")
})
```

Now every instance of an `AutocompleteInput` will have a template method that can generate the markup it needs.

The next thing our `AutocompleteInput` needs to do is determine when a command key is pressed. Let's create an `isCommandKey` method to determine what key was pressed with a given key code:

```js
describe("#isCommandKey", function() {
  it("returns true when a command keyCode is given", function() {
    expect(subject.isCommandKey(38)).to.be.true;
    expect(subject.isCommandKey(40)).to.be.true;
    expect(subject.isCommandKey(27)).to.be.true;
    expect(subject.isCommandKey(13)).to.be.true;
  });

  it("returns false when a non command keyCode is given", function() {
    expect(subject.isCommandKey(84)).to.be.false;
  });
});
```

Now we can simply use the given key code and our `CMD_KEYCODES` map to find a match:

```js
_.merge(AutocompleteInput.prototype, {
  ...

  isCommandKey: function(keyCode) {
    return _.contains(AutocompleteInput.CMD_KEYCODES, keyCode);
  },

  ...
});
```

The last thing our `AutocompleteInput` needs to do is call our text input and command callbacks when keys are pressed. Here is where we get into using spies to test how and when functions are called. We use a spy when we want to determine if a method was called and what arguments were passed to it. In this case we need to test that the proper handlers are called when a key is pressed:

```js
describe("#onKeyup", function() {
  describe("command", function() {
    beforeEach(function() {
      subject.handleKeyup({ keyCode: AutocompleteInput.CMD_KEYCODES.enter });
    });

    it("does not call the onTextEntry callback", function() {
      expect(subject.attributes.onTextEntry).to.not.have.been.called;
    });

    it("calls the onCommandEntry callback with the given command", function() {
      expect(subject.attributes.onCommandEntry).to.have.been.calledWith("enter");
    });
  });

  describe("text", function() {
    beforeEach(function() {
      subject.$el.val("test");
      subject.handleKeyup({ keyCode: 84 });
    });

    it("calls the onTextEntry callback", function() {
      expect(subject.attributes.onTextEntry).to.have.been.calledWith("test");
    });

    it("does not call the onCommandEntry callback with the given command", function() {
      expect(subject.attributes.onCommandEntry).not.to.have.been.called;
    });
  });
});
```

Now we simply utilize our `isCommandKey` method to determine which handler to call:

```js
_.merge(AutocompleteInput.prototype, {
  ...

  handleKeyup: function(evnt) {
    if (this.isCommandKey(evnt.keyCode)) {
      var command = AutocompleteInput.CMD_KEYCODES[evnt.keyCode];
      attributes.onCommandEntry(command);
    } else {
      attributes.onTextEntry(this.$el.val());
    }
  }
});
```

That's all our `AutocompleteInput` needs to do. It's small, easy to test, and extendable.

AutocompleteListItem
--------------------

The next part of functionality of an autocompleter is a completion list but since we're working from small to large, we'll start with the list items before we get to the list.

A list item's job is very simple. It need to store the value and text of the item, activate and deactivate the highlight on the item, and select the item when it is clicked. Let's take care of the basics:

```js
describe("AutocompleteListItem", function() {
  var subject;
  var testText;
  var testValue;
  var onSelectSpy;

  beforeEach(function() {
    testText = "Test Item";
    testValue = 1;
    onSelectSpy = sinon.spy();
    subject = new AutocompleteListItem({
      onSelect: onSelectSpy,
      item: {
        value: testValue,
        text: testText
      }
    });
  });

  it("has an element", function() {
    expect(subject.$el).to.exist;
    expect(subject.$el).to.have.class("autocomplete-list-item");
    expect(subject.$el[0].tagName).to.equal("LI");
  });

  it("has a value", function() {
    expect(subject.value).to.equal(testValue);
  });

  it("has text", function() {
    expect(subject.text).to.equal(testText);
  });

  it("has a template", function() {
    expect(subject.template).to.be.a("function");
    var renderedTemplate = subject.template({ text: "foo" });
    expect(renderedTemplate).to.match(/foo/);
  });

  it("has an onSelect handler", function() {
    expect(subject.onSelect).to.be.a("function");
  });

  it("has a active state", function() {
    expect(subject.active).to.be.false;
  });

  describe("#activate", function() {
    beforeEach(function() {
      subject.activate();
    });

    it("sets active to true", function() {
      expect(subject.active).to.be.true;
    });

    it("adds the active class to el", function() {
      expect(subject.$el).to.have.class("active");
    });
  });

  describe("#deactivate", function() {
    beforeEach(function() {
      subject.active = true;
      subject.$el.addClass("active");
      subject.deactivate();
    });

    it("sets active to false", function() {
      expect(subject.active).to.be.false;
    });

    it("removes the active class from el", function() {
      expect(subject.$el).to.not.have.class("active");
    });
  });

  describe("#select", function() {
    it("calls the onClick function, passing itself", function() {
      subject.select();
      expect(subject.onClick).to.have.been.calledWith(subject);
    });
  });

  describe("#registerEvents", function() {
    it("handles click", function() {
      subject.$el.trigger("click");
      expect(subject.onClick).to.have.been.called;
    });
  });
});

```

This handles creating a DOM element for each list item and it's properties, as well as activating and deactivating the item and calling the handlers when an item is selected:

```js
function AutocompleteListItem(attributes) {
  _.bindAll(this);
  attributes = attributes || {};
  _.defaults(attributes, {
    onSelect: function() {}
  });

  this.value = attributes.item.value;
  this.text = attributes.item.text;
  this.onSelect = attributes.onSelect;

  this.$el = $(this.template({
    value: this.value,
    text: this.text
  }));
  this.active = false;

  this.registerEvents();
}

_.merge(AutocompleteListItem.prototype, {

  template: _.template('<li class="autocomplete-list-item"><a href="#"><%= text %></a></li>'),

  activate: function() {
    this.active = true;
    this.$el.addClass("active");
  },

  deactivate: function() {
    this.active = false;
    this.$el.removeClass("active");
  },

  registerEvents: function() {
    this.$el.on("click", this.select);
  },

  select: function() {
    this.onSelect(this);
  }

});
```

Our `AutocompleteListItem` "Class" is complete. Now we need a list to manage them:

AutocompleteList
----------------

```js
describe("AutocompleteList", function() {
  var subject;
  var item1;
  var item2;
  var item3;
  var items;
  var onItemSelectSpy;
  beforeEach(function() {
    item1 = { value: 1, text: "Test item 1" };
    item2 = { value: 2, text: "Test item 2" };
    item3 = { value: 3, text: "Test item 3" };
    items = [item1, item2, item3];
    onItemSelectSpy = sinon.spy();
    subject = new AutocompleteList({ onItemSelect: onItemSelectSpy });
  });

  it("has an element", function() {
    expect(subject.$el).to.exist;
    expect(subject.$el[0].tagName).to.equal("UL");
    expect(subject.$el).to.have.class("autocomplete-list");
    expect(subject.$el).to.have.class("hidden");
  });

  it("has an onItemSelect handler", function() {
    expect(subject.onItemSelect).to.equal(onItemSelectSpy);
  });

  describe("defaults", function() {
    beforeEach(function() {
      subject = new AutocompleteList();
    });

    it("has an onItemSelect handler", function() {
      expect(subject.onItemSelect).to.be.a("function");
    });
  });

  describe("#render", function() {
    beforeEach(function() {
      subject.render(items);
    });

    it("creates an completionListItem for each item", function() {
      expect(subject.items).to.be.an("Array");
      expect(subject.items.length).to.equal(items.length);
      _.each(subject.items, function(item) {
        expect(item).to.be.an.instanceof(AutocompleteListItem);
      });
    });

    it("appends each item to the element", function() {
      expect(subject.$el).to.have.descendants("li");
    });

    it("removes the hidden class", function() {
      expect(subject.$el).not.to.have.class("hidden");
    });

    it("does not double render the items", function() {
      subject.render(items);
      expect(subject.$el.find("li").length).to.equal(items.length);
    });

    describe("when there are no items", function() {
      beforeEach(function() {
        subject.$el.removeClass("hidden");
        subject.$el.empty();
      });

      it("it adds the hidden class", function() {
        subject.render([]);
        expect(subject.$el).to.have.class("hidden");
      });

      it("does not throw an error when items are undefined", function() {
        expect(function() {
          subject.render();
        }).not.to.throw();
      });
    });
  });

  describe("#hide", function() {
    it("adds the hidden class to the element", function() {
      subject.$el.removeClass("hidden");
      subject.hide();
      expect(subject.$el).to.have.class("hidden");
    });
  });

  describe("#show", function() {
    it("removes the hidden class from the element", function() {
      subject.$el.addClass("hidden");
      subject.show();
      expect(subject.$el).not.to.have.class("hidden");
    });
  });

  describe("#handleItemSelect", function() {
    var selectedItem;
    beforeEach(function() {
      subject.render(items);
      subject.show();
      selectedItem = _.first(subject.items);
      subject.handleItemSelect(selectedItem);
    });

    it("calls the onItemSelect callback, passing the item clicked", function() {
      expect(subject.onItemSelect).to.have.been.calledWith(selectedItem);
    });

    it("hides the completion list", function() {
      expect(subject.$el).to.have.class("hidden");
    });
  });

  describe("#activeItem", function() {
    beforeEach(function() {
      subject.createListItems(items);
    });

    it("returns undefined when no item is active", function() {
      expect(subject.activeItem()).to.be.undefined;
    });

    it("returns the active item when one is active", function() {
      var activeItem = _.first(subject.items);
      activeItem.activate();
      expect(subject.activeItem()).to.equal(activeItem);
    });
  });

  describe("#nextItem", function() {
    beforeEach(function() {
      subject.createListItems(items);
    });

    describe("when no items are active", function() {
      it("returns the first item", function() {
        expect(subject.nextItem()).to.equal(_.first(subject.items));
      });
    });

    describe("when an item is active", function() {
      beforeEach(function() {
        _.first(subject.items).activate();
      });

      it("returns the next item in the items array", function() {
        expect(subject.nextItem()).to.equal(subject.items[1]);
      });
    });

    describe("when the last item is already active", function() {
      it("returns the first item", function() {
        _.last(subject.items).activate();
        expect(subject.nextItem()).to.equal(_.first(subject.items));
      });
    });
  });

  describe("#activateNextItem", function() {
    beforeEach(function() {
      subject.createListItems(items);
    });

    describe("when no items are active", function() {
      it("activates the first item", function() {
        subject.activateNextItem();
        expect(_.first(subject.items).active).to.be.true;
      });
    });

    describe("when an item is active", function() {
      beforeEach(function() {
        _.first(subject.items).activate();
        subject.activateNextItem();
      });

      it("activates the next item in the items array", function() {
        expect(subject.items[1].active).to.be.true;
      });

      it("deactivates the previously active item", function() {
        expect(_.first(subject.items).active).to.be.false;
      });
    });

    describe("when the last item is already active", function() {
      it("activates the first item", function() {
        _.last(subject.items).activate();
        subject.activateNextItem();
        expect(_.first(subject.items).active).to.be.true;
      });
    });
  });

  describe("#previousItem", function() {
    beforeEach(function() {
      subject.createListItems(items);
    });

    describe("when no items are active", function() {
      it("returns the last item", function() {
        expect(subject.previousItem()).to.equal(_.last(subject.items));
      });
    });

    describe("when an item is active", function() {
      beforeEach(function() {
        _.last(subject.items).activate();
      });

      it("returns the next item in the items array", function() {
        expect(subject.previousItem()).to.equal(subject.items[1]);
      });
    });

    describe("when the first item is already active", function() {
      it("returns the last item", function() {
        _.first(subject.items).activate();
        expect(subject.previousItem()).to.equal(_.last(subject.items));
      });
    });
  });

  describe("#activatePreviousItem", function() {
    beforeEach(function() {
      subject.createListItems(items);
    });

    describe("when no items are active", function() {
      it("activates the last item", function() {
        subject.activatePreviousItem();
        expect(_.last(subject.items).active).to.be.true;
      });
    });

    describe("when an item is active", function() {
      beforeEach(function() {
        _.last(subject.items).activate();
        subject.activatePreviousItem();
      });

      it("activates the previous item in the items array", function() {
        expect(subject.items[1].active).to.be.true;
      });

      it("deactivates the previously active item", function() {
        expect(_.last(subject.items).active).to.be.false;
      });
    });

    describe("when the first item is already active", function() {
      it("activates the last item", function() {
        _.first(subject.items).activate();
        subject.activatePreviousItem();
        expect(_.last(subject.items).active).to.be.true;
      });
    });
  });

  describe("#handleCommandEntry", function() {
    beforeEach(function() {
      sinon.stub(subject, "handleUp");
      sinon.stub(subject, "handleDown");
      sinon.stub(subject, "handleEnter");
      sinon.stub(subject, "handleEscape");
    });

    describe("up", function() {
      beforeEach(function() {
        subject.handleCommandEntry("up");
      });

      it("handles up", function() {
        expect(subject.handleUp).to.have.been.called;
        expect(subject.handleDown).to.not.have.been.called;
        expect(subject.handleEnter).to.not.have.been.called;
        expect(subject.handleEscape).to.not.have.been.called;
      });
    });

    describe("down", function() {
      beforeEach(function() {
        subject.handleCommandEntry("down");
      });

      it("handles down", function() {
        expect(subject.handleDown).to.have.been.called;
        expect(subject.handleUp).to.not.have.been.called;
        expect(subject.handleEnter).to.not.have.been.called;
        expect(subject.handleEscape).to.not.have.been.called;
      });
    });

    describe("enter", function() {
      beforeEach(function() {
        subject.handleCommandEntry("enter");
      });

      it("handles enter", function() {
        expect(subject.handleEnter).to.have.been.called;
        expect(subject.handleUp).to.not.have.been.called;
        expect(subject.handleDown).to.not.have.been.called;
        expect(subject.handleEscape).to.not.have.been.called;
      });
    });

    describe("escape", function() {
      beforeEach(function() {
        subject.handleCommandEntry("escape");
      });

      it("handles escape", function() {
        expect(subject.handleEscape).to.have.been.called;
        expect(subject.handleUp).to.not.have.been.called;
        expect(subject.handleDown).to.not.have.been.called;
        expect(subject.handleEnter).to.not.have.been.called;
      });
    });
  });

  describe("#handleDown", function() {
    beforeEach(function() {
      sinon.spy(subject, "activateNextItem");
      subject.createListItems(items);
      subject.handleDown();
    });

    it("activates the next item", function() {
      expect(subject.activateNextItem).to.have.been.called;
    });
  });

  describe("#handleUp", function() {
    beforeEach(function() {
      subject.createListItems(items);
      sinon.spy(subject, "activatePreviousItem");
      subject.handleUp();
    });

    it("activates the previous item", function() {
      expect(subject.activatePreviousItem).to.have.been.called;
    });
  });

  describe("#handleEscape", function() {
    beforeEach(function() {
      sinon.spy(subject, "hide");
      subject.handleEscape();
    });

    it("hides the list", function() {
      expect(subject.hide).to.have.been.called;
    });
  });

  describe("#handleEnter", function() {
    describe("when an item is active", function() {
      var item;
      beforeEach(function() {
        subject.createListItems(items);
        item = _.first(subject.items);
        item.activate();
        sinon.spy(item, "select");
        subject.handleEnter();
      });

      it("selects the active item", function() {
        expect(item.select).to.have.been.called;
      });
    });

    describe("when there is no active item", function() {
      it("does not throw an error", function() {
        expect(function() {
          subject.handleEnter();
        }).not.to.throw();
      });
    });
  });
});

```

This is the busiest "Class" in the autocompleter, which makes sense. It needs to handle rendering the list items, activating and deactivating items when the list is navigated, and hiding and showing the list when certain commands are entered. Thankfully TDD makes this a straight-forward and simple process:

```js
function AutocompleteList(attributes) {
  _.bindAll(this);
  attributes = attributes || {};
  _.defaults(attributes, {
    onItemSelect: function() {}
  });

  this.onItemSelect = attributes.onItemSelect;
  this.$el = $("<ul class='autocomplete-list hidden'/>");
}

_.merge(AutocompleteList.prototype, {

  render: function(items) {
    this.$el.empty();
    if (_.isEmpty(items)) {
      this.hide();
    } else {
      this.createListItems(items);
      this.renderItems();
      this.show();
    }
  },

  hide: function() {
    this.$el.addClass("hidden");
  },

  show: function() {
    this.$el.removeClass("hidden");
  },

  createListItems: function(items) {
    this.items = _.map(items, this.createListItem);
  },

  createListItem: function(item) {
    return new AutocompleteListItem({ item: item, onSelect: this.handleItemSelect });
  },

  handleItemSelect: function(item) {
    this.onItemSelect(item);
    this.hide();
  },

  renderItems: function() {
    _.each(this.items, this.renderItem);
  },

  renderItem: function(item) {
    this.$el.append(item.$el);
  },

  activeItem: function() {
    return _.find(this.items, "active");
  },

  nextItem: function() {
    var nextIndex = _.indexOf(this.items, this.activeItem()) + 1;
    var nextItem = this.items[nextIndex] || _.first(this.items);
    return nextItem;
  },

  activateNextItem: function() {
    var currentlySelected = this.activeItem();
    this.nextItem().activate();
    if (currentlySelected) {
      currentlySelected.deactivate();
    }
  },

  previousItem: function() {
    var previousIndex = _.indexOf(this.items, this.activeItem()) - 1;
    var previousItem = this.items[previousIndex] || _.last(this.items);
    return previousItem;
  },

  activatePreviousItem: function() {
    var currentlySelected = this.activeItem();
    this.previousItem().activate();
    if (currentlySelected) {
      currentlySelected.deactivate();
    }
  },

  handleCommandEntry: function(command) {
    this["handle" + _.capitalize(command)]();
  },

  handleDown: function() {
    this.activateNextItem();
  },

  handleUp: function() {
    this.activatePreviousItem();
  },

  handleEnter: function() {
    var activeItem = this.activeItem();
    if (activeItem) {
      activeItem.select();
    }
  },

  handleEscape: function() {
    this.hide();
  }

});
```

Now that we have our DOM components created we need to create the objects that will handle actually auto completing text when entered into the input. We'd like to be able to either provide a list of items to complete or a URL to a server endpoint that will fetch completions. Since this behavior is slightly different in each case, we'll create adapters to handle each of them. Let's start with an adapter for filtering a provided list:

AutocompleteLocalAdapter
------------------------

```js
describe("AutocompleteLocalAdapter", function() {
  var subject;
  var items;
  var onAutocompleteSpy;
  beforeEach(function() {
    items = [
      { value: 1, text: "Test item 1" },
      { value: 2, text: "Test item 2" },
      { value: 3, text: "Test item 3" }
    ];
    onAutocompleteSpy = sinon.spy();
    subject = new AutocompleteLocalAdapter({
      items: items,
      onAutocomplete: onAutocompleteSpy
    });
  });

  it("requires items", function() {
    expect(function() {
      new AutocompleteLocalAdapter;
    }).to.throw("AutocompleteLocalAdapter: items is undefined");
  });

  it("has an onAutocomplete callback", function() {
    expect(subject.onAutocompleteSpy).to.equal(onAutocompleteSpy);
  });

  describe("defaults", function() {
    beforeEach(function() {
      subject = new AutocompleteLocalAdapter({
        items: items
      });
    });

    it("has a default onAutocomplete handler", function() {
      expect(subject.onAutocomplete).to.be.a("function");
    });
  });

  describe("#handleTextEntry", function() {
    describe("when empty text is passed", function() {
      it("calls the onAutocomplete callback, passing an empty array of items", function() {
        subject.handleTextEntry("");
        expect(subject.onAutocomplete).to.have.been.calledWith([]);
      });
    });

    describe("when text is passed", function() {
      beforeEach(function() {
        subject.handleTextEntry("Test item 3");
      });

      it("calls the onAutocomplete callback, passing an array of matching items", function() {
        expect(subject.onAutocomplete).to.have.been.calledWith([_.last(items)]);
      });
    });
  });
});
```

And now the implementation:

```js
function AutocompleteLocalAdapter(attributes) {
  _.bindAll(this);
  attributes = attributes || {};
  _.defaults(attributes, {
    onAutocomplete: function() {}
  });

  if (_.isUndefined(attributes.items)) {
    throw new Error("AutocompleteLocalAdapter: items is undefined");
  }

  this.items = attributes.items;
  this.onAutocomplete = attributes.onAutocomplete;
}

_.merge(AutocompleteLocalAdapter.prototype, {

  handleTextEntry: function(text) {
    var items = [];
    if (text) {
      this.filter = new RegExp("^" + text, "i");
      items = _.filter(this.items, this.itemMatchesFilter);
    }
    this.onAutocomplete(items);
  },

  itemMatchesFilter: function(item) {
    return item.text.match(this.filter);
  }

});
```

AutocompleteAjaxAdapter
-----------------------

Now let's make an adapter to handle fetching completions from a remote server with an AJAX adapter:


It can be tricky to test asynchronous functions like AJAX calls. This is where sinon comes to the rescue. Sinon lets us mock out AJAX request and perform assertions without actually calling out to a remote server. To do this, we need to set up fake XHR request handling:

```js
...

var xhr;
var requests;
beforeEach(function() {
  ...

  xhr = sinon.useFakeXMLHttpRequest();
  requests = [];
  xhr.onCreate = function(xhr) {
    requests.push(xhr);
  };

  ...
})
```

Now whenever an AJAX request is made in our code, it will be captured in the `requests` array. Let's write some tests:

```js
describe("AutocompleteAjaxAdapter", function() {
  var subject;
  var onAutocomplete;
  var xhr;
  var requests;
  beforeEach(function() {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = function(xhr) {
      requests.push(xhr);
    };
    onAutocomplete = sinon.spy();
    subject = new AutocompleteAjaxAdapter({
      url: "test",
      onAutocomplete: onAutocomplete
    });
  });

  it("requires a url", function() {
    expect(function() {
      new AutocompleteAjaxAdapter;
    }).to.throw("AutocompleteAjaxAdapter: url is undefined");
  });

  it("has a url", function() {
    expect(subject.url).to.equal("test");
  });

  it("has an onAutocomplete handler", function() {
    expect(subject.onAutocomplete).to.equal(onAutocompleteSpy);
  });

  it("has a throttle delay", function() {
    expect(subject.throttleDelay).to.be.a("number");
  });

  describe("defaults", function() {
    beforeEach(function() {
      subject = new AutocompleteAjaxAdapter({
        url: "test"
      });
    });

    it("has a default onAutocomplete handler", function() {
      expect(subject.onAutocomplete).to.be.a("function");
    });
  });

  describe("#handleTextEntry", function() {
    var text;
    beforeEach(function() {
      text = "test query";
      sinon.spy(window, "clearTimeout");
      sinon.spy(subject, "queueRequest");
    });

    afterEach(function() {
      clearTimeout.restore();
    });

    it("sets the query", function() {
      subject.handleTextEntry(text);
      expect(subject.query).to.equal(text);
    });

    it("queues a request", function() {
      subject.handleTextEntry(text);
      expect(subject.queueRequest).to.have.been.called;
    });

    describe("when there's a queued request", function() {
      it("clears the timeout", function() {
        subject.queuedRequest = 5;
        subject.handleTextEntry(text);
        expect(clearTimeout).to.have.been.calledWith(5);
      });
    });

    describe("when there is not a queued request", function() {
      it("does nothing", function() {
        subject.handleTextEntry(text);
        expect(clearTimeout).not.to.have.been.called;
      });
    });

    describe("when the text is empty", function() {
      it("does not queue a request", function() {
        subject.handleTextEntry("");
        expect(subject.queuedRequest).to.be.undefined;
      });

      it("clears a request out", function() {
        subject.queuedRequest = 15;
        subject.handleTextEntry("");
        expect(clearTimeout).to.have.been.calledWith(subject.queuedRequest);
      });

      it("sends an empty array to the on autocomplete callback", function() {
        subject.handleTextEntry("");
        expect(subject.onAutocomplete).to.have.been.calledWith([]);
      });
    });
  });

  describe("#fetchItems", function() {
    it("gets the items via ajax", function() {
      subject.fetchItems();
      var request = _.last(requests);
      expect(request.url).to.equal(subject.url);
      expect(request.method).to.equal("GET");
      expect(request.requestHeaders.Accept).to.match(/application\/json/);
    });
  });

  describe("#queueRequest", function() {
    beforeEach(function() {
      subject.throttleDelay = 0;
      sinon.spy(window, "setTimeout");
      sinon.spy(subject, "fetchItems");
      subject.queueRequest();
    });

    afterEach(function() {
      setTimeout.restore();
    });

    it("queues a fetch items request", function() {
      expect(subject.queuedRequest).to.be.a("number");
    });

    it("fetches the items after the throttle delay", function() {
      expect(setTimeout).to.have.been.called;

      var args = _.first(setTimeout.args);
      var callback = _.first(args);
      var throttleDelay = _.last(args);
      callback();
      expect(subject.fetchItems).to.have.been.called;
      expect(throttleDelay).to.equal(subject.throttleDelay);
    });
  });
});
```

With a sturdy test harness underneath us we can confidently implement this adapter:

```js
function AutocompleteAjaxAdapter(attributes) {
  _.bindAll(this);
  attributes = attributes || {};
  _.defaults(attributes, {
    onAutocomplete: function() {}
  });

  if (_.isUndefined(attributes.url)) {
    throw new Error("AutocompleteAjaxAdapter: url is undefined");
  }

  this.url = attributes.url;
  this.onAutocomplete = attributes.onAutocomplete;
  this.throttleDelay = 250;
}

_.merge(AutocompleteAjaxAdapter.prototype, {

  handleTextEntry: function(text) {
    this.query = text;
    if (this.queuedRequest) {
      clearTimeout(this.queuedRequest);
    }
    if (!text) {
      this.onAutocomplete([]);
      return;
    }
    this.queueRequest();
  },

  fetchItems: function() {
    $.ajax({
      url: this.url,
      type: "get",
      dataType: "json",
      data: { query: this.query }
    })
      .done(this.onAutocomplete);
  },

  queueRequest: function() {
    var _this = this;
    this.queuedRequest = setTimeout(function() {
      _this.fetchItems();
    }, this.throttleDelay);
  }

});
```

Autocomplete
------------

All that's left is to create an object to wrangle all these pieces together:

```js
describe("Autocomplete", function() {
  var subject;
  var items;
  beforeEach(function() {
    appendFixture("input", { id: "autocomplete", type: "text", name: "autocomplete" });
    items = [
      { value: 1, text: "Test item 1" },
      { value: 2, text: "Test item 2" },
      { value: 3, text: "Test item 3" }
    ];
    subject = new Autocomplete({ selector: "#autocomplete", url: "test" });
  });

  it("requires a selector", function() {
    expect(function() {
      new Autocomplete;
    }).to.throw("Autocomplete: selector is undefined");
  });

  it("requires a url or an items array", function() {
    expect(function() {
      new Autocomplete({ selector: "#autocomplete" });
    }).to.throw("Autocomplete: items or url is undefined");
  });

  describe("initialize", function() {
    it("has a reference to the input", function() {
      expect(subject.$input).to.exist;
      expect(subject.$input).to.have.id("autocomplete");
      expect(subject.$input[0].tagName).to.equal("INPUT");
    });

    it("wraps the element in an .autocomplete-container", function() {
      expect(subject.$el).to.exist;
      expect(subject.$el).to.have.class("autocomplete-container");
    });

    it("hides the original input", function() {
      expect(subject.$input).not.to.be.visible;
    });

    it("creates a filter input", function() {
       var expectedName = subject.$input.attr("name") + "_autocomplete_input";
      expect(subject.autocompleteInput).to.be.an.instanceof(AutocompleteInput);
      expect(subject.autocompleteInput.name).to.equal(expectedName);
      expect(subject.autocompleteInput.value).to.equal(subject.$input.val());
      expect(subject.autocompleteInput.onTextEntry).to.equal(subject.adapter.handleTextEntry);
      expect(subject.autocompleteInput.onCommandEntry).to.equal(subject.completionList.handleCommandEntry);
    });

    it("creates a list for autocompleted items", function() {
      expect(subject.completionList).to.be.an.instanceof(AutocompleteList);
      expect(subject.completionList.onItemSelect).to.equal(subject.handleItemSelect);
    });

    it("has a default onAutocomplete callback", function() {
      expect(subject.onAutocomplete).to.be.a("function");
    });

    describe("onAutocomplete callback", function() {
      it("sets the onAutocomplete callback", function() {
        var callback = function() {};
        subject = new Autocomplete({
          selector: "#autocomplete",
          items: items,
          onAutocomplete: callback
        });

        expect(subject.onAutocomplete).to.equal(callback);
      });
    });

    describe("when items are passed", function() {
      it("has a local adapter", function() {
        subject = new Autocomplete({
          selector: "#autocomplete",
          items: items
        });
        expect(subject.adapter).to.be.an.instanceof(AutocompleteLocalAdapter);
      });
    });
  });

  describe("#render", function() {
    it("appends the autocomplete input to the element", function() {
      expect(subject.$el).to.have.descendants(".autocomplete-input");
    });

    it("appends the autocomplete list to the element", function() {
      expect(subject.$el).to.have.descendants(".autocomplete-list");
    });
  });

  describe("#handleItemSelect", function() {
    var item;
    beforeEach(function() {
      sinon.spy(subject, "onAutocomplete");
      item = new AutocompleteListItem({ item: _.first(items) });
      subject.handleItemSelect(item);
    });

    it("sets the $input's value to the item's value", function() {
      expect(subject.$input.val()).to.equal(item.value.toString());
    });

    it("displays the item's text in the autocomplete input", function() {
      expect(subject.autocompleteInput.$el).to.have.value(item.text);
    });

    it("calls the onAutocomplete callback, passing it the selected item", function() {
      expect(subject.onAutocomplete).to.have.been.calledWith(item);
    });
  });
});

```

And here's the implementation:

```js
function Autocomplete(attributes) {
  _.bindAll(this);
  attributes = attributes || {};

  if (_.isUndefined(attributes.selector)) {
    throw new Error("Autocomplete: selector is undefined");
  }
  if (_.isUndefined(attributes.items || attributes.url)) {
    throw new Error("Autocomplete: items or url is undefined");
  }

  this.initialize(attributes.selector, attributes.items || attributes.url, attributes.onAutocomplete);
}

_.merge(Autocomplete.prototype, {

  initialize: function(selector, itemsOrUrl, onAutocomplete) {
    this.onAutocomplete = onAutocomplete || function() {};
    this.setupInput(selector);
    this.$el = this.$input.parent();
    this.completionList = new AutocompleteList({ onItemSelect: this.handleItemSelect });
    this.createAdapter(itemsOrUrl);
    this.autocompleteInput = new AutocompleteInput({
      name: this.$input.attr("name"),
      value: this.$input.val(),
      onTextEntry: this.adapter.handleTextEntry,
      onCommandEntry: this.completionList.handleCommandEntry
    });
    this.render();
  },

  setupInput: function(selector) {
    this.$input = $(selector);
    this.$input.wrap("<div class='autocomplete-container' />");
    this.$input.hide();
  },

  createAdapter: function(itemsOrUrl) {
    if (_.isArray(itemsOrUrl)) {
      this.adapter = new AutocompleteLocalAdapter({
        items: itemsOrUrl,
        onAutocomplete: this.completionList.render
      });
    } else {
      this.adapter = new AutocompleteAjaxAdapter({
        url: itemsOrUrl,
        onAutocomplete: this.completionList.render
      });
    }
  },

  render: function() {
    this.$el.append(this.autocompleteInput.$el);
    this.$el.append(this.completionList.$el);
  },

  handleItemSelect: function(item) {
    this.$input.val(item.value);
    this.autocompleteInput.$el.val(item.text);
    this.onAutocomplete(item);
  }

});
```

That should complete our sweet Autocomplete widget :)
