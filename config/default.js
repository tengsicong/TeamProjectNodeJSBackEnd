module.exports = {
    port: 3000,
    session: {
        secret: 'student',
        key: 'student',
        maxAge: 2592000000,
    },
    mongodb: 'mongodb+srv://team:team@teamproject-9em6o.mongodb.net/test?retryWrites=true&w=majority',
    transporter: {
        service: 'Outlook365',
        auth: {
            user: 'ssit_group3@outlook.com',
            pass: 'ssitgroup3'
        }
    }
}
