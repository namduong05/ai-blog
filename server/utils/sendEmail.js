import nodemailer from "nodemailer";

const sendEmail = async ({ emailTo, subject, code, content }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: emailTo,
    subject,
    html: `
    <div>
      <h2>Use this bellow code to ${content}</h2>
      <p><strong>Code:</strong> ${code}</p>
    </div>
  `,
  });
};

export default sendEmail;
