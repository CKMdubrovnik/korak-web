const ALLOWED_DOMAIN = '@ckmdubrovnik.hr';

exports.handler = async (event) => {
  try {
    const { user } = JSON.parse(event.body || '{}');
    const email = ((user && user.email) || '').toLowerCase();

    if (email.endsWith(ALLOWED_DOMAIN)) {
      return { statusCode: 200, body: JSON.stringify({}) };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({
        error: `Registracija je dozvoljena samo za ${ALLOWED_DOMAIN} e-mail adrese.`,
      }),
    };
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Neispravan zahtjev.' }) };
  }
};
