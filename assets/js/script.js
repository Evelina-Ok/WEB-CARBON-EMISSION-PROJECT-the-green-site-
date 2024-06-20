// Async Fetch Function - Try fetch, if Response OK, get Data. Catch error, show error in console
const fetchFunction = async (url, options = null) => {
    try {
        let res = await fetch (url, options);
        if (!res.ok) {
            if (res.status === 500) {
                throw new Error(`HTTP error 500: Internal Server Error`);
            }

            throw new Error(`HTTP error! status: ${res.status}`);
        }

        let json = await res.json();
        return json;

    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

const options = {
    // Nothing here
}

// -------------------- Calculate CO2 Intensity Data --------------------

let calculateInputElm = document.getElementById('calculate-input')
let calculateInputBtn = document.getElementById('calculate-button')
let calculateView = document.getElementById('calculate-div')

let calculateCheckElm = document.createElement('p')
calculateView.appendChild(calculateCheckElm)
calculateView.setAttribute('id', 'hidden')

// Calculate button event listener - Takes value from input field and uses it in fetch ${inputtedURL}
// Builds view, otherwise shows an error
calculateInputBtn.addEventListener('click', async (event) => {
    event.preventDefault() // Prevents default action of form/button

    let inputtedURL = calculateInputElm.value;

    try {
    let calculateData = await fetchFunction(`https://api.thegreenwebfoundation.org/api/v3/ip-to-co2intensity/${inputtedURL}`)

    // InnerHTML for #calculate-div
    calculateCheckElm.innerHTML = `
    Carbon Intensity: ${calculateData.carbon_intensity} ${calculateData.carbon_intensity_type}. g/kWh<br>
    Fossil Fuels: ${calculateData.generation_from_fossil} percent<br>
    Checked IP/URL: ${calculateData.checked_ip}<br>
    Country: ${calculateData.country_name} (${calculateData.country_code_iso_2})<br>
    Year: ${calculateData.year} (Lastest data sample)<br><br>
    Data is provided by<br> <a href="https://www.thegreenwebfoundation.org/" target="_blank">The Green Web Foundation</a> and <a href="https://ember-climate.org/data/data-explorer/" target="_blank">Ember</a>
    ` // End of InnerHTML
    }
     catch (error) {
        if (error.message.includes('500')) {
            calculateCheckElm.innerHTML = `An error occurred:<br> ${error.message}`;
        } else {
            calculateCheckElm.innerHTML = `An unexpected error occured:<br> ${error.message}`
        }
    }

    calculateView.appendChild(calculateCheckElm)
    calculateView.setAttribute('id', 'calculate-div')
})


// -------------------- Green checker code --------------------

// Check whether Green host or not
let greenInputElm = document.getElementById('greencheck-input')
let greenInputBtn = document.getElementById('greencheck-button')
let greenCheckView = document.getElementById('greencheck-div')

let greenCheckElm = document.createElement('p')
greenCheckView.appendChild(greenCheckElm)
greenCheckView.setAttribute('id', 'hidden')

// Green check button event listener - Takes value from input field and uses it in fetch ${inputtedURL}
// Builds view, otherwise shows an error
greenInputBtn.addEventListener('click', async (event) => {
    event.preventDefault() // Prevents default action of form/button

    let inputtedURL = greenInputElm.value;

    greenCheckView.innerHTML = ''; // Clears view before build
    greenCheckView.appendChild(greenCheckElm);

    try {
        let greenCheckData = await fetchFunction(`https://admin.thegreenwebfoundation.org/api/v3/greencheck/${inputtedURL}`)

        // console.log(greenCheckData);

        // if green = true, build view
        if (greenCheckData.green) {
            // InnerHTML for #greencheck-div
            greenCheckElm.innerHTML = `
            Would you look at that, the provided URL (${greenCheckData.url}) is hosted Green.<br>
            <img src="https://www.svgrepo.com/show/356736/checkmark.svg"><br><br>
            The site is hosted by:<br> <a href="${greenCheckData.hosted_by_website}" target="_blank">${greenCheckData.hosted_by}</a><br><br>See supporting documents below:
            ` // End of InnerHTML

            // if green = true, data = true - Therefore documents are available
            // forEach loop for document build for docElm
            if (Array.isArray(greenCheckData.supporting_documents)) {
                greenCheckData.supporting_documents.forEach(supporting_documents => {
                    let docElm = document.createElement('div')
                    // docElm innerHTML
                    docElm.innerHTML = `
                    <a href="${supporting_documents.link}" target="_blank">${supporting_documents.title}</a>
                    ` // End of docElm innerHTML

                    greenCheckView.appendChild(docElm);
                })
            }
            // if green = false, build view
        } else {
            // false view innerHTML
            greenCheckElm.innerHTML = `
            We can't confirm that the provided URL (${greenCheckData.url}) is hosted Green.<br><img src="https://www.svgrepo.com/show/511674/close-1511.svg">
            ` // End of false view innerHTML
        }

        // greenCheckView.appendChild(greenCheckElm)
        greenCheckView.setAttribute('id', 'greencheck-div')
        
    } catch (error) {
        greenCheckElm.innerHTML = `An error occured: ${error.message}`
        greenCheckElm.setAttribute('id', 'greencheck-div')
    }
})

// Green
// ${greenCheckData.green} - Green: True
// ${greenCheckData.url} - Provided URL
// ${greenCheckData.hosted_by} - Example: team.blue Denmark A/S
// ${greenCheckData.hosted_by_website} - URL to team.blue
// ${greenCheckData.supporting_documents} - Array of documents supporting that team.blue is a green host

// Not Green
// ${greenCheckData.green} - Green: False
// ${greenCheckData.url} - Provided URL
// ${greenCheckData.data} - Data: False