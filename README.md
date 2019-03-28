# BigBrother
A javascript watcher, which evaluates an expression and fires a callback when its value changes.

This lightweight and programmer friendly module, written entirely in typescript, will allow you to keep track of value changes in an expression. It does not depend on any framework or library so you can easily integrate it into any node.js project.

# Instructions

## Install

```bash

npm install big-brother-js --save

```

## Usage

### watch()

Watch for changes in the return value of an expression by calling the **watch()** method, which requires two functions as parameters. The first one being the expression to watch, and the second, the callback to trigger when the value returned by the expression changes. Any call to **watch()** will automatically initialize the scheduler if it's not running already.

As you can see below, it also returns a function that you can call to stop watching.

```typescript

import BigBrother from 'big-brother-js';

let foo = 1;

const unwatch = BigBrother.watch(
  ()=> {
    return foo;
  },
  ( value )=> {
    console.log( "foo has changed, and its value is now ", value );
  }
);

unwatch();

```

### init()

You don't need to initialize BigBrother unless you deliberately stop it or wish to provide a specific interval to fire the scheduler. Any call to **watch()** will automatically initialize the scheduler if it's not running already. Calling **init()** when **BigBrother** is allready running, will simply restart the scheduler.

It takes an optional parameter, which you can use to set the interval (in milliseconds) in which to evaluate your expressions. When called with no parameters, it will schedule to watch for changes on every frame (this is the default functionality).

If no interval is provided and **requestanimationframe** is not available it'll initialize with a 16 ms interval.

```typescript

BigBrother.init(); // Checks for updates on every frame. ( requestanimationframe() || setTimeout() )

// OR

BigBrother.init( 100 ); // Checks for updates every 100 milliseconds. ( setTimeout() )

```

### clear() and stop()

Use the clear() method to remove all watchers, and the stop() method to stop the scheduler.

```typescript

BigBrother.clear(); // Removes all watchers (hence, stops watching).

BigBrother.stop(); // Stops watching, but keeps watchers.

```

## Deep Watch

You can watch for changes within an object/array, simply by setting the deepWatch parameter to true.

```typescript

let fooObj = { foo: 5 };

BigBrother.watch(
  ()=> {
    return fooObj;
  },
  ( value )=> {
    console.log( "fooObj has changed, and its value is now ", value );
  },
  true // Watch for changes within deep nested values of the object returned by the expression
);

fooObj.foo = 1; // Will trigger the callback

```

## Optimization

Unless you are watching a huge amount of expressions or updating too many observed values multiple times a second, the **BigBrother** should not be heavy on the CPU. It will be hard on the RAM though, if you decide to watch too many large objects. So keep that in mind when calling **watch()**. Make sure you are being as specific as possible with your expressions to optimize for memory allocation and avoid heavy garbage collection.

