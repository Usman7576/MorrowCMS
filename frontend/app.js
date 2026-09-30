const page = document.body.className;
const sessionKey = 'morrowCmsSession';

function setupSessionGuard() {
  const signedIn = window.localStorage.getItem(sessionKey) === 'active';

  if (page.includes('auth-page') && signedIn) {
    window.location.replace('dashboard.html');
    return true;
  }
  if (page.includes('workspace-page') && !signedIn) {
    window.location.replace('login.html');
    return true;
  }
  return false;
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3000);
}

function setupLogin() {
  const form = document.querySelector('#login-form');
  if (!form) return;
  const email = document.querySelector('#email');
  const password = document.querySelector('#password');
  const emailError = document.querySelector('#email-error');
  const passwordError = document.querySelector('#password-error');
  const status = document.querySelector('#login-status');
  const toggle = document.querySelector('#password-toggle');

  toggle.addEventListener('click', () => {
    const showing = password.type === 'text';
    password.type = showing ? 'password' : 'text';
    toggle.textContent = showing ? 'Show' : 'Hide';
    toggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
  });

  document.querySelector('#forgot-link').addEventListener('click', (event) => {
    event.preventDefault();
    status.textContent = 'Password reset will be available when the secure backend is connected.';
    status.className = 'form-status';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    emailError.textContent = '';
    passwordError.textContent = '';
    email.classList.remove('invalid');
    password.classList.remove('invalid');
    status.textContent = '';
    status.className = 'form-status';
    let valid = true;

    if (!email.value || !email.validity.valid) {
      emailError.textContent = 'Enter a valid work email.';
      email.classList.add('invalid');
      valid = false;
    }
    if (!password.value || password.value.length < 6) {
      passwordError.textContent = 'Password must be at least 6 characters.';
      password.classList.add('invalid');
      valid = false;
    }
    if (!valid) return;

    window.localStorage.setItem(sessionKey, 'active');
    status.textContent = 'Access verified. Opening your workspace...';
    window.setTimeout(() => { window.location.href = 'dashboard.html'; }, 550);
  });
}

function setupGoogleAuth() {
  const googleContainer = document.querySelector('#google-signin');
  const googleStatus = document.querySelector('#google-status');
  if (!googleContainer || googleContainer.dataset.ready === 'true') return;
  googleContainer.dataset.ready = 'true';
  const clientId = window.GOOGLE_CLIENT_ID || '';
  const authApi = window.GOOGLE_AUTH_API || '/api/auth/google';

  if (!clientId || !window.google?.accounts?.id) {
    const setupButton = document.createElement('button');
    setupButton.type = 'button';
    setupButton.className = 'google-fallback';
    setupButton.textContent = 'Continue with Google';
    setupButton.addEventListener('click', () => {
      googleStatus.textContent = 'Google sign-in needs a configured Google client ID and backend endpoint.';
      googleStatus.className = 'form-status error';
    });
    googleContainer.appendChild(setupButton);
    return;
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: async (response) => {
      googleStatus.textContent = 'Verifying your Google account...';
      googleStatus.className = 'form-status';
      try {
        const result = await fetch(authApi, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ credential: response.credential })
        });
        if (!result.ok) throw new Error('Google account verification failed.');
        window.localStorage.setItem(sessionKey, 'active');
        window.location.href = 'dashboard.html';
      } catch (error) {
        googleStatus.textContent = error.message;
        googleStatus.className = 'form-status error';
      }
    }
  });
  window.google.accounts.id.renderButton(googleContainer, { theme: 'outline', size: 'large', width: 390, text: 'continue_with' });
}

function setupSignOut() {
  const signOut = document.querySelector('#signout-link');
  if (!signOut) return;
  signOut.addEventListener('click', () => window.localStorage.removeItem(sessionKey));
}

