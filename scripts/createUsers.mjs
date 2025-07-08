import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function createUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'zochert@dreamcon.com',
    password: 'Password123!',
    email_confirm: true
  });

  if (error) {
    console.error('❌ Supabase Auth Error:', error);
    return;
  }

  console.log('✅ Auth user created:', data.user.id);

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: data.user.id,
      company: 'Zochert Fence',
      role: 'admin'
    });

  if (profileError) {
    console.error('❌ Profile Insert Error:', profileError);
  } else {
    console.log('✅ Profile created successfully.');
  }
}

createUser();
