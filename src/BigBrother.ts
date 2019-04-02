import Watcher from './Watcher';

declare var global: any;
let raf: ( ( callback: ()=>any )=>number ) | undefined;
let cancelAf: ( ( handle: number )=> void );
setRAF();

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
      this.initWithSetTimeout();
    else if( !raf ) {
      this._interval = this._interval !== undefined ? this._interval : 16;
      this.initWithSetTimeout();
    }
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

  private static initWithSetTimeout() {
    this.executeEndlessTimeout();
    this._stop = () => {
      clearTimeout( this._request );
    }
  }

  private static executeEndlessTimeout() {
    this.evaluateWatchers();
    this._request = setTimeout( this.executeEndlessTimeout.bind(this), this._interval );
  }

  private static initWithRequestAnimationFrame() {
    this.executeEndlessLoop();
    this._stop = () => {
      cancelAf( this._request );
    }
  }

  private static executeEndlessLoop() {
    if( raf ) {
      this.evaluateWatchers();
      this._request = raf( this.executeEndlessLoop.bind(this) );
    }
  }

  private static evaluateWatchers() {
    if( this._watchers.length < 0 ) return this.stop();
    for( let i = 0; i < this._watchers.length; i++ ) {
      let watcher = this._watchers[i];
      watcher.run();
    }
  }
}

function setRAF() {
  try {
    raf = window.requestAnimationFrame;
    cancelAf = window.cancelAnimationFrame;
  }
  catch(err) {
    try {
      raf = global.requestAnimationFrame;
      cancelAf = global.requestAnimationFrame;
    }
    catch(err) {
      raf = undefined;
    }
  }
}
