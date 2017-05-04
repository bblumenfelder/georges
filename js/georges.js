/**
 * RETURN FUZZY MATCHES
 */
function findFuzzy (QueryString, DictionaryData) {
    var Entry = $(DictionaryData).find("h1:contains('" + QueryString + "')");
    return Entry;
}


/**
 * RETURN ONLY STRICT MATCHES AND SANITIZE RESULTS
 */
function findStrictSense (QueryString, DictionaryData) {
    var Entry = findFuzzy(QueryString, DictionaryData);
    var EntryStrict = Entry.filter(function () {
        return $(this).text() === QueryString;
    });

    var SensesArray = [];
    var SensesArrayRaw = EntryStrict.nextUntil('h1', 'b');
    SensesArrayRaw.each(
        function () {
            var SenseString = $(this).text();
            var SenseSubstringArray = SenseString.split(',');
            var i;
            for (i = 0; i < SenseSubstringArray.length; i++) {
                SenseSubstringArray[i] = $.trim(SenseSubstringArray[i]);
                SensesArray.push(SenseSubstringArray[i]);

            }
        }
    );
    SensesArray = SensesArray.filter(v => v !== ' ' && v !== '');
    return SensesArray;
}


/**
 * RETURN WHOLE ENTRY OF VOCAB AND SANITIZE RESULTS
 */
function findEntry (QueryString, DictionaryData) {
    var Titles = $(DictionaryData).find("h1:contains('" + QueryString + "')");

    var Results = [];
    Titles.each(
        function (i) {
            var Title = $(this);
            var Entry = Title.next('p');
            Results.push(Title, Entry);
        }
    );
    return Results;
}



/**
 * QUERY HTML VIA AJAX AND RETURN JSON
 */
function getSensesAsJSON (QueryString) {
    $.ajax({
        // UrI to dictionary html-file
        url: 'html/georges.html',
        method: 'get',
        data: {},
        success: function (DictionaryData) {

            var Results = findStrictSense(QueryString, DictionaryData);
            var ResultsJson = JSON.stringify(Results);

            console.log(ResultsJson);
            return ResultsJson;
        },

    });
}

/**
 * QUERY HTML VIA AJAX AND RETURN HTML
 */
function getEntryAsHTML (QueryString) {
    $.ajax({
        // UrI to dictionary html-file
        url: 'html/georges.html',
        method: 'get',
        data: {},
        success: function (DictionaryData) {

            var Results = findEntry(QueryString, DictionaryData);
            $('#georges_result_container').append(Results);

            //console.log(Results);
            return Results;
        },
    });
}



/**
 * EVENT HANDLER Wortbedeutungen
 */
$(document).on('click', '#btn_georges_query_senses', function () {
    var QueryString = $('#ipt_georges_query').val();

    getSensesAsJSON(QueryString);

});

/**
 * EVENT HANDLER Wortbedeutungen
 */
$(document).on('click', '#btn_georges_query_entry', function () {
    var QueryString = $('#ipt_georges_query').val();

    getEntryAsHTML(QueryString);

});


/**
 * Entwurf: Zeno-Seite abfragen
 * :TODO: Wie lässt sich die Seite mit als JSON auslesen?
 */
/*function ajaxZeno (FirstLetter, QueryString) {
 $.ajax({
 url: 'http://www.zeno.org/Georges-1913/' + FirstLetter + '/' + QueryString + '?hl=' + QueryString,
 method: 'get',
 data: {},
 success: function (data) {
 $('#georges_result_container').html(data);
 console.log('API erfolgreich');
 }
 });
 }*/
