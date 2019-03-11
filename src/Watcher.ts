export default class Watcher {
  private _expression: ()=> any;
  private _callback: ( value?: any, oldValue?: any )=> any;
  private _value: any;
  private _deepWatch: boolean;

  constructor( expression: ()=> any, callback: ()=> any, deepWatch?: boolean ) {
    this._expression = expression;
    this._callback = callback;
    this._deepWatch = deepWatch as boolean;
    this.evaluateExpression();
  }

  /** The current value returned by the expression */
  public get value(): any {
    return this._value;
  }

  /** Evaluates the expression and executes the watcher's callback if the value has changed */
  run() {
    let oldValue = this._value;
    this.evaluateExpression();

    if( oldValue !== this._value ) {
      this._callback( this._value, oldValue );
    }
    else if( this._deepWatch )
      this.runDeep( oldValue );
  }

  private runDeep( oldValue: object ) {
    for( let key in this._value ) {
      if( this._value[key] !== oldValue[key] )
        return this._callback( this._value, oldValue );
      else
        this.runDeep( oldValue[key] );
    }
  }

  private evaluateExpression() {
    this._value = this._expression();
  }
}
