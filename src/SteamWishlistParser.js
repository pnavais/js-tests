#!/usr/bin/env node
'use strict';

const rp           = require('request-promise');
const chalk        = require('chalk');
const cheerio      = require('cheerio');
//const ProgressBar  = require('progress');
const Table        = require('cli-table2');
const GamePrice    = require('./GamePrice');

const log          = console.log;

let userName = "pnavais";
let gameList = [];


log(chalk.yellow('Retrieving Steam wishlist for ['+userName+']...\n'));

// Define the Promise
const rp_aux = new rp('http://steamcommunity.com/id/' + userName + '/wishlist', function (error, response, body) {

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
                gamePrice.setOldPrice(discountBlock.find('div[class="discount_pct"]').text().trim());
                gamePrice.setDiscount(discountBlock.find('div[class="discount_original_price"]').text().trim());
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
                                     'top-right': '╗', 'bottom': '═' , 'bottom-mid': '┴' ,
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

        //priceSum += accounting.unformat(priceTxt);

		if (gameList[i].hasDiscount()) {
            priceTxt = chalk.green.bold(priceTxt);
			priceTxt += " "+chalk.bgGreen.bold("["+gameList[i].getOldPrice()+"]");
		}		
        table.push( [ i+1, chalk.blue(gameList[i].getTitle()), {hAlign:'center',content:priceTxt} ] );
    }
    table.push( [{colSpan:2, content:'Total'}, {hAlign:'center',content: priceSum}]);


	log(table.toString());
});
