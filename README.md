Practical Object Oriented Javascript - CWC 2015 Workshop
========================================================

... or getting closure on thissues™.



What We Will Cover
------------------

 * JavaScript primer, is it functional? is it object oriented? is it funcject orientional?
 * First class functions
 * Closures
 * WTF is this?
 * Why is this that?
 * Seriously WTF is this and how do I force it to make sense
 * Managing scope
 * Building an autocomplete widget with the JS OO building blocks


First Class Functions
---------------------

 * Functions are values just like strings, numbers, arrays, and objects
 * Functions can be assigned to variables and passed as arguments
 * Functions can be manipulated as values
 * Functions can be dynamically created by other functions

[Function Assignment](https://gist.github.com/daytonn/2d0bdbaa9621d3aad207)
<script src="https://gist.github.com/daytonn/2d0bdbaa9621d3aad207.js"></script>

[Dynamic Function Assignment](https://gist.github.com/daytonn/bce92d21e36b71482722)
<script src="https://gist.github.com/daytonn/bce92d21e36b71482722.js"></script>

![Obligatory Mind Blown .gif](https://raw.githubusercontent.com/devmynd/practical-object-oriented-javascript/master/images/mind-blown.gif)

Scope
-----

`window` is the implicit global namespace. Leaked globals can be accessed on window.

Global variables are implied when assigned without the `var` keyword. Basically, you should **NEVER** assign a variable without the `var` keyword. It is otherwise very easy to leak a function's member variable to the global scope:

[Leaked globals](https://gist.github.com/daytonn/58b3b16151ed175d90ea)
<script src="https://gist.github.com/daytonn/58b3b16151ed175d90ea.js"></script>

### Closures

 Closures are an immediately invoked function, which usually return a function that has access to privately scoped members of the containing function. The outer function “closes over” the returned function, hence the term closure. The only way to create private methods/variables in JavaScript is to use a closure (for now).


#### examples:

[Closure](https://gist.github.com/daytonn/ec5326a6e73685da6747)
<script src="https://gist.github.com/daytonn/ec5326a6e73685da6747.js"></script>

Objects
-------

When we talk about Objects in JavaScript, we can be talking about 2 different things. The `Object` data type refers to a key-value pair; much like hashes, associative arrays, or maps in other languages. They are also refered to as JSON (javascript object notation) objects. Here are a few examples of simple JavaScript objects:

#### examples:

A basic object is a simple key-value store that can be arbitrarily nested: [basic object](https://gist.github.com/24af1870507ff2b637ad)

An object can have functions for properties (remember first class functions). When the property of an object is a function, we refer to these as methods: [object with "method"](https://gist.github.com/daytonn/3bc30ec52a74a7690960)

### Instantiated Objects

When we talk about objects in traditional object-oriented programming, we are talking about classes and instances. JavaScript *does not have* a traditional Class model. In fact, it does not have a "Class" at all (until recently). "Classes" in JavaScript are created by taking advantage of some interesting features of functions in JavaScript. The `new` keyword and the `this` keyword allow us to mimic the functionality of traditional Classes and inheritance patterns.

To create a "Class" in javascript, you must first define a function. Since there are no formal "Classes", always capitalize a function intended to be used as a "Class". This function is considered the `constructor`, which means this function will be executed every time a new instance of this "Class" is created, with a new context. "Instance variables" for each instance of the object can be assinged by using the `this` keyword. These are really just properties of the instantiated object.

#### examples:

To instantiate a new instance of a "Class": [use the `new` keyword](https://gist.github.com/daytonn/0d2dba80a131bdcc49f1)

*Warning if you do not use the `new` keyword when you instantiate a new object, the function will still be executed, returning undefined and leaking any properties assigned to the global scope*: [bad instantiation](https://gist.github.com/daytonn/3c88d1d996d2e919ef3b)

### Instance Methods

To define instance methods the right way, we assign functions to the "Class" `prototype`. The `prototype` is an `Object` (the JSON kind) that contains the methods that each instance will share. Every instance can share these same methods because when called, they will be called in the context of that instance.

[protype instance method definition](https://gist.github.com/daytonn/d0b2f2bd3a3fd9521cad)

There is a naive way to define instance methods that has an impact on performace. DO NOT define instance methods as `this` properties in a "Class" `constructor`. This will create a new function in memory for each instance, which is expensive and unnecessary.

[naive instance method definition](https://gist.github.com/daytonn/031a34f66b9e43370677)

### Static or Class Methods

Sometimes, methods should not belong to any specific instance and instead belong on the "Class" itself. Traditionally we call these static or class methods. Since a "Class" in JavaScript is simply a function, and functions are first-class and can have properties. We simply define a property on the "Class" function itself:

[class method definition](https://gist.github.com/daytonn/f19d2b0acd8573961693)

Thissues™
---------

`this` is a reference to the current context (object). The current context (object) is is not always what you expect. It can change what it references when a function is passed to other objects.Without a containing object, `this` refers to the global scope (window). Understanding `this` is crucial to writing solid object oriented JavaScript and will punish those who don’t understand it.

#### examples:

When there is no other containing scope: [`this` is window](https://gist.github.com/daytonn/1a7ed7cbfc8929e7225f)

In nested anonymous functions: [`this` is still window](https://gist.github.com/crismali/c6adf7cb6d91f266741f)

In an Object: [`this` refers to the containing object](https://gist.github.com/crismali/08e53b8a740f514d77f6)

When functions change scope: [`this` becomes the new scope](https://gist.github.com/crismali/247affaee419099e5583)

You can force a function to use a give context: [use call or apply and pass the context](https://gist.github.com/crismali/f05faffb2b701bb1ff4f)

You can pass on object to apply to bind the function's context to that object: [binding with apply](https://gist.github.com/crismali/6563184aa061fab0e053)

Most modern browsers support binding functions natively with the [bind method](https://gist.github.com/crismali/35fa19c388cf76aa4789)

Lodash and other libraries provide context binding for browsers that don't support binding: [binding with libraries](https://gist.github.com/crismali/a7aaff8a591cf90e34d6)

![Obligatory Mind Blown .gif](https://raw.githubusercontent.com/devmynd/practical-object-oriented-javascript/master/images/mind-blown.gif)

Building An Autocomplete Widget
-------------------------------

When creating object-oriented widgets in JavaScript requires breaking down the desired functionality down into seperate object. We can think of an autocomplete widget as a collection of several objects. It helps to identify each object by visualizing the widget:

![Autocomplete Diagram](https://raw.githubusercontent.com/devmynd/practical-object-oriented-javascript/master/images/autocomplete-diagram.png)

 * **Autocomplete** handles coordinating the objects
 * **Input** handles accepting text input and determining whether to handle text entry or commands
 * **List** handles showing, hiding, activating, and selecting list items
 * **List Item** handles interaction with the item

The benefits of this type of architecture is that it is easy to test, easy to extend and does not require traversing or reading the DOM. This helps hedge against unforseen errors when things in the markup change.



*Notes:*
*Inheritance in js is prototypal, and we're not going to get super deep into it*