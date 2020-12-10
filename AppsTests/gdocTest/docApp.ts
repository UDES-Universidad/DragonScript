import GDocsSettings from './settings';
import GdocClient from '../gdocs/gdocClient';
import GdocCreator from '../gdocs/gdocCreator';
import Test from '../Tests/testModel';

/**
 * Exec tester.
 * */
const GdocTester = () => new GdocTest().run();

/**
 * Tester class for Gdoc.
 * */
class GdocTest extends Test {
  private app?: GdocCreator;

  private constructor() {
    super();
    this.app = GdocClient.create(GDocsSettings.urlDoc);
  }

  private test_checkBodyIncludesString_1() {
    const txt = this.app.body.getText();
    const txtBit = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    const txtBit2 = 'Lorem ipsum dolor sit amet, adipiscing elit';
    this.assertStringIncludes(txt, txtBit);
    this.assertStringIncludes(txt, txtBit2);
  }
}
