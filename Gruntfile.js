"use strict";

const HTMLMinifier = require("html-minifier");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-es");

// Missing in uglify-es/tools/domprops.json
const otherDomprops = [
  "imageSmoothingEnabled",
  "clipboard",
  "fromEntries",
  "writeText"
];

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    
    cssOptions: {
      level: 2,
    },
    jsOptions: {
      compress: {
        hoist_funs: true,
        passes: 2,
        toplevel: true,
      },
      mangle: {
        properties: {
          keep_quoted: true,
          reserved: require("uglify-es/tools/domprops.json").concat(otherDomprops),
        },
        toplevel: true,
      },
      toplevel: true,
    },
    
    copy: {
      build: {
        files: {
          "index.html": "src/index.html",
          "style.css": "src/style.css",
        },
      },
    },
    
    concatOrder: [
      "src/game-state.js",
      "src/colour.js",
      "src/rect.js",
      "src/vector2.js",
      "src/animation.js",
      "src/sprite.js",
      "src/sprite-group.js",
      "src/actor.js",
      "src/player.js",
      "src/target.js",
      "src/targets/subject-a.js",
      "src/targets/subject-b.js",
      "src/targets/subject-c.js",
      "src/target-types.js",
      "src/weapon.js",
      "src/block.js",
      "src/camera.js",
      "src/map.js",
      "src/input-handler.js",
      "src/button.js",
      "src/title-screen.js",
      "src/end-screen.js",
      "src/game.js",
      "src/main.js",
    ],
    
    concat: {
      build: {
        options: {
          separator: "\n",
          order: "<%= concatOrder %>",
          // Immediately Invoked Function Expression
          prepend: "\"use strict\";(() => {",
          append: "})();",
        },
        files: {
          "script.js": ["src/**/*.js"],
        },
      },
      debug: {
        options: {
          separator: "\n",
          order: "<%= concatOrder %>",
          prepend: "\"use strict\";",
        },
        files: {
          "script.js": ["src/**/*.js"],
        },
      },
    },
    
    htmlmin: {
      options: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        sortAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
        minifyCSS: "<%= cssOptions %>",
        minifyJS: "<%= jsOptions %>",
      },
      build: {
        files: {
          "index.html": "index.html",
        },
      },
    },
    
    uglify: {
      build: {
        options: "<%= jsOptions %>",
        files: {
          "script.js": "script.js",
        },
      },
    },
    
    cssmin: {
      build: {
        options: "<%= cssOptions %>",
        files: {
          "style.css": "style.css",
        },
      },
    },
    
    replace: {
      build: {
        files: {
          "script.js": [{
            from: /{{ DATE }}/g,
            to: "<%= grunt.template.today(\"mediumDate\") %>",
          }],
        },
      },
    },
    
    base64Replace: {
      build: {
        options: {
          type: "image/png",
        },
        src: [
          "index.html",
          "style.css",
          "script.js",
        ],
      },
    },
    
    banner: {
      build: {
        options: {
          banner: {
            normal: "/*\n" +
                    " * Blood Sport (<%= pkg.homepage %>)\n" +
                    " * Copyright (C) <%= grunt.template.today('yyyy') %> <%= pkg.author %>\n" +
                    " * Licensed under the GNU General Public License v3.0\n" +
                    " */\n",
            html: "<!--\n" +
                  "  Blood Sport (<%= pkg.homepage %>)\n" +
                  "  Copyright (C) <%= grunt.template.today('yyyy') %> <%= pkg.author %>\n" +
                  "  Licensed under the GNU General Public License v3.0\n" +
                  "-->\n",
          },
        },
        src: [
          "index.html",
          "style.css",
          "script.js",
        ],
      },
    },
  });
  
  // html-minifier
  grunt.registerMultiTask("htmlmin", function () {
    this.files.forEach((file) => {
      const src = file.src[0];
      var result;
      try {
        result = HTMLMinifier.minify(grunt.file.read(src), this.options());
      } catch (err) {
        grunt.warn(src + "\n" + err);
        return;
      }
      grunt.file.write(file.dest, result);
    });
  });
  
  // clean-css
  grunt.registerMultiTask("cssmin", function () {
    this.files.forEach((file) => {
      const src = file.src[0];
      const result = new CleanCSS(this.options()).minify(grunt.file.read(src));
      if (result.errors.length) {
        grunt.warn(src + "\n" + result.errors);
        return;
      }
      if (result.warnings.length) {
        grunt.warn(src + "\n" + result.warnings);
      }
      grunt.file.write(file.dest, result.styles);
    });
  });
  
  // UglifyJS
  grunt.registerMultiTask("uglify", function () {
    this.files.forEach((file) => {
      const src = file.src[0];
      const result = UglifyJS.minify(grunt.file.read(src), this.options());
      if (result.error) {
        grunt.warn(src + "\n" + JSON.stringify(result.error));
        return;
      }
      if (result.warnings) {
        grunt.warn(src + "\n" + result.warnings);
      }
      grunt.file.write(file.dest, result.code);
    });
  });
  
  // replace
  grunt.registerMultiTask("replace", function () {
    this.files.forEach((file) => {
      file = file.dest;
      var data = grunt.file.read(file);
      this.data.files[file].forEach((replacement) => {
        data = data.replace(replacement.from, grunt.template.process(replacement.to));
      });
      grunt.file.write(file, data);
    });
  });
  
  // base64Replace
  grunt.registerMultiTask("base64Replace", function () {
    this.files.forEach((file) => {
      file.src.forEach((src) => {
        grunt.file.write(src, grunt.file.read(src).replace(/{{ BASE64:(.+?) }}/g, (match, $1) => {
          return `data:${this.options().type};base64,${grunt.file.read($1, { encoding: null }).toString("base64")}`;
        }));
      });
    });
  });
  
  // concat
  grunt.registerMultiTask("concat", function () {
    const options = this.options();
    this.files.forEach((file) => {
      var result = "";
      var i = 0;
      while (i < options.order.length) {
        file.src.forEach((filename) => {
          if (filename !== options.order[i]) {
            return;
          }
          result += grunt.file.read(filename) + options.separator;
          i++;
        });
      }
      
      if (options.prepend) {
        result = options.prepend + result;
      }
      if (options.append) {
        result += options.append;
      }
      
      grunt.file.write(file.dest, result);
    });
  });
  
  // copy
  grunt.registerMultiTask("copy", function () {
    this.files.forEach((file) => {
      grunt.file.copy(file.src[0], file.dest);
    });
  });
  
  // banner
  grunt.registerMultiTask("banner", function () {
    const options = this.options();
    this.files.forEach((file) => {
      file.src.forEach((src) => {
        const ext = /\.?([^.]+)$/.exec(src)[1];
        var banner;
        if (options.banner[ext]) {
          banner = options.banner[ext];
        } else {
          banner = options.banner.normal;
        }
        grunt.file.write(src, banner + grunt.file.read(src));
      });
    });
  });
  
  grunt.registerTask("build", ["copy", "concat:build", "htmlmin", "cssmin", "uglify", "replace:build", "base64Replace", "banner"]);
  grunt.registerTask("debug", ["copy", "concat:debug", "replace:build", "base64Replace"]);
};
