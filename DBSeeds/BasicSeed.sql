-- ================================================================
-- BONDITY SEED  |  re-run safe  |  login not required
-- ================================================================

TRUNCATE auth.users CASCADE;

-- ----------------------------------------------------------------
-- 1. AUTH USERS
-- ----------------------------------------------------------------
INSERT INTO auth.users (id, email, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'max@seed.dev',   '{"provider":"email"}', '{}', 'authenticated', 'authenticated'),
    ('22222222-2222-2222-2222-222222222222', 'sofia@seed.dev', '{"provider":"email"}', '{}', 'authenticated', 'authenticated'),
    ('33333333-3333-3333-3333-333333333333', 'leon@seed.dev',  '{"provider":"email"}', '{}', 'authenticated', 'authenticated'),
    ('44444444-4444-4444-4444-444444444444', 'emma@seed.dev',  '{"provider":"email"}', '{}', 'authenticated', 'authenticated'),
    ('55555555-5555-5555-5555-555555555555', 'noah@seed.dev',  '{"provider":"email"}', '{}', 'authenticated', 'authenticated'),
    ('66666666-6666-6666-6666-666666666666', 'lena@seed.dev',  '{"provider":"email"}', '{}', 'authenticated', 'authenticated')
    ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- 2. PROFILES  (upsert over trigger-created blanks)
-- ----------------------------------------------------------------
INSERT INTO public.profiles (id, username, full_name, avatar_url, is_maker, bio, location_city, avg_rating)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'max_weber',     'Max Weber',     'https://api.dicebear.com/7.x/lorelei/svg?seed=maxweber',    true,  'Passionate maker in Munich. FDM specialist, fast shipping.',       'Munich',  4.8),
    ('22222222-2222-2222-2222-222222222222', 'sofia_prints',  'Sofia Chen',    'https://api.dicebear.com/7.x/lorelei/svg?seed=sofiachen',   true,  'Engineer by day, maker by night. Precise mechanical parts.',       'Berlin',  4.6),
    ('33333333-3333-3333-3333-333333333333', 'leon_bauer',    'Leon Bauer',    'https://api.dicebear.com/7.x/lorelei/svg?seed=leonbauer',   false, null,                                                               'Hamburg', 0),
    ('44444444-4444-4444-4444-444444444444', 'emma_makes',    'Emma Fischer',  'https://api.dicebear.com/7.x/lorelei/svg?seed=emmafischer', true,  'Vienna-based designer. Home decor & accessories in eco PLA.',      'Vienna',  4.9),
    ('55555555-5555-5555-5555-555555555555', 'noah_3d',       'Noah Müller',   'https://api.dicebear.com/7.x/lorelei/svg?seed=noahmuller',  true,  'Prototype specialist in Zurich. ABS/ASA for technical parts.',     'Zurich',  4.5),
    ('66666666-6666-6666-6666-666666666666', 'lena_schmidt',  'Lena Schmidt',  'https://api.dicebear.com/7.x/lorelei/svg?seed=lenaschmidt', false, null,                                                               'Cologne', 0)
    ON CONFLICT (id) DO UPDATE SET
    username      = EXCLUDED.username,
                            full_name     = EXCLUDED.full_name,
                            avatar_url    = EXCLUDED.avatar_url,
                            is_maker      = EXCLUDED.is_maker,
                            bio           = EXCLUDED.bio,
                            location_city = EXCLUDED.location_city,
                            avg_rating    = EXCLUDED.avg_rating;

-- ----------------------------------------------------------------
-- 3. PROFILE ADDRESSES
-- ----------------------------------------------------------------
INSERT INTO public.profile_addresses (profile_id, address_line, address_postal_code, address_country, location_lat, location_lng)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Maximilianstraße 12',  '80539', 'Germany',     48.1374, 11.5755),
    ('22222222-2222-2222-2222-222222222222', 'Unter den Linden 45',  '10117', 'Germany',     52.5163, 13.3777),
    ('33333333-3333-3333-3333-333333333333', 'Mönckebergstraße 7',   '20095', 'Germany',     53.5505, 10.0007),
    ('44444444-4444-4444-4444-444444444444', 'Mariahilfer Straße 88','1060',  'Austria',     48.1972, 16.3477),
    ('55555555-5555-5555-5555-555555555555', 'Bahnhofstrasse 21',    '8001',  'Switzerland', 47.3769,  8.5417),
    ('66666666-6666-6666-6666-666666666666', 'Schildergasse 15',     '50667', 'Germany',     50.9333,  6.9500);

