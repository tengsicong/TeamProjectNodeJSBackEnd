module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        if (req.session.role === undefined) {
            console.log('You have not signin');
            return res.redirect('/role_select');
        }
        next();
    },

    checkAdminLogin: function checkAdminLogin(req, res, next) {
        checkRoleLogin('admin', req, res, next);
    },

    checkClientLogin: function checkLogin(req, res, next) {
        checkRoleLogin('client', req, res, next);
    },

    checkStaffLogin: function checkLogin(req, res, next) {
        checkRoleLogin('staff', req, res, next);
    },

    checkStudentLogin: function checkLogin(req, res, next) {
        checkRoleLogin('student', req, res, next);
    },
};

function checkRoleLogin(role, req, res, next) {
    if (req.session.role !== role) {
        console.log('You have not signin');
        return res.redirect('/role_select');
    }
    next();
}
