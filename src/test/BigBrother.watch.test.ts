import BigBrother from '../BigBrother';

let callbackCheck: boolean = false;
let controlValue = 0;
let controlOldValue = 0;

let testValue: number = 1;

const expression = ()=> testValue;

const callback = ( value, oldValue )=> {
  callbackCheck = true;
  controlValue = value
  controlOldValue = oldValue;
}

let callbackCheck2: boolean = false;

let testValue2 = { foo: 1, obj: { bar: 1 } };

let controlValue2 = 0;
let controlOldValue2 = 0;

const expression2 = ()=> testValue2;

function callback2( value, oldValue ) {
  callbackCheck2 = true;
  controlValue2 = value;
  controlOldValue2 = oldValue;
}

describe( 'Detecting changes on every frame', ()=> {

  beforeEach(()=>{
    BigBrother.watch( expression, callback );
    callbackCheck = false;
    callbackCheck2 = false;
  });

  afterEach(()=>{
    BigBrother.clearWatchers();
  })

  it( '(1 watcher) should trigger callback on the next frame, when the expression value changes', ( done )=> {
    let oldValue = testValue;
    testValue = 5;
    requestAnimationFrame( ()=> {
      expect( callbackCheck ).toEqual( true );
      expect( controlValue ).toEqual( testValue );
      expect( controlOldValue ).toEqual( oldValue );
      done();
    });
  });

  it( '(2 watchers, 1 nested value) should trigger callback on the next frame, when the expression value changes', ( done )=> {
    BigBrother.watch( expression2, callback2, true );
    testValue = 10;
    testValue2.foo = 5;
    requestAnimationFrame( ()=> {
      expect( callbackCheck ).toEqual( true );
      expect( callbackCheck2 ).toEqual( true );
      expect( controlValue2 ).toEqual( testValue2 );
      done();
    });
  });

  it( '(2 watchers, 1 nested value) should trigger callback on the next frame, when the expression value changes', ( done )=> {
    BigBrother.watch( expression2, callback2, true );
    testValue2.obj.bar = 5;
    requestAnimationFrame( ()=> {
      expect( callbackCheck2 ).toEqual( true );
      expect( controlValue2 ).toEqual( testValue2 );
      done();
    });
  });

  it( 'Should not trigger callback if object does not change', ( done )=> {
    BigBrother.watch( expression2, callback2 );
    requestAnimationFrame( ()=> {
      expect( callbackCheck2 ).toEqual( false );
      done();
    });
  });

  it( 'Should not trigger callback if object does not change, on deep watch', ( done )=> {
    BigBrother.watch( expression2, callback2, true );
    requestAnimationFrame( ()=> {
      expect( callbackCheck2 ).toEqual( false );
      done();
    });
  });

  it( 'Should NOT detect changes after calling BigBrother.clear()', ( done )=> {
    BigBrother.clearWatchers();
    testValue = 15;
    requestAnimationFrame( ()=> {
      expect( callbackCheck ).toEqual( false );
      done();
    });
  });

  it( 'Should stop watching for changes on BigBrother.stop()', ( done )=> {
    BigBrother.stop();
    testValue = 20;
    requestAnimationFrame( ()=> {
      expect( callbackCheck ).toEqual( false );
      done();
    });
  });

});

describe( 'Detecting changes on the given interval', ()=> {
  beforeAll( ()=> {
    testValue = 1;
    testValue2 = { foo: 1, obj: { bar: 1 } };
  });

  beforeEach(()=>{
    BigBrother.init( 500 );
    BigBrother.watch( expression, callback );
    callbackCheck = false;
    callbackCheck2 = false;
  });

  afterEach(()=>{
    BigBrother.stop();
    BigBrother.clearWatchers();
  });

  it( '(1 watcher) should trigger callback on the next interval, when the expression value changes', ( done )=> {
    testValue = 5;
    setTimeout( ()=>{
      expect( callbackCheck ).toEqual( true );
      done();
    }, 501);
  });

  it( 'should NOT trigger callback before the next interval, when the expression value changes', ( done )=> {
    testValue = 10;
    setTimeout( ()=>{
      expect( callbackCheck ).toEqual( false );
      done();
    }, 5);
  });

  it( '(2 watchers, 1 nested value) should trigger callback on the next interval, when the expression value changes', ( done )=> {
    BigBrother.watch( expression2, callback2, true );
    testValue = 15;
    testValue2.foo = 5;
    setTimeout( ()=> {
      expect( callbackCheck ).toEqual( true );
      expect( callbackCheck2 ).toEqual( true );
      done();
    }, 501);
  });

  it( 'Should stop watching for changes on BigBrother.stop()', ( done )=> {
    BigBrother.stop();
    testValue = 20;
    setTimeout( ()=> {
      expect( callbackCheck ).toEqual( false );
      done();
    }, 501);
  });

});
