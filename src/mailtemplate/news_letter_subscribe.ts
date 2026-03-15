export const newsLetterSubscribeTemplate = (data: { email: string }) => `
  <div style="background:#f3f7ff;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#0a2239">
    <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #d7e6ff">
      <div style="background:linear-gradient(90deg,#245bbf,#5aa0ff);padding:18px 22px;color:#ffffff">
        <div style="font-size:18px;font-weight:700;letter-spacing:0.5px">Eagle Heli</div>
        <div style="font-size:13px;opacity:0.9">Newsletter</div>
      </div>
      <div style="padding:22px">
        <div style="font-size:16px;margin-bottom:10px">Thanks for subscribing!</div>
        <div style="font-size:14px;line-height:1.6">
          We will send you updates, offers, and travel highlights.
        </div>
        <div style="margin-top:12px;font-size:13px;color:#4b6b88">
          Subscribed email: ${data.email}
        </div>
      </div>
      <div style="padding:14px 22px;background:#f2f7ff;font-size:12px;color:#4b6b88">
        Thank you for choosing Eagle Heli.
      </div>
    </div>
  </div>
`;
