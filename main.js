function getData(url, cb) { // cb = callback function. url replaces 'type'
    var xhr = new XMLHttpRequest();

    xhr.open("GET", url); // type = films, people, species, etc & comes from the API. url updated/added.
    xhr.send();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText)); // when function runs, 'this.responseText' is the data argument
        }                                      // when script reaches this point, then it will run the function
    };                                         // that we parsed into 'getData'
}

function getTableHeaders(obj) { // take a single object
    var tableHeaders = []; // initialise a new, empty [] array 
    
    Object.keys(obj).forEach(function(key) {
        tableHeaders.push(`<td>${key}</td>`); // `back-quote` used to help interpolate strings like this
    });                                       // Object is then pushed into a table header array            
    return `<tr>${tableHeaders}</tr>`;        // Each Object is then moved to a table cell <td> and then add each cell to a row <tr> 
}

function generatePaginationButtons(next, prev) {
    if (next && prev) { // if there is a value, a URL, for both next and previous, then I'm going to return a template literal that creates a next and a previous button.
        return `<button onclick="writeToDocument('${prev}')">Previous</button> 
                <button onclick="writeToDocument('${next}')">Next</button>`; // if the next and the previous values exist, then we want to return both next and previous buttons.
    } else if (next && !prev) { // If next appears, but no previous button, then click onto 'next' button 
        return `<button onclick="writeToDocument('${next}')">Next</button>`;
    } else if (!next && prev) { // if there is no next button, then user at end and should click on 'previous' button
        return `<button onclick="writeToDocument('${prev}')">Previous</button>`;
    }
}

function writeToDocument(url) { // Change 'type' to url
    var tableRows = [];                       // New variable created for row data 
    var el = document.getElementById("data"); // New variable 'el' (element) created. Data will be stored in this variable
    el.innerHTML = "";                        // innerHTML is then set to an empty string. Every time button clicked, content will clear  
    getData(url, function(data) {             // to save upon cumulative flow of data, every time <button. is clicked. 
        var pagination;
        if (data.next || data.previous) {
            pagination = generatePaginationButtons(data.next, data.previous);
        }
        
        data = data.results;
        var tableHeaders = getTableHeaders(data[0]); // 1st object in the array to be passed. Index [0] = 1st, etc
        
        data.forEach(function(item) { // A 'forEach' loop created to focus on each item, as per API items
            var dataRow = [];        // New, empty array created for row data
                
            Object.keys(item).forEach(function(key) {
                var rowData = item[key].toString(); // rowData set to the value of the 'key' or Name, for example
                var truncatedData = rowData.substring(0, 15); // Sets a boundary for text length > no greater than 15 characters
                dataRow.push(`<td>${truncatedData}</td>`); // truncated 'key' data items to be pushed into every row - much better UXD!!
            });
            tableRows.push(`<tr>${dataRow}</tr>`); // once row has been created (line 37), that dataRow will then be pushed into the tableRows array 
});                                                // Addition of 'dataRow' shows all available rows, per Object.         
        
        el.innerHTML = `<table>${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g, ""); // Enables creation of a table row that shows all keys relating to a selected Object (e.g.'Film')
    });                                                                                         // .replace () method contains 2 arguments (Find & replace)
        
}
