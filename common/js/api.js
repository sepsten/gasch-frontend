/*
Copyright 2016 sepsten

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var path = require("path"),
    request = require("superagent"),
    // A list of HTTP methods supported by superagent.
    methods = ["get", "head", "options", "delete", "patch", "post", "put"];

/**
 * HTTP API client which JSON Web Token authentication.
 *
 * @class
 * @param {String} root - The API's root URL
 */
module.exports = class GaschAPI {
  constructor(root) {
    /**
     * URL prefix used for every request.
     *
     * @type {String}
     */
    this.prefix = root;

    /**
     * True if the client has a valid token.
     *
     * @private
     * @type {Boolean}
     */
    this.authenticated = false;

    /**
     * JSON Web Token used to authenticate requests to the server.
     *
     * @private
     * @type {String}
     */
    this.token = "";

    // Adds methods for every HTTP verb supported by superagent
    var self = this;
    methods.forEach(function(verb) {
      /**
       * Sends a request to the API. The JSON parsing is taken care of.
       * A GaschAPI instance hence has `get`, `post`, etc. methods.
       *
       * @alias GaschAPI#httpVerb
       * @param {String} url - The endpoint to call
       * @param {Object} [body] - An object to send
       * @returns Promise
       */
      self[verb] = function(url, body) {
        var req = self._makeReq(verb, url, body);
        return self._sendReq(req);
      };
    });
  }

  /**
   * Tries to authenticate a given user to the server.
   *
   * @param {String} user - The username
   * @param {String} pass - The password
   * @returns Promise
   */
  requestToken(user, pass) {
    var req = this._makeReq("GET", "/token", null, false);
    req.auth(user, pass); // HTTP Basic Authentication

    var self = this;
    return this._sendReq(req).then(function(res) {
      self.authenticated = true;
      self.token = res.token;
    });
  }

  /**
   * Prepares a request to the server.
   *
   * @private
   * @param {String} method
   * @param {String} url
   * @param {Object} [body] - A JSON object that will be sent
   * @param {Boolean} [auth=true] - Should the request be authenticated.
   * @returns An superagent request object
   */
  _makeReq(method, url, body, auth=true) {
    var req = request(method, this.prefix + url);

    // Authenticate the request if necessary and possible
    if(auth && this.authenticated) {
      req.set("Authorization", "Bearer " + this.token);
    }

    if(body) {
      req.send(body); // Doesn't actually send the request...
    }

    return req;
  }

  /**
   * Turns the superagent request into a promise, adds listeners and executes
   * it.
   *
   * @param {Object} req
   * @returns An ES6 promise
   */
  _sendReq(req) {
    // Turns the thenable into an actual promise and sends the request
    var p = Promise.resolve(req);

    // Add callbacks which update the state of the API client
    /*p.then(function(result) {

    }).catch(function(err) {

    });*/

    return p;
  }
}
