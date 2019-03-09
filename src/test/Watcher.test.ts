import Watcher from '../Watcher';

let callbackCheck: boolean;

let testValue: number;

let watcher: Watcher;

function expression() {
  return testValue;
}

function callback() {
  callbackCheck = true;
}

beforeEach( ()=>{
  callbackCheck = false;
  testValue = 1;
  watcher = new Watcher( expression, callback );
});

describe( 'watcher.value', ()=> {
  it( 'should be equal to the current return value of the expression', () => {
    expect( watcher.value ).toBe( 1 );
  });
});

describe( 'watcher.run()', ()=> {
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
