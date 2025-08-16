export const otpTemplate = (otp) => `
    <div style="font-family: Arial, sans-serif; background-color: #f9f5f0; padding: 20px; text-align: center;">
        <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
        
        <!-- Header -->
        <div style="background-color: #6b4f36; padding: 20px;">
            <h1 style="color: #fff; margin: 0;">Maskan</h1>
        </div>
        
        <!-- Body -->
        <div style="padding: 30px;">
            <h2 style="color: #6b4f36;">OTP Verification</h2>
            <p style="font-size: 16px; color: #444;">We received a request to verify your email. Use the code below to complete your verification:</p>
            
            <div style="margin: 20px 0; font-size: 28px; font-weight: bold; color: #6b4f36; letter-spacing: 3px;">
            ${otp}
            </div>
            
            <p style="font-size: 14px; color: #666;">This code is valid for <b>10 minutes</b>. Please do not share it with anyone.</p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f1e7dc; padding: 15px; font-size: 12px; color: #666;">
            <p>© 2025 Maskan. All rights reserved.</p>
        </div>
        </div>
    </div>
`;