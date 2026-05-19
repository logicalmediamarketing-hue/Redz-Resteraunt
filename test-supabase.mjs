import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xtdutubocjaonocucuzs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZHV0dWJvY2phb25vY3VjdXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzgyMjYsImV4cCI6MjA5MzA1NDIyNn0.MLZPjdj7ZKcfR4tPYSq7izMCSIv45IPuWJ0ydoI8nSM'
);

async function test() {
  console.log('Fetching first reservation...');
  const { data, error } = await supabase.from('reservations').select('*').limit(1);
  if (error) {
    console.error('Fetch error:', error);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log('No reservations found.');
    return;
  }
  
  const id = data[0].id;
  console.log('Testing delete on ID:', id);
  const { error: delError } = await supabase.from('reservations').delete().eq('id', id);
  console.log('Delete result:', delError ? delError.message : 'Success');
  
  console.log('Testing update status to deleted on ID:', id);
  const { error: upError } = await supabase.from('reservations').update({ status: 'deleted' }).eq('id', id);
  console.log('Update status result:', upError ? upError.message : 'Success');
}

test();
