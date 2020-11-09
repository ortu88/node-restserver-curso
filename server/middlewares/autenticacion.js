//Verificar token

const jwt = require('jsonwebtoken');

const verificaToken = (req, res, next) => {
    const token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: err
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};

//Verifica admin role
const verificaAdminRole = (req, res, next) => {
    const {role} = req.usuario;
    if(role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No autorizado'
            }
        });
    }
    next();

};

const verificaTokenUrl = (req, res, next) => {
    const token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: err
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenUrl
}