-- Grove — Seed data from data/dummy.ts
-- This populates the database with the same content the frontend currently hardcodes.
-- Uses a placeholder user_id; replace with a real auth.users ID after first sign-up.
--
-- USAGE: After creating your first user via Google OAuth, run:
--   UPDATE branches      SET user_id = '<your-user-uuid>' WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE leaves         SET user_id = '<your-user-uuid>' WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE nightly_logs   SET user_id = '<your-user-uuid>' WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE gardener_suggestions SET user_id = '<your-user-uuid>' WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- Placeholder user (will be replaced after first OAuth sign-in)
-- NOTE: This insert requires temporarily disabling RLS or running as service_role.
-- In practice, seed this via the Supabase dashboard SQL editor with service_role context.

do $$
declare
  _user_id uuid := '00000000-0000-0000-0000-000000000001';

  -- Branch IDs (deterministic UUIDs for cross-referencing)
  _b_love      uuid := '11111111-0000-0000-0000-000000000001';
  _b_memory    uuid := '11111111-0000-0000-0000-000000000002';
  _b_becoming  uuid := '11111111-0000-0000-0000-000000000003';
  _b_beauty    uuid := '11111111-0000-0000-0000-000000000004';
  _b_icons     uuid := '11111111-0000-0000-0000-000000000005';
  _b_body      uuid := '11111111-0000-0000-0000-000000000006';
  _b_alive     uuid := '11111111-0000-0000-0000-000000000007';
  _b_words     uuid := '11111111-0000-0000-0000-000000000008';
  _b_horizon   uuid := '11111111-0000-0000-0000-000000000009';
  _b_people    uuid := '11111111-0000-0000-0000-000000000010';

begin

-- ============================================================
-- BRANCHES (from dummy.ts branches array)
-- ============================================================

insert into branches (id, user_id, name, color, attachment, direction_x, direction_y, direction_z) values
  (_b_love,     _user_id, 'Love',     '#c17f6b', 1.5, -2.5, 2.0,  1.0),
  (_b_memory,   _user_id, 'Memory',   '#c4935a', 1.8,  1.5, 1.5, -2.0),
  (_b_becoming, _user_id, 'Becoming', '#4ecdc4', 2.0,  0.5, 3.5,  0.5),
  (_b_beauty,   _user_id, 'Beauty',   '#a78bc4', 1.6,  2.5, 1.5,  1.5),
  (_b_icons,    _user_id, 'Icons',    '#c9a84c', 2.2, -1.5, 2.0, -1.5),
  (_b_body,     _user_id, 'Body',     '#7a9e6e', 1.0,  3.0, 0.5,  0.5),
  (_b_alive,    _user_id, 'Alive',    '#e8a85f', 1.1,  2.0, 1.0, -2.0),
  (_b_words,    _user_id, 'Words',    '#e8d5b7', 1.2, -3.0, 0.5, -0.5),
  (_b_horizon,  _user_id, 'Horizon',  '#f0a500', 2.5,  0.0, 4.5,  0.0),
  (_b_people,   _user_id, 'People',   '#b87c6a', 0.8, -1.0, 1.0, -3.0);

-- ============================================================
-- LEAVES (from dummy.ts branches[].leaves arrays)
-- ============================================================

-- Love
insert into leaves (user_id, branch_id, type, content, date, is_own_writing) values
  (_user_id, _b_love, 'own_writing', 'I will take shitty feeling every day rather than not feeling at all.', '2025-06-12', true);
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_love, 'text', 'She understood desire not as something to be managed, but as proof of being alive. — Simone de Beauvoir', '2025-11-03');
insert into leaves (user_id, branch_id, type, content, date, is_own_writing, sealed, sealed_until) values
  (_user_id, _b_love, 'capsule', 'The piece about the boy I loved.', '2025-02-14', true, true, '2028-02-14');
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_love, 'audio', 'Tum Se Hi — Jab We Met', '2025-12-01');

