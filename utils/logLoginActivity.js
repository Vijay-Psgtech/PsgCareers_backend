const axios = require('axios');
const LoginHistory = require('../models/LoginHistoryModel');

const logLoginActivity = async (userId, req) => {
  try {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip ||
      'Unknown';

    const userAgent = req.get('user-agent') || 'Unknown';

    let location = 'Unknown';
    try {
      const geoRes = await axios.get(`https://ipapi.co/${ip}/json/`);
      const geo = geoRes.data;
      location = `${geo.city || ''}, ${geo.region || ''}, ${geo.country_name || ''}`.trim();
    } catch (geoErr) {
      console.warn('Geo lookup failed:', geoErr.message);
    }

    await LoginHistory.create({
      userId: userId.toString(), // ✅ ensure string
      timestamp: new Date(),
      ip,
      userAgent,
      location,
    });

    console.log(`✅ Login activity logged for userId: ${userId}`);
  } catch (err) {
    console.error('❌ Error logging login activity:', err);
  }
};

module.exports = logLoginActivity;
