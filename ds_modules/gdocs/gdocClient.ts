import GdocCreator from './gdocCreator';

/**
 * Client method.
 * */

export default class GdocClient {
  static create(urlOrId: string): GdocCreator {
    return new GdocCreator().connect(urlOrId);
  }
}
