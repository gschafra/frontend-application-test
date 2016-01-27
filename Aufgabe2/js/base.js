/*jshint smarttabs: true, laxbreak: true */
/*jslint white: true, vars: true */
/*global  window,document*/
(function(window, document, undefined) {
	"use strict";
	/**
	 * Slider class (trying a little bit encapsulation with pseudo-classical pattern
	 *
	 * @class
	 * @param {Node} Main slide container
	 * @param {String} Selector for items to be slided
	 * @param {Array} Array of json objects {src: "...", alt: "..."}
	 * @author gscha_000
	 */
	var MySlider = function(container, selector, img, interval) {
		var _container = container;
		var _itemseletor = selector;
		var _images = img;
		var _itemNodes;
		var _currentIdx = 0;
		var _interval = (typeof interval === 'undefined') ? 3000 : interval;
		var _intervalId = 0;
		var that = this;

		this.getCurrentIdx = function() {
			return _currentIdx;
		}

		this.getContainer = function() {
			return _container;
		}

		this.getItemselector = function() {
			return _itemseletor;
		}

		this.getImages = function() {
			return _images;
		}

		this.getImageNodes = function() {
			return _itemNodes;
		}

		this.next = function() {
			var length = _itemNodes.length;
			if ( length == 0) return;
			if (_currentIdx < length-1)
				_currentIdx++;
			else
				_currentIdx = 0;
			that.show(_currentIdx);
		}

		this.start = function() {
			if (_itemNodes.length > 0 && _intervalId == 0) {
				_intervalId = window.setInterval(that.next, _interval);
			}
			return _intervalId;
		}

		this.pause = function() {
			if (_intervalId) {
				window.clearInterval(_intervalId);
			}
		}

		this.resume = function() {
			if (_intervalId) {
				_intervalId = 0;
				_intervalId = that.start();
			}
		}

		this.stop = function() {
			that.pause();
			_intervalId = 0;
		}

		_itemNodes = this.init();
		this.loadImage();
	}
	/*
	 * Prototypal setup
	 */
	/**
	 * Initialize slider object
	 *
	 * @return {NodeList}
	 * @author gscha_000
	 */
	MySlider.prototype.init = function() {
		var slideitem = this.getContainer().getElementsByClassName('slides')[0];
		var items = slideitem.querySelectorAll(this.getItemselector());
		var that = this;
		var container = this.getContainer();
		container.addEventListener('mouseover', function(e) {
			that.pause();
			return false;
		});
		container.addEventListener('mouseout', function(e) {
			that.resume();
			return false;
		});
		//As requested, not really nice...dirty
		this.getContainer().addEventListener('transitionend', function(e){
			that.loadImage(that.getCurrentIdx());
		});
		return items;
	};
	/**
	 * Show slider item of index idx
	 *
	 * @return {Number}
	 * @author gscha_000
	 */
	MySlider.prototype.show = function(idx) {
		if (typeof idx == 'undefined') idx = 0;
		var itemNodes = this.getImageNodes();
		var parent = itemNodes[0].parentElement;
		//Pre-add image container
		this.addDummyImageContainer(idx);
		parent.style.transform = 'translateX(-'+idx * 600+'px)';
		return this;
	}

	/**
	 * Add dummy image container containing loader background to item
	 *
	 * @return {Number}
	 * @author gscha_000
	 */
	MySlider.prototype.addDummyImageContainer = function(idx) {
		if (typeof idx == 'undefined') idx = 0;
		var itemNode = this.getImageNodes()[idx];
		if (itemNode.firstChild.nodeName == 'DIV' && itemNode.className == 'slideimg')
			return;
		var div = document.createElement('div');
		var inserted = itemNode.insertBefore(div, itemNode.firstChild);
		inserted.className = 'slideimg';
		return inserted;
	}

	/**
	 * Load slider image into container if exists index idx
	 *
	 * @return {Number}
	 * @author gscha_000
	 */
	MySlider.prototype.loadImage = function(idx) {
		if (typeof idx == 'undefined') idx = 0;
		var itemNode = this.getImageNodes()[idx];
		var imgContainer = itemNode.firstChild;
		//Check, if container already exists
		if (!(imgContainer.nodeName == 'DIV' && imgContainer.className == 'slideimg')) {
			imgContainer = this.addDummyImageContainer(idx);
		}
		//Check, if image already exists
		if (imgContainer.firstChild && imgContainer.firstChild.nodeName == 'IMG')
			return;
		var img = document.createElement('img');
		var image = this.getImages()[idx];
		img.setAttribute('src', image.src);
		img.setAttribute('alt', image.alt);
		var inserted = imgContainer.insertBefore(img, imgContainer.firstChild);
		inserted.className = 'load';
	}

	//Instantiating sliders
	var images = [
		{'src':'img/3.jpg', 'alt':'Dafür stehen wir' },
		{'src':'img/3.jpg', 'alt':'Dafür stehen wir' },
		{'src':'img/3.jpg', 'alt':'Dafür stehen wir' },
		{'src':'img/3.jpg', 'alt':'Dafür stehen wir' }
	];
	var sliderNodes = document.getElementsByClassName('slider');
	for (var i = 0; i < sliderNodes.length; i++) {
		new MySlider(sliderNodes[i], 'div.part', images).show(0).start();
	}
})(window, document);