export default class Watcher {
  private _expression: ()=> any;
  private _callback: ( value?: any, oldValue?: any )=> any;
  private _value: any;

  constructor( expression: ()=> any, callback: ()=> any ) {
    this._expression = expression;
    this._callback = callback;
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
  }

  private evaluateExpression() {
    this._value = this._expression();
  }
}
