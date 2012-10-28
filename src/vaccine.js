'use strict';

var templateFiles = ['vaccine.js', 'Makefile', 'build.sh', 'dev_server.js'],
    templateText = {},
    conditionals = {};

var templateMap = {
  'vaccine.js': 'vaccine.js',
  'Makefile': 'Makefile',
  'build.sh': 'build.sh',
  'dev_server.js': 'dev_server.js',
  'vaccine_dev.js': 'vaccine.js',
};

var macroMap = {
  '?????': 'if',
  '=====': 'elsif',
  '/////': 'end',
  ':::::': 'else',
};

var name,
    globalName,
    libraryDir,
    format,
    performance,
    debug,
    dev,
    devPerformance,
    devDebug,
    useStrict,
    dependencies = [],
    depString,
    umdDepString,
    numDeps,
    dirs,
    supportsArray,
    exportsArray,
    targets,
    sourceDir,
    main;

var has = function(array, item) {
  return array.indexOf(item) >= 0;
};

var maybeHas = function(array, item) {
  if (!array) return false;
  return has(array, item);
};

var exprts = function(exprtsType) {
  return has(exportsArray, exprtsType);
};

var supports = function(supportsType) {
  return has(supportsArray, supportsType);
};

var remove = function(array, item) {
  array.splice(array.indexOf(item), 1);
};

module.exports = exports = function(options) {

  setOptions(options);

  return targets.map(function(target) {
    if (target === 'vaccine_dev.js') {
      var old = {
        debug: debug,
        performance: performance,
        supportsArray: supportsArray
      };
      dev = true;
      debug = devDebug;
      performance = devPerformance;
      supportsArray = [];
    }
    var compiled = compileTemplate(templateMap[target]);
    if (target === 'vaccine_dev.js') {
      dev = false;
      debug = old.debug;
      performance = old.performance;
      supportsArray = old.supportsArray;
    }
    return {name: target, compiled: compiled};
  });
};

exports.validateOptions = function(opts) {
  var problems = [];
  var setDefault = function(option, value) {
    var fix = function(options) { options[option] = value; };
    var options = [{group: option, parts: value}];
    problems.push({options: options, fix: fix});
  };
  var maybeDefault = function(option, value) {
    if (!opts[option] || !opts[option].length) setDefault(option, value);
  };
  var mismatch = function(options, fix) {
    problems.push({options: options, fix: fix});
  };
  var formatMismatch = function(fmt, options, fix) {
    options.push({group: 'format', parts: [fmt]});
    mismatch(options, fix);
  };

  var format = opts.format;
  switch (format) {
    case 'amd':
      maybeDefault('supports', ['amd', 'window']);
      maybeDefault('exports', ['module', 'exports', 'return']);
      maybeDefault('targets', ['vaccine.js', 'build.sh']);
      break;
    case 'commonjs':
      maybeDefault('supports', ['amd', 'window', 'commonjs']);
      maybeDefault('exports', ['module', 'exports']);
      maybeDefault('targets', ['vaccine.js', 'build.sh']);
      break;
  }

  if (maybeHas(opts.exports, 'module') && !maybeHas(opts.exports, 'exports')) {
    mismatch([{group: 'exports', parts: ['module', 'exports']}],
             function(options) {
      options.exports.push('exports');
    });
  }

  if (maybeHas(opts.supports, 'commonjs') && format === 'amd') {
    formatMismatch('amd', [{group: 'supports', parts: ['commonjs']}],
          function(options) {
      remove(options.supports, 'commonjs');
    });
  }
  if (!maybeHas(opts.supports, 'commonjs') && format === 'commonjs') {
    formatMismatch('commonjs', [{group: 'supports', parts: ['commonjs']}],
          function(options) {
      options.supports.push('commonjs');
    });
  }
  if (opts.supports && opts.supports.length === 1 &&
                       opts.supports[0] === 'commonjs') {
    mismatch([{group: 'supports', parts: ['commonjs']}], function(options) {
      options.supports.push('window');
    });
  }
  if (format === 'commonjs' && maybeHas(opts.exports, 'return')) {
    formatMismatch('commonjs', [{group: 'exports', parts: ['return']}],
          function(options) {
      remove(options.exports, 'return');
    });
  }
  return problems;
}

var setOptions = function(options) {
  name = options.name;
  globalName = options.global || options.name;
  libraryDir = options.lib;
  format = options.format;
  performance = options.performance;
  debug = options.debug;
  devDebug = !options.dev_no_debug;
  devPerformance = !options.dev_no_performance;
  useStrict = options.use_strict;
  dependencies = options.dependencies || [];
  numDeps = dependencies.length;
  depString = "['" + dependencies.join("', '") + "']";
  dirs = options.dirs;
  supportsArray = options.supports;
  exportsArray = options.exports;
  targets = options.targets;

  var cleanedMain = options.main.replace(/^\.\//, '').replace(/\.js$/, '');
  if (options.src) {
    sourceDir = options.src.replace(/^\.\//, '');
  } else {
    var mainSplit = cleanedMain.split('/');
    mainSplit.pop();
    sourceDir = mainSplit.join('/') || '.';
  }
  main = cleanedMain.replace(new RegExp('^' + sourceDir + '/'), '');

  if (format === 'umd') {
    umdDepString = '[';
    if (exprts('exports')) {
      umdDepString += "'exports'";
      if (exprts('module')) umdDepString += ", 'module'";
      if (numDeps > 0) umdDepString += ', ';
    }
    if (numDeps > 0) {
      umdDepString += "'" + dependencies.join("', '") + "'";
    }
    umdDepString += ']';
  }
};


var compileTemplate = function(templateName) {
  var template = templateText[templateName],
      stack = [],
      top = {enabled: true},
      enabled = true,
      stackEnabled = true,
      first = true,
      compiled = '';

  template.split('\n').forEach(function(line) {
    var match = line.match(/([?\/=:]{5})( .*)?$/);
    if (match) {
      var type = macroMap[match[1]];
      if (type === 'end' || type === 'if') {
        if (type === 'end') top = stack.pop();
        if (type === 'if') {
          stack.push(top);
          top = {};
        }
        stackEnabled = stack.every(function(d) { return d.enabled; });
      }
      if (stackEnabled && type !== 'end') {
        if (top.wasTrue) {
          top.enabled = false;
        } else {
          if (type === 'else') {
            top.enabled = true;
          } else {
            top.enabled = evaluate(match[2]);
          }
        }
        top.wasTrue = top.wasTrue || top.enabled;
      }
      enabled = stackEnabled && top.enabled;
    } else {
      if (enabled) {
        var compiledLine = line.replace(/\$--(.*?)--\$/g, function(match, group) {
          return eval(group);
        });
        compiled += compiledLine.replace(/^    /, '') + '\n';
      }
    }
  });
  return compiled.slice(0, -1);   // Remove last newline.
};

var evaluate = function(string) {
  return eval(string);
};


exports.templateText = function(_) {
  if (!_) return templateText;
  templateText = _;
};

// Only use outside of the browser.
exports.loadFiles = function() {
  var fs = require('fs');
  templateFiles.forEach(function(file) {
    templateText[file] = fs.readFileSync(__dirname + '/../templates/' + file, 'utf8');
  });
};