-- ----------------------------------------------------------------
-- 4. PRINTERS  (one per maker)
-- ----------------------------------------------------------------
INSERT INTO public.printers (id, owner_id, model_name, description, is_active, build_volume_x_mm, build_volume_y_mm, build_volume_z_mm, nozzle_diameter_mm)
VALUES
    ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Bambu Lab X1 Carbon', 'Multi-material with AMS. Fast and precise.',        true, 256, 256, 256, 0.4),
    ('aaaaaaaa-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Prusa MK4',           'Reliable workhorse for prototypes & functional parts.', true, 250, 210, 220, 0.4),
    ('aaaaaaaa-0000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444444', 'Creality Ender 3 V3', 'Fast affordable prints. Home decor & simple models.',  true, 220, 220, 250, 0.4),
    ('aaaaaaaa-0000-0000-0000-000000000004', '55555555-5555-5555-5555-555555555555', 'Bambu Lab P1S',       'Enclosed. High-temp ABS/ASA engineering parts.',      true, 256, 256, 256, 0.4);

-- ----------------------------------------------------------------
-- 5. PRINTER MATERIALS
-- ----------------------------------------------------------------
INSERT INTO public.printer_materials (printer_id, material, available_colors)
VALUES
    ('aaaaaaaa-0000-0000-0000-000000000001', 'PLA',  ARRAY['black','white','red','blue','green','yellow']),
    ('aaaaaaaa-0000-0000-0000-000000000001', 'PETG', ARRAY['black','white','transparent']),
    ('aaaaaaaa-0000-0000-0000-000000000001', 'TPU',  ARRAY['black','white']),
    ('aaaaaaaa-0000-0000-0000-000000000002', 'PLA',  ARRAY['black','white','silver','blue']),
    ('aaaaaaaa-0000-0000-0000-000000000002', 'PETG', ARRAY['black','transparent','blue']),
    ('aaaaaaaa-0000-0000-0000-000000000003', 'PLA',  ARRAY['white','black','pink','purple']),
    ('aaaaaaaa-0000-0000-0000-000000000004', 'PLA',  ARRAY['black','white']),
    ('aaaaaaaa-0000-0000-0000-000000000004', 'PETG', ARRAY['black','white','transparent']),
    ('aaaaaaaa-0000-0000-0000-000000000004', 'ABS',  ARRAY['black','white','gray']),
    ('aaaaaaaa-0000-0000-0000-000000000004', 'ASA',  ARRAY['black','white']);

-- ----------------------------------------------------------------
-- 6. FILES
-- ----------------------------------------------------------------
INSERT INTO public.files (id, owner_id, name, description, file_url, preview_url, price, status)
VALUES
    ('f0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
     'Articulated Dragon Figurine',
     'Print-in-place dragon, 18 segments, fully flexible. No supports needed. Great for kids and collectors.',
     'files/11111111/dragon.stl',        'https://picsum.photos/seed/dragon/600/400',    4.99,  'published'),

    ('f0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
     'Miniature Castle Set',
     '8-piece medieval castle with towers, walls and gate. Perfect for tabletop gaming.',
     'files/11111111/castle.stl',        'https://picsum.photos/seed/castle/600/400',    7.99,  'published'),

    ('f0000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222',
     'Modular Phone Stand',
     'Adjustable stand with 3 height settings. Works for any phone size.',
     'files/22222222/phone-stand.stl',   'https://picsum.photos/seed/phonestand/600/400', 2.99, 'published'),

    ('f0000000-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222',
     'Cable Organiser Clips',
     '5 cable management clips in different sizes. Snap onto desk edges. Free to download!',
     'files/22222222/cable-clips.stl',   'https://picsum.photos/seed/cableclips/600/400', null, 'published'),

    ('f0000000-0000-0000-0000-000000000005', '55555555-5555-5555-5555-555555555555',
     'Functional Gear Box',
     'Working 3-speed gearbox. Fully print-in-place. Great educational model.',
     'files/55555555/gearbox.stl',       'https://picsum.photos/seed/gearbox/600/400',   null,  'published'),

    ('f0000000-0000-0000-0000-000000000006', '44444444-4444-4444-4444-444444444444',
     'Geometric Vase Collection',
     'Set of 3 Bauhaus-inspired vases. Looks great with dried flowers.',
     'files/44444444/vases.stl',         'https://picsum.photos/seed/vases/600/400',     3.49,  'published'),

    ('f0000000-0000-0000-0000-000000000007', '44444444-4444-4444-4444-444444444444',
     'Parametric Lamp Shade (WIP)',
     'Still tweaking the sizing — not ready to share yet.',
     'files/44444444/lampshade.stl',     null,                                            5.99,  'draft'),

    ('f0000000-0000-0000-0000-000000000008', '33333333-3333-3333-3333-333333333333',
     'Coffee Maker Bracket',
     'Replacement part for my Jura. Keeping private for reorders.',
     'files/33333333/bracket.stl',       null,                                            null,  'private');

