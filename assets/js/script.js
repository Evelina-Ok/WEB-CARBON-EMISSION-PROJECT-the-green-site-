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

console.log(greenCheckData);

let greenCheckElm = document.createElement('p')

if (greenCheckData.green) {
    greenCheckElm.innerHTML = `Would you look at that, the provided URL (${greenCheckData.url}) is hosted Green.<br><img src="https://www.svgrepo.com/show/356736/checkmark.svg">`;
} else {
    greenCheckElm.innerHTML = `We can't confirm that the provided URL (${greenCheckData.url}) is hosted Green.<br><img src="https://www.svgrepo.com/show/511674/close-1511.svg"> `;
}

document.body.appendChild(greenCheckElm)