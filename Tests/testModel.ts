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
      try {
        classInstance[fn]();
      } catch (error) {
        Logger.log(`ERROR: ${error}`);
      }
      Logger.log('------------------------------');
    });
  }

  protected getCurrentClass(): Test {
    const name = this.constructor.toString().split(' ')[1];
    return eval(name);
  }

  protected sessertString(item1: string | number, item2: string | number): void {
    if (item1 === item2) {
      Logger.log('TEST OK');
    } else {
      Logger.log('Error');
    }
  }
}
