TRUNCATE auth.users CASCADE;

-- 1. AUTH USERS (The foundation)
INSERT INTO auth.users (id, email, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES
    ('a1111111-1111-1111-1111-111111111111', 'alice@maker.com', '{"provider":"email"}', '{}', 'authenticated', 'authenticated'),
    ('a2222222-2222-2222-2222-222222222222', 'bob@maker.com', '{"provider":"email"}', '{}', 'authenticated', 'authenticated'),
    ('a3333333-3333-3333-3333-333333333333', 'charlie@maker.com', '{"provider":"email"}', '{}', 'authenticated', 'authenticated'),
    ('b1111111-1111-1111-1111-111111111111', 'dave@cust.com', '{"provider":"email"}', '{}', 'authenticated', 'authenticated'),
    ('b2222222-2222-2222-2222-222222222222', 'eve@cust.com', '{"provider":"email"}', '{}', 'authenticated', 'authenticated'),
    ('b3333333-3333-3333-3333-333333333333', 'frank@cust.com', '{"provider":"email"}', '{}', 'authenticated', 'authenticated')
    ON CONFLICT (id) DO NOTHING;

-- 2. PROFILES (Using UPSERT logic to overwrite trigger-created blanks)
-- If the ID already exists, it will UPDATE the existing row with your seed data.
INSERT INTO public.profiles (id, username, full_name, is_maker, avg_rating, location_city, bio)
VALUES
    ('a1111111-1111-1111-1111-111111111111', 'alice_prints', 'Alice Anderson', true, 4.9, 'New York', 'Pro resin prints.'),
    ('a2222222-2222-2222-2222-222222222222', 'bob_builds', 'Bob Robertson', true, 4.5, 'Austin', 'FDM engineering parts.'),
    ('a3333333-3333-3333-3333-333333333333', 'charlie_flex', 'Charlie Chestnut', true, 4.7, 'Chicago', 'TPU specialist.'),
    ('b1111111-1111-1111-1111-111111111111', 'dave_hobbies', 'Dave Davis', false, 0, 'Seattle', 'Board game fan.'),
    ('b2222222-2222-2222-2222-222222222222', 'cosplay_eve', 'Eve Evens', false, 0, 'Miami', 'Prop maker.'),
    ('b3333333-3333-3333-3333-333333333333', 'frankie_fix', 'Frank Franklin', false, 0, 'Denver', 'Repair enthusiast.')
    ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
                            full_name = EXCLUDED.full_name,
                            is_maker = EXCLUDED.is_maker,
                            avg_rating = EXCLUDED.avg_rating,
                            location_city = EXCLUDED.location_city,
                            bio = EXCLUDED.bio;

-- 3. PRINTERS (Assigned to Makers only)
INSERT INTO public.printers (id, owner_id, model_name, material_types, is_active, location_city, description)
VALUES
    (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'Bambu X1C', '{PLA, PETG}', true, 'New York', 'High speed multi-color.'),
    (gen_random_uuid(), 'a2222222-2222-2222-2222-222222222222', 'Voron 2.4', '{ABS, ASA}', true, 'Austin', 'High temp specialist.'),
    (gen_random_uuid(), 'a3333333-3333-3333-3333-333333333333', 'Prusa MK4', '{PLA, TPU}', true, 'Chicago', 'Reliable daily prints.');

-- 4. JOBS
INSERT INTO public.jobs (id, customer_id, maker_id, status, estimated_price, material, color, target_type)
VALUES
    (gen_random_uuid(), 'b1111111-1111-1111-1111-111111111111', NULL, 'pending', 20.00, 'PLA', 'Blue', 'marketplace'),
    (gen_random_uuid(), 'b2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'completed', 50.00, 'PETG', 'Red', 'direct');

-- 5. REVIEWS
INSERT INTO public.reviews (id, job_id, reviewer_id, target_id, rating, comment)
VALUES
    (gen_random_uuid(), (SELECT id FROM jobs WHERE status = 'completed' LIMIT 1), 'b2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 5, 'Perfect quality!');