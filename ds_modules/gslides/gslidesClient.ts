import GslidesCreator from './gslidesCreator';

/**
 * Client method.
 * */
export default class GslidesClient {
  public static create(urlOrId?: string): GslidesCreator {
    const slides = new GslidesCreator();
    return slides.connect(urlOrId);
  }
}
