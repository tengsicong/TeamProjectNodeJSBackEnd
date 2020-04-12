const express = require('express');
const session = require('express-session');
const router = express.Router();
const mongoose = require('mongoose');
const clientModel = require('../models/client');
const signupModel = require('../models/signup');

router.post('/', function(req, res) {
    const role = req.query.role;
    //console.log(role);

    if(role === 'client') {
        const fullName = req.body.fullname;
        const email = req.body.email;
        const pw = req.body.password;
        const confirmedpw = req.body.confirmedpw;

        //console.log(fullName);
        //console.log(email);
        //console.log(pw);
        //console.log(confirmedpw);

        let postPromise = clientModel.getClientByUserName(email);
        postPromise.then(function(result) {
            const client = result;
            /*if (client !== null) {
                console.log(client);
            }*/

            if (client !== null) {
                console.log('This email address has been already registered');
                res.redirect('/signup?role=client');
            } else {
                if(pw === confirmedpw) {
                    let doc = {
                        UserName: email,
                        Password: pw,
                        Name: fullName,
                        AllProposalID: [],
                    }

                    let newClientPromise = signupModel.createClient(doc);
                    newClientPromise.then(function(clientEntity) {
                        console.log('Registration success ' + clientEntity);
                        req.session.userinfo = clientEntity._id;
                        req.session.username = email;
                        req.session.role = 'client';
                        req.session.save(function(err) {
                            res.redirect('/client/myproject');
                        });
                    });
                } else {
                    console.log('The passwords you input are not matched');
                    res.redirect('/signup?role=client');
                }
            }
        });
    } else {
        res.redirect('/role_select');
    }
});

router.get('/', function(req, res) {
    const role = req.query.role;
    //console.log(role);

    if(role === 'client') {
        res.render('portal/signup', {
            pageTitle: 'Team Project - Signup',
        });
    } else {
        res.redirect('/role_select');
    }
});

module.exports = router;