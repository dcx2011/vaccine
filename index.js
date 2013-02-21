
var fs = require('fs');
var child_process = require('child_process');

var vaccine = require('./src/vaccine');


var templateFiles = ['vaccine.js', 'Makefile', 'build.sh', 'dev_server.js',
                     'umd.js'];
var templateText = {};
var vaccineDir = process.env.HOME + '/.vaccine';
var userTemplateDir = vaccineDir + '/template';
var sourceTemplateDir = __dirname + '/lib_template';
var libTemplateDir;

var componentOptions;


var fail = function(message, num) {
  console.error(message);
  process.exit(num || 1);
};

var optionLocations = {
  format: 'vaccine.format',
  name: 'name',
  main: 'entry',
  dependencies: 'dependencies',
  targets: 'vaccine.targets',
  exports: 'vaccine.exports',
  supports: 'supports',
  define: 'vacccine.define',
  require: 'vaccine.require',
  debugging: 'vaccine.debugging',
  src: 'vaccine.source_dir',
  global: 'vaccine.global',
};

var optionConversions = {
  dependencies: function(d) { return Object.keys(d); },
};

var defaultForFormat = vaccine.defaultForFormat;
var optionDefaults = {
  dependencies: {},
  targets: defaultForFormat,
  define: defaultForFormat,
  debugging: [],
  src: '',
  global: '',
};

var ifNoExist = function(path, action) {
  if (fs.existsSync(path)) {
    console.log(path + ' already exists');
  } else {
    action();
  }
};

var maybeThrow = function(err) {
  if (err) throw err;
};

var createComponent = function(filename) {
  return function() {
    ifNoExist(filename, function() {
      var copy = 'cp ' + libTemplateDir + '/component.json ' + filename;
      child_process.exec(copy, maybeThrow);
    });
  };
};


module.exports = exports = {
  defaultForFormat: vaccine.defaultForFormat,
  validateOptions: vaccine.validateOptions,

  loadTemplates: function() {
    var fs = require('fs');
    templateFiles.forEach(function(file) {
      templateText[file] = fs.readFileSync(__dirname + '/templates/' + file, 'utf8');
    });
    vaccine.templateText(templateText);
  },

  templateText: function(_) {
    if (!_) return templateText;
    templateText = _;
  },

  targets: function(targets) {
    if (!targets || !targets.length)
      targets = loadOptions().targets;
    var compiled = compileTargets(targets);
    compiled.forEach(function(target) {
      var name = target.name;
      if (name === 'Makefile') {
        if (fs.existsSync('Makefile')) name = 'Makefile.example';
      }
      fs.writeFile(name, target.compiled, 'utf8', function(err) {
        if (err) throw err;
        if (name === 'build.sh') {
          fs.chmod('build.sh', '755', function(err) { if (err) throw err; });
        }
        console.log('Completed... ' + name);
      });
    });
  },

  "component.json": createComponent('component.json'),
  "vaccine.json": createComponent('vaccine.json'),

  create: function(args) {
    var name = args[0];
    var execFile = function(err) {
      maybeThrow(err);
      process.chdir(name);
      if (fs.existsSync('post_create')) {
        var spawn = child_process.spawn;
        var post = spawn('./post_create', args, {stdio: 'inherit'});
      }
    };
    ifNoExist(name, function() {
      child_process.exec('cp -R ' + libTemplateDir + ' ' + name, execFile);
    });
  },

  template: function() {
    if (libTemplateDir === userTemplateDir) {
      var when = ' before calling $vaccine template';
      console.log('Remove ~/.vaccine/template' + when);
    } else {
      var command = 'cp -R ' + libTemplateDir + ' ' + userTemplateDir;
      child_process.exec(command, maybeThrow);
    }
  },
};

var compileTargets = function(targets, options) {
  var options = options || loadOptions();
  options = clone(options);
  options.targets = targets;
  return compile(options);
};
exports.compileTargets = compileTargets;

var compile = function(options) {
  var options = options || loadOptions();
  var problems = vaccine.validateOptions(options);
  if (problems.length) {
    problems.forEach(function(problem) {
      // TODO: log problems.
    });
    console.log(problems);
    console.log(problems[0].options);
    fail("Problem with options");
  }
  return vaccine(options);
};
exports.compile = compile;

var clone = function(object) {
  var copy = {};
  var i;
  for (i in object)
    if (object.hasOwnProperty(i))
      copy[i] = object[i];
  return copy;
};

var loadOptions = function() {
  if (componentOptions) return componentOptions;
  var jsonFile = 'vaccine.json';
  if (!fs.existsSync(jsonFile)) jsonFile = 'component.json';
  if (!fs.existsSync(jsonFile))
    fail("Must specify options in component.json (vaccine.json for apps)");
  var component = JSON.parse(fs.readFileSync(jsonFile));
  componentOptions = determineOptions(component);
  return componentOptions;
};

var determineOptions = function(component) {
  var options = {};
  var vac = component.vaccine;
  Object.keys(optionLocations).forEach(function(opt) {
    var loc = optionLocations[opt];
    var prefix = 'vaccine.';
    var setting;
    if (loc.slice(0, prefix.length) === prefix) {
      if (vac) setting = vac[loc.slice(prefix.length)];
    } else {
      setting = component[loc];
    }
    if (typeof setting === 'undefined') {
      if (typeof optionDefaults[opt] === 'undefined')
        fail("Missing required option: " + loc);
      setting = optionDefaults[opt];
      if (typeof setting === 'function')
        setting = setting(options.format)[opt];
    }
    if (optionConversions[opt])
      setting = optionConversions[opt](setting);
    options[opt] = setting;
  });
  return options;
};

var whichLibTemplate = function() {
  if (!fs.existsSync(vaccineDir))
    fs.mkdirSync(vaccineDir);
  if (fs.existsSync(userTemplateDir))
    libTemplateDir = userTemplateDir;
  else
    libTemplateDir = sourceTemplateDir;
};

whichLibTemplate();
exports.loadTemplates();