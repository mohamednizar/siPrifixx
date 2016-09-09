( function ($) {

    var settings = {
        maxDigits: 3,
        seperator: true,
        decimal: 2,
        popUp: false,
        bold:false
    }


    function convert(value, options) {
        var opts = $.extend(settings, options || {});
        var maxDigits = opts.maxDigits;
        var number = getFormate(value,settings.decimal);

        var data_max = this.attr('data-max-digit');
        if (typeof data_max !== 'undefined') {
            maxDigits = data_max;
        }
        var checkNumber = typeof number !== 'undefined';
        if (checkNumber) {
            var n = opts.decimal;
            var decPlace = Math.pow(10, n);
            var abbrev = ["K", "M", "B", "T"];
            for (var i = abbrev.length - 1; i >= 0; i--) {
                var size = Math.pow(10, (i + 1) * 3);
                if (size <= number) {
                    number = Math.round(number * decPlace / size) / decPlace;
                    if ((number == 1000) && (i < abbrev.length - 1)) {
                        number = 1;
                        i++;
                    }
                    number += abbrev[i];
                    break;
                }
            }
            if (opts.popUp) {
                var tooltip = ' tooltip" data-toggle="tooltip" title="'+value+'"';
                this.data("tooltip",tooltip);
               
            }

            this.data("number", number); // set `number` at `.data("number")`
            return this; // return `this` for chaining jQuery methods
        } else {

            this.data("number", number); // set `number` at `.data("number")`
            return this; // return `this` for chaining jQuery methods
        }
    }
    $.fn.convert = convert;
    $.fn.siPrifixx = function (value, options) {

        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            maxDigits: 3,
            seperator: true,
            decimal: 1,
            popUp: false,
            convert:false
        }, options);
        var maxDigits = settings.maxDigits;
        /**
         * create a duplicate of value to use inside SI prifixx function
         * aattribute of number will change but value remain defult formate
         */

        var number = getFormate(value);
        var checkNumber = (typeof number !== 'undefined') && number.toString().length > maxDigits && settings.convert === true ;

        /**
         * setting tooltip popup
         * the tooltip only apeare on popUp:true
         */
        plugin = this;
        if (settings.popUp && checkNumber) {
            plugin.addClass('tooltip', value);
            var cvalue = numberWithCommas(value)
            var tootip = $(this).tooltipster({
                theme: 'tooltipster-default',
                content: function() {
                                return cvalue;
                            }, 
            })
            if (!tootip)
                console.log("We couldn't find tooltipster function.Please make sure you have loaded the plugin")
        }

        /**
         * setting maxDigits
         * the SI Prifixx only apeare on number length grater then maxDigits
         */

        if (checkNumber) {
            var div = $("div");
            div.convert(value, options);
            var results = div.data("number");
            $(this).html(results);

        } else {
            /**
             * setting seperator
             * the seperator for numbers only apeare on seperator:true
             */
            var isnum = regIsNumber(number);
            if (settings.seperator && isnum) {
                cvalue = numberWithCommas(number,settings.decimal)
                $(this).html(cvalue);
            } else {
                $(this).html(value);
            }

            /**
             * after this section,we can add setting which is not need si prifixx.
             */

            if (typeof  value === 'string')
                if (checkDate(value)) {
                    $(this).html(value)
                }
        }

    };

}(jQuery));

var getFormate = function (value) {
    if (typeof value === 'string') {
        var val = cleanUpHTML(value)
        var parts = val.split(",");
        var num = parts.join("");
        var isNumber = regIsNumber(num)
        if (isNumber) {
            var number = (parseFloat(num));
            if (regIsNumber(number))
                return num;
        }
    } else if (typeof value === 'number') {
        return  value
    }
}

//use to convert numbers with comma seperated

var numberWithCommas = function (value,decimal) {
    var number = value;
    if (isNaN(parseInt(number))) {
        return number
    }
    else if (typeof value === 'string') {
        var parts = value.split(",");
        number = (parseInt(parts.join("")));
        if (!isNaN(number)) {
            return number.toFixed(decimal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return number.toFixed(decimal);
        }
    } else if (typeof value === 'number') {
        return number.toFixed(decimal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

};
var cleanUpHTML = function (body) {
    var regex = /(<([^>]+)>)/ig
    if(typeof body === "string"){
        var result = body.replace(regex, "");
        return result
    }else{
        return body
    }
    }





var getNumber = function (str) {
    var num = str.replace(/^\D+|\D+$/g, "");
    console.log(num)
}

// check is number
var regIsNumber = function (fData) {
    var reg = new RegExp("^[-]?[0-9]+[\.]?[0-9]+$");
    return reg.test(fData)
}

var checkDate = function (str) {
    var dates = str.split("To");
    if (dates != [])
        for (var i = 0; i < dates.length; i++) {
            if (moment(dates[i]).isValid()) {
                return true;
            } else {
                return false;
            }
        }
}

