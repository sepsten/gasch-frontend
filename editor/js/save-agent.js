var api = require("./../../common/js/client");

/**
 * Deals with saving or creating documents on the server.
 *
 * @class
 * @param {String} [id] - The current's document ID if it is known
 * @param {Piotr.History} history - The current Piotr history instance
 */
class SaveAgent {
  constructor(id)	{
    /**
     * A reference to the API client.
     *
     * @type {GaschAPI}
     */
    this.api = api;

    /**
     * The current document's ID.
     *
     * @type {Number}
     */
    this.id = id;

    /**
     * A reference to the current history instance.
     *
     * @type {Piotr.History}
     */
    this.history = history;
  }

  /**
   * Saves the current document.
   *
   * @param {Object} data - The data to be saved
   * @returns {Promise}
   */
  save(data) {
    var p, self = this;

    var url = "/documents";
    var method = "post";
    // If the document already exists, add its ID to the URL
    if(this.id) {
      url += "/" + this.id;
      method = "put";
    }

    p = this.api[method](url, data).then(function(res) {
      // Update the stored ID
      if(res.body) self.id = res.body.id;
    });

    return p;
  }

  /**
   * Returns true if there are changes to be saved.
   *
   * @returns {Boolean}
   */
  /*canSave() {
    // Don't save is the document was not modified since opening.
    if(this.lastChange === null) return false;

    // Return: is history's cursor different from our last saved change ?
    return this.lastChange !== this.history.stack[this.history.cursor];
  }*/
}

module.exports = SaveAgent;
