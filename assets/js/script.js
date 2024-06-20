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

// Calculate CO2 Intensity Data

let calculateInputElm = document.getElementById('calculate-input')
let calculateInputBtn = document.getElementById('calculate-button')
let calculateView = document.getElementById('calculate-div')

let calculateCheckElm = document.createElement('p')
calculateView.appendChild(calculateCheckElm)
calculateView.setAttribute('id', 'hidden')

calculateInputBtn.addEventListener('click', async (event) => {
    event.preventDefault()

    let inputtedURL = calculateInputElm.value;

    try {
    let calculateData = await fetchFunction(`https://api.thegreenwebfoundation.org/api/v3/ip-to-co2intensity/${inputtedURL}`)

    calculateCheckElm.innerHTML = `
    Carbon Intensity: ${calculateData.carbon_intensity} ${calculateData.carbon_intensity_type}. g/kWh<br>
    Fossil Fuels: ${calculateData.generation_from_fossil} percent<br>
    Checked IP/URL: ${calculateData.checked_ip}<br>
    Country: ${calculateData.country_name} (${calculateData.country_code_iso_2})<br>
    Year: ${calculateData.year} (Lastest data sample)<br><br>
    Data is provided by<br> <a href="https://www.thegreenwebfoundation.org/" target="_blank">The Green Web Foundation</a> and <a href="https://ember-climate.org/data/data-explorer/" target="_blank">Ember</a>
    `
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

// --------------------------------------------------


// Check whether Green host or not
let greenInputElm = document.getElementById('greencheck-input')
let greenInputBtn = document.getElementById('greencheck-button')
let greenCheckView = document.getElementById('greencheck-div')

let greenCheckElm = document.createElement('p')
greenCheckView.appendChild(greenCheckElm)
greenCheckView.setAttribute('id', 'hidden')

greenInputBtn.addEventListener('click', async (event) => {
    event.preventDefault()
    let inputtedURL = greenInputElm.value;

    let greenCheckData = await fetchFunction(`https://admin.thegreenwebfoundation.org/api/v3/greencheck/${inputtedURL}`)

    // console.log(greenCheckData);

    if (greenCheckData.green) {
        greenCheckElm.innerHTML = `Would you look at that, the provided URL (${greenCheckData.url}) is hosted Green.<br><img src="https://www.svgrepo.com/show/356736/checkmark.svg">`;
    } else {
        greenCheckElm.innerHTML = `We can't confirm that the provided URL (${greenCheckData.url}) is hosted Green.<br><img src="https://www.svgrepo.com/show/511674/close-1511.svg">`;
    }

    greenCheckView.appendChild(greenCheckElm)
    greenCheckView.setAttribute('id', 'greencheck-div')
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