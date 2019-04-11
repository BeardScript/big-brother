import Watcher from './Watcher';

declare var global: any;
let raf: ( ( callback: ()=>any )=>number ) | undefined;
let cancelAf: ( ( handle: number )=> void );
setRAF();

export default class Scheduler {
  private _watchers: Watcher[] = [];
  private _stop: ()=> void = ()=> {};
  private _request: number;
  private _initialized: boolean = false;
  private _interval: number | "manual" | undefined;
  private _scheduledActions: ( ()=> any )[] = [];

  constructor( interval?: number | "manual" ) {
    this.init( interval );
  }

  get interval() {
    return this._interval;
  }

  init( interval?: number | "manual" ) {
    if( this._initialized ) this.stop();
    
    this._initialized = true;
    this._interval = interval;

    if( typeof this._interval === "number" )
      this.initWithSetTimeout();
    else if( this._interval === "manual" )
      return;
    else if( !raf ) {
      this._interval = this._interval !== undefined ? this._interval : 16;
      this.initWithSetTimeout();
    }
    else
      this.initWithRequestAnimationFrame();
  }

  do( callback: ()=> any ) {
    this._scheduledActions.push( callback );
    this.init( this._interval );

    return () => {
      let i = this._scheduledActions.indexOf( callback );
      this._scheduledActions.splice( i, 1 );
    }
  }

  watch( expression: ()=> any, callback: ( value?: any, oldValue?: any )=> any, deepWatch?: boolean ) {
    let watcher = new Watcher( expression, callback, deepWatch as boolean );
    this._watchers.push( watcher );
    this.init( this._interval );

    return () => {
      let i = this._watchers.indexOf( watcher );
      this._watchers.splice( i, 1 );
    }
  }

  stop() {
    this._stop();
    this._initialized = false;
  }

  clearWatchers() {
    this._watchers = [];
  }

  clearScheduledActions() {
    this._scheduledActions = [];
  }

  evaluateWatchers() {
    if( this._watchers.length < 0 ) return this.stop();
    for( let i = 0; i < this._watchers.length; i++ ) {
      let watcher = this._watchers[i];
      watcher.run();
    }
  }

  executeScheduledActions() {
    if( this._scheduledActions.length < 0 ) return this.stop();
    for( let i = 0; i < this._scheduledActions.length; i++ ) {
      this._scheduledActions[i]();
    }
  }

  run() {
    this.evaluateWatchers();
    this.executeScheduledActions();
  }

  private initWithSetTimeout() {
    this.executeTimeoutLoop();
    this._stop = () => {
      clearTimeout( this._request );
    }
  }

  private executeTimeoutLoop() {
    this.run();
    this._request = setTimeout( this.executeTimeoutLoop.bind(this), this._interval as number );
  }

  private initWithRequestAnimationFrame() {
    this.executeRafLoop();
    this._stop = () => {
      cancelAf( this._request );
    }
  }

  private executeRafLoop() {
    if( raf ) {
      this.run();
      this._request = raf( this.executeRafLoop.bind(this) );
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
