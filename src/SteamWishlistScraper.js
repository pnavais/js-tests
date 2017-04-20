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
 * Parses the Steam wishlist page of a given user retrieving 
 * the list of games and prices, displaying them as an ascii table
 *
 * @summary   Parses the Steam Wishlist page of a given User
 *
 * @link      https://github.com/pnavais/steam-watcher
 * @since     30/03/2017  
 */

 'use strict';

const rp           = require('request-promise');
const cheerio      = require('cheerio');
const GamePrice    = require('./GamePrice');

/**
 * Creates a Steam Wishlist Scraper
 *
 * @constructor
 */
 function SteamWishlistScraper()  {	
 }

/**
 * Parses the Steam Wishlist of the given user name retrieving
 * a list of GamePrice objects.
 *
 * @method
 *
 * @param {string} parsedBody - The HTML parsed body.
 * @param {string} response   - The response status
 * @param {string} resWithFR  - Resolve with full reponse. 
 *                              meaning whether just the transformed body
 *                              or the whole response shall be returned
 * @return {List} the list of GamePrice objects.
 */
 function parseGameList(body, response, resWithFR) {
 	
 	const gameList = [];

 	// Parse the response
 	let $ = cheerio.load(body);

 	// Process each game row
 	$('div[class="wishlistRow "]').each((i, elem) => {

 		// General game info
 		const gamePrice = new GamePrice($(elem).attr("id"));
 		gamePrice.setOrder(i + 1);
 		gamePrice.setTitle($(elem).find('h4').text());

 		// Retrieve game price
 		const gameBlock = $(elem).find('div[class="gameListPriceData"]');
 		let price = gameBlock.find('div[class="price"]').text().trim();

 		// Check discounts
 		if (!price) {
 			const discountBlock = gameBlock.find('div[class~="discount_block"]');
 			if (discountBlock) {
 				price = discountBlock.find('div[class="discount_final_price"]').text().trim();
 				gamePrice.setDiscount(discountBlock.find('div[class="discount_pct"]').text().trim());
 				gamePrice.setOldPrice(discountBlock.find('div[class="discount_original_price"]').text().trim());
 			}
 		}

 		// No price found
 		if (!price) {
 			price = "X";
 		}

 		gamePrice.setPrice(price);
 		gameList.push(gamePrice);
 	});

 	return gameList;
 }

/**
 * Parses the Steam Wishlist of the given user name retrieving
 * a list of GamePrice objects.
 *
 * @method
 *
 * @param {string} userName - The Steam user name.
 * @return {List} the list of GamePrice objects.
 */

SteamWishlistScraper.prototype.getWishList = function(userName) {
	
	const options = {
		uri: 'http://steamcommunity.com/id/' + userName + '/wishlist',
		transform: parseGameList
	};

    return rp(options).promise();
};

module.exports = SteamWishlistScraper;
