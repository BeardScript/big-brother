export default class Watcher {
  private _expression: ()=> any;
  private _callback: ()=> any;
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

  /** Returns the watched expression's result */
  get() {
    return this._expression();
  }

  /** Evaluates the expression and executes the watcher's callback if the value has changed */
  run() {
    let oldValue = this._value;
    this.evaluateExpression();

    if( oldValue !== this._value ) {
      this._callback();
    }
  }

  private evaluateExpression() {
    this._value = this.get();
  }
}
