import GdocCreator from './gdocCreator';

/**
 * Client method.
 * */
export default class GdocClient {
  public static create(urlOrId: string): GdocCreator {
    return new GdocCreator().connect(urlOrId);
  }
}

