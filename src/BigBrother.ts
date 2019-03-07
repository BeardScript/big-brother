import Watcher from './Watcher';

/**
 * BigBrother is a singleton which stores and manages watchers
 */
export default class BigBrother {
  private _watchers: Watcher[];
  private _stop: ()=> void;
  private _request: number;

  private constructor(){};

  /** Starts evaluating watchers on every frame or in the given interval ( in milliseconds ) */
  init( interval?: number ) {
    if( interval !== undefined )
      this.initWithSetInterval( interval );
    else
      this.initWithRequestAnimationFrame();
  }

  stop() {
    this._stop;
  }

  watch( expression: ()=> any, callback: ()=> any ) {
    let watcher = new Watcher( expression, callback );
    this._watchers.push( watcher );

    return () => {
      let i = this._watchers.indexOf( watcher );
      this._watchers.splice( i, 1 );
    }
  }

  private initWithSetInterval( interval: number ) {
    this._request = setInterval( this.evaluateWatchers.bind(this), interval );
    this._stop = () => {
      clearInterval( this._request );
    }
  }

  private initWithRequestAnimationFrame() {
    this.executeEndlessLoop();
    this._stop = () => {
      cancelAnimationFrame( this._request );
    }
  }

  private executeEndlessLoop() {
    this.evaluateWatchers();
    this._request = requestAnimationFrame( this.evaluateWatchers.bind(this) );
  }

  private evaluateWatchers() {
    for( let i = 0; i < this._watchers.length; i++ ) {
      let watcher = this._watchers[i];
      watcher.run();
    }
  }
}
