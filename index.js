/*!
 * template-config <https://github.com/jonschlinkert/template-config>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var extend = require('extend-shallow');

module.exports = function (app) {
  if (typeof app !== 'object' || typeof app.create !== 'function') {
    throw new Error('template-config expects an instance of Template');
  }

  return function templateConfig(config, cb) {
    config = config || {};

    var options = extend({}, config, config.options);
    delete options.templates;

    var cwd = config.base || 'templates' || process.cwd();
    var templates = config.templates || {};

    for (var key in templates) {
      if (templates.hasOwnProperty(key)) {
        var settings = templates[key];
        var opts = extend({}, options, settings.options);

        opts.cwd = opts.cwd || settings.base || key;
        opts.cwd = path.resolve(cwd, opts.cwd);
        if (typeof app[key] !== 'function') {
          app.create(key, opts);
        }
        app[key](settings.patterns, opts);
      }
    }
    if (typeof cb === 'function') cb();
  };
};
