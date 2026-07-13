const message = document.querySelector('#authMessage');
const show = text => { message.hidden = false; message.innerHTML = `<b>Account update</b><p>${text}</p>`; };
const client = window.effSupabase;

if (!client) show('The account connection is not added yet. EFF staff: add the public Supabase project values to assets/supabase-config.js after completing the Academy SQL setup.');

document.querySelector('#signInForm').addEventListener('submit', async event => {
  event.preventDefault();
  if (!client) return;
  const form = new FormData(event.currentTarget);
  const { error } = await client.auth.signInWithPassword({ email: form.get('email'), password: form.get('password') });
  if (error) return show(error.message);
  location.href = 'dashboard.html';
});

document.querySelector('#signUpForm').addEventListener('submit', async event => {
  event.preventDefault();
  if (!client) return;
  const form = new FormData(event.currentTarget);
  const fullName = form.get('name').trim();
  const chapter = form.get('chapter').trim();
  const position = form.get('position');
  const { error } = await client.auth.signUp({
    email: form.get('email'),
    password: form.get('password'),
    options: {
      data: { full_name: fullName, chapter, position },
      emailRedirectTo: location.origin + '/dashboard.html'
    }
  });
  if (error) return show(error.message);
  show('Your account and EFF leadership profile are ready to verify. Check your inbox—and your spam folder—for the confirmation email, then return here to sign in.');
  event.currentTarget.reset();
});

document.querySelector('#sendReset').addEventListener('click', async () => {
  if (!client) return;
  const email = document.querySelector('#signInForm [name="email"]').value.trim();
  if (!email) return show('Enter your email in the sign-in box first, then select “Forgot your password?”');
  const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth.html` });
  if (error) return show(error.message);
  show('A password-reset link was sent. Check your inbox and spam folder, then use the link to choose a new password.');
});

client?.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') {
    document.querySelector('#resetCard').hidden = false;
    show('Your reset link is confirmed. Choose a new password below.');
  }
});

document.querySelector('#resetPasswordForm').addEventListener('submit', async event => {
  event.preventDefault();
  if (!client) return;
  const form = new FormData(event.currentTarget);
  if (form.get('password') !== form.get('confirmPassword')) return show('Those passwords do not match. Please try again.');
  const { error } = await client.auth.updateUser({ password: form.get('password') });
  if (error) return show(error.message);
  event.currentTarget.reset();
  document.querySelector('#resetCard').hidden = true;
  show('Password updated. You can now sign in with your new password.');
});
