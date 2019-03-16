export default class Watcher {
  private _expression: ()=> any;
  private _callback: ( value?: any, oldValue?: any )=> any;
  private _oldValue: any;
  private _deepWatch: boolean;

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
    let value = this.value;

    if( 
      ( this._oldValue !== value && !this._deepWatch ) || ( 
        this._deepWatch &&
        this.runDeep( value, this._oldValue ) 
      )
    ) {
      this._callback( value, this._oldValue );
      this.saveOldValue();
    }
  }

  private runDeep( value: any, oldValue: any ): boolean {
    for( let key in value ) {
      if( value[key] !== oldValue[key] || this.runDeep( value[key], oldValue[key] ) )
        return true;
    }
    return false;
  }

  private cloneObject( object ) {
    const clone = {};

    for( let key in object ) {
      if( typeof object[key] === "object" )
        clone[key] = this.cloneObject( object[key] );
      else
        clone[key] = object[key];
    }

    return clone;
  }

  private saveOldValue() {
    let value = this.value;
    this._oldValue = typeof value === "object" ? this.cloneObject( value ) : value;
  }
}
