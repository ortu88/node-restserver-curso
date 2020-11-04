// Puerto

process.env.PORT = process.env.PORT || 3000;

// entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//DB

process.env.URLDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URL;

// vencimiento token

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30 * 1000;

//SEED

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//Client ID Google
process.env.CLIENT_ID = process.env.CLIENT_ID || '732124700485-o2pjo4vrbpjpmteva600d9bbv16p298d.apps.googleusercontent.com';