-- Example seed — copy, edit, and run in the Supabase SQL Editor to
-- populate your guest list. You can re-run safely: deleting a party
-- cascades to its guests, but existing rows are not touched by this
-- script unless you delete them first.

begin;

-- Example: a couple invited together, plus a family of four.
with new_party as (
  insert into public.parties (party_name)
  values ('The Smiths')
  returning id
)
insert into public.guests (party_id, full_name)
select id, unnest(array['Alex Smith', 'Jamie Smith'])
from new_party;

with new_party as (
  insert into public.parties (party_name)
  values ('The Patel Family')
  returning id
)
insert into public.guests (party_id, full_name)
select id, unnest(array[
  'Priya Patel',
  'Raj Patel',
  'Anya Patel',
  'Kiran Patel'
])
from new_party;

commit;
