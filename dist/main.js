const TIER_PRICES = {
  starter: 9,
  pro: 29,
  elite: 99
};

let selectedPlan = 'starter';

function runCommand(cmd) {
  const output = document.getElementById('commandOutput');
  output.textContent = `Running: ${cmd}...`;

  setTimeout(() => {
    output.textContent = `✅ ${cmd} executed. Shell & vault in sync.`;
  }, 1200);
}

function executeCommand() {
  const cmd = document.getElementById('commandInput').value.trim();
  if (!cmd) return;

  // Gated command example
  if (cmd.startsWith('atlas snapshot') && selectedPlan === 'starter') {
    alert('🔐 Snapshot requires Pro or Elite tier.');
    return;
  }

  if (cmd.startsWith('atlas memory --vault') && selectedPlan !== 'elite') {
    alert('🔓 Vault memory access is Elite-only.');
    return;
  }

  runCommand(cmd);
}

function routeToCheckout(plan) {
  selectedPlan = plan;
  window.location.href = `/checkout?plan=${plan}`;
}

document.getElementById('paymentForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const plan = e.target.plan.value;
  selectedPlan = plan;

  const price = TIER_PRICES[plan];
  alert(`Redirecting to payment: $${price}/mo for ${plan.toUpperCase()}`);
  // TODO: Integrate Stripe or ReflexPay gateway here
});


