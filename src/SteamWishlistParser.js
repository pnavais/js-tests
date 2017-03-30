const http = require('request');
const chalk = require('chalk');
const cheerio = require('cheerio');
const log = console.log;

String.prototype.chomp = function ()
{
    return this.replace(/(\n|\r)+$/, '');
};

let userName = "pnavais";


log(chalk.blue('Retrieving Steam wishlist for ['+userName+']...'));


let request = require('request');
request('http://steamcommunity.com/id/'+userName+'/wishlist', function (error, response, body) {
    log('error:', error); // Print the error if one occurred
    log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //log('body:', body); // Print the HTML
    let $ = cheerio.load(body);
    $('div[class="wishlistRow "]').each(function(i, elem) {
        log("Indice ["+(i+1)+"]> "+$(this).attr("id")+" > "+$(this).find('h4').text()+" > |"+$(this).find('div[class="price"]').text().trim().chomp()+"|");
    });
});

