# MVP Validation Campaign — Legal Discovery
## 4-Day Sprint | $15/day | $60 Total

---

## Campaign Goal
Validate product-market fit for the PDF Redaction Auditor by answering:
**Will one person pay $29 to verify their legal document redactions?**

---

## Campaign Settings

| Setting | Value |
|---------|-------|
| **Campaign Type** | Search Network ONLY |
| **Bidding** | Manual CPC (set max $3.50/click) |
| **Daily Budget** | $15 |
| **Location** | United States only |
| **Device** | Desktop only |
| **Schedule** | Weekdays 8am-6pm (lawyers work hours) |

---

## Single Ad Group: Legal Redaction Verification

### Keywords (Exact Match Only)

```
[verify pdf redaction]
[check pdf redaction]
[test pdf redaction]
[pdf redaction failed]
[hidden text under redaction]
[legal document redaction check]
```

### Negative Keywords

```
-free
-online
-how to
-tutorial
-what is
-adobe
-acrobat
-software download
```

---

## Ad Copy

### Headlines
1. `PDF Redaction Audit — Instant`
2. `Hidden Text Under Black Boxes?`
3. `Verify Before You File`

### Descriptions
1. `Court filings expose hidden text under redactions. Scan your PDF in-browser—100% private, no uploads.`
2. `Get a Certified Audit Report for $29. Find ghost text that opposing counsel could copy.`

### Final URL
```
https://audit.reactpdf.app?target=legal
```

### Display Path
```
audit.reactpdf.app/legal/verify
```

---

## Success Criteria

| Metric | Target | If Below |
|--------|--------|----------|
| CTR | >3% | Ad copy problem |
| Upload Rate | >40% | Landing page problem |
| Paywall Show | >70% | Tool/UX problem |
| Payment | ≥1 | **PMF signal** |

---

## Tracking Checklist

- [ ] GA4 events firing: `view_landing_page`, `upload_started`, `paywall_shown`, `purchase_initiated`, `purchase_completed`
- [ ] Google Ads conversion set to `purchase_completed`
- [ ] Test file upload with `debug_analytics` URL param

---

## What Happens After 4 Days

| Outcome | Meaning | Next Step |
|---------|---------|-----------|
| 0 clicks | Keywords wrong | Pause, try finance angle |
| Clicks but 0 uploads | Landing page fails | A/B test headline |
| Uploads but 0 paywall | Tool UX broken | Debug scanner flow |
| Paywall but 0 pay | Price/value mismatch | Test $19 or add testimonials |
| **1+ purchase** | **PMF signal** | Scale to $50/day |
