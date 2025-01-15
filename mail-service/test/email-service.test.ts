import { sendEmail } from '../src/email-service.js';

(async () => {
  // const testUserEmail = 'anythingyouwantt.corporate@gmail.com';
  const testUserEmail = 'datngoqhss@gmail.com';
  const testTitle = 'Oreo';
  const time = new Date().toISOString();

  try {
    await sendEmail(time, testUserEmail, testTitle);
    console.log('[test] Test email sent successfully.');
  } catch (error) {
    console.error('[test] Failed to send test email:\n', error);
  }
})();
