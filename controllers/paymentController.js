const createPayment = async (req, res) => {
  try {
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('[payments] Missing SQUARE_ACCESS_TOKEN in server env');
      return res.status(500).json({ error: 'Server missing SQUARE_ACCESS_TOKEN' });
    }

    const { token, amount, idempotencyKey, currency = 'USD' } = req.body || {};
    const serverLocationEnv = process.env.SQUARE_LOCATION_ID || process.env.REACT_APP_SQUARE_LOCATION_ID;
    console.log('[payments] Incoming createPayment', {
      amount,
      currency,
      idempotencyKeyLen: idempotencyKey?.length,
      clientLocationId: req.body?.locationId,
      serverLocationEnv,
      tokenPreview: token ? `${String(token).slice(0,6)}...${String(token).slice(-4)}` : undefined
    });
    if (!token || !amount || !idempotencyKey) {
      return res.status(400).json({ error: 'Missing required fields: token, amount, idempotencyKey' });
    }

    const resolvedLocationId = serverLocationEnv; // always trust server env
    console.log('[payments] Resolved Location ID:', resolvedLocationId);
    if (!resolvedLocationId) {
      return res.status(500).json({ error: 'Server missing Square Location ID' });
    }

    const response = await fetch('https://connect.squareupsandbox.com/v2/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-08-14'
      },
      body: JSON.stringify({
        idempotency_key: idempotencyKey,
        source_id: token,
        amount_money: { amount: Number(amount), currency },
        location_id: resolvedLocationId
      })
    });

    const data = await response.json();
    if (!response.ok) {
      const detail = Array.isArray(data?.errors) ? data.errors.map(e => e.detail || e.code || JSON.stringify(e)).join(' | ') : undefined;
      console.error('[payments] Square API error', { status: response.status, detail, raw: data });
      return res.status(response.status).json({ error: detail || 'Square API error' });
    }
    console.log('[payments] Square payment success', {
      id: data?.payment?.id,
      status: data?.payment?.status,
      amount: data?.payment?.amount_money?.amount
    });
    return res.json(data);
  } catch (err) {
    console.error('[payments] Server exception:', err);
    return res.status(500).json({ error: 'Payment processing failed' });
  }
};

module.exports = { createPayment };
