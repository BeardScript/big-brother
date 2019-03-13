import Watcher from './Watcher';

/**
 * BigBrother is a singleton which stores and manages watchers
 */
export default class BigBrother {
  private static _watchers: Watcher[] = [];
  private static _stop: ()=> void = ()=> {};
  private static _request: number;
  private static _initialized: boolean = false;
  private static _interval: number | undefined;

  private constructor(){};

  /** Starts evaluating watchers on every frame or in the given interval ( in milliseconds ). Calling it multiple times will simply restart the watch process. */
  static init( interval?: number ) {
    if( this._initialized ) this.stop();
    
    this._initialized = true;
    this._interval = interval;

    if( this._interval !== undefined )
      this.initWithSetInterval( this._interval );
    else if( !requestAnimationFrame )
      this.initWithSetInterval( 1000/16 );
    else
      this.initWithRequestAnimationFrame();
  }

  /** Stops the scheduler */
  static stop() {
    this._stop();
    this._initialized = false;
  }

  /** Removes all watchers */
  static clear() {
    this._watchers = [];
  }

  /** Defines an expression to watch, and a callback to trigger when the returned value of the expression changes */
  static watch( expression: ()=> any, callback: ( value?: any, oldValue?: any )=> any, deepWatch?: boolean ) {
    let watcher = new Watcher( expression, callback, deepWatch as boolean );
    this._watchers.push( watcher );
    this.init( this._interval );

    return () => {
      let i = this._watchers.indexOf( watcher );
      this._watchers.splice( i, 1 );
    }
  }

  private static initWithSetInterval( interval: number ) {
    this._request = setInterval( this.evaluateWatchers.bind(this), interval );
    this._stop = () => {
      clearInterval( this._request );
    }
  }

  private static initWithRequestAnimationFrame() {
    this.executeEndlessLoop();
    this._stop = () => {
      cancelAnimationFrame( this._request );
    }
  }

  private static executeEndlessLoop() {
    this.evaluateWatchers();
    this._request = requestAnimationFrame( this.executeEndlessLoop.bind(this) );
  }

  private static evaluateWatchers() {
    if( this._watchers.length < 0 ) return this.stop();
    for( let i = 0; i < this._watchers.length; i++ ) {
      let watcher = this._watchers[i];
      watcher.run();
    }
  }
}
