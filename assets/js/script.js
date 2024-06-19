const fetchFunction = async (url, options = null) => {
    try {
        let res = await fetch (url, options);
        if (!res.ok) {
            throw new Error('HTTP error! status: ${res.status}');
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

// Check whether Green host or not

let greenCheckData = await fetchFunction('https://admin.thegreenwebfoundation.org/api/v3/greencheck/simply.com')

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

// console.log(greenCheckData);

let greenCheckElm = document.createElement('p')

if (greenCheckData.green) {
    greenCheckElm.innerHTML = `Would you look at that, the provided URL (${greenCheckData.url}) is hosted Green.<br><img src="https://www.svgrepo.com/show/356736/checkmark.svg">`;
} else {
    greenCheckElm.innerHTML = `We can't confirm that the provided URL (${greenCheckData.url}) is hosted Green.<br><img src="https://www.svgrepo.com/show/511674/close-1511.svg"> `;
}

// document.body.appendChild(greenCheckElm)

// --------------------------------------------------

// Calculate CO2 Intensity Data

let calculateData = await fetchFunction('https://api.thegreenwebfoundation.org/api/v3/ip-to-co2intensity/simply.com')

// console.log(calculateData);

let calculateElm = document.createElement('p')

calculateElm.innerHTML = `
Carbon Intensity: ${calculateData.carbon_intensity} ${calculateData.carbon_intensity_type}. grams per kilowatt-hour (g/kWh)<br>
Generation From Fossil: ${calculateData.generation_from_fossil} percent generated from fossil fuels<br>
Checked IP/URL: ${calculateData.checked_ip}<br>
Country: ${calculateData.country_name} (${calculateData.country_code_iso_2})<br>
Year: ${calculateData.year} (Lastest data sample)<br>
Data is provided by <a href="https://www.thegreenwebfoundation.org/" target="_blank">The Green Web Foundation</a> and <a href="https://ember-climate.org/data/data-explorer/" target="_blank">Ember</a>
`

document.body.appendChild(calculateElm)
