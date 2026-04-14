const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'SEU_EMAIL@gmail.com',
    pass: 'SUA_SENHA_DE_APP'
  }
});

module.exports = transporter;