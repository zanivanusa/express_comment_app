var VprasanjeModel = require('../models/vprasanjeModel.js');
var OdgovorModel = require('../models/odgovorModel.js');
var userModel = require('../models/userModel.js');

/**
 * vprasanjeController.js
 *
 * @description :: Server-side logic for managing vprasanjes.
 */
module.exports = {

  /**
   * vprasanjeController.list()
   */

  //rendera naš view vprasanja.hbs
  objaviVprasanje: function (req, res) {
    return res.render('vprasanja/objaviVprasanje');
  },

  //doda vprasanju objavljen odgovor
  objaviOdgovor: async function (req, res) {
    var id = req.params.id;
    var vprasanje = await VprasanjeModel.findById(id);


    console.log("okej odgovor");
    var odgovor = new OdgovorModel({
      text: req.body.text,
      postedOn: vprasanje._id,
      askedBy: req.session.userId
      //spet nerabim datuma ker sem ga ustvaril na default
    });
    try {
      var savedOdgovor = await odgovor.save();
      vprasanje.odgovori.push(savedOdgovor._id);
      await vprasanje.save();
      return res.redirect('/vprasanja/' + id);
    } catch (err) {
      console.log(err);
      return res.redirect('/error');
    }
  },


  mojaVprasanja: function (req, res) {
    VprasanjeModel.find({ askedBy: req.session.userId })
      .populate('askedBy', 'username')
      .exec(function (err, vprasanja) {
        if (err) {
          return res.status(500).json({
            message: 'Error when getting vprasanja.',
            error: err
          });
        }
        vprasanja.forEach(function (vprasanje) {
          if (vprasanje.askedBy._id.equals(req.session.userId)) {
            vprasanje.enakPosted = true;
          } else {
            vprasanje.enakPosted = false;
          }
        });
        return res.render('vprasanja/mojaVprasanja', { vprasanja: vprasanja });
      });
  },



  list: function (req, res) {
    //let myVariable = false;
    console.log("liosting");

    VprasanjeModel.find()
      .populate('askedBy')
      .exec(function (err, vprasanja) {
        if (err) {
          return res.status(500).json({
            message: 'Error when getting vprasanje.',
            error: err
          });
        }
        userModel.findById(req.session.userId, function (err, currentUser) {
          if (err) {
            return res.status(500).json({
              message: 'Error when getting current user.',
              error: err
            });
          }
          if (currentUser != null) {
            // execute code for logged-in user            
            vprasanja.forEach(function (vprasanje) {
              if (vprasanje.askedBy._id.equals(currentUser._id)) {
                vprasanje.enakPosted = true;
              } else {
                vprasanje.enakPosted = false;
              }
            });
          } 
          else 
          {
            // execute code for non-logged-in user
            vprasanja.forEach(function (vprasanje) {

            vprasanje.enakPosted = false;
            });

          }

          // console.log(myVariable);

          return res.render('vprasanja/list', { vprasanja: vprasanja });

        });
      });
  },


  //ko izbere odgovor
  refresh: function (req, res) {
    var Vprasanjeid = req.params.Vprasanjeid;
    var Odgovorid = req.params.Odgovorid;
    
    
    OdgovorModel.findById(Odgovorid, function (err, odgovor) {
      if (err) {
        return res.status(500).json({
          message: 'Error selecting the selected answer.',
          error: err
        });
      }



      odgovor.najOdgovor = true;

      console.log("yupi");
      console.log(odgovor.najOdgovor);
    
      // Save the updated answer with najOdgovor set to true
      odgovor.save(function(err) {
        if (err) {
          return res.status(500).json({
            message: 'Error saving the selected answer.',
            error: err
          });
        }

        // Sort the answers array based on najOdgovor property
        //vprasanje.odgovori.sort((a, b) => b.najOdgovor - a.najOdgovor);

        //mogoce rabil render ker povprasam po bazi
        return res.redirect('/vprasanja/' + Vprasanjeid);
      });
    });
    
  },


  /**
   * vprasanjeController.show()
   */
  show: function (req, res) {
    var id = req.params.id;
    VprasanjeModel.findById(id)//dobimo vprasanje
      .populate('askedBy')
      .populate({
        path: 'odgovori',
        populate: { path: 'askedBy' }
      })
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

        vprasanje.odgovori.forEach(function (odgovor) {
          // preverimo ce je uporabnik objavil vprasanje ali odgvoror, potem lahko izbrise
          if (vprasanje.askedBy.equals(req.session.userId) || odgovor.askedBy.equals(req.session.userId)) {
            odgovor.lahkoZbriseOdgovor = true;
          } else {
            odgovor.lahkoZbriseOdgovor = false;
          }
          
          // Check if the logged in user is the owner of the answer
          if (vprasanje.askedBy.equals(req.session.userId)) {
            odgovor.AvtorLahkoIzbere = true;
          }
        });
        
        //console.log(vprasanje.vsebina);
        return res.render('vprasanja/uredi', { vprasanje: vprasanje });
      });
  },

  /**
   * vprasanjeController.create()
   */
  create: function (req, res) {
    var vprasanje = new VprasanjeModel({
      naslov: req.body.naslov,
      vsebina: req.body.vsebina,
      oznake: req.body.oznake,
      askedBy: req.session.userId,
      //datum verjetno nerabimo saj se vedno nastavi na default
    });

    vprasanje.save(function (err, vprasanje) {
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
   * vprasanjeController.update()
   */
  update: function (req, res) {
    var id = req.params.id;

    VprasanjeModel.findOne({ _id: id }, function (err, vprasanje) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting vprasanje',
          error: err
        });
      }

      if (!vprasanje) {
        return res.status(404).json({
          message: 'No such vprasanje'
        });
      }

      vprasanje.naslov = req.body.naslov ? req.body.naslov : vprasanje.naslov;
      vprasanje.vsebina = req.body.vsebina ? req.body.vsebina : vprasanje.vsebina;
      vprasanje.oznake = req.body.oznake ? req.body.oznake : vprasanje.oznake;
      vprasanje.datum = req.body.datum ? req.body.datum : vprasanje.datum;

      vprasanje.save(function (err, vprasanje) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating vprasanje.',
            error: err
          });
        }

        return res.json(vprasanje);
      });
    });
  },

  /**
   * vprasanjeController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;
    console.log("prosim");
    VprasanjeModel.findByIdAndRemove(id, function (err, vprasanje) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the vprasanje.',
          error: err
        });
      }
      if (!vprasanje) {
        return res.status(404).json({
          message: 'Vprasanje not found'
        });
      }
      if (vprasanje.askedBy != req.session.userId) {
        return res.status(403).json({
          message: 'You are not authorized to delete this vprasanje'
        });
      }
      return res.redirect('/vprasanja');
    });
  }


};
