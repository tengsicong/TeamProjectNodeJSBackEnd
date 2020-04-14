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
    const email = req.body.email;
    const pw = req.body.password;
    //console.log('post: ' + role);
    //console.log('u: ' + email);
    //console.log('p: ' + pw);
    
    let method;
    if (role === 'student') {
        method = studentModel.getStudentByUserName(email);
    } else if (role === 'staff') {
        method = staffModel.getStaffByUserName(email);
    } else if (role === 'admin') {
        method = adminModel.getAdminByUserName(email);
    } else if (role === 'client') {
        method = clientModel.getClientByUserName(email);
    } else {
        res.redirect('/role_select');
        console.log('role error');
    }

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
                req.session.save(function(err) {
                    if (req.session.role === 'student') {
                        res.redirect('/student/homepage');
                    } else if (req.session.role === 'staff') {
                        res.redirect('/staff/my_project');
                    } else if (req.session.role === 'admin') {
                        res.redirect('/admin/project_list')
                    } else if (req.session.role === 'client') {
                        res.redirect('/client/myproject');
                    }
                });
            }
            else {
                res.redirect('/signin?role=' + role);
                console.log('Invalid username or password');
            }
        });
});

router.get('/', function(req, res) {
    const role = req.query.role;
    //console.log(role);

    if(req.session.role !== undefined && req.session.role === role) {
        if (req.session.role === 'student') {
            res.redirect('/student/homepage');
        } else if (req.session.role === 'staff') {
            res.redirect('/staff/my_project');
        } else if (req.session.role === 'admin') {
            res.redirect('/admin/project_list')
        } else if (req.session.role === 'client') {
            res.redirect('/client/myproject')
        } else {
            res.redirect('/role_select');
            console.log('role error');
        }
    }
    else {
        if(req.session !== undefined) {
            req.session.cookie.maxAge = 0;
            req.session.destroy(function(err) {
                if(err) {
                    console.log(err);
                }
            });
        }

        if (role !== undefined) {
            res.render('portal/signin', {
                pageTitle: 'Team Project - ' + role.substring(0,1).toUpperCase() + role.substring(1) + ' Login',
                role: role,
            });
        } else {
            res.redirect('/role_select');
        }
    }
});

module.exports = router;
