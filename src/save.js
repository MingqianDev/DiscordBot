const fs = require('fs');

function save(userMap) {
    const dataToSave = JSON.stringify([...userMap]);
    fs.writeFileSync('./config/config.json', dataToSave);
}

module.exports = save;