export const resetPasswordTemplate = (data: { name: string; resetLink: string }) => `
  <h2>Password Reset</h2>
  <p>Hi ${data.name},</p>
  <p>Click the link below to reset your password:</p>
  <p><a href="${data.resetLink}">Reset Password</a></p>
  <p>If you did not request this, please ignore this email.</p>
`;
