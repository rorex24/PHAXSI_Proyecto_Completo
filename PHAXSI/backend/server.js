const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Backend PHAXSI ejecutándose en el puerto ${PORT}`);
});
