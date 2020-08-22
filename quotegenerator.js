// quotegenerator.js

/* 

API method calls are implemented in the form of HTTP requests to the URL
http://api.forismatic.com/api/1.0/.

Query parameters are passed using POST or GET (URL-encoded) method.

The server return data format is set by the query parameter.
The following response formats are supported:
xml
json
jsonp
html
text

getQuote Method
Selects a random quote using passed numeric key, if the key is not 
specified the server generates a random key.
The key influences the choice of quotation.

Request parameters:
method=getQuote — method name to invoke
format=<format> — one of the server supported response formats
key=<integer> — numeric key, which influences the choice of quotation, the maximum length is 6 characters
lang=<string> — response language ("ru" or "en")
jsonp=<string> — callback function name, used for jsonp format only (usage example)
Query example:
POST:
method=getQuote&key=457653&format=xml&lang=en

response:
<forismatic>
    <quote>
        <quoteText>Brevity — the soul of wit</quoteText>
        <quoteAuthor></quoteAuthor>
        <senderName>name or nickname of the quote sender</senderName>
        <senderLink>email or website address of the quote sender</senderLink>
    </quote>
</forismatic> 
*/

// constants for the html elements
const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

// Show Loader (Loading Spinner); hide Quote Container
function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

// Hide Loader (Loading Spinner); show Quote Container
function hideLoadingSpinner() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

// Get Quote from API
// asynchronous fetch function
// with async - the const will not be evaluated till the request completes
async function getQuote() {

    showLoadingSpinner();

    // adding a proxy to avoid the CORS error
    //const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const proxyUrl = 'https://pacific-cliffs-73220.herokuapp.com/';

    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    try {
        // the const response will not be evaluated till the const apiUrl request completes
        const response = await fetch(proxyUrl + apiUrl);
        // the const data will not be evaluated till the const response request completes
        const data = await response.json();
        //console.log(data);

        // handle empty author response
        if (data.quoteAuthor === '') {
            authorText.innerText = 'Unknown';
        } else {
            authorText.innerText = data.quoteAuthor;
        }
        // reduce font size for long-quotes response
        if (data.quoteText.length > 120) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = data.quoteText;

        hideLoadingSpinner();
    } catch (error) {
        // this call makes this a recursive function
        getQuote();
        //console.log('Error: no quote!', error);
    }
}

// Tweet Quote
function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    // open another tab for the twitter post
    window.open(twitterUrl, '_blank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
getQuote();
