async function main() {
    const url = 'https://api.thecatapi.com/v1/images/search'
    try{
        const response = await fetch(url);
        const data = await response.json();
        return data[0].url;
    } catch(error) {
        console.error(error);
    };

}

exports.main = main;