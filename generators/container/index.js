'use strict';
let generator = require('yeoman-generator');
let utils = require('../app/utils');
let walk = require('esprima-walk');
var path = require('path');

module.exports = generator.Base.extend({

  constructor: function() {
    generator.Base.apply(this, arguments);
    this.argument('name', { type: String, required: true });
    this.option('route', { type: String, required: false });
    
    this.attachToRoutes = function(path, containerPath, name, route) {
      const newlineNode = { type: 'Literal', value: '\n          ', raw: '\n          '}
    
      const routeNode = { 
        type: 'JSXElement',
        openingElement:
          { type: 'JSXOpeningElement',
            name: { type: 'JSXIdentifier', name: 'Route' },
            selfClosing: true,
            attributes:
            [ 
              { type: 'JSXAttribute',
                name: { type: 'JSXIdentifier', name: 'path' },
                value: { type: 'Literal', value: route } },
              { type: 'JSXAttribute',
                name: { type: 'JSXIdentifier', name: 'component' },
                value:
                  { type: 'JSXExpressionContainer',
                    expression:
                    { type: 'Identifier',
                      name: name,
                      typeAnnotation: undefined,
                      optional: undefined } } } 
              ] 
                      
          },
        closingElement: null,
        children: [] }
      
      const importNode = { 
          type: 'ImportDeclaration',
          specifiers:
          [ { type: 'ImportDefaultSpecifier',
              id:
                { type: 'Identifier',
                  name: name,
                  typeAnnotation: undefined,
                  optional: undefined }
                } ],
          source:
          { type: 'Literal',
            value: containerPath
          },
          importKind: 'value' }
      
      let tree = utils.read(path);
      walk(tree, function(node) {
        // Add import statement
        if(node.type === 'Program') {
          var importCount = 0;
          for (var i = 0; i < node.body.length; i++) {
            if(node.body[i].type === 'ImportDeclaration') {
              importCount++;
            }
            if(importCount > 0 && node.body[i].type !== 'ImportDeclaration') {
              node.body.splice(i, 0, importNode);
              break;
            }
          }
        }
        
        // Add new route
        if(node.type === 'JSXElement' && node.openingElement.name.name === 'Router') {
          // let pos = > 1 ? pos = node.children.length - 2
          node.children.splice(node.children.length - 1, 0, newlineNode, routeNode);
        }
      });

      utils.write(path, tree);
    }
  },

  writing: function() {
    const routesPath = utils.getDestinationPath('index', 'routes', 'js');
    const containerPath = utils.getRouteImportPath(this.name, 'containers');
    const destination = utils.getDestinationPath(this.name, 'containers', 'js');
    const baseName = utils.getBaseName(this.name);
    const depth = this.name.split('/').length - 1;
    const prefix = '../'.repeat(depth);
    const route = typeof this.options.route == 'string' ? this.options.route : '';


    // Copy container template
    this.fs.copyTpl(
      this.templatePath('Container.js'),
      this.destinationPath(destination),
      {
        name: baseName,
        prefix: prefix
      }
    );
    
    // Add route
    if(route) {
      this.attachToRoutes(
        routesPath, 
        containerPath, 
        baseName, 
        route
      );
    }
    
  }
});
