const express = require('express');
const session = require('express-session');
const router = express.Router();
const mongoose = require('mongoose');
const clientModel = require('../models/client');
const studentModel = require('../models/student');
const staffModel = require('../models/staff');
const adminModel = require('../models/admin');

router.post('/reset_password', function(req, res) {
    if(req.session.role !== undefined) {
        const currentPW = req.body.currentpw;
        const newPW = req.body.newpw;
        const confirmedNewPW = req.body.confirmednewpw;
        //console.log('currentPW: ' + currentPW);
        //console.log('newPW: ' + newPW);
        //console.log('confirmedNewPW: ' + confirmedNewPW);

        let method;
        if (req.session.role === 'student') {
            method = studentModel.getStudentByUserName(req.session.username);
        } else if (req.session.role === 'staff') {
            method = staffModel.getStaffByUserName(req.session.username);
        } else if (req.session.role === 'admin') {
            method = adminModel.getAdminByUserName(req.session.username);
        } else if (req.session.role === 'client') {
            method = clientModel.getClientByUserName(req.session.username);
        } else {
            res.redirect('/role_select');
            console.log('role error');
        }
    
        Promise.all([method])
            .then(function(result) {
                let person = result[0];
                let isError = (currentPW !== person.Password);
                let isSame = (newPW === person.Password);
                let isMatch = (newPW === confirmedNewPW);

                if (person !== null && !isError && !isSame && isMatch) {
                    /* TO-DO： reset password method */
                    let resetMethod;
                    if (req.session.role === 'staff') {
                        resetMethod = staffModel.resetPasswordByStaffId(req.session.userinfo, newPW);
                    } else {
                        res.redirect('/role_select');
                        console.log('role error');
                    }

                    const promise = resetMethod;
                    promise.then(function(result) {
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
                    res.redirect('/account/reset_password');
                    if(isError) console.log('Current password error');
                    if(isSame) console.log('Your new password is same as your current one');
                    if(!isMatch) console.log('New password you input twice is not matched');
                }
            });
    } else {
        res.redirect('/role_select');
    }
});

router.get('/reset_password', function(req, res) {
    if(req.session.role !== undefined) {
        //console.log(req.session);
        res.render('portal/reset_password', {
            pageTitle: 'Reset Password',
        });
    } else {
        res.redirect('/role_select');
    }
});

router.get('/forgot_password', function(req, res) {
    const routePromise = adminModel.getAllAdmin();
    routePromise.then(function(result) {
        const admins = result;

        res.render('portal/forgot_password', {
            pageTitle: 'Forgot Password',
            admins: admins,
        });
    });
});

module.exports = router;
