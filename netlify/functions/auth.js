exports.handler = async (event) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const host = event.headers['x-forwarded-host'] || event.headers.host;
  const redirectUri = `https://${host}/.netlify/functions/callback`;

  const url =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent('repo,user')}`;

  return {
    statusCode: 302,
    headers: { Location: url },
    body: '',
  };
};
