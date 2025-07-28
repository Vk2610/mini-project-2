import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();



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


// Uncomment and update the PDF generation function
export const send_ApplicationForm = async (email, name, memberNo, formData) => {
    try {
        // Create PDF document
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const chunks = [];
        const stream = new PassThrough();

        // Create promise to handle PDF generation
        const pdfPromise = new Promise((resolve, reject) => {
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', reject);
        });

        doc.pipe(stream);

        // Update font path
        const fontPath = path.join(__dirname, '..', '..', 'fonts', 'NotoSansDevanagari-VariableFont_wdth,wght.ttf');

        try {
            if (!fs.existsSync(fontPath)) {
                throw new Error(`Font file not found at: ${fontPath}`);
            }
            doc.registerFont('Devanagari', fontPath);
            doc.font('Devanagari');
        } catch (fontError) {
            console.error('Font loading error:', fontError);
            // Fallback to default font if Devanagari font fails
            doc.font('Helvetica');
        }

        // Generate PDF with form data
        doc.fontSize(18).text('रयत शिक्षण संस्था, सातारा', { align: 'center' });
        doc.moveDown(0.3);
        doc.fontSize(16).text('रयत सेवक कुटुंब कल्याण योजना', { align: 'center' });
        doc.moveDown(0.3);
        doc.fontSize(13).text('(वर्गणीदार होण्यासाठीचा करावयाचा अर्ज व संमती पत्रक)', { align: 'center' });

        // Member Number Box (top-right)
        doc.rect(420, 60, 120, 30).stroke();
        doc.fontSize(12).text(`सभासद क्र.: KK-${memberNo}`, 430, 70);

        doc.moveDown(2);

        // Address section
        doc.fontSize(12);
        doc.text('प्रति,');
        doc.text('     मा. चेअरमन,');
        doc.text('     रयत सेवक कुटुंब कल्याण योजना');
        doc.text('     रयत शिक्षण संस्था, सातारा');
        doc.text('     यांना--');
        doc.moveDown(1.2);

        // Intro paragraph
        const intro = `महोदय,

रयत सेवक कुटुंब कल्याण योजनेची घटना व नियम मी वाचले असून ते मला मान्य आहेत. त्यानुसार या अंशतःशःत नियमामान्यप्रमाणे प्रवेश फी रु. १००/- व वर्गणी रु. ______________ मी माझ्या शाखेमार्फत पाठवित आहे. रयत सेवक कुटुंब कल्याण योजनेची संपूर्ण वर्गणी रु. ५०००/- ही एप्रिल २०____ ते मार्च २०____ या आर्थिक वर्षात समांतर व धुपराषी माझ्या पगारातून कपात करून रयत सेवक कुटुंब कल्याण योजनेच्या खात्यातील वर्गणी मी माझ्या शाखेच्या शाखामुख्यांच्या संमतीने देत आहे. तरी मला रयत सेवक कुटुंब कल्याण योजनेचा सभासद करावा ही विनंती.`;

        doc.fontSize(12).text(intro, { align: 'justify' });
        doc.moveDown(1.5);

        // Form Section Header
        const header = 'माझी माहिती खालीलप्रमाणे आहे';
        const headerWidth = doc.widthOfString(header);
        const startX = (doc.page.width - headerWidth) / 2;

        doc.fontSize(14).text(header, startX);
        doc.moveTo(startX, doc.y).lineTo(startX + headerWidth, doc.y).stroke();
        doc.moveDown(1.5);

        // Fields (manual layout)
        const fields = [
            '१. संपूर्ण नाव: _____________________________________      २. हुद्दा: _____________________________',
            '३. शाखा : _________________________________________________________________',
            '४. कायमचा पत्ता : ____________________________________________________________',
            '   Mobile No. ___________________     WhatsApp Mobile No. ___________________',
            '   Email ______________________________________',
            '५. संस्थेतील नेमणूक तारीख : ___________     ६. कायम झाल्याची तारीख : ___________',
            '७. जन्म तारीख : ___________     ८. सेवानिवृत्ती तारीख : ___________',
            '९. रयत सेवक बँक – ऑफ केव्हा सभासद क्र. : ________________  शाखा : ___________________',
            '१०. ३१ मार्च २०२० पूर्वी कुटुंब कल्याण योजनेचा सभासद असाल/नसाल सभासद क्र.: ________________ व वर्गणी रु.: ________________     HRMS No. ________________',
            '११. माझ्या सेवानिवृत्तीनंतर योजनांच्या घटनेनुसार वर्गणी व रक्कम नियमांनुसार मला मिळालेल्या रक्कम मी सेवा कालावधीत लागू झालेल्या घटनेनुसार माझ्या पश्चात वारसांना मिळावी यास मी संमती देतो (तथापि)'
        ];

        fields.forEach(line => {
            doc.fontSize(12).text(line);
            doc.moveDown(0.5);
        });

        doc.moveDown(2);

        // Signature Section
        doc.text('तारीख: ________________', 70);
        doc.text('स्वाक्षरी: ________________', 350);
        doc.moveDown(2);

        // Footer (optional)
        doc.fontSize(10)
            .fillColor('#666')
            .text('ही माहिती शाखामुख्यांच्या संमतीने देण्यात आली आहे.', { align: 'left' });

        // Add form data from formData object
        doc.fontSize(12);
        doc.text(`नाव: ${formData.name}`);
        doc.text(`HRMS नंबर: ${formData.hrmsNo}`);
        doc.text(`पद: ${formData.designation}`);
        doc.text(`शाखा: ${formData.branch}`);
        // ... add other form fields

        // Add signatures if available
        if (formData.signature) {
            doc.image(formData.signature, { width: 200 });
        }
        if (formData.principal_sign_stamp) {
            doc.image(formData.principal_sign_stamp, { width: 200 });
        }

        doc.end();

        const pdfBuffer = await pdfPromise;

        // Send email with PDF
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
            subject: 'Your Rayat Kutumb Kalyan Yojana Application Form',
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Your Application Form</h2>
                <p>Dear ${name},</p>
                <p>Please find attached your application form for Rayat Kutumb Kalyan Yojana.</p>
                <p>Member Number: KK-${memberNo}</p>
                <p>You can download and print this form for your records.</p>
                <br/>
                <p>Best regards,</p>
                <p>Rayat Kutumb Kalyan Yojana Team</p>
            </div>
            `,
            attachments: [{
                filename: `RKKY_Application_${memberNo}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf'
            }]
        };

        await transporter.sendMail(mail_options);
        return true;

    } catch (error) {
        console.error('Error in sending form:', error);
        throw error;
    }
};
