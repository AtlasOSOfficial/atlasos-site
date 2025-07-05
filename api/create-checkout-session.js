const stripe = require('stripe')('sk_test_REPLACE_WITH_SECRET_KEY');

export default async function handler(req, res) {
  const { plan } = req.body;
  const prices = {
    pro: 'price_ABC123',
    elite: 'price_DEF456',
  };

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: prices[plan], quantity: 1 }],
      success_url: 'https://atlasos.org/success',
      cancel_url: 'https://atlasos.org/cancel',
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stripe session failed.' });
  }
}
