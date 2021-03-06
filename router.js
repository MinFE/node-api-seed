const router = require('express').Router()
const { validate } = require('./midware')
const {
    baseCtrl,
} = require('./ctrl')


// base
register('post', '/login', baseCtrl, 'login')
register('get', '/verify', baseCtrl, 'verify')
register('post', '/register', baseCtrl, 'register')


// check health
const monitor = (req, res) => res.success(undefined, 'sevice works well')
router.get('/', monitor)
router.get('/monitor', monitor)


/**
 * register ctrl and validate(if any) midware funcs to routes
 * @param {string} method    http method
 * @param {string} path      route path
 * @param {object} ctrl      ctrl namespace
 * @param {string} func      ctrl func name
 */
function register(method, path, ctrl, func) {
    const fields = validate[func]
    if (fields) {
        const validFunc = (req, res, next) => {
            validate.validateParams(req, next, fields)
        }
        return router[method](path, validFunc, co(ctrl[func]))
    }
    return router[method](path, co(ctrl[func]))
}

/**
 * wrap all ctrl funcs to handle errors
 */
function co(asyncFunc) {
    return async (req, res, next) => {
        try {
            await asyncFunc(req, res, next)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = router
