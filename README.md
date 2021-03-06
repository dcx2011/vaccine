Vaccine
=======

Check out Vaccine at [www.vaccinejs.com](http://www.vaccinejs.com)!

The help is also [online](http://www.vaccinejs.com#help-start).

Tool
----

Vaccine has a command line tool in addition to the
[GUI](http://www.vaccinejs.com). The tool has the ability to build with only
a minimal `component.json`, to run a development server, and to create a
barebones library from a template. Some of the options that must be set when
using the GUI can be automatically detected when using the tool.

The tool is organized as several commands (like git). Each command can be
shortened if it is unambiguous.

### Installation ###

With [Node.js](http://nodejs.org/) installed:

```
$ npm install -g vaccine
```

### component.json ###

Vaccine uses `component.json` for some info. This is the same file
used by [Bower](http://twitter.github.com/bower/). Some settings Bower uses
Vaccine does not need, and some settings are Vaccine only. If you are using
Vaccine as an application, it is a better idea to use a `vaccine.json`
name instead. The options are exactly the same.

Vaccine may in the future switch to using a `library.json` as described in
[this gist](https://gist.github.com/jakesandlund/709b9697c13e967ca2e2).

Here is an example `component.json`:

```
{
  "name": "my_library",
  "version": "1.0.1",
  "main": ["./my_library.js", "./my_library.css"],
  "entry": "src/index.js",
  "dependencies": {
    "jquery": "~1.9.1",
    "underscore": "~1.4.4"
  },
  "devDependencies": {
    "qunit": "~1"
  },
  "vaccine": {
    "supports": ["window", "amd", "commonjs"]
  }
}
```

__Required Options (for build)__

- `name`: The name of the project. Also used as the global defined on window,
  or the AMD module id.
- `entry`: The main/entry module of the JavaScript sources. The first part
  of the path is also used to determine the directory all the source files
  (and only source files) are in.

__Important Options__

- `version`: Not used by Vaccine, but sets the version number (follow
  [semver](http://semver.org/)).
- `main`: Used by Bower, but not Vaccine. Sets the main (built) JavaScript
  file, stylesheet, or image sprites.
- `dependencies`: A list of libraries the project depends on, with version
  specifiers.
- `devDependencies`: A list of dependencies that aren't needed to use the
  project, but might be needed in development for things like testing and
  documentation.
- `vaccine.supports`: A list of environments the project supports.
  The possibilites are `window`, `amd`, and `commonjs`.

__Option Overrides__

The following options are detected, and so not necessary. However, it still
may be useful to override what is detected. (Especially since they are
detected quite naively, currently.)

- `vaccine.format`: The module format used in the project: `amd`, `commonjs`,
  or `umd`.
- `vaccine.require`: An array of "require" functionality. Options are:
  `full`, `single`, `absolute`, `index`. See
  [help](http://www.vaccinejs.com/#help-require).
- `vaccine.exports`: An array of methods of exporting a module's API. Options
  are: `exports`, `module`, and `return`. See
  [help](http://www.vaccinejs.com/#help-exports).
- `vaccine.define`: An array of "define" functionality. Currently the only
  option is `optional_id`. See [help](http://www.vaccinejs.com/#help-define).
- `vaccine.debugging`: An array of "debugging" functionality. Options are:
  `debug`, `performance`, and `use_strict`.
  See [help](http://www.vaccinejs.com/#help-debugging).
- `vaccine.output`: The name/path of the output filename for `$ vaccine build`.
  This defaults to `<name>.js`.
- `vaccine.source_dir`: A way to override the source directory parsed from
  `entry`.
- `vaccine.global_name`: A way to override the global variable name, if `name`
  is not right.
- `vaccine.targets`: An array of filenames of targets to build with
  `$ vaccine targets`. Possibilities are `vaccine.js`, `build.sh`,
  `vaccine_dev.js`, `dev_server.js`, `Makefile`, `umd.js`.

### Building ###

In addition to creating a `vaccine.js` shim and `build.sh` script, Vaccine can
directly build a library:

```
$ vaccine build [file name]
```

The file name in the above command is the name of the output file. It is
optional and defaults to `component.vaccine.output` or `<component.name>.js`.
`--stdout` or `-c` outputs the built file to stdout.

The method of building is nearly identical to creating a `vaccine.js` and
a `build.sh` and then running `$ sh build.sh > my_library_name.js`.

### Building targets ###

To construct a specific [target](http://www.vaccinejs.com/#help-targets),
use the "targets" command, optionally followed by the name of the target(s):

```
$ vaccine targets [<target-names>]   # e.g. $ vaccine vaccine.js build.sh
```

If `component.vaccine.targets` is set, then running `vaccine targets` will
build the targets specified in that array. Otherwise it will build the
default targets.

### Development server ###

```
$ vaccine server
```

Starts a development server to serve local files. This is roughly
equivalent to using
[dev_server.js](http://www.vaccinejs.com/#help-dev_server-js).

The one added benefit is that if `build.sh` or `vaccine_dev.js` don't exist,
and they are requested, it will respond with the result of the build or the
contents of `vaccine_dev.js`, respectively.

### Create a new project from a template ###

Create a skeleton library of the given name. Creates a new directory
of the given name.

```
$ vaccine create <project-name>
```

The template used can be overriden by having a directory at
`~/.vaccine/template`. Then that directory will be copied as the new project.

If an executalbe exists at `~/.vaccine/template/post_create`, it will be called
after the copy takes place. The current directory is the new project's
directory.

### Copy the basic template to ~/.vaccine/template ###

The template being used if `~/.vaccine/template` does not exist can be copied
into that location with this command:

```
$ vaccine template
```

As described above, this template will be copied into a new project's
directory, and then `post_create` will be executed (if it exists).

### Create minimal component.json ###

Initializes an example component.json. This is taken from the same template
as used in `$ vaccine create`.

```
$ vaccine component.json    # or:
$ vaccine vaccine.json
```

FAQ
---

### Who is Vaccine for? ###

Vaccine is specifically targeted for JavaScript libraries. It certainly can
be used by applications, but the benefits of the small size are not as
significant.

### Why a new tool for libraries? ###

Currently, libraries are mostly developed as a single large file, or multiple
files that are concatenated in a manually defined order. Few libraries
use a modular format such as CommonJS or AMD, instead using weaker
JavaScript idioms. (Well there are a number of libraries targeted for
[Browserify](http://browserify.org/) or
[component](https://github.com/component/component), but they need those
tools to run in the browser.) Vaccine lets libraries use these better
formats and still work in the browser as a script tag.

### What are the CommonJS, AMD, and UMD module formats? ###

See below: [CommonJS](#commonjs), [AMD](#amd), [UMD](#umd).

### What needs do libraries have? ###

Libraries need to provide a single built JavaScript file that can be
dropped in a browser script tag. This is the de facto way of using libraries.
Without support for this, the number of possible users of a library
drastically declines.

Libraries need to be cautious about their size. While there are build tools
that can compile AMD/CommonJS modules into a single file, they are too big
for most libraries.

Libraries need to be in control of, or at the very least understand, the
build process. An opaque build tool makes this more difficult. Libraries
may need to extend the build process. Issues may come up with a build tool
or how they are using it.

Some libraries need to be developed in the browser. Using a single built
file makes it harder for debugging. Splitting out each module into separate
script tags is easier.

### How does Vaccine meet these needs? ###

The Vaccine GUI creates a shim and a tiny build script. In combination they
make a library written in AMD or CommonJS work in a single browser script
tag.

The shim is configured to be as small as possible, so that the tradeoff
between size added and better modularity tips in favor of better modularity.

The tiny build script is easy to comprehend, and easy to modify.

A special version of the shim can be used during development along with
a development server so that testing in the browser is done with each module
as a separate script tag.

### Why is Vaccine a GUI instead of a tool? ###

A build tool will be added at some point for those who prefer that. The GUI
was done initially for the transparency in how Vaccine works. It is easy
to compare configurations to see how the shim is generated. It is also very
quick to use, so the added convenience from a tool will not be that
substantial.

### Why does Vaccine support more than one module format? ###

The JavaScript community is split between different module formats. Some
people prefer one format to another. This way they can choose the format
they like best. Also, CommonJS is needed for libraries that can be used
on the server. AMD is generally considered to be better for the browser.

### Why doesn't Vaccine do package management? ###

Vaccine helps with the development of a JS library and building it into
a single file. It does not come with or tie itself to a specific package
management system. This is purposeful. If Vaccine only worked with a
certain package manager, it would limit the number of possible users of a
library. Therefore, Vaccine is package manager agnostic.

A library can use Vaccine and be distributed in any number of the
available package managers (there are a lot: [Bower](http://twitter.github.com/bower/),
[component](https://github.com/component/component),
[volo](http://volojs.org/), [Jam](http://jamjs.org/),
[npm](https://npmjs.org/)), as well as providing a single built file that
users can grab.

Module Formats
--------------
- [CommonJS](#commonjs)
- [AMD](#amd)
- [UMD](#umd)

CommonJS
--------
See the [CommonJS wiki](http://wiki.commonjs.org/wiki/Modules/1.1) for more
info.

Intro coming soon.

AMD
---
See the [AMD wiki](https://github.com/amdjs/amdjs-api/wiki/AMD) for more
info.

Intro coming soon.

UMD
---
See the [UMD Github](https://github.com/umdjs/umd).

Intro coming soon.

TODO
----

- Fill out remaining documentation.
- TESTS! Need to test the resulting shims for every possible option
  combination. Then need to make tests for detecting options.

LICENSE
-------

Vaccine is licensed under the MIT license. No, you don't need to have the
license, or even a copyright comment, if you used the files generated by
the GUI or command line tool. Those are public domain.
