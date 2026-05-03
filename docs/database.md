# Bondity — Database Reference

## Tables overview

| Table               | Purpose                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| `profiles`          | One row per user. Public identity + maker status + rating.                                        |
| `profile_addresses` | Private shipping address + GPS coordinates. Separate from profiles for privacy.                   |
| `printers`          | One printer per maker. Specs like model, build volume, nozzle.                                    |
| `printer_materials` | Materials a printer supports, each with available colors. One row per material.                   |
| `jobs`              | A print request created by a customer. Lifecycle: draft → pending → active → completed/cancelled. |
| `job_invitations`   | When a job is `specific`, the customer hand-picks printers. One row per invite.                   |
| `reviews`           | Customers rate makers after a completed job. Feeds the maker's avg_rating.                        |

---

## `profiles`

Stores public user information. Linked 1:1 to `auth.users`.

**Triggers**

| Trigger                      | When              | What it does                                                                                                                                                    |
| ---------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger_set_updated_at`     | Before any UPDATE | Sets `updated_at = now()` automatically.                                                                                                                        |
| `trigger_protect_avg_rating` | Before any UPDATE | If the caller is an authenticated user (not an internal function), it silently reverts any change to `avg_rating`. Prevents users from faking their own rating. |

**Policies**

| Policy                             | Operation | Rule                                                                                                              |
| ---------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| Profiles are viewable by everyone  | SELECT    | Anyone (including logged-out visitors) can read all profiles.                                                     |
| Users can insert their own profile | INSERT    | You can only create a profile where `id = your user id`. Triggered automatically on signup via `handle_new_user`. |
| Users can update own profile       | UPDATE    | You can only edit your own profile row.                                                                           |

> `avg_rating` is always computed from the `reviews` table via trigger. Nobody can write to it directly.

---

## `profile_addresses`

Stores private data: street address and GPS coordinates. Intentionally separated from `profiles` so this data is never publicly visible.

**Triggers**

None.

**Policies**

| Policy                                    | Operation | Rule                                                                                                                                                             |
| ----------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Users can view own address                | SELECT    | You can only read your own address row.                                                                                                                          |
| Users can manage own address              | ALL       | You can insert, update, or delete your own address row.                                                                                                          |
| Assigned makers can view customer address | SELECT    | If you are the `maker_id` on a job with status `active` or `completed`, you can read that customer's address. This unlocks automatically when a job is accepted. |

---

## `printers`

One row per maker. Enforced by a UNIQUE constraint on `owner_id`.

**Triggers**

| Trigger                           | When                   | What it does                                                                                                                                    |
| --------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger_set_updated_at_printers` | Before any UPDATE      | Sets `updated_at = now()` automatically.                                                                                                        |
| `trigger_sync_is_maker`           | After INSERT or DELETE | When a printer is created, sets `profiles.is_maker = true` for the owner. When deleted, sets it back to `false`. Keeps the flag always in sync. |

**Policies**

| Policy                              | Operation | Rule                                                         |
| ----------------------------------- | --------- | ------------------------------------------------------------ |
| Printers are viewable by everyone   | SELECT    | Anyone can browse all printers. Needed for the marketplace.  |
| Users can manage their own printers | ALL       | You can insert, update, or delete only your own printer row. |

---

## `printer_materials`

Child table of `printers`. Each row is one material a printer supports, with an array of colors available in that material.

Example: `{ printer_id: X, material: "PLA", available_colors: ["Red", "Black"] }`

**Triggers**

None.

**Policies**

| Policy                                     | Operation | Rule                                                                                                                |
| ------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------- |
| Printer materials are viewable by everyone | SELECT    | Anyone can read all materials. Needed for job matching and marketplace browsing.                                    |
| Owners can manage their printer materials  | ALL       | You can insert, update, or delete materials only for your own printer (verified by joining to `printers.owner_id`). |

---

## `jobs`

The core of the marketplace. Created by customers, picked up by makers.

**Status lifecycle:** `draft` → `pending` → `active` → `completed` or `cancelled`

**target_type:**

- `open` — any maker matching the criteria can see and apply
- `specific` — only makers explicitly invited via `job_invitations` can see it

**Triggers**

| Trigger                       | When              | What it does                             |
| ----------------------------- | ----------------- | ---------------------------------------- |
| `trigger_set_updated_at_jobs` | Before any UPDATE | Sets `updated_at = now()` automatically. |

