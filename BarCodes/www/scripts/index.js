// Copyright (c) Microsoft. All rights reserved.  Licensed under the MIT license. See LICENSE file in the project root for full license information.

(function () {
    'use strict';

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    angular.module('xPlat', ['xPlat.services', 'xPlat.controllers', 'xPlat.directives']);
    angular.module('xPlat.directives', []);
    angular.module('xPlat.controllers', []);
    angular.module('xPlat.services', ['ngResource']);

})();