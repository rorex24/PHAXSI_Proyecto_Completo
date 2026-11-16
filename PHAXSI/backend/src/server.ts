import dotenv from 'dotenv';
import app from './app';
dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Backend PHAXSI ejecutándose en el puerto ${PORT}`);
});
