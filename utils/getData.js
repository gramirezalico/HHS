const getData= async function (url) {
	try {
		console.log('URL:', url);
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': 'vMGRf6ryrOBOttpzlyBi60qviKImvIMW6Dnsb5GeJewpn',
				'Authorization': 'Basic ZXh0ZXJuYWxfYXBpOjEwMjRtYi0xVA==',
				'accept': 'application/json',
				'Sec-Fetch-Site': 'same-origin',
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Dest': 'empty'
			}
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response}`);
		}
		const result = await response.json(); // Asume que la respuesta es JSON
		return result;
	} catch (error) {
		console.error('Error posting data:', error);
	}
}
module.exports = {getData}