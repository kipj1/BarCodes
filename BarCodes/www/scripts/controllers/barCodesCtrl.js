(function () {
	'use strict';

	angular.module("xPlat.controllers").controller('BarCodesCtrl', ['maps', 'storage', '$scope', BarCodesCtrl]);

	/**
	 * Controller for the barCodes list.
	 * 
	 * @param {!angular.Service} maps
	 * @param {!angular.Service} storage
	 * @constructor
	 * @export
	 */
	function BarCodesCtrl(maps, storage, $scope) {

	    this.maps = maps;
	    this.storage = storage;
	    var that = this;

        //---Get all barCodes
	    storage.getAll().then(function (items) {
	        that.barCodess = items;
            // Refresh on another thread.
	        setTimeout(function () {
	            $scope.$apply();
	        }, 0);
	    });

	    this.updateBarCode = function (barCodesItem) {
	        var _this = this;

	        return this.maps.getCurrentPosition()
                .then(function (barcode) {
                    //---Update internal starage with barCodesItem---
                    return _this.storage.update(barCodesItem);
                }, function (errorMessage) {
                    //--Error happened so pass back error in barcode property---
                    barCodesItem.barcode = errorMessage;
                    return _this.storage.update(barCodesItem);
                });
	    }

	    this.refresh = function () {
	        setTimeout(function () {
	            $scope.$apply();
	        }, 0);
	    }

	}

	/**
	 *
	 * @param barCodesItem
	 */

	/**
	 * Add a barCodes item to the list.
	 */
	BarCodesCtrl.prototype.addBarCodes = function () {
	    var _this = this;

		var text = this.newBarCodesText;
		if (!text) {
			return;
		};

		this.newBarCodesText = '';
		this.storage.create(text, 'Getting info...')
			.then
            (
                function (barCodes) {
                    //---Get screen elements--
                    var productcode = document.getElementById("new-productcode");
                    var barcode = document.getElementById("new-barcode");

                    //---Set screen element values into barCodes object--
                    barCodes.text = productcode.value;
                    barCodes.barcode = barcode.value;
                    productcode.value = "";

                    //---Save/Push barCodes object to stack memory---
			        _this.barCodess.push(barCodes);
			        return barCodes;
                }
            )
            .then
            (
                this.updateBarCode.bind(this)
            );
	};

	/**
	 * Scane the text of a barCodes item.
	 */
	BarCodesCtrl.prototype.scanBarCodesText = function () {
	    //alert("1");
	    var _this = this;
	    cordova.plugins.barcodeScanner.scan(
           function (result) {
               //----Good result came back from barcode scan--

               //==================Test Code=======================
               //$("#new-barcode").val(result.text);
               //alert("We got a barcode\n" +
               //      "Result: " + result.text + "\n" +
               //      "Format: " + result.format + "\n" +
               //      "Cancelled: " + result.cancelled);

               //---Get "new-barcode" element--
               var barcode = document.getElementById("new-barcode");
               //---Set barcode value on screen--
               barcode.value = result.text;
               var event = new Event('change');
               //---Fire change event back to new-barcode element to let it know we are done scanning a new barcode asynchronously IMPORTANT!!
               if ('fireEvent' in barcode) {
                   barcode.fireEvent("onchange");
                   barcode.fireEvent("onchange");
               }
               else {
                   var evt = document.createEvent("HTMLEvents");
                   evt.initEvent("change", false, true);
                   barcode.dispatchEvent(evt);
                   barcode.dispatchEvent(evt);
               }
           },
           function (error) {
               //----Bad result came back from barcode scan--
               alert("Scanning failed: " + error);
           },
           {
               "preferFrontCamera": true, // iOS and Android
               "showFlipCameraButton": true, // iOS and Android
               "prompt": "Place a barcode inside the scan area", // supported on Android only
               "formats": "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
               "orientation": "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
           }
        );

	};

    /**
    * Update the text of a barCodes item.
    */
	BarCodesCtrl.prototype.changeBarCodesText = function (barCodesItem) {
	    this.storage.update(barCodesItem)
			.then(this.updateBarCode.bind(this))
	};

	/**
	 * Check/uncheck a barCodes item.
	 */
	BarCodesCtrl.prototype.toggleBarCodesDone = function (barCodesItem) {
	    barCodesItem.done = !barCodesItem.done;
		this.storage.update(barCodesItem);
	};

	/**
	 * Remove a barCodes item from the list.
	 */
	BarCodesCtrl.prototype.removeBarCodes = function (barCodesItem, $index) {
		var _this = this;
		this.storage.del(barCodesItem).then(function (barCodes) {
		    // var index = _this.barCodess.indexOf(barCodes);
		    _this.barCodess.splice($index, 1);
		    _this.refresh();
		});
	};
})();