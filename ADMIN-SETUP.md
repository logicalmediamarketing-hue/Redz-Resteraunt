# Create the CRM admin (2 minutes)

Supabase currently has **0** auth users. `/admin` needs one staff account.

## Steps (LaurelDev project)

1. Open: https://supabase.com/dashboard/project/dbzvxncnkgqgfjqcbyai/auth/users  
2. **Add user** → Email: `marketing@laurellodging.com`  
3. Set a strong password (or Auto Generate) → enable **Auto Confirm User**  
4. Save  

Then lock the door:

5. https://supabase.com/dashboard/project/dbzvxncnkgqgfjqcbyai/auth/providers  
6. Email provider → turn **OFF** “Allow new users to sign up” → Save  

Sign in:

- Preview: https://redz-restaurant.vercel.app/admin  
- After DNS: https://redzrestaurant.com/admin  

Only `marketing@laurellodging.com` is allowlisted (`NEXT_PUBLIC_ADMIN_EMAILS`).
