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