-- Memory
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_memory, 'text', 'Standing before the terracotta warriors in Xi''an. The scale of human ambition, preserved in clay.', '2024-07-20');
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_memory, 'text', 'The smell of monsoon. Petrichor on hot stone. That specific weight in the air before it breaks.', '2025-08-14');
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_memory, 'image', 'India — the light at 5pm in October.', '2024-10-15');
insert into leaves (user_id, branch_id, type, content, date, is_own_writing, person) values
  (_user_id, _b_memory, 'own_writing', 'Sister called. Felt like myself.', '2026-02-03', true, 'Sister');
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_memory, 'text', 'Cooking at Vipassana. The silence made the food taste different. Presence as an ingredient.', '2025-04-08');

-- Becoming
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_becoming, 'bucket', 'Surf a barrel.', '2025-01-01');
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_becoming, 'bucket', 'Do a backflip.', '2025-03-15');
insert into leaves (user_id, branch_id, type, content, date, language) values
  (_user_id, _b_becoming, 'bucket', 'Watch Life is Beautiful — in Italian.', '2025-09-20', 'Italian');
insert into leaves (user_id, branch_id, type, content, date, language) values
  (_user_id, _b_becoming, 'text', 'Ciao, mi chiamo Ishita. Sto imparando l''italiano.', '2026-02-10', 'Italian');
insert into leaves (user_id, branch_id, type, content, date, is_own_writing) values
  (_user_id, _b_becoming, 'own_writing', 'Made a 3-minute documentary on my phone today. It counts.', '2026-01-22', true);

-- Beauty
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_beauty, 'image', 'Claude Monet — Impression, Sunrise. 1872. He named an entire movement and didn''t mean to.', '2025-09-01');
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_beauty, 'image', 'Winter Olympics — the pairs skating. The way trust becomes movement.', '2026-02-10');
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_beauty, 'image', 'A croissant from the place on Rue de Rivoli. Ordinary things made extraordinary.', '2024-11-30');
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_beauty, 'text', 'Beauty is a legitimate life''s work. Monet proved it. So did whoever baked this.', '2025-11-30');

-- Icons
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_icons, 'text', 'Taylor Swift. Faced backlash. Kept making things. Turned the noise into albums.', '2025-10-15');
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_icons, 'text', 'Eileen Gu chose herself. Refused to be just one thing. That''s the whole lesson.', '2026-01-10');
insert into leaves (user_id, branch_id, type, content, date, person) values
  (_user_id, _b_icons, 'text', 'The question is not whether you are capable. The question is whether you will let yourself find out.', '2025-06-20', 'Professor Chris Peiche');
insert into leaves (user_id, branch_id, type, content, date, person) values
  (_user_id, _b_icons, 'text', 'You are building the plane while flying it. That is the only way anyone has ever built anything.', '2025-08-05', 'Sierra Wang');
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_icons, 'text', 'Simone de Beauvoir refused the life handed to her. Wrote her way to a different one.', '2025-07-12');

-- Body
insert into leaves (user_id, branch_id, type, content, date, is_own_writing, person) values
  (_user_id, _b_body, 'own_writing', 'Running with Imogen. 8km. We didn''t talk for the first 4km and it was perfect.', '2026-02-12', true, 'Imogen Gardiner');
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_body, 'text', 'Pilates at 7am. The teacher said: your body already knows. Let it.', '2026-02-18');
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_body, 'bucket', 'Do a full split.', '2025-05-01');

-- Alive
insert into leaves (user_id, branch_id, type, content, date, is_own_writing) values
  (_user_id, _b_alive, 'own_writing', 'Got pulled under a wave today. Held down for what felt like forever. Came up. Paddled back out.', '2025-12-28', true);
insert into leaves (user_id, branch_id, type, content, date, is_own_writing) values
  (_user_id, _b_alive, 'own_writing', 'The cartwheel. Attempted at 23. Looked completely ridiculous. Felt completely alive.', '2026-01-05', true);
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_alive, 'text', 'Falling off a skateboard and feeling the ground — the aliveness of impact, of trying.', '2025-11-22');

-- Words
insert into leaves (user_id, branch_id, type, content, date, is_own_writing) values
  (_user_id, _b_words, 'own_writing', 'Hard night. Writing this at 2am. I don''t know what I''m doing but I know I''m not done.', '2025-10-03', true);
