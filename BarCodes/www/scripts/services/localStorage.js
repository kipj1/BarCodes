(function () {
	'use strict';

	angular.module('xPlat.services').service('localStorage', ['$q', '$window', 'guidGenerator', LocalStorage]);

	/**
	 * Local storage service.
	 * @param {angular.Service} $q
	 * @param {angular.Service} $window
	 * @param {angular.Service} guidGenerator
	 * @constructor
	 */
	function LocalStorage($q, $window, guidGenerator) {
		this.$q = $q;
		this.$window = $window;
		this.guidGenerator = guidGenerator;
	}

	/**
	 * Key for storing barCodes items locally.
	 * @type {string}
	 * @const
	 */
	LocalStorage.prototype.LOCAL_STORAGE_KEY = 'barCodesItems';

	/**
	 * Load JSON data from the local storage.
	 * @return {Object} BarCodes items.
	 */
	LocalStorage.prototype.loadFromStorage = function () {
		return angular.fromJson(this.$window.localStorage.getItem(this.LOCAL_STORAGE_KEY)) || [];
	};

	/**
	 * Save JSON data in the local storage.
	 * @params {Object} items BarCodes items.
	 */
	LocalStorage.prototype.saveToStorage = function (items) {
		this.$window.localStorage.setItem(this.LOCAL_STORAGE_KEY, angular.toJson(items));
	}

	/**
	 * Retrieve all data from local storage.
	 */
	LocalStorage.prototype.getAll = function () {

	    var items;
	    var _this = this;
	    items = _this.loadFromStorage();
	    return _this.$q.when(items);
	};

	/**
	 * Create a new barCodes to local storage.
	 * @param {string} text Text of the barCodes item.
	 * @param {string} address Address of the barCodes item.
	 */
	LocalStorage.prototype.create = function (text, address) {
		var item = {
			id: this.guidGenerator.get(),
			text: text,
			address: address,
			done: false
		}
		var items = this.loadFromStorage();
		items.push(item);

		this.saveToStorage(items);
		return this.$q.when(item);
	};

	/**
	 * Update an existing barCodes in local storage.
	 * @param {Object} item barCodes item to modify.
	 */
	LocalStorage.prototype.update = function (item) {
		var items = this.loadFromStorage();
		for (var i = 0; i < items.length; i++) {
			if (items[i].id === item.id) {
				items[i] = item;
				break;
			}
		}

		this.saveToStorage(items);
		return this.$q.when(item);
	};

	/**
	 * Remove a barCodes from local storage.
	 * @param {Object} item BarCodes item to remove from local storage.
	 */
	LocalStorage.prototype.del = function (item) {
		var items = this.loadFromStorage();
		for (var i = 0; i < items.length; i++) {
			if (items[i].id === item.id) {
				items.splice(i, 1);
				break;
			}
		}

		this.saveToStorage(items);
		return this.$q.when(item);
	};
})();