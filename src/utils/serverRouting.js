let baseUrl = 'http://127.0.0.1:5000'

function changeBaseUrl(val) {
    console.log(val)
    baseUrl = val === 1 ? 'http://localhost:3100' : 'http://127.0.0.1:5000';
    console.log(baseUrl)
}

export { baseUrl, changeBaseUrl };