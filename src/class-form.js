
/**
 * Testing application javascript code, in any javascript application
 *
 * To use writer: t( value, new Error());
 *
 * @param value
 * @param error
 * @returns {boolean}
 * @author Jonas Schelde
 * @version 1.0.1
 */
function t(value, error) {

    var activate_test = true;


    // Quit - if test is turned of
    if (!activate_test) {

        return false;

    }


    // Extract - line number from error
    var line_text, line_number_position, line_number, line_number_ending_position, test_response;

    line_text = error.stack;                                           // console.log( line_text );

    line_number_position = line_text.indexOf('.js:');                // console.log( line_number_position );

    if (line_number_position === -1) {                               //   console.log( true );

        return false;

    }

    line_number = line_text.substring(line_number_position + 4);                      //  console.log( line_number );

    line_number_ending_position = line_number.indexOf(':');                         //  console.log( line_number_ending_position );

    line_number = line_number.substring(0, line_number_ending_position);              //  console.log( line_number );


    // Prepare - current time
    var today, time;

    today = new Date();

    time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();


    // Print - test line for debugging and finding errors and value
    console.log('[' + time + ']' + ' test ' + line_number);

    console.log(value);


    return true;

}


class Errors {

    /**
     * Create a new Errors instance.
     */
    constructor() {

        this.errors = {};

    }


    /**
     * Determine if an errors exists for the given field.
     *
     * @param {string} field
     */
    has(field) {

        return this.errors.hasOwnProperty(field);

    }


    /**
     * Determine if we have any errors.
     */
    any() {

        return Object.keys(this.errors).length > 0;

    }


    /**
     * Retrieve the error message for a field.
     *
     * @param {string} field
     */
    get(field) {

        if (this.errors[field]) {

            return this.errors[field][0];

        }

    }

    /**
     * Retrieve the first error message
     *
     * @param {string} field
     */
    get_first() {

        let first_key = Object.keys(this.errors)[0];

        let error = this.errors[first_key][0];

        return error;

    }


    /**
     * Record the new errors.
     *
     * @param {object} errors
     */
    record(errors) {

        this.errors = errors;

    }


    /**
     * Clear one or all error fields.
     *
     * @param {string|null} field
     */
    clear(field) {

        if (field) {
            delete this.errors[field];

            return;
        }

        this.errors = {};

    }

}


class Form {

    /**
     * Create a new Form instance.
     *
     * @param {object} data
     */
    constructor(data) {

        this.originalData = data;

        for (let field in data) {

            this[field] = data[field];

        }

        this.errors = new Errors();

    }


    /**
     * Fetch all relevant data for the form.
     */
    data() {

        let data = {};

        for (let property in this.originalData) {

            if ( this[property] === '' ) {

                data[property] = this.originalData[property];

            } else {

                data[property] = this[property];

            }

        }

        return data;

    }


    /**
     * Reset the form fields.
     */
    reset(excepted_field) {

        for (let field in this.originalData) {
            if (field != excepted_field) {
                this[field] = '';
            }
        }

        this.errors.clear();

    }

    /**
     * Send a GET request to the given URL.
     *
     * @param url
     * @returns {string} json data
     */
    get(url) {
        return this.submit('get', url);
    }


    /**
     * Send a POST request to the given URL.
     * .
     * @param {string} url
     */
    post(url) {
        return this.submit('post', url);
    }


    /**
     * Send a PUT request to the given URL.
     * .
     * @param {string} url
     */
    put(url) {
        return this.submit('put', url);
    }


    /**
     * Send a PATCH request to the given URL.
     * .
     * @param {string} url
     */
    patch(url) {
        return this.submit('patch', url);
    }


    /**
     * Send a DELETE request to the given URL.
     * .
     * @param {string} url
     */
    delete(url) {
        return this.submit('delete', url);
    }


    /**
     * Submit the form.
     *
     * @param {string} requestType
     * @param {string} url
     */
    submit(requestType, url) {                                                                                          console.log( requestType );
                                                                                                                        console.log( url );
        return new Promise((resolve, reject) => {

            let options = {
                method: requestType,
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CoinAPI-Key': 'A8FE8088-6CFB-4C58-9725-E90AFFE766BF'
                }
            };                                                                                                          console.log( options );

            if ( requestType !== 'get' ) {                                                                              console.log( true );

                options.body = JSON.stringify(this.data());

            }

            fetch( url, options)
                .then( response => response.json() )
                .then(data => {

                    this.onSuccess(
                        data
                        ,url
                    );                                                                                                  console.log( true );

                    resolve( data );

                })
                .catch(error => {                                                                             console.log( error );

                    reject( error );

                });

        });

    }


    /**
     * Handle a successful form submission.
     *
     * @param {object} data
     * @param url
     */
    onSuccess(data, url) {                                                                                              console.log( data );
                                                                                                                        console.log( url );

        //this.reset('_token');

        if ( url.indexOf('exchanges') !== -1 ) {                                                                        console.log( true );

            this.exchanges = data;

        }
        else if ( url.indexOf('assets') !== -1 ) {                                                                      console.log( true );

            this.assets = data;

        }

        return data;

    }


    /**
     * Handle a failed form submission.
     *
     * @param {object} errors
     */
    onFail(errors) {                                                                                                        console.log(errors);
        let is_errors_key = (errors.errors !== undefined);                                                              console.log(is_errors_key);
        if ( is_errors_key ) {
            this.errors.record(errors.errors);
        }

    }

}

export default Form;