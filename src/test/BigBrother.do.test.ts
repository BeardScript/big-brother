import BigBrother from '../BigBrother';

let controlValue1 = 0;
let controlValue2 = 0;
let controlValue3 = 0;

function scheduledAction1() {
  controlValue1++;
}

function scheduledAction2() {
  controlValue2++;
}

function scheduledAction3() {
  controlValue3++;
}

describe( 'Scheduled Actions', ()=> {
  
  beforeAll(()=>{
    controlValue1 = 0;
    controlValue2 = 0;
    controlValue3 = 0;
  });

  it( 'should execute on the next frame', ( done )=> {
    BigBrother.do( scheduledAction1 );

    requestAnimationFrame( ()=> {
      expect( controlValue1 ).toEqual( 2 );
      controlValue1 = 0;
      BigBrother.stop();
      BigBrother.clearScheduledActions();
      done();
    } );
  });

  it( 'should execute at the right time', ( done )=> {
    BigBrother.init( 100, "HighPriority" );
    BigBrother.init( 200, "MediumPriority" );
    BigBrother.init( 300, "LowPriority" );

    BigBrother.do( scheduledAction1, "HighPriority" );
    BigBrother.do( scheduledAction2, "MediumPriority" );
    BigBrother.do( scheduledAction3, "LowPriority" );

    setTimeout(()=>{
      expect( controlValue1 ).toEqual( 5 );
      expect( controlValue2 ).toEqual( 3 );
      expect( controlValue3 ).toEqual( 2 );
      done();
    }, 410 );
  });

  it( 'should stop execution of scheduled priorities at the right time', ( done )=> {
    BigBrother.stop("HighPriority");
    setTimeout(()=>{
      BigBrother.stop("MediumPriority");
      expect( controlValue1 ).toEqual( 5 );
      setTimeout(()=>{
        BigBrother.stop("LowPriority");
        expect( controlValue1 ).toEqual( 5 );
        expect( controlValue2 ).toEqual( 3 );
        setTimeout(()=>{
          expect( controlValue1 ).toEqual( 5 );
          expect( controlValue2 ).toEqual( 3 );
          expect( controlValue3 ).toEqual( 3 );
          controlValue1 = 0;
          controlValue2 = 0;
          controlValue3 = 0;
          done();
        }, 150 );
      }, 150 );
    }, 150 );
  });

  it( 'should clear all scheduled actions correctly and restart clean', ( done )=> {
    BigBrother.clearScheduledActions();

    BigBrother.init( 100, "HighPriority" );
    BigBrother.init( 200, "MediumPriority" );
    BigBrother.init( 300, "LowPriority" );

    BigBrother.do( scheduledAction1, "HighPriority" );
    BigBrother.do( scheduledAction2, "MediumPriority" );
    BigBrother.do( scheduledAction3, "LowPriority" );

    setTimeout(()=>{
      expect( controlValue1 ).toEqual( 5 );
      expect( controlValue2 ).toEqual( 3 );
      expect( controlValue3 ).toEqual( 2 );
      done();
    }, 410 );
  });

  it( 'should clear scheduled actions of a certain priority at the right time', ( done )=> {
    BigBrother.clearScheduledActions("HighPriority");
    setTimeout(()=>{
      BigBrother.clearScheduledActions("MediumPriority");
      expect( controlValue1 ).toEqual( 5 );
      setTimeout(()=>{
        BigBrother.clearScheduledActions("LowPriority");
        expect( controlValue1 ).toEqual( 5 );
        expect( controlValue2 ).toEqual( 3 );
        setTimeout(()=>{
          expect( controlValue1 ).toEqual( 5 );
          expect( controlValue2 ).toEqual( 3 );
          expect( controlValue3 ).toEqual( 3 );
          controlValue1 = 0;
          controlValue2 = 0;
          controlValue3 = 0;
          done();
        }, 150 );
      }, 150 );
    }, 150 );
  });

  it( 'should manually execute all scheduled actions with executeScheduledActions()', ()=> {
    controlValue1 = 0;
    controlValue2 = 0;
    controlValue3 = 0;
    BigBrother.clearScheduledActions();

    BigBrother.init( "manual", "HighPriority" );
    BigBrother.init( undefined, "MediumPriority" );
    BigBrother.init( 300, "LowPriority" );

    BigBrother.do( scheduledAction1, "HighPriority" );
    BigBrother.do( scheduledAction2, "MediumPriority" );
    BigBrother.do( scheduledAction3, "LowPriority" );

    BigBrother.executeScheduledActions();

    expect( controlValue1 ).toEqual( 1 );
    expect( controlValue2 ).toEqual( 2 );
    expect( controlValue3 ).toEqual( 2 );
  });

  it( 'should manually execute all scheduled actions with a certain priorityKey with executeScheduledActions(priorityKey)', ()=> {
    controlValue1 = 0;
    controlValue2 = 0;
    controlValue3 = 0;
    BigBrother.clearScheduledActions();

    BigBrother.init( 100, "HighPriority" );
    BigBrother.init( 200, "MediumPriority" );
    BigBrother.init( 300, "LowPriority" );

    BigBrother.do( scheduledAction1, "HighPriority" );
    BigBrother.do( scheduledAction2, "MediumPriority" );
    BigBrother.do( scheduledAction3, "LowPriority" );

    BigBrother.executeScheduledActions("HighPriority");
    expect( controlValue1 ).toEqual( 2 );
    expect( controlValue2 ).toEqual( 1 );
    expect( controlValue3 ).toEqual( 1 );

    BigBrother.executeScheduledActions("MediumPriority");
    expect( controlValue1 ).toEqual( 2 );
    expect( controlValue2 ).toEqual( 2 );
    expect( controlValue3 ).toEqual( 1 );

    BigBrother.executeScheduledActions("LowPriority");
    expect( controlValue1 ).toEqual( 2 );
    expect( controlValue2 ).toEqual( 2 );
    expect( controlValue3 ).toEqual( 2 );
  });

  it( 'should hook to an existing scheduler with the same interval', ( done )=> {
    controlValue1 = 0;
    controlValue2 = 0;
    controlValue3 = 0;
    BigBrother.clearScheduledActions();

    BigBrother.init( 100, "HighPriority" );
    BigBrother.do( scheduledAction1, "HighPriority" );

    let hookedControlValue = 0;

    BigBrother.do( ()=>{ hookedControlValue++ }, 100 );

    setTimeout(() => {
      expect( hookedControlValue ).toEqual( 2 );
      done();
    }, 110);
  });

  it( 'should throw an error if trying to assign a priority which does not exist', ()=> {
    BigBrother.clearScheduledActions();
    let tempControlValue = 0;

    expect( ()=> BigBrother.do( ()=>{ tempControlValue++ }, "WrongPriority" ) ).toThrow();
    expect( tempControlValue ).toEqual( 0 );
  });

});

