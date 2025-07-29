import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactPayload {
    user_name: string;
    user_email: string;
    message: string;
}

export const sendContactEmail = async (payload: ContactPayload) => {
    const { user_name, user_email, message } = payload;

    const toEmail = process.env.CONTACT_FORM_EMAIL_TO;
    const fromEmail = process.env.CONTACT_FORM_EMAIL_FROM;

    if (!toEmail || !fromEmail) {
        throw new Error("Server email configuration is incomplete.");
    }

    const { data, error } = await resend.emails.send({
        from: `Rooftop Energy Contact Form <${fromEmail}>`,
        to: [toEmail],
        subject: `New Message from ${user_name}`,
        html: `
            <p>You have received a new message from the Solar Potential Explorer contact form.</p>
            <p><strong>Name:</strong> ${user_name}</p>
            <p><strong>Email:</strong> ${user_email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
    });

    if (error) {
        console.error({ error });
        throw new Error('Failed to send email via Resend.');
    }

    return data;
};