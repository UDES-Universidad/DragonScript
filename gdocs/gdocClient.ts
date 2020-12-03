import GdocCreator from './gdocCreator';

/**
 * Client method.
 * */
namespace GdocClient {
  export default const create = (urlOrId: string): GdocCreator => (
    new GdocCreator().connect(urlOrId)
  );
}
