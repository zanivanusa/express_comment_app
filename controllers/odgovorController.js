var odgovorModel = require('../models/odgovorModel.js');

 /**
     * vprasanjeController.js
     *
     * @description :: Server-side logic for managing vprasanjes.
     */
 module.exports = {

    /**
     * vprasanjeController.list()
     */

    //mogoce tega tudi ne rabim ker bom lahko direkt pod podrobno objavil vprasanje
    objaviDdgovor: function (req, res) {
        console.log("ok");
        return res.render('vprasanja/{{this._id}}/podrobno');
    },

    //to spremenim oz nerabim za specificen odgovor mogoce za vse odgovore
    mojaVprasanja: function(req, res) {
        odgovorModel.find({ askedBy: req.session.userId }, function(err, vprasanja) {
          if (err) {
            return res.status(500).json({
              message: 'Error when getting vprasanja.',
              error: err
            });
          }
          return res.render('vprasanja/mojaVprasanja', { vprasanja: vprasanja });
        });
      },
          

      list: function (req, res) {
        //let myVariable = false;
        console.log("liosting");

        VprasanjeModel.find()
          .populate('askedBy')
          .exec(function(err, vprasanja) {
            if (err) {
              return res.status(500).json({
                message: 'Error when getting vprasanje.',
                error: err
              });
            }
      
            userModel.findById(req.session.userId, function(err, currentUser) {
              if (err) {
                return res.status(500).json({
                  message: 'Error when getting current user.',
                  error: err
                });
              }
              vprasanja.forEach(function(vprasanje) { 
                if (vprasanje.askedBy._id.equals(currentUser._id)) {
                    vprasanje.enakPosted = true;
                } else {
                    vprasanje.enakPosted = false;
                }
            });
           // console.log(myVariable);

                return res.render('vprasanja/list', { vprasanja: vprasanja});

            });
          });
      },
    
    /**
     * vprasanjeController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        odgovorModel.findById(id)
        .populate('askedBy')
        .exec(function (err, vprasanje) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting vprasanje.',
                    error: err
                });
            }

            if (!vprasanje) {
                return res.status(404).json({
                    message: 'No such vprasanje'
                });
            }
            //console.log(vprasanje.vsebina);
            return res.render('vprasanja/uredi', {vprasanje: vprasanje});
        });
    },

    /**
     * vprasanjeController.create()
     */
    create: function (req, res) {
        var odgovor = new VprasanjeModel({
            text : req.body.text,        
            askedBy: req.session.userId,
            //datum verjetno nerabimo saj se vedno nastavi na default
        });

        odgovor.save(function (err, odgovor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating vprasanje',
                    error: err
                });
            }          
            //return res.status(201).json(vprasanje);
            return res.redirect('/vprasanja');

        });
    },


    /**
     * vprasanjeController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        odgovorModel.findByIdAndRemove(id, function (err, odgovor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the vprasanje.',
                    error: err
                });
            }

            
            return res.redirect('/vprasanja/vsaVprasanja');

        });
    }
};
