"use strict";
var blessed = require('neo-blessed')
  , Box = blessed.Box
  , marked = require('marked')
  , TerminalRenderer = require('marked-terminal')
  , chalk = require('chalk');


function Markdown(options) {
  if (!(this instanceof Box)) {
    return new Markdown(options);
  }

  options = options || {};

  const markdownOptions = {
    style: options.markdownStyle
  };

  this.evalStyles(markdownOptions);

  this.setOptions(markdownOptions.style);

  this.options = options;
  Box.call(this, options);

  if (options.markdown) this.setMarkdown(options.markdown);
}

Markdown.prototype = Object.create(Box.prototype);

Markdown.prototype.setMarkdown = function(str) {
  this.setContent(marked(str));
};

Markdown.prototype.setOptions = function(style) {
  marked.setOptions({
    renderer: new TerminalRenderer(style)
  });
};

Markdown.prototype.evalStyles = function(options) {
  if (!options.style) return;
  for (var st in options.style) {
    if (typeof(options.style[st])!="string") continue;

    var tokens = options.style[st].split('.');
    options.style[st] = chalk;
    for (var j=1; j<tokens.length; j++) {
      options.style[st] = options.style[st][tokens[j]];
    }
  }
};

Markdown.prototype.getOptionsPrototype = function() {
  return {
    markdown: 'string',
    markdownStyle: 'object'
  }
};

Markdown.prototype.type = 'markdown';

module.exports = Markdown;
