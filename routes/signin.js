const config = require('config-lite')(__dirname);
const express = require('express');
const session = require('express-session');
const router = express.Router();
const mongoose = require('mongoose');
const clientModel = require('../models/client');
const studentModel = require('../models/student');
const staffModel = require('../models/staff');
const adminModel = require('../models/admin');

router.post('/', function(req, res) {
    const role = req.query.role;
    console.log('post' + role);
    const email = req.body.email;
    const pw = req.body.password;
    console.log('u : ' + email);
    console.log('p : ' + pw);
    let method;
    if (role == 'student') {
        method = studentModel.getStudentByUserName(email)
    } else if (role == 'staff') {
        method = staffModel.getStaffByUserName(email)
    } else if (role == 'admin') {
        method = adminModel.getAdminByUserName(email)
    } else if (role == 'client') {
        method = clientModel.getClientByUserName(email)
    } else (console.log('role error'))
    //console.log('Login(username pw):' + email + ' ' + pw);

    Promise.all([method])
        .then(function(result) {
            const person = result[0];
            /*if (staff !== null) {
                console.log(staff);
            }*/
            if (person !== null && pw === person.Password) {
                req.session.userinfo = person._id;
                req.session.username = person.UserName;
                req.session.role = role;
                if (req.session.role == 'student') {
                    res.redirect('/student/homepage');
                } else if (req.session.role == 'staff') {
                    res.redirect('/staff/my_project');
                } else if (req.session.role == 'admin') {
                    res.redirect('/admin/project_list')
                } else if (req.session.role == 'client') {
                    res.redirect('/ClientPart/client_myproposals');
                }
            }
            else {
                res.redirect('/signin');
                console.log('Invalid username or password');
            }
        });
});

router.get('/', function(req, res) {
    const role = req.query.role;
    // console.log(role)
    // if (req.session.role == 'student') {
    //     res.redirect('/student/homepage');
    // } else if (req.session.role == 'staff') {
    //     res.redirect('/staff/my_project');
    // } else if (req.session.role == 'admin') {
    //     res.redirect('/admin/project_list')
    // } else if (req.session.role == 'client') {
    //     res.redirect('/ClientPart/client_myproposals')
    // } else
        if (role != null) {
            res.render('portal/signin', {
                pageTitle: role + 'Signin',
                role: role,
            });
            // } else {
            //     res.redirect('portal/role_select')
            // }
        }
});

module.exports = router;
