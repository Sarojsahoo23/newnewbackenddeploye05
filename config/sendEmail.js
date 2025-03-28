import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.RESEND_API) {
    console.error("Missing RESEND_API key in environment variables.");
    process.exit(1); // Stop the server if API key is missing
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'NewsNew <no-reply@fydo.shop>', // Use a verified domain email
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error("Email sending error:", error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Unexpected email error:", error);
        return null;
    }
};

export default sendEmail;
