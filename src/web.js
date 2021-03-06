// Keep these top two lines, so that the built line numbers line
// with these.
var d3 = require('d3'),
    hijs = require('./hijs'),
    jsdiff = require('./jsdiff'),
    uglifyjs = require('./uglify-js'),
    vaccine = require('./vaccine'),
    templateText = require('./templates'),
    demo = require('./demo'),
    web = {},
    diffColor = '#664985',
    maxSize = 800,
    scrollHelpOffset = 60,
    shotWidth = 161;

var prepend = function(text, pre) {
  var split = text.split('\n');
  split.pop();
  return pre + split.join('\n' + pre);
};

var diff = function(old, next) {
  // Reverse the next and old so that removed lines show before added.
  var chunks = jsdiff.diffLines(next, old).map(function(d) {
    if (d.removed) {
      return '<span class="added">' + prepend(d.value, '+') + '</span>';
    } else if (d.added) {
      return '<span class="removed">' + prepend(d.value, '-') + '</span>';
    } else {
      return prepend(d.value, ' ');
    }
  });
  return chunks.join('\n');
};

vaccine.templateText(templateText);

var currentOptions = {},
    currentCompiled,
    currentSize,
    savedOptions,
    savedCompiled,
    savedSize,
    diffEnabled = false;

var formatHides = {
  amd: ['#w-o-index', '#target-umd'],
  commonjs: ['#absolute-id', '#define', '#export-return', '#target-umd'],
  umd: ['#require', '#entry-file', '#define', '.target-non-umd',
        '#source-directory', '#debugging'],
};

var amdFmtDefault = vaccine.defaultForFormat('amd');

var defaultOptions = {
  format: 'amd',
  name: 'my_project_name',
  main: 'src/index.js',
  dependencies: 'dep_one, dep_two',
  targets: amdFmtDefault.targets,
  exports: amdFmtDefault.exports,
  supports: amdFmtDefault.supports,
  define: amdFmtDefault.define,
  require: amdFmtDefault.require,
  debugging: [],
  source_dir: '',
  global_name: '',
};
web.defaultOptions = defaultOptions;
web.defaultForFormat = vaccine.defaultForFormat;

var updateWithOptions = function(options) {
  setOptions(options);
  maybeUpdate();
};
web.updateWithOptions = updateWithOptions;

var maybeUpdate = function() {
  var options = getOptions();
  var same = Object.keys(options).every(function(key) {
    var next = options[key];
    if (!Array.isArray(next)) {
      return next === currentOptions[key];
    }
    var current = currentOptions[key];
    if (current.length !== next.length) return false;
    return !next.filter(function(d) { return current.indexOf(d) < 0; }).length;
  });
  if (same) return false;
  currentOptions = options;
  update();
  return false;
};

var getOptions = function() {
  var options = {};
  d3.selectAll('input').each(function() {
    if (this.type === 'button') return;
    if (this.type === 'checkbox') {
      options[this.name] = options[this.name] || [];
      if (this.checked) options[this.name].push(this.value);
    } else if (this.type !== 'radio' || this.checked) {
      options[this.name] = this.value;
    }
  });
  return options;
};

var setOptions = function(options) {
  var format = options.format;
  d3.selectAll('.format-hide').classed('format-hide', false);
  formatHides[format].forEach(function(hide) {
    d3.selectAll(hide).classed('format-hide', true);
  });
  d3.selectAll('.format-picker.chosen').classed('chosen', false);
  d3.select('#' + format).classed('chosen', true);

  d3.selectAll('input').each(function() {
    if (this.type === 'button') return;
    var current = options[this.name];
    if (this.type === 'checkbox') {
      this.checked = current.indexOf(this.value) >= 0;
    } else if (this.type === 'radio') {
      this.checked = current === this.value;
    } else {
      this.value = current;
    }
  });
};

var update = function() {
  d3.select('#save').attr('disabled', null);
  var compiled = currentCompiled = compile();
  var vaccineCompiled = compiled['vaccine.js'] || compiled['umd.js'];
  if (vaccineCompiled) {
    if (compiled['vaccine.js']) {
      vaccineCompiled = '(function(vaccineRoot) {' + vaccineCompiled + '}(this))';
      try {
        currentSize = uglifyjs(vaccineCompiled).length;
      } catch (e) {
        currentSize = 1;
      }
    } else { // umd.js
      try {
        currentSize = uglifyjs(vaccineCompiled).length;
      } catch (e) {
        currentSize = 1;
      }
    }
  } else {
    currentSize = null;
  }
  updateSources();
};

