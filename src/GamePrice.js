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