'use strict';

// UI Libraries to be bundled.
// If a new library is required, it should first be installed using Bower :
//      `bower install xxxx --save`
// and then added to the list. If LESS files are required, those should be
// `@import`ed on public/less/styles.less. If the library only bundles CSS
// files, those should be imported as well AND added as a copy task.
module.exports = function(basePath, min) {
    var target = '';

    if (min) {
        target = '.min';
    }

    var scripts = [
        // ImpressPages DragDropEditor
        basePath + '/vendor_components/jquery-2.1.1.min.js',
        basePath + '/vendor_components/easyXDM.min.js',

        // Note: angular-file-upload-shim.js MUST BE PLACED BEFORE angular.js and angular-file-upload.js AFTER angular.js
        basePath + '/bower_components/ng-file-upload/angular-file-upload-shim' + target + '.js',
        basePath + '/bower_components/angular/angular' + target + '.js',
        basePath + '/bower_components/angular-mocks/angular-mocks.js',
        basePath + '/bower_components/ng-file-upload/angular-file-upload' + target + '.js',
        basePath + '/bower_components/lodash/dist/lodash' + target + '.js',
        basePath + '/bower_components/angular-bootstrap/ui-bootstrap-tpls' + target + '.js',
        basePath + '/bower_components/angular-translate/angular-translate' + target + '.js',
        basePath + '/bower_components/messageformat/messageformat.js',
        basePath + '/bower_components/messageformat/locale/en.js',
        basePath + '/bower_components/messageformat/locale/fr.js',
        basePath + '/bower_components/messageformat/locale/es.js',
        basePath + '/bower_components/messageformat/locale/ru.js',
        basePath + '/bower_components/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat' + target + '.js',
        basePath + '/bower_components/angular-checklist-model/checklist-model.js',
        basePath + '/bower_components/angular-ui-router/release/angular-ui-router' + target + '.js',
        basePath + '/bower_components/alertify.js/lib/alertify' + target + '.js',
        basePath + '/bower_components/angular-ui-tree/dist/angular-ui-tree' + target + '.js',
        basePath + '/bower_components/restangular/dist/restangular' + target + '.js',
        basePath + '/bower_components/angulartics/dist/angulartics.min.js',
        basePath + '/bower_components/ckeditor/ckeditor.js',
        basePath + '/bower_components/jquery-minicolors/jquery.minicolors' + target + '.js',
        basePath + '/bower_components/angular-minicolors/angular-minicolors.js',
    ];

    return scripts;
};
