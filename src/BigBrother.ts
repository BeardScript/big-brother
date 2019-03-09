import Watcher from './Watcher';

/**
 * BigBrother is a singleton which stores and manages watchers
 */
export default class BigBrother {
  private static _watchers: Watcher[] = [];
  private static _stop: ()=> void = ()=> {};
  private static _request: number;

  private constructor(){};

  /** Starts evaluating watchers on every frame or in the given interval ( in milliseconds ) */
  static init( interval?: number ) {
    if( interval !== undefined )
      this.initWithSetInterval( interval );
    else
      this.initWithRequestAnimationFrame();
  }

  static stop() {
    this._stop();
  }

  static clear() {
    this._watchers = [];
  }

  static watch( expression: ()=> any, callback: ( value?: any, oldValue?: any )=> any ) {
    let watcher = new Watcher( expression, callback );
    this._watchers.push( watcher );

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
    for( let i = 0; i < this._watchers.length; i++ ) {
      let watcher = this._watchers[i];
      watcher.run();
    }
  }
}
