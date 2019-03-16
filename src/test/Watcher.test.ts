import Watcher from '../Watcher';

let callbackCheck: boolean;

let testValue: any;

let watcher: Watcher;

function expression() {
  return testValue;
}

function callback() {
  callbackCheck = true;
}

describe( 'watcher.value', ()=> {

  beforeEach( ()=>{
    callbackCheck = false;
    testValue = 1;
    watcher = new Watcher( expression, callback );
  });

  it( 'should be equal to the current return value of the expression', () => {
    expect( watcher.value ).toBe( 1 );
  });
});

describe( 'watcher.run()', ()=> {

  beforeEach( ()=>{
    callbackCheck = false;
    testValue = 1;
    watcher = new Watcher( expression, callback );
  });

  it( 'should not execute callback if there are no changes', () => {
    watcher.run();
    expect( callbackCheck ).toBe( false );
  });

  it( 'should execute callback if the expression value changed', () => {
    testValue = 5;
    watcher.run();
    expect( callbackCheck ).toBe( true );
  });
});

describe( 'Deep Watch', ()=> {

  beforeEach( ()=>{
    callbackCheck = false;
  });

  it( 'should execute callback if an element of an array changes', () => {
    testValue = [];
    testValue.push(1);
    watcher = new Watcher( expression, callback, true );

    testValue[0] = 5;
    watcher.run();
    
    expect( callbackCheck ).toBe( true );
  });

  it( 'should execute callback when adding an element to an array', () => {
    testValue = [];
    testValue.push(1);
    watcher = new Watcher( expression, callback, true );

    testValue.push(5);
    watcher.run();
    
    expect( callbackCheck ).toBe( true );
  });

  it( 'should execute callback if a nested member of the expression value changed', () => {
    testValue = { 
      foo: 1
    };
    watcher = new Watcher( expression, callback, true );

    testValue.foo = 5;
    watcher.run();
    
    expect( callbackCheck ).toBe( true );
  });

  it( 'should execute callback when adding a member to an object', () => {
    testValue = { 
      foo: 1
    };
    watcher = new Watcher( expression, callback, true );

    testValue["bar"] = 5;
    watcher.run();
    
    expect( callbackCheck ).toBe( true );
  });

  it( 'should execute callback if a deep nested member of the expression value changed', () => {
    testValue = { 
      foo: {
        fooFoo: 1
      }
    };
    watcher = new Watcher( expression, callback, true );

    testValue.foo.fooFoo = 5;
    watcher.run();
    
    expect( callbackCheck ).toBe( true );
  });

  it( 'should execute callback if a deep nested member of the expression is added', () => {
    testValue = { 
      foo: {
        fooFoo: 1
      }
    };
    watcher = new Watcher( expression, callback, true );

    testValue.foo["bar"] = 5;
    watcher.run();
    
    expect( callbackCheck ).toBe( true );
  });
});
