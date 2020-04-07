const config = require('config-lite')(__dirname);
const express = require('express');
const session = require('express-session');
const router = express.Router();
const mongoose = require('mongoose');
const clientModel = require('../models/client');
const studentModel = require('../models/student');
const staffModel = require('../models/staff');

router.post('/', function(req, res) {
    const role = req.query.role;
    console.log('post' + role);
    const email = req.body.email;
    const pw = req.body.password;
    if (role == 'student') {
        const method = studentModel.getStudentByUserName(email)
    } else (role == 'staff') {
        const method = staffModel.getStaffByUserName(email)
    } else (role == 'admin') {
        const method =
    } else (role == 'client') {
        const method =
    }
    //console.log('Login(username pw):' + email + ' ' + pw);

    Promise.all([staffModel.getStaffByUserName(email)])
        .then(function(result) {
            const staff = result[0];
            /*if (staff !== null) {
                console.log(staff);
            }*/
            if (staff !== null && pw === staff.Password) {
                req.session.userinfo = staff._id;
                req.session.username = staff.UserName;
                res.redirect('/staff/my_project');
            }
            else {
                res.redirect('/signin');
                console.log('Invalid username or password');
            }
        });
});

router.get('/', function(req, res) {
    const role = req.query.role;
    console.log(role)
    if (req.session.role == 'student') {
        res.redirect('/student/homepage');
    } else if (req.session.role == 'staff') {
        res.redirect('/staff/my_project');
    } else if (req.session.role == 'admin') {
        res.redirect('/admin/project_list')
    } else if (req.session.role == 'client') {
        res.redirect('/ClientPart/client_myproposals')
    } else if (role != null) {
        res.render('portal/signin', {
            pageTitle: role + 'Signin',
            role: role,
        });
    } else {
        res.redirect('portal/role_select')
    }
});

module.exports = router;