function setupWorkspace() {
  const menuItems = [...document.querySelectorAll('.menu-item:not(:disabled)')];
  const categoryTabs = [...document.querySelectorAll('.category-tab')];
  const search = document.querySelector('#menu-search');
  const orderItems = document.querySelector('#order-items');
  const itemCount = document.querySelector('#item-count');
  const subtotal = document.querySelector('#subtotal');
  const serviceCharge = document.querySelector('#service-charge');
  const orderTotal = document.querySelector('#order-total');
  const sendOrder = document.querySelector('#send-order');
  const clearOrder = document.querySelector('#clear-order');
  const saveDraft = document.querySelector('#save-draft');
  const orderNote = document.querySelector('#order-note');
  const noteCount = document.querySelector('#note-count');
  const menuEmpty = document.querySelector('#menu-empty');
  const confirmModal = document.querySelector('#confirm-modal');
  const cancelSend = document.querySelector('#cancel-send');
  const confirmSend = document.querySelector('#confirm-send');
  const guestCount = document.querySelector('#guest-count');
  const tableLabel = document.querySelector('.order-table-label');
  const tableButtons = [...document.querySelectorAll('.floor-table')];
  const order = new Map();
  let activeCategory = 'All';

  function renderMenu() {
    const term = search.value.trim().toLowerCase();
    let visibleItems = 0;
    menuItems.forEach((item) => {
      const matchesCategory = activeCategory === 'All' || item.dataset.category === activeCategory;
      const matchesSearch = item.dataset.name.toLowerCase().includes(term);
      item.hidden = !(matchesCategory && matchesSearch);
      if (!item.hidden) visibleItems += 1;
    });
    menuEmpty.hidden = visibleItems > 0;
  }

  function renderOrder() {
    orderItems.innerHTML = '';
    let totalItems = 0;
    let total = 0;
    order.forEach((item, name) => {
      totalItems += item.quantity;
      total += item.price * item.quantity;
      const line = document.createElement('div');
      line.className = 'order-line';
      line.innerHTML = `<div class="order-line-main"><strong>${name}</strong><small>$${item.price.toFixed(2)} each</small><div class="quantity-control"><button type="button" data-action="decrease" data-name="${name}" aria-label="Decrease ${name}">-</button><span>${item.quantity}</span><button type="button" data-action="increase" data-name="${name}" aria-label="Increase ${name}">+</button><button type="button" class="remove-item" data-action="remove" data-name="${name}">Remove</button></div></div><strong class="order-line-price">$${(item.price * item.quantity).toFixed(2)}</strong>`;
      orderItems.appendChild(line);
    });
    if (!totalItems) orderItems.innerHTML = '<div class="empty-order"><span class="empty-icon">+</span><strong>Your order is empty</strong><span>Add an item from the menu to get started.</span></div>';
    const fee = total * 0.05;
    itemCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
    subtotal.textContent = `$${total.toFixed(2)}`;
    serviceCharge.textContent = `$${fee.toFixed(2)}`;
    orderTotal.textContent = `$${(total + fee).toFixed(2)}`;
    sendOrder.disabled = totalItems === 0;
    clearOrder.disabled = totalItems === 0;
    saveDraft.disabled = totalItems === 0;
  }

  menuItems.forEach((item) => item.addEventListener('click', () => {
    const name = item.dataset.name;
    const orderStatus = document.querySelector('.order-status');
    if (orderStatus.textContent.includes('Sent')) {
      orderStatus.innerHTML = '<span class="mini-dot green"></span> Draft';
      sendOrder.textContent = 'Send to kitchen';
    }
    const current = order.get(name) || { price: Number(item.dataset.price), quantity: 0 };
    current.quantity += 1;
    order.set(name, current);
    renderOrder();
    showToast(`${name} added to the order.`);
  }));

  categoryTabs.forEach((tab) => tab.addEventListener('click', () => {
    categoryTabs.forEach((button) => button.classList.remove('active'));
    tab.classList.add('active');
    activeCategory = tab.dataset.category;
    renderMenu();
  }));
  search.addEventListener('input', renderMenu);

  orderItems.addEventListener('click', (event) => {
    const control = event.target.closest('[data-action]');
    if (!control) return;
    const name = control.dataset.name;
    const item = order.get(name);
    if (!item) return;
    if (control.dataset.action === 'increase') item.quantity += 1;
    if (control.dataset.action === 'decrease') item.quantity -= 1;
    if (control.dataset.action === 'remove' || item.quantity <= 0) order.delete(name);
    renderOrder();
  });

  orderNote.addEventListener('input', () => {
    noteCount.textContent = `${orderNote.value.length} / 120`;
  });

  clearOrder.addEventListener('click', () => {
    order.clear();
    orderNote.value = '';
    noteCount.textContent = '0 / 120';
    document.querySelector('.order-status').innerHTML = '<span class="mini-dot green"></span> Draft';
    renderOrder();
    showToast('Draft order cleared.');
  });

  saveDraft.addEventListener('click', () => {
    document.querySelector('.order-status').innerHTML = '<span class="mini-dot green"></span> Saved';
    showToast(`Draft for ${tableLabel.textContent.replace('/', '').trim()} saved for later.`);
  });

  tableButtons.forEach((table) => table.addEventListener('click', () => {
    tableButtons.forEach((button) => button.classList.remove('selected'));
    table.classList.add('selected');
    tableLabel.textContent = `/ ${table.dataset.table}`;
    showToast(`${table.dataset.table} is now the active table.`);
  }));

  guestCount.addEventListener('change', () => {
    showToast(`${guestCount.value} recorded for ${tableLabel.textContent.replace('/', '').trim()}.`);
  });

  function closeConfirmation() {
    confirmModal.hidden = true;
  }

  sendOrder.addEventListener('click', () => {
    if (sendOrder.disabled) return;
    confirmModal.hidden = false;
    confirmSend.focus();
  });

  cancelSend.addEventListener('click', closeConfirmation);
  confirmModal.addEventListener('click', (event) => {
    if (event.target === confirmModal) closeConfirmation();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !confirmModal.hidden) closeConfirmation();
  });

  confirmSend.addEventListener('click', () => {
    closeConfirmation();
    sendOrder.textContent = 'Sent to kitchen';
    sendOrder.disabled = true;
    saveDraft.disabled = true;
    document.querySelector('.order-status').innerHTML = '<span class="mini-dot green"></span> Sent';
    showToast(`Order for ${tableLabel.textContent.replace('/', '').trim()} sent to the kitchen.`);
  });

  renderOrder();
}

const redirectedBySession = setupSessionGuard();
if (!redirectedBySession && page.includes('auth-page')) setupLogin();
if (!redirectedBySession && page.includes('workspace-page')) {
  setupWorkspace();
  setupSignOut();
}
if (!redirectedBySession && page.includes('auth-page')) {
  window.addEventListener('load', setupGoogleAuth);
  window.setTimeout(setupGoogleAuth, 1200);
}
