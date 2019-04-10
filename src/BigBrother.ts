import Scheduler from './Scheduler';

/**
 * BigBrother is a singleton which stores and manages watchers
 */
export default class BigBrother {
  private static _priorities: IPrioritiesMap = {};
  private static _defaultPriority: string = "raf";

  private constructor(){};

  /** 
   * Starts the default priority Scheduler with the given interval 
   * If no interval is provided, it uses requestAnimationFrame by default.
   * If requestAnimationFrame is not available, it falls back to SetTimeout with an interval of 16 ms.
  */
  static init( interval?: number | "manual" ): void
  /** 
   * Starts a Scheduler with the given interval and priority key.
   * If the interval is undefined, it uses requestAnimationFrame.
   * If requestAnimationFrame is not available, it falls back to SetTimeout with an interval of 16 ms.
   */
  static init( interval: number | "manual" | undefined, priorityKey: string ): void
  static init( interval?: number | "manual", priorityKey?: string ) {
    priorityKey = priorityKey === undefined ? this._defaultPriority : priorityKey;

    if( this._priorities[priorityKey] === undefined )
      this._priorities[priorityKey] = new Scheduler( interval )
    else
      this._priorities[priorityKey].init( interval );
  }

  /** 
   * Stops the Scheduler with the given priorityKey.
   * If no priorityKey is given, all Schedulers will be stopped.
   */
  static stop( priorityKey?: string ) {
    if( priorityKey && this._priorities[priorityKey] )
      return this._priorities[priorityKey].stop();

    for( let key in this._priorities ) {
      this._priorities[key].stop();
    }
  }

  /** 
   * Removes all watchers of the given priorityKey.
   * If no priorityKey is provided, all watchers will be removed.
   */
  static clearWatchers( priorityKey?: string ) {
    if( priorityKey && this._priorities[priorityKey] )
      return this._priorities[priorityKey].clearWatchers();

    for( let key in this._priorities ) {
      this._priorities[key].clearWatchers();
    }
  }

  /** 
   * Schedules the execution of the given callback with the given priority.
   * If no priority is passed, it will use the default.
   * If the given priority key does not exist, it will start a .
  */
  static do( callback: ()=> any, priorityKey?: string ): ()=> void
  /** 
   * Schedules the execution of the given callback with the given interval.
   * If no interval is passed, it will use the default priority.
   * If the given interval matches a priority, it'll hook into its scheduler.
  */
  static do( callback: ()=> any, interval?: number ): ()=> void
  static do( callback: ()=> any, priorityOrInterval?: string | number ) {
    let scheduler: Scheduler;

    if( typeof priorityOrInterval === "string" ) {
      if( priorityOrInterval && this._priorities[priorityOrInterval] === undefined )
        throw "(BigBrother) Error: the provided priorityKey does not exist. Make sure you define it like this: BigBrother.init( 120, 'myPriorityKey' )";
      scheduler = this._priorities[priorityOrInterval];
    }
    else if( typeof priorityOrInterval === "number" ) {
      scheduler = this.getSchedulerByInterval( priorityOrInterval ) as Scheduler;
      if( scheduler === undefined )
        scheduler = this._priorities["auto_generated_priority_" + priorityOrInterval] = new Scheduler( priorityOrInterval );
    }
    else {
      scheduler = this._priorities["raf"] = this._priorities["raf"] || new Scheduler();
    }

    return scheduler.do( callback );
  }

  /** Defines an expression to watch, and a callback to trigger when the returned value of the expression changes */
  static watch( expression: ()=> any, callback: ( value?: any, oldValue?: any )=> any, deepWatch?: boolean, priorityKey?: string ) {
    if( priorityKey && this._priorities[priorityKey] === undefined )
      throw "(BigBrother) Error: the provided priorityKey does not exist. Make sure you define it like this: BigBrother.init( 120, 'myPriorityKey' )";
      
    priorityKey = priorityKey === undefined ? this._defaultPriority : priorityKey;
    this._priorities[priorityKey] = this._priorities[priorityKey] || new Scheduler();

    return this._priorities[priorityKey].watch( expression, callback, deepWatch );
  }

  /** 
   * Use this to evaluate all watchers of a given priority key.
   * If no priority key is provided, all watchers will be evaluated.
   */
  static evaluateWatchers( priorityKey?: string ) {
    if( priorityKey && this._priorities[priorityKey] )
      return this._priorities[priorityKey].evaluateWatchers();

    for( let key in this._priorities ) {
      this._priorities[key].evaluateWatchers();
    }
  }

  private static getSchedulerByInterval( interval: number ): Scheduler | undefined {
    for( let key in this._priorities ) {
      if( this._priorities[key].interval === interval )
        return this._priorities[interval];
    }
    return undefined;
  }
}

interface IPrioritiesMap {
  [priorityKey: string]: Scheduler;
}
