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
    
    this.option('projectLanguage', { type: String, required: true, desc: 'language for the project: js or ts' });
    this.option('projectTemplate', { type: String, required: false, desc: 'template kind: empty, rollup package'});
    this.option('projectName', { type: String, required: true, desc: 'name for the project' });
    // this.option('azureServices', { type: String, require: false, desc: 'azure services the project will depend on.' });

    this.projectConfig = Object.create(null);
    this.projectConfig.installDependencies = false;
  },

  initializing: {

    // Welcome
    welcome: function () {
      this.log(yosay('Welcome to ' + chalk.blue('azure node projects') + ' generator!'));
    }
  },

  prompting: {

    // Ask for project language kind
    askForType: function () {
      var generator = this;

      if (generator.projectLanguage) {
        var projectLanguages = ['ts', 'js'];
        if (projectLanguages.indexOf(generator.projectLanguage) !== -1) {
          generator.projectConfig.type = 'empty-project-' + generator.projectLanguage;
        } else {
          generator.env.error("Invalid extension type: " + generator.projectLanguage + '. Possible types are :' + projectLanguages.join(', '));
        }
        return Promise.resolve();
      }

      var typePrompt = {
        type: 'list',
        name: 'projectType',
        message: 'Please select a language.',
        choices: [
          {
            name: 'Azure JavaScript Project',
            value: 'empty-project-js'
          },
          {
            name: 'Azure TypeScript Project',
            value: 'empty-project-ts'
          },
        ],
        default: 0
      };

      return generator.prompt(typePrompt).then(function (typeAnswer) {
        generator.projectConfig.type = typeAnswer.projectType;
      });
    },

    // Ask for project template kind
    askForTemplateKind: function () {
      var generator = this;

      if (generator.projectTemplate) {
        var projectTemplates = ['empty', 'all-up'];
        if (projectTemplates.indexOf(generator.projectTemplate) !== -1) {
          generator.projectConfig.template = generator.projectTemplate;
        } else {
          generator.env.error("Invalid template type: " + generator.projectTemplate + '. Possible types are :' + projectTemplates.join(', '));
        }
        return Promise.resolve();
      }

      var templateKindPrompt = {
        type: 'list',
        name: 'azureTemplateKind',
        message: 'Please select an azure template.',
        choices:[
          {
            name: 'Empty Project',
            value: 'empty'
          },
          {
            name: 'All up Project',
            value: 'all-up'
          }
        ],
        default: 0
      };

      return generator.prompt(templateKindPrompt).then(function (templateAnswer) {
        generator.projectConfig.template = templateAnswer.azureTemplateKind;
      });
    },

    // Ask for project name ("name" in package.json)
    askForProjectName: function () {
      var generator = this;
      if (generator.projectName) {
        generator.projectConfig.projectName = generator.projectName;
        return Promise.resolve();
      }

      return generator.prompt({
        type: 'input',
        name: 'projectName',
        message: 'What\'s the name of your new project?',
      }).then(function (projectNameAnswer) {
        generator.projectConfig.projectName = projectNameAnswer.projectName;
      });
    },

  },

  // Write files
  writing: function () {
    this.sourceRoot(path.join(__dirname, './templates/' + this.projectConfig.type));

    switch (this.projectConfig.type) {
      case 'empty-project-ts':
        this._writingTsProject();
        break;
      case 'empty-project-js':
        this._writingJsProject();
        break;
      default:
        // unknown project type
        break;
    }
  },

  // write typescript project
  _writingTsProject: function () {

  },

  // write javascript project
  _writingJsProject: function () {
    var context = this.projectConfig;

    this.directory(this.sourceRoot() + '/src', context.projectName + '/src');
    this.directory(this.sourceRoot() + '/test', context.projectName + '/test');

    // TODO: template this.
    this.copy(this.sourceRoot() + '/package.json', context.projectName + '/package.json');
  },

  // Installation
  install: function () {
    // this.installDependencies();
  },

  // End
  end: function () {
    this.log('');
    this.log('Your project ' + this.projectConfig.projectName + ' has been created!');
    this.log('');
    this.log('Opening project in Visual Studio Code...');
    this.spawnCommand('code', [this.projectConfig.projectName]);
  }
});
