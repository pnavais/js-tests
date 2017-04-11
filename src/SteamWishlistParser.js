#!/usr/bin/env node

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
const chalk        = require('chalk');
const cheerio      = require('cheerio');
const Table        = require('cli-table2');
const GamePrice    = require('./GamePrice');

const log          = console.log;

let userName = "pnavais";
let gameList = [];

// Define the Promise
const rp_aux = new rp('http://steamcommunity.com/id/' + userName + '/wishlist', function (error, response, body) {

    log(chalk.yellow('Retrieving Steam wishlist for ['+userName+']...\n'));

    // Parse the response
    let $ = cheerio.load(body);

    // Process each game row
    $('div[class="wishlistRow "]').each(function (i, elem) {
        // General game info
        const gamePrice = new GamePrice($(this).attr("id"));
        gamePrice.setOrder(i + 1);
        gamePrice.setTitle($(this).find('h4').text());

        // Retrieve game price
        const gameBlock = $(this).find('div[class="gameListPriceData"]');
        let price = gameBlock.find('div[class="price"]').text().trim();
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
});

// Print the results in an ASCII Table
rp_aux.then(function(parsedBody) {	
	
    const table = new Table({
        chars: { 'top': '═' , 'top-mid': '┬' , 'top-left': '╔' ,
                                     'top-right': '╗', 'bottom': '═' , 'bottom-mid': '╧' ,
                                     'bottom-left': '╚' , 'bottom-right': '╝', 'left': '║',
                                     'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼', 'right': '║',
                                     'right-mid': '╢' , 'middle': '│'
                                   },
                            style:{ border:[], header:[] }
                        });

    table.push([{colSpan:3,hAlign:'center',content:'Steam Wishlist for ['+chalk.yellow(userName)+"] , "+gameList.length+" "+((gameList.length>1) ? "games" : "game")+" found" }]);
	
    let priceSum = 0;
	for (let i = 0; i < gameList.length; i++) {
		let priceTxt = gameList[i].getPrice();

		if (gameList[i].hasDiscount()) {            
            priceTxt = chalk.gray.bold.strikethrough(gameList[i].getOldPrice())+" -> "+chalk.green.bold(priceTxt);
            priceTxt += " "+chalk.bgGreen.bold(gameList[i].getDiscount());            
		}		
        table.push( [ i+1, chalk.blue(gameList[i].getTitle()), {hAlign:'center',content:priceTxt} ] );
    }

	log(table.toString());
});