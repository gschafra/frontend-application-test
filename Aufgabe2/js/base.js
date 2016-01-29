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
	 * @param {Object} Settings
	 */
	var MySlider = function(container, settings) {
		var _settings = extend({
			selector: null, //Selector for items to be slided
			img: {}, //Array of json objects {src: "...", alt: "..."} defining the images
			interval: 3000, //Slide interval
			wrapperClass: 'slidesWrap', //Slides wrapper class
		    chooserClass: 'slideSelect', //Slides selector container class
		    imageWrapperClass: 'slideimg', //Image wrapper class
		    withChooser: true
		}, settings);
		var _container = container;
		var _itemNodes;
		var _currentIdx = 0;
		var _intervalId = 0;
		var _pause = false;
		var that = this;

		this.getSetting = function(setting) {
			if (typeof _settings[setting] !== 'undefined')
				return _settings[setting];
			return null;
		};

		this.getCurrentIdx = function() {
			return _currentIdx;
		};

		this.getContainer = function() {
			return _container;
		};

		this.getItemNodes = function() {
			return _itemNodes;
		};

		this.set = function(idx) {
			var length = _itemNodes.length;
			if ( length === 0 || idx > length - 1 || idx == _currentIdx) return;
			_currentIdx = idx;
			that.show(_currentIdx);
		};

		this.next = function() {
			var length = _itemNodes.length;
			if ( length === 0) return;
			if (_currentIdx < length-1)
				_currentIdx++;
			else
				_currentIdx = 0;
			that.show(_currentIdx);
		};

		this.start = function() {
			if (_itemNodes.length > 0 && _intervalId === 0) {
				_intervalId = window.setInterval(that.next, that.getSetting('interval'));
			}
			return _intervalId;
		};

		this.pause = function() {
			if (_intervalId) {
				window.clearInterval(_intervalId);
			}
			_pause = true;
		};

		this.resume = function() {
			if (_intervalId) {
				_intervalId = 0;
				_intervalId = that.start();
			}
			_pause = false;
		};

		this.toggle = function() {
			if (_pause) {
				that.resume();
			} else {
				that.pause();
			}
			return _pause;
		};

		this.stop = function() {
			that.pause();
			_intervalId = 0;
		};

		_itemNodes = this.init();
		this.loadImage();
	};

	/*
	 * Prototypal setup
	 */
	/**
	 * Initialize slider object
	 *
	 * @return {NodeList}
	 */
	MySlider.prototype.init = function() {
		//Wrap slides with div.slides by getting first item of items to be wrapped
		var sliderContainer = this.getContainer();
		var items = sliderContainer.querySelectorAll(this.getSetting('selector'));
		var wrapperDiv = document.createElement('div');
		addClass(wrapperDiv, this.getSetting('wrapperClass'));
		wrapperDiv.style.width = sliderContainer.offsetWidth * items.length + 'px';
		wrapperDiv = items[0].parentNode.appendChild(wrapperDiv);
		for (var i = 0; i < items.length; i++) {
			wrapperDiv.appendChild(items[i].parentNode.removeChild(items[i]));
		}
		items = sliderContainer.querySelectorAll(this.getSetting('selector'));
		var that = this;
		/*
		 * Pause on click
		 */
		sliderContainer.addEventListener('click', function(e) {
			var paused = that.toggle();
			var imageWrapper = this.querySelectorAll('div.'+that.getSetting('imageWrapperClass'));
			for (var i = 0; i < imageWrapper.length; i++) {
				if (pause) {
					addClass(imageWrapper[i], 'paused');
				} else {
					removeClass(imageWrapper[i], 'paused');
				}
			}
			return false;
		});
		/*
		 * Some touch magic planned here
		 */

		//As requested, not really nice...dirty
		sliderContainer.addEventListener('transitionend', function(e){
			that.loadImage(that.getCurrentIdx());
		});

		//Add selector
		if (this.getSetting('withChooser')) {
			this.addChooser(items.length);
		}

		return items;
	};



	/**
	 * Add the selector controls
	 *
	 * @param {Number} Number of navigateable items (optional)
	 */
	MySlider.prototype.addChooser = function(count) {
		var that = this;
		var sliderContainer = this.getContainer();
		if (typeof count == 'undefined') {
			count = sliderContainer.querySelectorAll(this.getSetting('selector')).length;
		}
		var selectorContainer = document.createElement('div');
		var selectorSubContainer = document.createElement('div');
		for (var i = 0; i < count; i++) {
			var node = document.createElement('a');
			node.setAttribute('href', '#');
			node = selectorSubContainer.appendChild(node);
			(function(index){
				node.onclick = function(e){
		              that.set(index);
		              that.pause();
		              var imageWrapper = sliderContainer.querySelectorAll('div.'+that.getSetting('imageWrapperClass'));
			  		  for (var i = 0; i < imageWrapper.length; i++) {
			  		       addClass(imageWrapper[i], 'paused');
			  		  }
		              e.preventDefault();
		              e.stopImmediatePropagation();
		              return false;
		        };
		    })(i);

		}
		selectorContainer.appendChild(selectorSubContainer);
		addClass(selectorContainer, this.getSetting('chooserClass'));
		sliderContainer.appendChild(selectorContainer);
	};

	/**
	 * Show image in slider of index idx
	 *
	 * @return {Number}
	 */
	MySlider.prototype.show = function(idx) {
		if (typeof idx == 'undefined') idx = 0;
		var itemNodes = this.getItemNodes();
		var slidingPanel = itemNodes[0].parentElement;
		//Pre-add image container
		var wrapper = this.addImageWrapper(idx);
		slidingPanel.style.transform = 'translateX(-'+idx * wrapper.offsetWidth+'px)';
		//Set active selector
		if (this.getSetting('withChooser')) {
			var sliderContainer = this.getContainer();
			var buttons = sliderContainer.querySelectorAll('div.'+this.getSetting('chooserClass')+' a');
	  		for (var i = 0; i < buttons.length; i++) {
	  			removeClass(buttons[i], 'active');
	  		}
	  		addClass(buttons[idx], 'active');
		}
		return this;
	};

	/**
	 * Add dummy image container containing loader background to item
	 *
	 * @return {Number}
	 */
	MySlider.prototype.addImageWrapper = function(idx) {
		if (typeof idx == 'undefined') idx = 0;
		var itemNode = this.getItemNodes()[idx];
		var imgWrapper = itemNode.firstChild;
		if (this.isImgageWrapper(imgWrapper))
			return imgWrapper;
		var div = document.createElement('div');
		var inserted = itemNode.insertBefore(div, imgWrapper);
		inserted.className = this.getSetting('imageWrapperClass');
		return inserted;
	};

	/**
	 * Load slider image into container if exists index idx
	 *
	 * @return {Number}
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
		var image = this.getSetting('img')[idx];
		img.setAttribute('src', image.src);
		img.setAttribute('alt', image.alt);
		var inserted = imgWrapper.insertBefore(img, imgWrapper.firstChild);
		addClass(imgWrapper, 'loaded');
	};

	/**
	 * Check if element is a image wrapper
	 *
	 * @param {Node} element
	 * @returns {Boolean}
	 */
	MySlider.prototype.isImgageWrapper = function(element) {
		return (element.nodeName == 'DIV' && hasClass(element, this.getSetting('imageWrapperClass')));
	};

	/**
	 * Add a class
	 *
	 * @param {String} element
	 * @param {String} classname
	 */
	function addClass(element, classname) {
		if (!hasClass(element, classname)) {
			element.className += (' '+classname);
			element.className = element.className.trim();
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
			element.className = element.className.replace(classname, '').trim();
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

	/**
	 * Pure JS equivalent to jQuery's $.extend() function
	 */
	function extend(){
	    for(var i=1; i<arguments.length; i++)
	        for(var key in arguments[i])
	            if(arguments[i].hasOwnProperty(key))
	                arguments[0][key] = arguments[i][key];
	    return arguments[0];
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
		new MySlider(sliderNodes[i], {selector: 'div.part', img: images}).show(0).start();
	}
})(window, document);