var copyCurrentOptions = function() {
  var options = {};
  Object.keys(currentOptions).forEach(function(k) {
    if (Array.isArray(currentOptions[k])) {
      options[k] = currentOptions[k].slice();
    } else {
      options[k] = currentOptions[k];
    }
  });
  return options;
};

var compile = function() {
  var options = copyCurrentOptions();
  var deps = [];
  options.dependencies.split(/ *[ ,] */).forEach(function(dep) {
    if (dep) deps.push(dep);
  });
  options.dependencies = deps;

  var problems = vaccine.validateOptions(options);
  d3.selectAll('.problem').classed('problem', false);
  d3.selectAll('.fix').remove();
  problems.forEach(function(problem) {
    problem.options.forEach(function(opt) {
      var group = d3.select('#' + opt.group);
      if (group.empty()) return;

      problemFixer(group, problem.fix);

      var labels = group.selectAll('label, .format-picker');
      labels.each(function() {
        var label = d3.select(this),
            input = label.select('input');
        // toLowerCase allows for the use of the values format buttons.
        if (opt.parts.indexOf(input.attr('value').toLowerCase()) >= 0) {
          label.classed('problem', true);
        }
      });
    });
    problem.fix(options);
  });

  return vaccine(options);
};

var problemFixer = function(group, fix) {
  var title = group.select('.title')
      .classed('problem', true);
  var span = title.select('span.fix');
  var fixes = [fix];
  if (span.empty()) {
    span = title.append('span')
        .attr('class', 'fix')
        .text('fix');
  } else {
    fixes = fixes.concat(span.on('click').fixes);
  }
  var fixProblem = function() {
    var options = copyCurrentOptions();
    fixes.forEach(function(fix) { fix(options); });
    setOptions(options);
  };
  fixProblem.fixes = fixes;
  span.on('click', fixProblem);
};

