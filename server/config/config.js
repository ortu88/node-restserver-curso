// Puerto

process.env.PORT = process.env.PORT || 3000;

// entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//DB

process.env.URLDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URL;

// vancimiento token

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//SEED

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

