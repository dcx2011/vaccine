??????????????????????????????????????????????????????????????????????? PERFORM
    var vaccineFirstDefineTime,
        vaccineRequireStart,
        vaccineRequireEnd;

/////////////////////////////////////////////////////////////////////// PERFORM
    function define(id, factory) {
??????????????????????????????????????????????????????????????????????? PERFORM
      vaccineFirstDefineTime = vaccineFirstDefineTime || Date.now();
/////////////////////////////////////////////////////////////////////// PERFORM
????????????????????????????????????????????????????????????????????????? DEBUG
      if ((vaccineFactories || {})[##[ multi_DIRS ?? id :: './' + id ]##]) {
        throw 'Attempting to redefine: ' + id;
      } else {
        console.log('Defining: ' + id);
      }
///////////////////////////////////////////////////////////////////////// DEBUG
      (vaccineFactories = vaccineFactories || {})[##[ multi_DIRS ?? id :: './' + id ]##] = factory;
    }


    function require(id) {
??????????????????????????????????????????????????????????????????????? PERFORM
      if (!vaccineRequireStart) {
        vaccineRequireStart = Date.now();
        var firstRequire = true;
      }

/////////////////////////////////////////////////////////////////////// PERFORM
????????????????????????????????????????????????????????????????????????? DEBUG
      console.log('Resolving require as: ' + id);

///////////////////////////////////////////////////////////////////////// DEBUG
???????????????????????????????????????????????????????????????????? multi_DIRS
      var parts = id.split('/');
//////////////////////////////////////////////////////////////////// multi_DIRS
???????????????????????????????????????????????????????????????? MODULE_EXPORTS
      var module = {exports: {}};
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: MODULE_EXPORTS
 ???????????????????????????????????????????????????????????????????? EXPORTS
      var exports = {};
 //////////////////////////////////////////////////////////////////// EXPORTS
//////////////////////////////////////////////////////////////// MODULE_EXPORTS

      if (!vaccineLocalModules[id] && !vaccineWindow[id]) {
 ?????????????????????????????????????????????????????????????????????? DEBUG
        if (vaccineFactories[id]) {
          console.log('Executing module factory: ' + id);
        } else {
          throw 'Missing module factory. Cannot execute: ' + id;
        }
 ////////////////////////////////////////////////////////////////////// DEBUG
        ##[ RETURN_EXPORTS ?? vaccineLocalModules[id] =  ]##vaccineFactories[id](
???????????????????????????????????????????????????????????????????? multi_DIRS
            function(reqId) {
 ?????????????????????????????????????????????????????????????????????? DEBUG
              console.log('Attempting to require: ' + reqId);
 ////////////////////////////////////////////////////////////////////// DEBUG
              var matching = /(\.?\.\/?)*/.exec(reqId)[0],
                  // Some code golf to get the number of "directories" back we want to go
                  back = Math.floor(matching.replace(/\//g, '').length / 1.9 + 0.99),
                  base;
              if (back) {
                base = parts.slice(0, parts.length - back).join('/');
                if (base) base += '/';
                reqId = base + reqId.slice(matching.length);
              }
              return require(reqId.replace(/\/$/, ''));
            }##[ EXPORTS ?? , :: ); ]##
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: multi_DIRS
            ##[ EXPORTS ?? require, :: require); ]##
//////////////////////////////////////////////////////////////////// multi_DIRS
???????????????????????????????????????????????????????????????? RETURN_EXPORTS
 ????????????????????????????????????????????????????????????? MODULE_EXPORTS
            module.exports, module) || module.exports;
 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: MODULE_EXPORTS
  ????????????????????????????????????????????????????????????????? EXPORTS
            exports) || exports;
  ///////////////////////////////////////////////////////////////// EXPORTS
 ///////////////////////////////////////////////////////////// MODULE_EXPORTS
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: RETURN_EXPORTS
            ##[ MODULE_EXPORTS ?? module.exports, module :: exports ]##);
        vaccineLocalModules[id] = ##[ MODULE_EXPORTS ?? module.exports :: exports ]##;
//////////////////////////////////////////////////////////////// RETURN_EXPORTS
      }
????????????????????????????????????????????????????????????????????????? DEBUG
      var moduleFoundWhere = vaccineLocalModules[id] ? 'local' : 'window';
      console.log('Returning required ' + moduleFoundWhere + ' module: ' + id);
///////////////////////////////////////////////////////////////////////// DEBUG
??????????????????????????????????????????????????????????????????????? PERFORM
      if (firstRequire) {
        vaccineRequireEnd = Date.now();
        console.log('Defined in: ' + (vaccineRequireStart - vaccineFirstDefineTime) + ' ms');
        console.log('Executed in: ' + (vaccineRequireEnd - vaccineRequireStart) + ' ms');
        console.log('Overall time: ' + (vaccineRequireEnd - vaccineFirstDefineTime) + ' ms');
      }
/////////////////////////////////////////////////////////////////////// PERFORM
      return vaccineLocalModules[id] || vaccineWindow[id];
    }


    var vaccineFactories,
        vaccineLocalModules = {},
???????????????????????????????????????????????????????????? multi_DEPS_and_AMD
        vaccineDependencies = [$$[ DEP_NAMES ]$$],
//////////////////////////////////////////////////////////// multi_DEPS_and_AMD
        vaccineWindow = window;

??????????????????????????????????????????????????????????????????????????? AMD
 ????????????????????????????????????????????????????????????????????? WINDOW
    if (typeof vaccineWindow.define == 'function' &&
        vaccineWindow.define.amd) {
 ///////////////////////////////////////////////////////////////////// WINDOW
      define('$$[ LIB_NAME ]$$',
 ===================================================================== 0 DEPS
             function() {
 ===================================================================== 1 DEPS
             [$$[ DEP_NAMES ]$$],
             function(vaccineSingleDep) {
               vaccineLocalModules.$$[ DEP_NAME ]$$ = vaccineSingleDep;
 ===================================================================== > DEPS
             vaccineDependencies,
             function() {
               for (var i = 0, args = arguments; i < args.length; ++i) {
                 vaccineLocalModules[vaccineDependencies[i]] = args[i];
               }
 ==================================================================== // DEPS
               return require(##[ multi_DIRS ?? '$$[ MAIN ]$$' :: './$$[ MAIN ]$$' ]##);
             });
    ##[ WINDOW ?? } else { ]##
/////////////////////////////////////////////////////////////////////////// AMD
???????????????????????????????????????????????????????????????????????? WINDOW
      vaccineWindow.$$[ GLOBAL_NAME ]$$ = require(##[ multi_DIRS ?? '$$[ MAIN ]$$' :: './$$[ MAIN ]$$' ]##);
    ##[ AMD ?? } ]##
//////////////////////////////////////////////////////////////////////// WINDOW