export default class Watcher {
  private _expression: ()=> any;
  private _callback: ( value?: any, oldValue?: any )=> any;
  private _oldValue: any;
  private _deepWatch: boolean;
  private _deps: IDeps = {};
  private _propsCount: number = 0;

  constructor( expression: ()=> any, callback: ()=> any, deepWatch?: boolean ) {
    this._expression = expression;
    this._callback = callback;
    this._deepWatch = deepWatch as boolean;
    this.saveOldValue();
  }

  /** The current value returned by the expression */
  public get value(): any {
    return this._expression();
  }

  /** Evaluates the expression and executes the watcher's callback if the value has changed */
  run() {
    if( this.hasChanged() ) {
      this._callback( this.value, this._oldValue );
      this.saveOldValue();
    } 
    else if( this._deepWatch ) {
      this.runDependencies();
    }
  }

  private runDependencies() {
    for( let key in this._deps ) {
      this._deps[key].run();
    }
  }

  private hasChanged() {
    if( this.value !== this._oldValue ) {
      return true;
    }
    else if( this.value instanceof Array && this._deepWatch ) {
      if( this.value !== this._oldValue || this.value.length !== this._propsCount )
        return true;
    }
    if( typeof this.value === "object" && this._deepWatch ) {
      if( this.value !== this._oldValue || Object.keys( this.value ).length !== this._propsCount )
        return true;
    } 
    return false;
  }

  private generateDependencies( object: object ) {
    this._deps = {};
    this._propsCount = 0;
    for( let key in object ) {
      this._deps[key] = new Watcher( ()=>{ return object[key] }, () => { this._callback( this.value, this._oldValue ) }, true )
      this._propsCount++;
    }
  }

  private saveOldValue() {
    this._oldValue = this.value;
    if( typeof this.value === "object" && this._deepWatch ) {
      this.generateDependencies( this.value );
    }
  }
}

interface IDeps {
  [ prop:string ]: Watcher;
}