insert into leaves (user_id, branch_id, type, content, date, is_own_writing) values
  (_user_id, _b_words, 'own_writing', 'What would you do today if nothing counted? Answer: exactly this.', '2026-02-21', true);
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_words, 'gift', 'A note from the gardener: you''ve written 12 times this month. The tree is listening.', '2026-02-24');

-- Horizon
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_horizon, 'bucket', 'Go to France — Lyon. Stay long enough.', '2025-05-20');
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_horizon, 'bucket', 'Learn to sing.', '2025-08-01');
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_horizon, 'bucket', 'Plant a tree.', '2025-09-10');
insert into leaves (user_id, branch_id, type, content, date) values
  (_user_id, _b_horizon, 'text', 'The year I take off to ski. It is allowed. Val Thorens. February.', '2026-01-15');
insert into leaves (user_id, branch_id, type, content, date, is_own_writing, sealed, sealed_until) values
  (_user_id, _b_horizon, 'capsule', 'Letter to myself — 2031.', '2026-02-24', true, true, '2031-02-24');

-- People
insert into leaves (user_id, branch_id, type, content, date, person) values
  (_user_id, _b_people, 'text', 'Imogen — the friend you run with and talk to about everything and nothing. She makes the world feel smaller in a good way.', '2026-01-30', 'Imogen Gardiner');
insert into leaves (user_id, branch_id, type, content, date, person) values
  (_user_id, _b_people, 'text', 'The work is never finished. You just get better at knowing when to stop.', '2025-05-14', 'John Mitchell');
insert into leaves (user_id, branch_id, type, content, date, is_own_writing, person) values
  (_user_id, _b_people, 'own_writing', 'My sister. She called when I didn''t know I needed it. She always does.', '2026-02-03', true, 'Sister');

-- ============================================================
-- NIGHTLY LOGS (from dummy.ts nightlyLogs array)
-- ============================================================

insert into nightly_logs (user_id, date, entry, positive) values
  (_user_id, '2026-02-24', 'The light through the window at 4pm. Imogen texted.', true),
  (_user_id, '2026-02-23', 'Finished the Italian lesson. Managed a whole sentence.', true),
  (_user_id, '2026-02-22', 'Hard day. Wrote about it anyway.', false),
  (_user_id, '2026-02-21', 'Pilates. The city at night from the roof.', true),
  (_user_id, '2026-02-20', 'Sister called.', true),
  (_user_id, '2026-02-19', 'Didn''t go outside. Felt the pull of the screen.', false),
  (_user_id, '2026-02-18', 'Cooked something new. It worked.', true);

-- ============================================================
-- GARDENER SUGGESTIONS (from dummy.ts seedSuggestions array)
-- ============================================================

insert into gardener_suggestions (user_id, title, why, complexity, claude_prompt, status) values
  (_user_id,
   'Vine mechanic between Love and Horizon',
   'Love and Horizon have been co-occurring in your logs for months. France keeps appearing near the boy you loved. There should be a visible connection between these branches.',
   'medium',
   'Add a vine/connection mechanic to the Grove 3D tree. When two branches have strong co-occurrence in leaf content (detected via embeddings), render a thin glowing vine between them using TubeGeometry along a CatmullRomCurve3 that arcs between the two branch tips. The vine should pulse slowly and be barely visible — felt more than seen.',
   'pending'),
  (_user_id,
   'Waveform visualization on branch view',
   'You feed audio constantly but the branch view only shows leaf shapes. The Body and Memory branches should pulse with the rhythm of the music saved there.',
   'small',
   'Add ambient waveform bars to branches that contain audio leaves in the Grove 3D tree. When a branch has audio content, render 5-7 thin bar geometries near the branch tip that animate in a slow breathing waveform pattern using sine waves with staggered phase offsets.',
   'pending'),
  (_user_id,
   'Lyon sub-branch under Horizon',
   'France appears 11+ times across your logs and leaves. Lyon specifically. This deserves its own space inside the Horizon branch.',
   'small',
   'Add sub-branch support to the Grove 3D tree. A sub-branch grows off an existing branch tip rather than off the trunk. Implement the first sub-branch: Lyon, growing from the tip of Horizon, shorter and thinner, in the same gold color but slightly cooler. Populate with 2-3 placeholder leaves about Lyon/France.',
   'pending');

end $$;
