????????????????????????????????????????????????????????????????? (performance)
    var vaccineFirstDefineTime,
        vaccineRequireStart,
        vaccineRequireEnd;

///////////////////////////////////////////////////////////////////////////////
    function define(id, factory) {
???????????????????????????????????????????????? (dev && define('optional_id'))
      if (!factory) {
        factory = id;
        id = vaccineOptionalId();
      }
///////////////////////////////////////////////////////////////////////////////
????????????????????????????????????????????????????????????????? (performance)
      vaccineFirstDefineTime = vaccineFirstDefineTime || Date.now();
///////////////////////////////////////////////////////////////////////////////
??????????????????????????????????????????????????????????????????????? (debug)
      if ((vaccineFactories || {})[$-- onlyRequire('single') ? "'./' + id" : 'id' --$]) {
        throw 'Attempting to redefine: ' + id;
      } else {
        console.log('Defining: ' + id);
      }
///////////////////////////////////////////////////////////////////////////////
      (vaccineFactories = vaccineFactories || {}
      )[$-- onlyRequire('single') ? "'./' + id" : (require('index') ? "id.replace(/\\/index$/, '')" : 'id') --$] = factory;
    }


    function vaccineRequire(id) {
????????????????????????????????????????????????????????????????? (performance)
      if (!vaccineRequireStart) {
        vaccineRequireStart = Date.now();
        var firstRequire = true;
      }

///////////////////////////////////////////////////////////////////////////////
??????????????????????????????????????????????????????????????????????? (debug)
      console.log('Resolving require as: ' + id);

///////////////////////////////////////////////////////////////////////////////
??????????????????????????????????????????????????????????????? require('full')
      var parts = id.split('/');
///////////////////////////////////////////////////////////////////////////////
????????????????????????????????????????????????????????????? exports('module')
      var module = {exports: {}};
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  ?????????????????????????????????????????????????????? exports('exports')
      var exports = {};
  /////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

      if (!vaccineModules[id] && !vaccineRoot[id]) {
??????????????????????????????????????????????????????????????????????? (debug)
        if (vaccineFactories[id]) {
          console.log('Executing module factory: ' + id);
        } else {
          throw 'Missing module factory. Cannot execute: ' + id;
        }
///////////////////////////////////////////////////////////////////////////////
        $-- exports('return') ? 'vaccineModules[id] = ' : '' --$vaccineFactories[id](
??????????????????????????????????????????????????????????????? require('full')
            function(reqId) {
  ????????????????????????????????????????????????????????????????? (debug)
              console.log('Attempting to require: ' + reqId);
  /////////////////////////////////////////////////////////////////////////
              var dots = /(\.?\.\/?)*/.exec(reqId)[0],
                  // Some code golf to get the number of "directories" back.
                  back = Math.floor(dots.replace(/\//g, '').length/1.9 + 0.99),
                  base;
              if (back) {
                base = parts.slice(0, parts.length - back).join('/');
                if (base) base += '/';
                reqId = base + reqId.slice(dots.length);
              }
              return vaccineRequire(reqId.replace(/\/$/, ''));
            }$-- exports('exports') ? ',' : ');' --$
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  ???????????????????????????????? require('single') && require('absolute')
            function(reqId) {
              return vaccineRequire(reqId.replace('.', '$-- name --$'));
            }$-- exports('exports') ? ',' : ');' --$
  :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            $-- exports('exports') ? 'vaccineRequire,' : 'vaccineRequire);' --$
  /////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
????????????????????????????????????????????????????????????? exports('return')
  ??????????????????????????????????????????????????????? exports('module')
            module.exports, module) || module.exports;
  :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ???????????????????????????????????????????????? exports('exports')
            exports) || exports;
    ///////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            $-- exports('module') ? 'module.exports, module' : 'exports' --$);
        vaccineModules[id] = $-- exports('module') ? 'module.exports' : 'exports' --$;
///////////////////////////////////////////////////////////////////////////////
      }
??????????????????????????????????????????????????????????????????????? (debug)
      var moduleFoundWhere = vaccineModules[id] ? 'local' : 'window';
      console.log('Returning required ' + moduleFoundWhere + ' module: ' + id);
///////////////////////////////////////////////////////////////////////////////
????????????????????????????????????????????????????????????????? (performance)
      if (firstRequire) {
        vaccineRequireEnd = Date.now();
        console.log('Defined in: ' + (vaccineRequireStart - vaccineFirstDefineTime) + ' ms');
        console.log('Executed in: ' + (vaccineRequireEnd - vaccineRequireStart) + ' ms');
        console.log('Overall time: ' + (vaccineRequireEnd - vaccineFirstDefineTime) + ' ms');
      }
///////////////////////////////////////////////////////////////////////////////
      return vaccineModules[id] || vaccineRoot[id];
    }


    var vaccineFactories$-- dev ? ' = {}' : '' --$,
???????????????????? (numDeps > 1 && (supports('amd') || supports('commonjs')))
        vaccineDependencies = $-- depString --$,
///////////////////////////////////////////////////////////////////////////////
        vaccineModules = {};

??????????????????????????????????????????????????????????????? supports('amd')
  ??????????????????????????????????????????????????????? (numSupports > 1)
    if (typeof vaccineRoot.define === 'function' &&
        vaccineRoot.define.amd) {
  /////////////////////////////////////////////////////////////////////////
      define('$-- name --$',
  ????????????????????????????????????????????????????????? (numDeps === 0)
             function() {
  ========================================================= (numDeps === 1)
             $-- depString --$,
             function(vaccineSingleDep) {
               vaccineModules$-- setDependency --$ = vaccineSingleDep;
  :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
             vaccineDependencies,
             function() {
               for (var i = 0, args = arguments; i < args.length; ++i) {
                 vaccineModules[vaccineDependencies[i]] = args[i];
               }
  /////////////////////////////////////////////////////////////////////////
               return vaccineRequire('$-- main --$');
             });
  ??????????????????????????????????????????????????????? (numSupports > 1)
    }
  /////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
?????????????????????????????????????????????????????????? supports('commonjs')
  ??????????????????????????????????????????????????????? (numSupports > 1)
    if (typeof module === 'object' && typeof module.exports === 'object') {
  /////////////////////////////////////////////////////////////////////////
  ????????????????????????????????????????????????????????? (numDeps === 1)
      vaccineModules$-- setDependency --$ = require('$-- dependencies[0] --$');
  =========================================================== (numDeps > 1)
      for (var i = 0; i < vaccineDependencies.length; ++i) {
        vaccineModules[vaccineDependencies[i]] = require(vaccineDependencies[i]);
      }
  /////////////////////////////////////////////////////////////////////////
      module.exports = vaccineRequire('$-- main --$');
  ??????????????????????????????????????????????????????? (numSupports > 1)
    ???????????????????????????????????????????????? supports('window')
    } else {
    :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    }
    ///////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
???????????????????????????????????????????????????????????? supports('window')
      vaccineRoot$-- setGlobalName --$ = vaccineRequire('$-- main --$');
  ???????????????????????????????????????????????????? supports('commonjs')
    }
  /////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
????????????????????????????????????????????????????????????????????????? (dev)
    var requireDev = function(main) {
      return vaccineRequire(main || '$-- main --$');
    };
  ??????????????????????????????????????????????????? define('optional_id')

    var vaccineOptionalId = function() {
      var loc = window.location,
          href = loc.protocol + '//' + loc.host,
          sourceDirRe = new RegExp('^' + href + '/$-- source_dir --$/'),
          scripts = document.getElementsByTagName('script');
      var idFromScript = function(script) {
        return script.src.replace(sourceDirRe, '').replace(/\.js$/, '');
      };
      scripts = Array.prototype.slice.call(scripts).filter(function(script) {
        if (!sourceDirRe.test(script.src)) return false;
        var id = idFromScript(script)
        return !vaccineFactories[$-- onlyRequire('single') ? "'./' + id" : 'id' --$];
      });
      return idFromScript(scripts[scripts.length - 1]);
    };
  /////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
