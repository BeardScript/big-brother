# BigBrother
A scheduler management tool for javascript.

This lightweight and programmer friendly module, written entirely in typescript, provides the means to manage multiple schedulers from one place, making it simple and stress free. BigBrother keeps track of everything so that you don't have to.

## Features

- Initialize multiple schedulers with different priorities.
- Schedule actions with the desired priority.
- Watch for value changes in expressions.
- Stop and re-initialize your schedulers at will.
- Flexible and user friendly API.

# Instructions

## Install

```bash

npm install big-brother-js --save

```

## Usage

### init()

To initialize the default scheduler which uses **requestAnimationFrame** by default (falls back to 16 ms **setTimeout**) simply call init() with no parameters:

```typescript

BigBrother.init(); // Runs the scheduler on every frame. ( requestanimationframe() || setTimeout() )

```

Note: You don't need to initialize the default scheduler, unless you deliberately stop it and wish to restart it. Any call to **watch()** or **do()** without providing an interval or **priorityKey** will autimatically fire it.

To initialize a scheduler other than the default, you have to specify the update interval and a **priorityKey**.

```typescript

BigBrother.init( 100, "highPriority" ); // Runs the scheduler every 100 ms.
BigBrother.init( 500, "midPriority" ); // Runs the scheduler every 500 ms.
BigBrother.init( 1000, "lowPriority" ); // Runs the scheduler every 1000 ms.

```

### stop()

Use this method to stop the scheduler corresponding to the given **priorityKey**. call it with no paremeters to stop all schedulers. 

```typescript

BigBrother.stop( "someCustomPriority" ); // Stop only the scheduler with the given priorityKey

BigBrother.stop(); // Stop all schedulers

```

### do()

Schedules the execution of actions with the desired priority or update interval.

To execute an action with the default scheduler simply call **do()** with a callback function.

```typescript

BigBrother.do( ()=> "Hello Default Scheduler" ); // Will excecute the callback on every frame.

```

To execute an action with a specific scheduler, pass the **priorityKey** of the scheduler you wish to use.

```typescript

BigBrother.init( 100, "customPriority" );
BigBrother.do( ()=> "Hello customPriority Scheduler", "customPriority" ); // Will execute the callback every 100 ms

BigBrother.init( 1000, "veryLowCustomPriority" );
BigBrother.do( ()=> "Hello veryLowCustomPriority Scheduler", "veryLowCustomPriority" ); // Will execute the callback every 1000 ms

```

Note: if the given **priorityKey** does not exist, it'll throw an error.

Instead of a **priorityKey** you could give it an update interval. If there's no scheduler with the same interval, it'll automatically create a new one. Otherwise, it'll hook to a matching scheduler.

```typescript

BigBrother.init( 100, "customPriority" );

BigBrother.do( ()=> doSomething(), 100 ); // Will hook to "customPriority"
BigBrother.do( ()=> doSomething(), 255 ); // Will create a new scheduler
BigBrother.do( ()=> doSomethingElse(), 255 ); // Will hook to the scheduler created by the above action

```

To stop scheduling an action, call the function returned by **do()**.

```typescript

let stopSchedulingAction = BigBrother.do( ()=> doSomething() );

stopSchedulingAction();

```

### clearScheduledActions()

Use this method to remove either all scheduled actions, or only those from the selected Scheduler.

```typescript

BigBrother.clearScheduledActions( "someCustomPriority" ); // Clears only the scheduled actions with the given priority

BigBrother.clearScheduledActions(); // Clears all scheduled actions

```

### watch()

Watches for changes in the return value of an expression. It requires two functions as parameters. The first one being the expression to watch, and the second, the callback to trigger when a change is detected. Any call to **watch()** will automatically initialize the scheduler if it's not running already.

```typescript

import BigBrother from 'big-brother-js';

let foo = 1;

BigBrother.watch( ()=> foo, value => console.log( "foo has changed, and its value is now ", value ) );

```
You can watch for changes within an object/array, simply by setting the deepWatch parameter to true:

```typescript

let fooObj = { foo: 5 };

BigBrother.watch( ()=> return fooObj, value => doSomething(), true ); // Watch for changes within deep nested values of an object

fooObj.foo = 1; // Will trigger the callback

```

Just like with **do()** you can schedule to watch for changes using any of your previously defined schedulers by passing its **priorityKey** as the fourth parameter:

```typescript

BigBrother.init( 100, "highPriority" );

let foo = 1;

BigBrother.watch( ()=> return foo, ( value )=> doSomething(), false, "highPriority" ); // Will watch for changes every 100 ms

```

Note: Please keep in mind that the bigger the objects you are watching, the higher amount of resources BigBrother will need in order to keep track of them. So be mindful of this when calling **watch()**. Keep your expressions specific and your callbacks with the lowest computational complexity possible.

### clearWatchers()

Use this method to remove either all watchers, or only those from the selected Scheduler.

```typescript

BigBrother.clearWatchers( "someCustomPriority" ); // Clears only watchers with the given priority

BigBrother.clearWatchers(); // Clears all watchers

```

## About BigBrother.

This tool is still in development, and there's still a lot to improve. Use at your own peril. If you find any bugs, please open a ticket.

If you feel like giving some feedback or just wish to say hi, [Hit me on twitter]: https://twitter.com/BeardScript

