const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use( express.static('./public/front') );
app.use( bodyParser.json() );

//---
app.listen(3000, () => {
    console.log(`Serwer uruchomiony na porcie 3000`);
});

