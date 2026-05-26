# Latvia Ride Platform — Supabase + React PWA

A production-oriented starter for a Latvian ride-hailing platform with passenger, driver and admin/compliance surfaces. It includes Supabase PostgreSQL migrations, Edge Functions, Stripe Connect split-payment logic, immutable fiscal logs, and a mobile-first React + Tailwind PWA.

## Compliance scope

This implementation encodes the core operational controls required for Latvian taxi / light commercial passenger transport platforms:

- platform registration model for web/mobile service providers;
- only licensed carriers, registered drivers and valid licence-card vehicles may be surfaced;
- online ordering, confirmation, fare calculation, online cashless payment and electronic invoice support;
- EU/NATO data processing location and 5-year data retention model;
- ATD verification gate before drivers go online;
- immutable VID audit snapshots for completed/cancelled rides.

Legal sources to verify before production launch:

- ATD: Tīmekļvietņu vai mobilo lietotņu pakalpojuma sniedzēja reģistrācija — https://www.atd.lv/lv/t%C4%ABmek%C4%BCviet%C5%86u-vai-mobilo-lietot%C5%86u-pakalpojuma-sniedz%C4%93ja-re%C4%A3istr%C4%81cija
- MK Regulation No. 541 — https://likumi.lv/ta/id/310793-noteikumi-par-timeklvietnu-vai-mobilo-lietotnu-pakalpojuma-sniedzejiem-pasazieru-komercparvadajumos-ar-taksometru-un-vieglo
- Autopārvadājumu law updates — https://lvportals.lv/skaidrojumi/362706-papildinatas-prasibas-pasazieru-parvadajumiem-ar-taksometru-un-vieglo-automobili-2024

This repository is not legal, tax, accounting or ATD registration advice. Before operating, review it with a Latvian transport lawyer, accountant and VAT specialist.

## Architecture

```
React PWA (Passenger / Driver / Admin)
        |
        | Supabase JS + Realtime
        v
Supabase EU Project (Frankfurt / eu-central-1 preferred)
        |
        | Edge Functions (Deno TypeScript)
        v
Stripe Connect + PostgreSQL triggers + immutable fiscal logs
```

## Setup

1. Create a Supabase project in the EU region. Select Frankfurt / eu-central-1 where available.
2. Configure the environment:

```bash
cp .env.example .env
```

3. Install dependencies:

```bash
npm install
```

4. Apply migrations:

```bash
supabase db push
```

5. Set Edge Function secrets:

```bash
supabase secrets set SUPABASE_URL=https://YOUR_PROJECT.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
supabase secrets set STRIPE_SECRET_KEY=sk_test_or_live
supabase secrets set PLATFORM_COMMISSION_BPS=2000
supabase secrets set VAT_RATE_BPS=2100
supabase secrets set VAT_MODE=exclusive
```

6. Deploy Edge Functions:

```bash
supabase functions deploy request-ride
supabase functions deploy accept-trip
supabase functions deploy complete-trip
supabase functions deploy set-driver-duty
supabase functions deploy driver-onboarding
supabase functions deploy update-location
supabase functions deploy generate-invoice
```

7. Run the PWA:

```bash
npm run dev
```

## Important production tasks still required

- Replace demo geocoding/routing endpoints with SLA-backed Mapbox/Google/HERE/OSRM infrastructure.
- Add Stripe Elements / PaymentSheet UI and SetupIntent card saving.
- Convert HTML invoice endpoint to PDF with a server-side renderer.
- Add formal ATD/VID export endpoints and data-access audit review.
- Add proper SMS OTP provider configuration in Supabase Auth.
- Add rate limiting and fraud controls around location updates and PaymentIntents.
- Configure backups and retention policies to preserve fiscal logs for at least 5 years.
- Complete GDPR DPIA, privacy policy, DPA/SCC vendor review, and law-enforcement/government request procedure.

## File map

- `supabase/migrations/0001_init.sql` — database, constraints, RLS, immutable fiscal snapshot trigger.
- `supabase/migrations/0002_storage.sql` — private driver documents and invoice buckets.
- `supabase/functions/request-ride` — creates trip and Stripe PaymentIntent hold.
- `supabase/functions/complete-trip` — captures payment, transfers driver share, stores split transaction state.
- `supabase/functions/set-driver-duty` — blocks online status unless verified and unexpired.
- `src/pages/PassengerApp.tsx` — passenger map, quote, ride request, invoices and history.
- `src/pages/DriverApp.tsx` — onboarding, duty status, requests, navigation and earnings ledger.
- `src/pages/AdminApp.tsx` — driver verification and fiscal log inspection.
