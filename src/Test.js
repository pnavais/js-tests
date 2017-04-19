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
 * Tests the Steam Wishlist Scraper
 */

const chalk                = require('chalk');
const Table                = require('cli-table2');
const SteamWishlistScraper = require('./SteamWishlistScraper');

let userName = 'pnavais';

console.log(chalk.yellow('Retrieving Steam wishlist for ['+userName+']...\n'));

const scraper = new SteamWishlistScraper();
const gameListPromise = scraper.getWishList(userName);

// Print the results in an ASCII Table
gameListPromise.then( (gameList) => {	
	
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
	
    for (let i = 0; i < gameList.length; i++) {
		let priceTxt = gameList[i].getPrice();

		if (gameList[i].hasDiscount()) {            
            priceTxt = chalk.gray.bold.strikethrough(gameList[i].getOldPrice())+" -> "+chalk.green.bold(priceTxt);
            priceTxt += " "+chalk.bgGreen.bold(gameList[i].getDiscount());            
		}		
        table.push( [ i+1, chalk.blue(gameList[i].getTitle()), {hAlign:'center',content:priceTxt} ] );
    }

	console.log(table.toString());
});