-- ----------------------------------------------------------------
-- 7. JOBS
-- ----------------------------------------------------------------
INSERT INTO public.jobs (id, customer_id, maker_id, title, description, file_url, material, color, settings, estimated_price, status, target_type, min_rating)
VALUES
    ('bbbbbbbb-0000-0000-0000-000000000001',
     '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111',
     'Articulated dragon — red PLA', 'Please print the dragon in red PLA, high detail.',
     'jobs/33333333/dragon-order.stl', 'PLA', 'red',
     '{"layer_height":0.15,"infill":20,"supports":false}',
     12.50, 'completed', 'specific', 4.0),

    ('bbbbbbbb-0000-0000-0000-000000000002',
     '66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222',
     '10× cable clips in black PETG', 'Need 10 sets for my home office setup.',
     null, 'PETG', 'black',
     '{"layer_height":0.2,"infill":40,"supports":false}',
     18.00, 'active', 'specific', 0),

    ('bbbbbbbb-0000-0000-0000-000000000003',
     '33333333-3333-3333-3333-333333333333', null,
     'Phone stand — white PLA', 'Looking for any maker. Need it within a week.',
     null, 'PLA', 'white',
     '{"layer_height":0.2,"infill":15,"supports":false}',
     null, 'pending', 'open', 4.0),

    ('bbbbbbbb-0000-0000-0000-000000000004',
     '66666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444',
     'Geometric vase set — white', 'All 3 vases in white PLA please.',
     null, 'PLA', 'white',
     '{"layer_height":0.15,"infill":10,"supports":false}',
     22.00, 'completed', 'specific', 0),

    ('bbbbbbbb-0000-0000-0000-000000000005',
     '66666666-6666-6666-6666-666666666666', null,
     'Custom shelf bracket', 'Broken bracket, needs reprinting in solid PETG. File attached.',
     'jobs/66666666/bracket.stl', 'PETG', 'black',
     '{"layer_height":0.2,"infill":60,"supports":true}',
     null, 'pending', 'open', 0);

-- ----------------------------------------------------------------
-- 8. JOB INVITATIONS
-- ----------------------------------------------------------------
INSERT INTO public.job_invitations (job_id, printer_id, status)
VALUES
    ('bbbbbbbb-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'pending'),
    ('bbbbbbbb-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000002', 'pending'),
    ('bbbbbbbb-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000004', 'pending');

-- ----------------------------------------------------------------
-- 9. REVIEWS
-- ----------------------------------------------------------------
INSERT INTO public.reviews (job_id, reviewer_id, target_id, rating, comment)
VALUES
    ('bbbbbbbb-0000-0000-0000-000000000001',
     '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111',
     5, 'Incredible quality! Dragon came out perfectly, every joint moves smoothly. Very fast shipping.'),

    ('bbbbbbbb-0000-0000-0000-000000000004',
     '66666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444',
     5, 'Beautiful prints, look even better in person. Emma was very communicative. Will order again!');