**Policies**

| Policy                                | Operation | Rule                                                                                                                                                                                                                             |
| ------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Marketplace visibility                | SELECT    | You can see a job if: you are the customer, OR you are the assigned maker, OR the job is `pending + open` (visible to all makers), OR the job is `pending + specific` and you have been invited (checked via `job_invitations`). |
| Users can create their own jobs       | INSERT    | You can only create jobs where `customer_id = your user id`.                                                                                                                                                                     |
| Customers can edit their draft jobs   | UPDATE    | You can only edit job content while status is `draft`.                                                                                                                                                                           |
| Customers can cancel their jobs       | UPDATE    | You can change status to `cancelled` if the job is currently `pending` or `active`.                                                                                                                                              |
| Customers can delete their draft jobs | DELETE    | You can hard-delete a job only while it is still a `draft`.                                                                                                                                                                      |

---

## `job_invitations`

Used when `jobs.target_type = 'specific'`. The customer picks which printers to invite.

**Status lifecycle:** `pending` → `accepted` or `declined`

**Triggers**

| Trigger                              | When         | What it does                                                                                                                                                                                           |
| ------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `trigger_handle_invitation_accepted` | After UPDATE | When status changes from `pending` to `accepted`: sets `jobs.maker_id` to the accepting maker, flips `jobs.status` to `active`, and sets all other pending invitations for the same job to `declined`. |

**Policies**

| Policy                                    | Operation | Rule                                                                                                        |
| ----------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------- |
| Customers can send invitations            | INSERT    | You can invite a printer only to your own job (verified via `get_job_customer_id`).                         |
| Customers can view their job invitations  | SELECT    | You can see all invitations on your own jobs.                                                               |
| Customers can rescind pending invitations | DELETE    | You can withdraw an invitation only while it is still `pending`.                                            |
| Makers can view their own invitations     | SELECT    | You can see invitations addressed to your printer.                                                          |
| Makers can respond to invitations         | UPDATE    | You can change the status of a `pending` invitation to your printer — but only to `accepted` or `declined`. |

---

## `reviews`

Customers rate makers after a job is completed. One review per customer per job.

**Triggers**

| Trigger                     | When                            | What it does                                                                                                                                                       |
| --------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `trigger_update_avg_rating` | After INSERT, UPDATE, or DELETE | Recalculates `profiles.avg_rating` for the reviewed maker by averaging all their reviews. Uses `SECURITY DEFINER` so it runs as the database owner, bypassing RLS. |

**Policies**

| Policy                                      | Operation | Rule                                                                                                                                                             |
| ------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reviews are viewable by everyone            | SELECT    | Anyone can read all reviews.                                                                                                                                     |
| Users can create reviews for completed jobs | INSERT    | You can only submit a review if: you are the reviewer, the job status is `completed`, you are the customer on that job, and the target is the maker on that job. |
| Users cannot update reviews                 | UPDATE    | Blocked for everyone — reviews are permanent once written.                                                                                                       |

> There is no DELETE policy, so reviews cannot be deleted by users. Only a database admin can remove a review.

---

## Key constraints summary

| Table             | Constraint                                 | Prevents                                            |
| ----------------- | ------------------------------------------ | --------------------------------------------------- |
| `profiles`        | `username` UNIQUE + NOT NULL + min 3 chars | Duplicate or empty usernames                        |
| `profiles`        | `is_maker` NOT NULL, default false         | NULL maker status                                   |
| `printers`        | `owner_id` UNIQUE                          | More than one printer per user                      |
| `jobs`            | `status` CHECK                             | Invalid status values                               |
| `jobs`            | `target_type` CHECK                        | Values other than `open` or `specific`              |
| `jobs`            | `min_rating` CHECK (0–5)                   | Out-of-range rating filters                         |
| `reviews`         | UNIQUE `(job_id, reviewer_id)`             | Reviewing the same job twice                        |
| `reviews`         | CHECK `reviewer_id != target_id`           | Self-reviews                                        |
| `reviews`         | `rating` CHECK (1–5)                       | Out-of-range ratings                                |
| `job_invitations` | UNIQUE `(job_id, printer_id)`              | Inviting the same printer twice                     |
| `job_invitations` | `status` CHECK                             | Values other than `pending`, `accepted`, `declined` |
