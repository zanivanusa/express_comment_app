var express = require('express');
var router = express.Router();
var vprasanjeController = require('../controllers/vprasanjeController.js');
var odgovorController = require('../controllers/odgovorController.js');

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

/*
 * GET
 */
router.get('/', vprasanjeController.list);
router.get('/objava', requiresLogin, vprasanjeController.objaviVprasanje);
router.get("/vsaVprasanja", requiresLogin, vprasanjeController.mojaVprasanja);
router.get('/:id', vprasanjeController.show);

/*
 * POST
 */
router.post('/', vprasanjeController.create);
router.post('/:Vprasanjeid/izbran/:Odgovorid', requiresLogin, vprasanjeController.refresh);
router.post('/:id', requiresLogin, vprasanjeController.objaviOdgovor);
router.post('/odstrani/:id', requiresLogin, vprasanjeController.remove);
router.post('/delete/:id', requiresLogin, odgovorController.remove);

/*
 * PUT
 */
router.put('/:id', vprasanjeController.update);

/*
 * DELETE
 */
router.delete('/:id', vprasanjeController.remove);

module.exports = router;
