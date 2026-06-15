const nodemailer = require('nodemailer');

async function testSMTP() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'sandeepsamineni800@gmail.com',
      pass: 'ytzgaqpfbjvhlpoc'
    }
  });

  try {
    await transporter.verify();
    console.log("SUCCESS: SMTP connected perfectly!");
  } catch (error) {
    console.error("FAILED:", error.message);
  }
}

testSMTP();
