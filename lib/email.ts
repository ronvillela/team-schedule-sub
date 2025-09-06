import nodemailer from 'nodemailer';

interface EmailData {
  type: 'bug' | 'suggestion' | 'error' | 'general';
  message: string;
  team?: string;
  sport?: string;
  league?: string;
  userAgent?: string;
  url?: string;
  ip?: string;
}

export async function sendFeedbackEmail(data: EmailData) {
  try {
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
      },
    });

    // Determine email subject based on type
    const getSubject = (type: string) => {
      switch (type) {
        case 'bug': return '🐛 Bug Report - Universal Sports Calendar';
        case 'suggestion': return '💡 Suggestion - Universal Sports Calendar';
        case 'error': return '❌ Error Report - Universal Sports Calendar';
        default: return '💬 Feedback - Universal Sports Calendar';
      }
    };

    // Create HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; text-align: center;">Universal Sports Calendar</h1>
          <p style="color: white; margin: 10px 0 0 0; text-align: center; opacity: 0.9;">User Feedback Notification</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Feedback Details</h2>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #555;">Type:</strong> 
            <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; margin-left: 8px;">
              ${data.type.toUpperCase()}
            </span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #555;">Message:</strong>
            <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 8px; border-left: 4px solid #2196f3;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          ${data.team ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #555;">Team Context:</strong>
            <span style="margin-left: 8px;">${data.team} (${data.sport} - ${data.league})</span>
          </div>
          ` : ''}
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #555;">User Agent:</strong>
            <div style="font-size: 12px; color: #666; margin-top: 4px; word-break: break-all;">
              ${data.userAgent || 'Not provided'}
            </div>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #555;">IP Address:</strong>
            <span style="margin-left: 8px; font-family: monospace;">${data.ip || 'Not provided'}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #555;">Page URL:</strong>
            <div style="font-size: 12px; color: #666; margin-top: 4px; word-break: break-all;">
              ${data.url || 'Not provided'}
            </div>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #555;">Timestamp:</strong>
            <span style="margin-left: 8px;">${new Date().toLocaleString()}</span>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #f0f0f0; border-radius: 8px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            This feedback was submitted through the Universal Sports Calendar app.
          </p>
          <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">
            <a href="https://team-schedule-sub.vercel.app" style="color: #2196f3;">View App</a> | 
            <a href="https://team-schedule-sub.vercel.app/analytics" style="color: #2196f3;">Analytics Dashboard</a>
          </p>
        </div>
      </div>
    `;

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER, // Send to yourself or specified recipient
      subject: getSubject(data.type),
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendErrorNotification(error: any, context?: any) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #f44336;">
          <h1 style="color: #d32f2f; margin: 0;">🚨 Error Alert</h1>
          <p style="color: #666; margin: 10px 0 0 0;">Universal Sports Calendar</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-top: 0;">Error Details</h2>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #555;">Error Message:</strong>
            <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 8px; border-left: 4px solid #f44336; font-family: monospace;">
              ${error.message || 'Unknown error'}
            </div>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #555;">Timestamp:</strong>
            <span style="margin-left: 8px;">${new Date().toLocaleString()}</span>
          </div>
          
          ${context ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #555;">Context:</strong>
            <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 8px; font-family: monospace; font-size: 12px;">
              ${JSON.stringify(context, null, 2)}
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
      subject: '🚨 Error Alert - Universal Sports Calendar',
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Error notification sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (emailError) {
    console.error('Failed to send error notification:', emailError);
    return { success: false, error: emailError instanceof Error ? emailError.message : 'Unknown error' };
  }
}
