
import './scss/app.scss';

import Form from './class-form';


const exchange_select = document.getElementById('exchange_type');                                             console.log( exchange_select );

const assets_select = document.getElementById('assets_type');                                                 console.log( assets_select );

const symbols_select = document.getElementById('symbols_type');                                               console.log( symbols_select );

const iframe_link = document.getElementById('iframe_link');                                                   console.log( iframe_link );

const iframe = document.querySelector('iframe');                                                               console.log( iframe );

const form = document.querySelector('form');                                                                   console.log( form );

const comment_section = document.getElementById('comment_section');                                           console.log( comment_section );


// ------------------------------------------
//  FORM INSTANCE TO CRYPTO
// ------------------------------------------

let crypto = new Form({
    'currencies': [],
    'assets': [],
    'symbols': [],
});


// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}


function generate_options(data) {                                                                                       console.log( data );

    let options = '';

    for ( let option of data ) {

        options = options + `
            <option value='${option.exchange_id}'>${option.name}</option>
        `;

    }

    return options;

}


function fetch_exchanges() {

    crypto.get('https://rest.coinapi.io/v1/exchanges')
        .then( data => {                                                                                                console.log( data );

            let options = '';

            for ( let option of data ) {

                options = options + `
                    <option value='${option.exchange_id}'>${option.name}</option>
                `;

            }

            exchange_select.innerHTML = options;

            iframe.src = data[0].website;

            iframe_link.href = data[0].website;

        });

}

function fetch_assets() {

    crypto.get('https://rest.coinapi.io/v1/assets')
        .then( data => {

            let options = '';

            for ( let option of data ) {

                options = options + `
                    <option value='${option.asset_id}'>${option.name}</option>
                `;

            }

            assets_select.innerHTML = options;

        });
}


// ------------------------------------------
//  FILL PAGE WITH SELECTS
// ------------------------------------------

fetch_exchanges();

fetch_assets();


// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

function get_chosen_exchanger() {

    let exchange_id = exchange_select.value;                                                                            console.log( exchange_id );

    let exchange = crypto.exchanges.filter( exchange => exchange.exchange_id == exchange_id )[0];                          console.log( exchange );

    return exchange;

}

function get_chosen_asset() {

    let asset_id = assets_select.value;                                                                            console.log( asset_id );

    let asset = crypto.assets.filter( asset => asset.asset_id == asset_id )[0];                          console.log( asset );

    return asset;

}

function show_website_in_iframe() {

    let exchange = get_chosen_exchanger();

    iframe.src = exchange.website;

    iframe_link.href = exchange.website;

}

// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------

exchange_select.addEventListener('change', show_website_in_iframe);

form.addEventListener('submit', post_comment );


// ------------------------------------------
//  POST DATA
// ------------------------------------------

function post_comment(e) {

    e.preventDefault();

    const name = document.getElementById('name').value;

    const comment = document.getElementById('comment').value;

    const exchange = get_chosen_exchanger();

    const asset = get_chosen_asset();

    comment_section.innerHTML = `
        <h3>Hi ${name}.</h3>
        
        <p>We are currently working on a very delightfull comment section for rating and commenting each exchanger.</p>
        
        <p>Come back another time and we will almost for sure have implemented it, at that time.</p>
        
        <hr>
        
        <h4>We have received your comment so far as:</h4>
        
        <p>${comment}</p>
        
        <hr>
        
        <p>For your choice as:</p>
        
        <p>Exchanger: ${exchange.name} - ${exchange.website}</p>
        
        <p>Asset: ${asset.name}</p>
        
        <p>Thank you a lot. And see you soon.</p>
    `;

}
