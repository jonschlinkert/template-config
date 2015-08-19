'use strict';

var path = require('path');
var glob = require('glob');
var template = require('template');
var Renamer = require('easy-renamer');
var renamer = new Renamer();
var app = template();
var config = require('./')(app);

// add a `config` method to `app`
app.mixin('config', config);
app.mixin('rewrite', renamer.match.bind(renamer));
app.mixin('rewritePath', renamer.rename.bind(renamer));

// the following config will automatically create the
// specified template collections, and load files from
// the provided directories based on the glob patterns
app.config({
  base: 'fixtures/templates',
  renameKey: function (key) {
    return path.basename(key, path.extname(key));
  },
  templates: {
    pages: {
      base: 'pages',
      patterns: '*.hbs',
      options: {},
    },
    posts: {
      base: 'posts',
      patterns: '*.md',
      options: {},
    },
    layouts: {
      base: 'layouts',
      patterns: '*.hbs',
      options: { viewType: 'layout' },
    },
    includes: {
      base: 'includes',
      patterns: '*.hbs',
      options: { viewType: 'partial' },
    }
  }
});


function extname(ext) {
  return function(file) {
    return path.join(file.dirname, file.name + ext);
  };
}

app.rewrite('**/*.md', extname('.html'));
app.rewrite(/foo\/.*\.less$/, extname('.css'));
app.rewrite(/\.js$/, extname('.foo'));

glob('**/*', function(err, files) {
  files.forEach(function(fp) {
    fp = app.rewritePath(fp);
    console.log(fp);
  });
});
