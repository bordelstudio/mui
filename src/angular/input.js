/**
 * MUI Angular Input and Textarea Components
 * @module angular/input
 */

import angular from 'angular';


const moduleName = 'mui.input';


/**
 * Build directive function.
 * @param {Boolean} isTextArea
 */
function inputFactory(isTextArea) {
  var scopeArgs,
      template,
      ngClassStr;

  // defaults
  scopeArgs = {
    floatLabel: '@',
    hint: '@',
    label: '@',
    name: '@',
    ngDisabled: '=',
    ngModel: '='
  };

  ngClassStr = '{' + [
    "'mui--is-touched': inputCtrl.$touched",  // hasn't lost focus yet
    "'mui--is-untouched': inputCtrl.$untouched",
    "'mui--is-pristine': inputCtrl.$pristine",  // user hasn't interacted yet
    "'mui--is-dirty': inputCtrl.$dirty",
    "'mui--is-empty': inputCtrl.$isEmpty(inputCtrl.$viewValue)",
    "'mui--is-not-empty': !inputCtrl.$isEmpty(inputCtrl.$viewValue)",
  ].join(',') + '}';

  template = '<div class="mui-textfield">';

  // element-specific
  if (!isTextArea) {
    scopeArgs.type = '@';

    template += '<input ' + 
      'name={{name}} ' +
      'placeholder={{hint}} ' +
      'type={{type}} ' +
      'ng-change=onChange() ' +
      'ng-class="' + ngClassStr + '" ' +
      'ng-disabled="ngDisabled" ' +
      'ng-model="ngModel" ' +
      '>';
  } else {
    scopeArgs.rows = '@';

    template += '<textarea ' +
      'name={{name}} ' +
      'placeholder={{hint}} ' +
      'rows={{rows}} ' +
      'ng-change=onChange() ' +
      'ng-class=" ' + ngClassStr + '" ' +
      'ng-disabled="ngDisabled" ' +
      'ng-model="ngModel" ' +
      '></textarea>';
  }

  // update template
  template += '<label>{{label}}</label></div>';

  // directive function
  return ['$timeout', function($timeout) {
    return {
      restrict: 'AE',
      require: ['ngModel'],
      scope: scopeArgs,
      replace: true,
      template: template,
      link: function(scope, element, attrs, controllers) {
        var inputEl = element.find('input') || element.find('textarea'),
            labelEl = element.find('label'),
            ngModelCtrl = controllers[0],
            formCtrl = controllers[1],
            isUndef = angular.isUndefined,
            el = inputEl[0];

        // add inputCrl to scope
        scope.inputCtrl = inputEl.controller('ngModel');

        // disable MUI js
        if (el) el._muiTextfield = true;

        // remove attributes from wrapper
        element.removeAttr('ng-change');
        element.removeAttr('ng-model');

        // scope defaults
        if (!isTextArea) scope.type = scope.type || 'text';
        else scope.rows = scope.rows || 2;
        
        // autofocus
        if (!isUndef(attrs.autofocus)) inputEl[0].focus();

        // required
        if (!isUndef(attrs.required)) inputEl.prop('required', true);

        // invalid
        if (!isUndef(attrs.invalid)) inputEl.addClass('mui--is-invalid');

        // float-label
        if (!isUndef(scope.floatLabel)) {
          element.addClass('mui-textfield--float-label');

          $timeout(function() {
            labelEl.css({
              'transition': '.15s ease-out',
              '-webkit-transition': '.15s ease-out',
              '-moz-transition': '.15s ease-out',
              '-o-transition': '.15s ease-out',
              '-ms-transition': '.15s ease-out',
            })
          }, 150);
        }

        // handle changes
        scope.onChange = function() {
          // trigger ng-change on parent
          if (ngModelCtrl) ngModelCtrl.$setViewValue(scope.ngModel);
        }
      }
    };
  }];
}


angular.module(moduleName, [])
  .directive('muiInput', inputFactory(false))
  .directive('muiTextarea', inputFactory(true));


/** Define module API */
export default moduleName;
