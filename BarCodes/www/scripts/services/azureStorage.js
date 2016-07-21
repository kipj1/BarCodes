(function () {
	'use strict';

	angular.module('xPlat.services').service('azureStorage', ['$resource', 'guidGenerator', AzureStorage]);

	/**
	 * Azure Mobile Apps Application URL.
	 * TODO: Add your Azure Mobile App URL.
	 *
	 * @type {string}
	 * @const
	 */
	//var AZURE_MOBILE_APPS_ADDRESS = 'http://youraddress.azurewebsites.net';
	var AZURE_MOBILE_APPS_ADDRESS = '';
	var client;

	if (AZURE_MOBILE_APPS_ADDRESS) {
	    client = new WindowsAzure.MobileServiceClient(AZURE_MOBILE_APPS_ADDRESS);
	}


	/**
	 * Use the Azure Mobile Service to store barCodes items in the cloud.
	 *
	 * @param {angular.Service} $resource
	 * @param {angular.Service} guidGenerator
	 * @constructor
	 */
	function AzureStorage($resource, guidGenerator) {
	    this.isAvailable = AZURE_MOBILE_APPS_ADDRESS;

	    if (!AZURE_MOBILE_APPS_ADDRESS) {
	        console.warn("The Azure Mobile Apps URL is not set up properly. Items will not be stored on Azure.");
		}
		else {
	        this.barCodesItem = client.getTable('barCodesitem');
	        // default barCodes item
	        // this.barCodess = [ { text: "testing", address: 67777 } ];
		}
	}

    AzureStorage.prototype.getAll = function () {

        return this.barCodesItem.read()
            .then(function (items) {
                console.log("items:");
                console.log(items);
                return items;
            }, handleError);
    };

    function refreshList(thisArg) {

        return thisArg.barCodesItem.read()
            .then(function (items) {
                console.log("refresh items:");
                console.log(items);
                return items;
            }, handleError);
    }

    function createBarCodesItemList(items) {
        return items;
    }

	/**
	 * Create a new barCodes to Azure storage.
	 *
	 * @param {string} text Text of the barCodes item.
	 * @param {string} address Address of the barCodes item.
	 */
    AzureStorage.prototype.create = function (itemText, itemAddress) {

	    console.log("creating..." + itemText);
	    return this.barCodesItem.insert({
	        text: itemText,
            address: itemAddress,
	        complete: false
	    }).then(success, handleError);
	};

	/**
	 * Update an existing barCodes in Azure storage.
	 *
	 * @param {Object} item BarCodes item to modify.
	 */
	AzureStorage.prototype.update = function (item) {

	    return this.barCodesItem.update({
	        id: item.id,
	        complete: item.complete
	    }).then(success, handleError);
	};

	/**
	 * Remove a barCodes from Azure storage.
	 *
	 * @param {Object} item BarCodes item to remove from local storage.
	 */
	AzureStorage.prototype.del = function (item) {

	    return this.barCodesItem.del({
	        id: item.id
	    }).then(success, handleError)
	};

	function handleError(error) {
	    var text = error + (error.request ? ' - ' + error.request.status : '');
	    console.error(text);
	    console.log('error', error.request.status);
	    if (error.request.status == '0' || error.request.status == '404') {
	        alert({
	            title: 'Connection Failure',
	            template: 'Connection with backend can not be established.'
	        });
	    }
	}

	function success(retVal) {
	    console.log("successful operation");
	    return retVal;
	}

})();