const config = {
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_MAIL,
    pass: process.env.NODEMAILER_PASSWD,
  },
};
export default config
