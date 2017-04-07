//const request     = require('request');
const rp          = require('request-promise');
const chalk       = require('chalk');
const cheerio     = require('cheerio');
const ProgressBar = require('progress');
const GamePrice   = require('./GamePrice');
const log         = console.log;

var bar;
//String.prototype.chomp = function ()
//{
    //return this.replace(/(\n|\r)+$/, '');
//};

let userName = "pnavais";

var gameList = [];


log(chalk.yellow('Retrieving Steam wishlist for ['+userName+']...\n'));


var rp_aux = new rp('http://steamcommunity.com/id/'+userName+'/wishlist', function (error, response, body) {
    //log('error:', error); // Print the error if one occurred
    //log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //log('body:', body); // Print the HTML
    let $ = cheerio.load(body);
    $('div[class="wishlistRow "]').each(function(i, elem) {
    	// General game info
    	var gamePrice = new GamePrice($(this).attr("id"));
    	gamePrice.setOrder(i+1);
        gamePrice.setTitle($(this).find('h4').text());
        
        // Retrieve price
        var gameBlock = $(this).find('div[class="gameListPriceData"]');
        var price = gameBlock.find('div[class="price"]').text().trim();
        if (!price) {
            var discountBlock = gameBlock.find('div[class~="discount_block"]');
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

       //+" > |"+$(this).find('div[class="price"]').text().trim().chomp()+"|");
    });
});


rp_aux.then(function(parsedBody) {	
	for (i = 0; i < gameList.length; i++) {
		var msg = chalk.white("Game["+(i+1)+"/"+gameList.length+"] : ")+chalk.blue(gameList[i].getTitle())+" -> "+chalk.white(gameList[i].getPrice());
		if (gameList[i].hasDiscount()) {
			msg += " "+chalk.bgGreen("("+ gameList[i].getOldPrice()+")");
		}

		log(msg);
	}
});


