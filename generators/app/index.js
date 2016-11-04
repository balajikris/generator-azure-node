'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var fs = require('fs');
//var request = require('request');

module.exports = yeoman.Base.extend({

  constructor: function () {
    yeoman.Base.apply(this, arguments);
    this.option('extensionType', { type: String, required: false });
    this.option('projectName', { type: String, required: false });
    this.option('extensionParam', { type: String, required: false });
    this.option('extensionParam2', { type: String, required: false });

    this.extensionConfig = Object.create(null);
    this.extensionConfig.installDependencies = false;
  },

  initializing: {

    // Welcome
    welcome: function () {
      this.log(yosay('Welcome to ' + chalk.red('azure node projects') + ' generator!'));
    }
  },

  prompting: {

    // Ask for extension type
    askForType: function () {
      var generator = this;

      if (generator.extensionType) {
        var extensionTypes = ['javascript', 'typescript'];
        if (extensionTypes.indexOf(generator.extensionType) !== -1) {
          generator.extensionConfig.type = 'ext-' + generator.extensionType;
        } else {
          generator.env.error("Invalid extension type: " + generator.extensionType + '. Possible types are :' + extensionTypes.join(', '));
        }
        return Promise.resolve();
      }

      var typePrompt = {
        type: 'list',
        name: 'projectType',
        message: 'Please select a project template.',
        choices: [
          {
            name: 'Azure TypeScript Project',
            value: 'ext-command-ts'
          },
          {
            name: 'Azure JavaScript Project',
            value: 'ext-command-js'
          },
        ]
      };

      return generator.prompt(typePrompt).then(function (typeAnswer) {
        generator.extensionConfig.type = typeAnswer.projectType;      
      });
    },
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  },

  install: function () {
    this.installDependencies();
  }
});
