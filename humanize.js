( function ($) {

    $.fn.siPrifixx = function (value, options) {

        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            maxDigits: 8,
            seperator: true,
            decimal: 1,
            popUp: false,
        }, options);
        var maxDigits = settings.maxDigits;

        /**
         * create a duplicate of value to use inside SI prifixx function
         * aattribute of number will change but value remain defult formate
         */

        if (typeof value === 'string') {
            var parts = value.split(",");
            var num = parts.join("");
            var isNumber = regIsNumber(num)
            if(isNumber){
               var  number = (parseInt(num));
            }else{

                number = num;
            }
        }else if (typeof value === 'number'){
                number = value
        }

        var data_max = this.attr('data-max-digit');
        if(typeof data_max !== 'undefined'){
            maxDigits = data_max;
        }

        var checkNumber = typeof number !== 'undefined' && !isNaN(number) && (number).toString().length > maxDigits;

        /**
         * setting tooltip popup
         * the tooltip only apeare on popUp:true
         */
        if (settings.popUp && checkNumber) {
            $(this).addClass('tooltip', value);
            var tootip = $(this).tooltipster({
                theme: 'tooltipster-default',
                functionInit: function () {
                    return value
                }
            })
            if(!tootip)
                console.log("We couldn't find tooltipster function.Please make sure you have loaded the plugin")
        }

        /**
         * setting maxDigits
         * the SI Prifixx only apeare on number length grater then maxDigits
         */


        if (checkNumber) {
            // if the number is alreadey comma seperated convert to number
            var n = settings.decimal
            // 2 decimal places => 100, 3 => 1000, etc
            var decPlace = Math.pow(10, n);

            // Enumerate number abbreviations
            var abbrev = ["K", "M", "B", "T"];
            // Go through the array backwards, so we do the largest first
            for (var i = abbrev.length - 1; i >= 0; i--) {

                // Convert array index to "1000", "1000000", etc
                var size = Math.pow(10, (i + 1) * 3);

                // If the number is bigger or equal do the abbreviation
                if (size <= number) {
                    /**
                     * Here, we multiply by decPlaces, round, and then divide by decPlaces.
                     * This gives us nice rounding to a particular decimal place.
                     */
                    number = Math.round(number * decPlace / size) / decPlace;

                    // Handle special case where we round up to the next abbreviation
                    if ((number == 1000) && (i < abbrev.length - 1)) {
                        number = 1;
                        i++;
                    }

                    // Add the letter for the abbreviation
                    number += abbrev[i];

                    // We are done... stop

                    break;
                }

            }

            $(this).html(number)

        } else {
            /**
             * setting seperator
             * the seperator for numbers only apeare on seperator:true
             */

            if (settings.seperator) {
                var cvalue = numberWithCommas(value)
                $(this).html(cvalue)
            } else {
                $(this).html(value)
            }

            /**
             * after this section,we can add setting which is not need si prifixx.
             */

            if(typeof  value === 'string')
                if(checkDate(value)){
                    $(this).html(value)
                }
        }

    };

}(jQuery));

//use to convert numbers with comma seperated

var numberWithCommas = function (value) {
    var number = value;
    if (isNaN(parseInt(number))) {
        return number
    }
    else if (typeof value === 'string') {
        var parts = value.split(",");
        number = (parseInt(parts.join("")));
        if (!isNaN(number)) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return number
        }
    } else if (typeof value === 'number') {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

};

// check is number
var regIsNumber = function (fData)
{
    var reg = new RegExp("^[-]?[0-9]+[\.]?[0-9]+$");
    return reg.test(fData)
}

var checkDate = function (str){
        var dates = str.split("To");
        if(dates!=[])
            for(var i = 0; i < dates.length; i++) {
                if (moment(dates[i]).isValid()) {
                    return true;
                } else {
                    return false;
                }
            }
}

