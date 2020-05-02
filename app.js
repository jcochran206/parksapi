const STATES = {
    AL: "Alabama",
    AK: "Alaska",
    AR: "Arkansas",
    AZ: "Arizona",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DC: "District of Columbia",
    DE: "Delaware",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    IA: "Iowa",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    MA: "Massachusetts",
    MD: "Maryland",
    ME: "Maine",
    MI: "Michigan",
    MN: "Minnesota",
    MO: "Missouri",
    MS: "Mississippi",
    MT: "Montana",
    NC: "North Carolina",
    ND: "North Dakota",
    NE: "Nebraska",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NV: "Nevada",
    NY: "New York",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VA: "Virginia",
    VT: "Vermont",
    WA: "Washington",
    WI: "Wisconsin",
    WV: "West Virginia",
    WY: "Wyoming",
};

const base_url = 'https://developer.nps.gov/api/v1/parks';
let apikey = "Tc2i8N2GaL9dOUpMCtDOqgMt0P95vEZvdvYRGnVG";

function getParks(query, states, maxResults = 10){
$('#loading').toggleClass('hidden');


const params = {
    q: query,
    stateCode: states,
    limit: maxResults,
    api_key: apikey,
};

const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
);

const url = base_url + '?' + queryItems.join('&');

fetch(url)
.then((response) => {
    if(response.ok){
        return response.json();
    }
    throw new Error(response.statusText);
})
.then((responseJson) => {
    if(responseJson.data.length === 0) {
        throw new Error("No data was returned. please refine query")
    }
    displayResults(responseJson)
})

.catch((err) => {
    console.log(err.message);
    displayError("Please refine your query.");
});

}

function displayStates() {
    $('#statelist').html(stateDisplay());
}
// all stuff that displays on html 
function displayResults(res){
    // console.log(res)
    $('#results').html(resultsFromApi(res));
    $('#loading').toggleClass('hidden');
}

function displayError(errMsg) {
    $("#results").html(errorMsgTmpl(errMsg));
    $("#loading").toggleClass("hidden");
  }
  
//displays states
function stateDisplay() {
    let states = Object.keys(STATES).map((key) => {
        let id = STATES[key].replace(/\s/, "");
        return ` 
        <div class="state-item"> 
            <input type="checkbox" id="${id}" name="${id}" value="${key}">
            <label for='${id}'> ${STATES[key]} </label>
        </div>
        `;
    });

    return `
    <fieldset>
    <legend> Pick a state </legend>
        ${states.join("")}
    </fieldset>
    `;
} 

function resultsFromApi(res){
    console.log(res)
    let results = res.data.map((item) => {
        let address = item.addresses.find((obj) => obj.type === "Physical");
        return `
        <li class="results__list-item">
        <h1>${item.fullName}</h1>
        <p>${item.description}</p>
        <address>
          ${address.line1}<br/>
          ${address.city}, ${address.stateCode} ${address.postalCode}<br/><br/>
        </address>
        <a href="${item.url}" target="_blank">${item.url}</a>
      </li>
        `;
    });

    return `
    <ul class="results-list">
        ${results.join("")}
    </ul>
    `;
}

//error msg
function errorMsgTmpl(msg) {
    return `
      <div class="error-message">
        <h2>Something went wrong</h2>
        <p>${msg}</p>
      </div>
      `;
  }

function watchForm() {
    $('.np-form').submit(function(e){
        e.preventDefault();
        const searchTerm = $('#js-searchterm').val();
        const maxResults = $('#maxresults').val();
        const checkeditem = $('#statelist').find("input[type='checkbox']:checked");

        let states = checkeditem.map(function() {
            return this.value;
        })
        .get()
        .join()
        .toLowerCase();

        if(checkeditem.length < 1) {
            alert('choose at least one state');
            return false;
        }

        getParks(searchTerm, states, maxResults);
    });
};



function main(){
    watchForm();
    displayStates();
}

$(main);
