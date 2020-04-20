const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.API_KEY)

const sendWelcomeEmail = async(email, name) => {
    await sgMail.send({
        to: email,
        from: 'siddhantarekar21@gmail.com',
        subject: 'Welcome To Task-Manager',
        text: `Welcome to the app ,${name}, Hey ${name} how you have been. We would like to welcome you to our task manager app `
    })
}

const sendCancelEmail = async(email, name) => {
    await sgMail.send({
        to: email,
        from: 'Siddhantarekar21@gmail.com',
        subject: 'See You Later',
        text: `Hey ${name}, Sorry we were not able to reach your expectations,${name} please let us know how we can improve our service, leave a comment on our website or reply to yhis mail`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}