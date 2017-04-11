/**
 *  Copyright 2017 Payball
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *     
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * Contains the basic information of a Steam game including
 * its price.
 *
 * @summary   Contains Steam game information
 *
 * @link      https://github.com/pnavais/steam-watcher
 * @since     30/03/2017  
 * @class
 * @classdesc Contains basic Steam game information
 */

'use strict';

function GamePrice(gameId)  {
	this._gameId = gameId;
}


GamePrice.prototype.setOrder = function(order) {
	this._order = order;
};

GamePrice.prototype.setSource = function(source) {
	this._source = source;
};

GamePrice.prototype.setURL = function(url) {
	this._url = url;
};

GamePrice.prototype.setTitle = function(title) {
	this._title = title;
};

GamePrice.prototype.getTitle = function() {
	return this._title;
};

GamePrice.prototype.setPrice = function(price) {
	this._price = price;
};

GamePrice.prototype.getPrice = function() {
	return this._price;
};

GamePrice.prototype.hasDiscount = function(discount) {
	return this._discount;
};

GamePrice.prototype.setOldPrice = function(oldPrice) {
	this._oldPrice = oldPrice;
};

GamePrice.prototype.getOldPrice = function() {
	return this._oldPrice;
};

GamePrice.prototype.setDiscount = function(discount) {
	this._discount = discount;
};

GamePrice.prototype.getDiscount = function() {
	return this._discount;
};

module.exports = GamePrice;