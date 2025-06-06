import nodemailer from 'nodemailer';

export const Successful_ApplicationForm = async (Email_ID, HRMS_No, password) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mail_options = {
        from: process.env.EMAIL_USER,
        to: Email_ID,
        subject: '🎉 Welcome to Rayat Kutumb Kalyan Yojana – Your Account is Ready!',
        html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
            <h2 style="color: #0066cc;">Welcome to Rayat Kutumb Kalyan Yojana!</h2>
            <p>Dear User,</p>
            
            <p>🎉 <strong>Congratulations!</strong> Your account has been <strong>successfully created</strong> under the <strong>Rayat Kutumb Kalyan Yojana</strong> initiative.</p>
            
            <p><strong>Please find your login credentials below:</strong></p>
            <ul style="list-style: none; padding-left: 0;">
                <li><strong>👤 Username:</strong> ${HRMS_No}</li>
                <li><strong>🔐 Password:</strong> ${password}</li>
            </ul>

            <p style="color: #cc0000;"><strong>⚠️ You can change your password after your first login for security purposes.</strong></p>

            <p>If you have any questions or need assistance, feel free to contact our support team.</p>

            <p>Welcome to the <strong>Rayat Kutumb Kalyan Yojana</strong> family!</p>

            <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>Rayat Kutumb Kalyan Yojana Team</strong>
            </p>
        </div>
    `
    };



    try {
        const info = await transporter.sendMail(mail_options);
        console.log('Email sent successfully:', info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Email for rejected application with remarks 
export const Rejected_ApplicationForm = async (email, name, memberNo, remarks) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mail_options = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '❌ Application Status Update - Rayat Kutumb Kalyan Yojana',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #dc3545; margin-bottom: 10px;">Application Update</h2>
                <div style="background-color: #fff3f3; padding: 10px; border-radius: 4px;">
                    <p style="color: #dc3545; font-size: 18px; margin: 0;">Rayat Kutumb Kalyan Yojana</p>
                </div>
            </div>

            <p style="margin-bottom: 15px;">Dear <strong>${name}</strong>,</p>
            
            <p>We regret to inform you that your application (Member No: ${memberNo}) has been <strong style="color: #dc3545">REJECTED</strong>.</p>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Reason for Rejection:</strong></p>
                <p style="margin: 10px 0 0 0; color: #dc3545;">${remarks || 'Application does not meet current eligibility criteria.'}</p>
            </div>

            <p>What you can do next:</p>
            <ul style="padding-left: 20px;">
                <li>Review the rejection reason carefully</li>
                <li>Contact your branch office for clarification</li>
                <li>Submit a new application after addressing the concerns</li>
            </ul>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="margin: 0;">Best regards,</p>
                <p style="margin: 5px 0; color: #0066cc;"><strong>Rayat Kutumb Kalyan Yojana Team</strong></p>
            </div>

            <div style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
        `
    };

    try {
        const info = await transporter.sendMail(mail_options);
        console.log('Rejection email sent successfully:', info.response);
        return true;
    } catch (error) {
        console.error('Error sending rejection email:', error);
        throw error;
    }
}

// Email for approved application
export const Approved_ApplicationForm = async (email, name, memberNo, remarks) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mail_options = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '✅ Application Approved - Rayat Kutumb Kalyan Yojana',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #0066cc; margin-bottom: 10px;">Application Approved! 🎉</h2>
                <div style="background-color: #e6f3ff; padding: 10px; border-radius: 4px;">
                    <p style="color: #0066cc; font-size: 18px; margin: 0;">Rayat Kutumb Kalyan Yojana</p>
                </div>
            </div>

            <p style="margin-bottom: 15px;">Dear <strong>${name}</strong>,</p>
            
            <p>We are pleased to inform you that your application for membership in the Rayat Kutumb Kalyan Yojana has been <strong style="color: #28a745">APPROVED</strong>.</p>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Member Number:</strong> ${memberNo}</p>
                ${remarks ? `<p style="margin: 10px 0 0 0;"><strong>Remarks:</strong> ${remarks}</p>` : ''}
            </div>

            <p>Next Steps:</p>
            <ul style="padding-left: 20px;">
                <li>Keep your member number safe for future reference</li>
                <li>You will receive further instructions about membership benefits</li>
                <li>Contact your branch office for any queries</li>
            </ul>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="margin: 0;">Best regards,</p>
                <p style="margin: 5px 0; color: #0066cc;"><strong>Rayat Kutumb Kalyan Yojana Team</strong></p>
            </div>

            <div style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
        `
    };

    try {
        const info = await transporter.sendMail(mail_options);
        console.log('Approval email sent successfully:', info.response);
        return true;
    } catch (error) {
        console.error('Error sending approval email:', error);
        throw error;
    }
};