// Puerto

process.env.PORT = process.env.PORT || 3000;

// entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//DB

process.env.URLDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : 'mongodb+srv://matias:EiZtn273QOOMKIYt@cluster0.hzgbi.mongodb.net/cafe';