var updateSources = function() {
  var compiledData = Object.keys(currentCompiled).map(function(name) {
    if (diffEnabled) {
      var html = diff(savedCompiled[name], currentCompiled[name]);
    } else {
      var html = hijs(currentCompiled[name]);
    }
    return {name: name, html: html};
  });
  var sources = d3.select('#sources').selectAll('.source')
      .data(compiledData, function(d) { return d.name; });

  sources.enter().append('div')
      .attr('class', 'source')
      .each(function(d) {
        source = d3.select(this);
        var title = source.append('div')
            .attr('class', 'title')
            .text(d.name);
        source.append('div')
            .attr('class', 'code-container')
            .append('code');
        title.append('a')
            .attr('class', 'open-help')
            .attr('href', helpLink(d.name.replace('.', '-')))
            .append('div').text('?');
      });

  sources.exit().remove();

  var order = ['vaccine.js', 'umd.js', 'build.sh', 'Makefile',
               'vaccine_dev.js', 'dev_server.js'];
  sources.sort(function(a, b) {
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  sources.select('code').html(function(d) { return d.html; });

  if (currentSize) {
    if (currentSize === 1 || diffEnabled && savedSize === 1) {
      var min = 'Oops!';
      var gzip = min;
    } else {
      var currentShot = shotWidth * currentSize / maxSize;
      if (diffEnabled) {
        var min = currentSize - savedSize;
        var gzip = gzipFromMin(currentSize) - gzipFromMin(savedSize);
        var savedShot = shotWidth * savedSize / maxSize;
      } else {
        var min = currentSize;
        var gzip = gzipFromMin(currentSize);
        var savedShot = currentShot;
      }
      gzip = 5 * Math.round(gzip / 5);
      d3.select('#sizes .shot.current').transition().duration(600)
          .style('width', currentShot + 'px');
      d3.select('#sizes .shot.saved').transition().duration(600)
          .style('width', savedShot + 'px');
    }
    var sizeHtml = numberSpan(min) + ' bytes minified';
    sizeHtml += numberSpan(gzip, true) + ' bytes gzipped';
    d3.select('#size-info .variable-sizes').html(sizeHtml);
  }
};

var gzipFromMin = function(min) {
  // Calculated from 14 vaccine variations applied to converted
  // underscore (see jakesandlund/underscore branch gzip-sizes).
  return 7.976827711761272 + 0.4496433129841989 * min;
};

var numberSpan = function(number, approximate) {
  if (!diffEnabled || number === 0 || number.length) {
    var numClass = 'number';
  } else if (number > 0) {
    var numClass = 'number added';
  } else {
    var numClass = 'number removed';
  }
  if (number.length) {
    var abs = number;
  } else {
    var abs = Math.abs(number);
    if (approximate) abs = '~' + abs;
  }
  return '<span class="' + numClass + '">' + abs + '</span>';
};

var toggleDiff = function() { setDiff(!diffEnabled); };

var setDiff = function(enabled) {
  diffEnabled = enabled;
  d3.select('#diff').classed('active', diffEnabled);
  if (enabled) {
    d3.select('#sizes .shot.saved').style('background-color', diffColor);
  } else {
    d3.select('#sizes .shot.saved').style('background-color', null);
  }
  updateSources();
};
web.setDiff = setDiff;

var saveCurrent = function() {
  savedCompiled = currentCompiled;
  savedOptions = currentOptions;
  savedSize = currentSize;
  d3.select('#save').attr('disabled', 'disabled');
  if (diffEnabled) updateSources();
};
web.saveCurrent = saveCurrent;

var swapSaved = function() {
  if (!savedOptions) return;
  var options = currentOptions,
      compiled = currentCompiled,
      size = currentSize;
  currentOptions = savedOptions;
  currentCompiled = savedCompiled;
  currentSize = savedSize;
  savedOptions = options;
  savedCompiled = compiled;
  savedSize = size;
  setOptions(currentOptions);
  updateSources();
};

var changeFormat = function() {
  var format = this.parentNode.id;
  var options = copyCurrentOptions();
  var fmtDefault = vaccine.defaultForFormat(format);
  options.supports = fmtDefault.supports;
  options.exports = fmtDefault.exports;
  options.targets = fmtDefault.targets;
  options.require = fmtDefault.require;
  options.define = fmtDefault.define;
  options.format = format;
  setOptions(options);
};

var uncheckAll = function() {
  var options = copyCurrentOptions();
  options.require = [];
  options.exports = [];
  options.define = [];
  setOptions(options);
};

var helpLink = function(helpId) {
  return '#help-' + helpId;
};

var openHelp = function(helpId) {
  window.history.replaceState({}, '', helpLink(helpId));
  d3.select('#dim-background')
      .style('display', 'block')
      .on('click', closeHelp);

  var help = d3.select('#help-document')
      .style('display', 'block');
  help.select('.close')
      .on('click', closeHelp);
  help.select('#show-demo')
      .on('click', function() {
        closeHelp();
        demo.show();
      });

  help.selectAll('.focused').classed('focused', false);

  var helpHeight = Math.floor(0.6 * window.innerHeight);
  var content = help.select('.content')
      .style('height', helpHeight + 'px');

  var section = help.select('#h-' + helpId).classed('focused', true);
  var scrollTo = section.property('offsetTop') - scrollHelpOffset;
  content.node().scrollTop = scrollTo;
};

var hashChange = function() {
  var hash = window.location.hash;
  if (/^#help-/.test(hash)) {
    openHelp(hash.slice(6));
  }
};
window.onhashchange = hashChange;

var closeHelp = function() {
  window.history.replaceState({}, '', '#');
  d3.select('#dim-background')
      .style('display', null);
  d3.select('#help-document')
      .style('display', null);
};

d3.selectAll('.open-help').each(function() {
  this.href = this.href || helpLink(this.parentNode.id);
});

d3.select('#uncheck-all input').on('click', uncheckAll);

d3.selectAll('#format input[type=button]').on('click', changeFormat);

d3.selectAll('.configuration')
    .on('click', maybeUpdate)
    .on('keyup', maybeUpdate);
d3.select('#diff').on('click', toggleDiff);
d3.select('#save').on('click', saveCurrent);
d3.select('#swap').on('click', swapSaved);

updateWithOptions(defaultOptions);
saveCurrent();

firstUpdate = true;

demo(web);
hashChange();
