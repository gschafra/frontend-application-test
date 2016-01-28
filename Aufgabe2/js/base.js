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
		var _pause = false;
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

		this.getItemNodes = function() {
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
			_pause = true;
		}

		this.resume = function() {
			if (_intervalId) {
				_intervalId = 0;
				_intervalId = that.start();
			}
			_pause = false;
		}

		this.toggle = function() {
			_pause ? that.resume() : that.pause();
			return _pause;
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
		/*
		 * Pause on click
		 */
		container.addEventListener('click', function(e) {
			var paused = that.toggle();
			var imageWrapper = this.querySelectorAll('div.slideimg');
			for (var i = 0; i < imageWrapper.length; i++) {
				paused ? addClass(imageWrapper[i], 'paused') : removeClass(imageWrapper[i], 'paused');
			}
			return false;
		});
		/*
		 * Some touch magic planned here
		 */

		//As requested, not really nice...dirty
		this.getContainer().addEventListener('transitionend', function(e){
			that.loadImage(that.getCurrentIdx());
		});
		return items;
	};

	/**
	 * Show image in slider of index idx
	 *
	 * @return {Number}
	 * @author gscha_000
	 */
	MySlider.prototype.show = function(idx) {
		if (typeof idx == 'undefined') idx = 0;
		var itemNodes = this.getItemNodes();
		var slidingPanel = itemNodes[0].parentElement;
		//Pre-add image container
		var wrapper = this.addImageWrapper(idx);
		console.log(wrapper.offsetWidth);
		slidingPanel.style.transform = 'translateX(-'+idx * wrapper.offsetWidth+'px)';
		return this;
	}

	/**
	 * Add dummy image container containing loader background to item
	 *
	 * @return {Number}
	 * @author gscha_000
	 */
	MySlider.prototype.addImageWrapper = function(idx) {
		if (typeof idx == 'undefined') idx = 0;
		var itemNode = this.getItemNodes()[idx];
		var imgWrapper = itemNode.firstChild;
		if (this.isImgageWrapper(imgWrapper))
			return imgWrapper;
		var div = document.createElement('div');
		var inserted = itemNode.insertBefore(div, imgWrapper);
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
		var itemNode = this.getItemNodes()[idx];
		var imgWrapper = itemNode.firstChild;
		//Check, if container already exists
		if (!this.isImgageWrapper(imgWrapper)) {
			imgWrapper = this.addImageWrapper(idx);
		}
		//Check, if image already exists
		if (imgWrapper.firstChild && imgWrapper.firstChild.nodeName == 'IMG')
			return;
		var img = document.createElement('img');
		var image = this.getImages()[idx];
		img.setAttribute('src', image.src);
		img.setAttribute('alt', image.alt);
		var inserted = imgWrapper.insertBefore(img, imgWrapper.firstChild);
		addClass(imgWrapper, 'loaded');
	}

	MySlider.prototype.isImgageWrapper = function(element) {
		return (element.nodeName == 'DIV' && hasClass(element, 'slideimg'));
	}

	/**
	 * Add a class
	 *
	 * @param {String} element
	 * @param {String} classname
	 */
	function addClass(element, classname) {
		if (!hasClass(element, classname)) {
			element.className += (' '+classname);
		}
	}

	/**
	 * Remove a class
	 *
	 * @param {String} element
	 * @param {String} classname
	 */
	function removeClass(element, classname) {
		if (hasClass(element, classname)) {
			element.className = element.className.replace(' '+classname, '');
		}
	}

	/**
	 * Check if class exists a class
	 *
	 * @param {String} element
	 * @param {String} classname
	 * @return {Boolean}
	 */
	function hasClass(element, classname) {
		return (element.className.indexOf(classname) > -1);
	}

	//Instantiating sliders
	var images = [
		{'src':'img/1.jpg', 'alt':'Dafür stehen wir' },
		{'src':'img/2.jpg', 'alt':'Entwicklung' },
		{'src':'img/3.png', 'alt':'Marketing' },
		{'src':'img/4.jpg', 'alt':'Team' }
	];
	var sliderNodes = document.getElementsByClassName('slider');
	for (var i = 0; i < sliderNodes.length; i++) {
		new MySlider(sliderNodes[i], 'div.part', images).show(0).start();
	}
})(window, document);