/**
 * Deals with saving or creating documents.
 *
 * @class
 * @param {GaschAPI} lapi - An API client instance
 * @param {String} [id] - The current's document ID if it is known
 */
class SaveAgent {
  constructor(api, id)	{
    this.api = api;
    this.id = id;
  }

  /**
   * Saves the current document.
   *
   * @param {Object} data - The data to be saved
   * @returns {Promise}
   */
  save(data) {
    var p;

    // 1. If we have a new document...
    if(!this.id)
      p = this.api.post("/documents", data);
    else
      p = this.api.put("/documents/" + this.id, data);

    return p;
  }
}

module.exports = SaveAgent;
