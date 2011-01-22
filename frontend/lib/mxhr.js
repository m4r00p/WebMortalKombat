/**
 * DUI.Stream: A JavaScript MXHR client
 *
 * Copyright (c) 2009, Digg, Inc.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without 
 * modification, are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice, 
 *   this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, 
 *   this list of conditions and the following disclaimer in the documentation 
 *   and/or other materials provided with the distribution.
 * - Neither the name of the Digg, Inc. nor the names of its contributors 
 *   may be used to endorse or promote products derived from this software 
 *   without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE 
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE 
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * @module DUI.Stream
 * @author Micah Snyder <micah@digg.com>
 * @author Jordan Alperin <alpjor@digg.com>
 * @description A JavaScript MXHR client
 * @version 0.0.3
 * @link http://github.com/digg/dui
 *
 */

(function() {
	
	// ================================================================================
	// MXHR
	// --------------------------------------------------------------------------------
	// F.mxhr is a porting of DUI.Stream (git://github.com/digg/stream.git).
	//
	// We ripped out the jQuery specific code, and replaced it with normal for() loops. 
	// Also worked around some of the brittleness in the string manipulations, and 
	// refactored some of the rest of the code.
	// 
	// Images don't work on IE yet, since we haven't found a way to get the base64
	// encoded image data into an actual image (RFC 822 looks promising, and terrifying:
	// http://www.hedgerwow.com/360/dhtml/base64-image/demo.php)
	//
	// Another possible approach uses "mhtml:", 
	// http://www.stevesouders.com/blog/2009/10/05/aptimize-realtime-spriting-and-more/ 
	//
	// --------------------------------------------------------------------------------
	// GLOSSARY
	// packet:  the amount of data sent in one ping interval
	// payload: an entire piece of content, contained between control char boundaries
	// stream:  the data sent between opening and closing an XHR. depending on how you 
	//          implement MHXR, that could be a while.
	// ================================================================================

	F = window.F || {};
	F.mxhr = {
		
		// --------------------------------------------------------------------------------
		// Variables that must be global within this object.
		// --------------------------------------------------------------------------------

		getLatestPacketInterval: null,
		lastLength: 0,
		listeners: {},
		
		boundary: "\u0003", 		// IE jumps over empty entries if we use the regex version instead of the string.
		fieldDelimiter: "\u0001",

		_msxml_progid: [
			'MSXML2.XMLHTTP.6.0',
			'MSXML3.XMLHTTP',
			'Microsoft.XMLHTTP', // Doesn't support readyState == 3 header requests.
			'MSXML2.XMLHTTP.3.0', // Doesn't support readyState == 3 header requests.
		],

		// --------------------------------------------------------------------------------
		// load()
		// --------------------------------------------------------------------------------
		// Instantiate the XHR object and request data from url.
		// --------------------------------------------------------------------------------

		load: function(url) {
			this.req = this.createXhrObject();
			if (this.req) {
				this.req.open('GET', url, true);

				var that = this;
				this.req.onreadystatechange = function() {
					that.readyStateHandler();
				}

				this.req.send(null);
			}
		},

		// --------------------------------------------------------------------------------
		// createXhrObject()
		// --------------------------------------------------------------------------------
		// Try different XHR objects until one works. Pulled from YUI Connection 2.6.0.
		// --------------------------------------------------------------------------------
		
		createXhrObject: function() {
			var req;
			try {
				req = new XMLHttpRequest();
			}
			catch(e) {
				for (var i = 0, len = this._msxml_progid.length; i < len; ++i) {
					try {
						req = new ActiveXObject(this._msxml_progid[i]);
						break;
					}
					catch(e2) {  }
				}
			}
			finally {
				return req;
			}
		},		
    
		// --------------------------------------------------------------------------------
		// readyStateHandler()
		// --------------------------------------------------------------------------------
		// Start polling on state 3; stop polling and fire off oncomplete event on state 4.
		// --------------------------------------------------------------------------------

		readyStateHandler: function() {

			if (this.req.readyState === 3 && this.getLatestPacketInterval === null) {
					
				// Start polling.

				var that = this;					
				this.getLatestPacketInterval = window.setInterval(function() { that.getLatestPacket(); }, 15);
			}

			if (this.req.readyState == 4) {

				// Stop polling.

				clearInterval(this.getLatestPacketInterval);

				// Get the last packet.

				this.getLatestPacket();

				// Fire the oncomplete event.

				if (this.listeners.complete && this.listeners.complete.length) {
					var that = this;
					for (var n = 0, len = this.listeners.complete.length; n < len; n++) {
						this.listeners.complete[n].apply(that);
					}
				}
			}
		},
		
		// --------------------------------------------------------------------------------
		// getLatestPacket()
		// --------------------------------------------------------------------------------
		// Get all of the responseText downloaded since the last time this was executed.
		// --------------------------------------------------------------------------------		
    
		getLatestPacket: function() {
			var length = this.req.responseText.length;
			var packet = this.req.responseText.substring(this.lastLength, length);

			this.processPacket(packet);
			this.lastLength = length;
		},
   
		// --------------------------------------------------------------------------------
		// processPacket()
		// --------------------------------------------------------------------------------
		// Keep track of incoming chunks of text; pass them on to processPayload() once
		// we have a complete payload.
		// --------------------------------------------------------------------------------
 
		processPacket: function(packet) {

			if (packet.length < 1) return;

			// Find the beginning and the end of the payload. 

			var startPos = packet.indexOf(this.boundary),
			    endPos = -1;

			if (startPos > -1) {
				if (this.currentStream) {

					// If there's an open stream, that's an end marker.

					endPos = startPos;
					startPos = -1;
				} 
				else {
					endPos = packet.indexOf(this.boundary, startPos + this.boundary.length);
				}
			}

			// Using the position markers, process the payload.

			if (!this.currentStream) {

				// Start a new stream.

				this.currentStream = '';

				if (startPos > -1) {

					if (endPos > -1) {

						// Use the end marker to grab the entire payload in one swoop

						var payload = packet.substring(startPos, endPos);
						this.currentStream += payload;

						// Remove the payload from this chunk

						packet = packet.slice(endPos);

						this.processPayload();

						// Start over on the remainder of this packet

						try {
							this.processPacket(packet);
						}
						catch(e) {  } // This catches the "Maximum call stack size reached" error in Safari (which has a really low call stack limit, either 100 or 500 depending on the version).
					} 
					else {
						// Grab from the start of the start marker to the end of the chunk.

						this.currentStream += packet.substr(startPos);

						// Leave this.currentStream set and wait for another packet.
					}
				} 
			} 
			else {
				// There is an open stream.

				if (endPos > -1) {

					// Use the end marker to grab the rest of the payload.

					var chunk = packet.substring(0, endPos);
					this.currentStream += chunk;

					// Remove the rest of the payload from this chunk.
					packet = packet.slice(endPos);

					this.processPayload();

					//Start over on the remainder of this packet.

					this.processPacket(packet);
				} 
				else {
					// Put this whole packet into this.currentStream.

					this.currentStream += packet;

					// Wait for another packet...
				}
			}
		},

		// --------------------------------------------------------------------------------
		// processPayload()
		// --------------------------------------------------------------------------------
		// Extract the mime-type and pass the payload on to its listeners.
		// --------------------------------------------------------------------------------
    
		processPayload: function() {

			// Get rid of the boundary.
			
			this.currentStream = this.currentStream.replace(this.boundary, '');

			// Perform some string acrobatics to separate the mime-type and id from the payload.
			// This could be customized to allow other pieces of data to be passed in as well,
			// such as image height & width.

			var pieces = this.currentStream.split(this.fieldDelimiter);
			var mime = pieces[0]
			var payloadId = pieces[1];
			var payload = pieces[2];

			// Fire the listeners for this mime-type.

			var that = this;
			if (typeof this.listeners[mime] != 'undefined') {
				for (var n = 0, len = this.listeners[mime].length; n < len; n++) {
					this.listeners[mime][n].call(that, payload, payloadId);
				}
			}

			delete this.currentStream;
		},
		
		// --------------------------------------------------------------------------------
		// listen()
		// --------------------------------------------------------------------------------
		// Registers mime-type listeners. Will probably rip this out and use YUI custom
		// events at some point. For now, it's good enough.
		// --------------------------------------------------------------------------------		
    
		listen: function(mime, callback) {
			if (typeof this.listeners[mime] == 'undefined') {
				this.listeners[mime] = [];
			}

			if (typeof callback === 'function') {
				this.listeners[mime].push(callback);
			}
		}
	};

})();
