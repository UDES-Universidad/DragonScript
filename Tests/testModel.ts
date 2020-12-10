/**
 * Test module
 * */

export default class Test {
  /**
   * Gets functions and execute test.
   * */
  public run() {
    const TargetClass = this.getCurrentClass();
    const fnNames = Object
      .getOwnPropertyNames(TargetClass.prototype);
    const fnTest = fnNames.filter((name) => name.includes('test_'));
    const classInstance = new TargetClass();
    fnTest.forEach((fn) => {
      Logger.log(`Testing: ${fn}`);
      // try {
         classInstance[fn]();
      // } catch (error) {
      //   Logger.log(`ERROR: ${error}`);
      // }
      Logger.log('------------------------------');
    });
  }
  
  /**
   * Print result.
   * */
  protected printerResult(result: boolean) {
    if (result) {
      Logger.log('✔ Test OK');
    } else {
      Logger.log('NOT PASSED');
    }
  }
  
  /**
   * Gets the current class.
   * */
  protected getCurrentClass(): Test {
    const name = this.constructor.toString()
      .split(' ')[1]
      .replace('()', '');
    return eval(name);
  }
  
  /**
   * Check if tow items are equals, not works
   * for objects or arrays.
   * */
  protected assertIsEqual(item1: any, item2: any): void {
    this.printerResult(item1 === item2);
  }
  
  /**
   * Check if string includes a substring.
   * */
  protected assertStringIncludes(txt: string, txtBit: string): void {
    this.printerResult(txt.includes(txtBit));
  }
}
