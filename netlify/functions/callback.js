exports.handler = async (event) => {
  const code = event.queryStringParameters && event.queryStringParameters.code;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  const htmlResponse = (script) => ({
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: `<!DOCTYPE html><html><body><script>${script}</script></body></html>`,
  });

  if (!code) {
    return htmlResponse(`
      (function() {
        function receive(e) {
          window.opener.postMessage('authorization:github:error:' + JSON.stringify({ message: 'Nedostaje code parametar' }), e.origin);
        }
        window.addEventListener('message', receive, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    `);
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return htmlResponse(`
        (function() {
          function receive(e) {
            window.opener.postMessage('authorization:github:error:' + JSON.stringify(${JSON.stringify(tokenData)}), e.origin);
          }
          window.addEventListener('message', receive, false);
          window.opener.postMessage('authorizing:github', '*');
        })();
      `);
    }

    const payload = JSON.stringify({ token: tokenData.access_token, provider: 'github' });

    return htmlResponse(`
      (function() {
        function receive(e) {
          window.opener.postMessage('authorization:github:success:' + JSON.stringify(${payload}), e.origin);
          window.removeEventListener('message', receive, false);
        }
        window.addEventListener('message', receive, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    `);
  } catch (err) {
    return htmlResponse(`
      (function() {
        function receive(e) {
          window.opener.postMessage('authorization:github:error:' + JSON.stringify({ message: ${JSON.stringify(err.message)} }), e.origin);
        }
        window.addEventListener('message', receive, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    `);
  }
};
