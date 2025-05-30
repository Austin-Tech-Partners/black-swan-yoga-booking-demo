Screen Guides

---

**1. Home · Find a Class**
**Purpose:** Provide the fastest path to a bookable class by surfacing nearby studios and the next available sessions.
**Entry Points:** "Book a Class" CTA on homepage; app icon tap for returning users.
**Key UI Components:**

* Location selector with geolocation default; studio cards show distance and capacity bar
* Date picker defaulted to Today
* Class list grouped by time; each item shows style, teacher photo, heat level, remaining spots
* Filter drawer for style, teacher, temperature, membership-only classes
  **User Actions:** Choose studio; filter or scroll; tap a class to continue
  **Edge Cases:** No classes available today prompts switch date; GPS blocked shows manual location selector

---

**2. Class Details**
**Purpose:** Give context so first-timers feel confident and regulars can confirm it fits their goal.
**Key UI Components:**

* Hero with class name, style tag, teacher bio snippet
* Quick facts chips: Heat 90°F, Difficulty All Levels, Bring Mat, Water, Towel
* Donation summary: Suggested \$15–\$20; minimum \$12 to reserve
* Reserve button; link to full teacher profile
  **Edge Cases:** Class full shows "Full" badge and disables Reserve

---

**3. Donation and Upsell**
**Purpose:** Capture payment commitment and introduce membership value without pressure.
**Key UI Components:**

* Preset buttons: \$12, \$15, \$20, \$25, Other
* Slider reveals for custom amount over minimum
* Membership card: Unlimited classes + merch/workshop discount for \$98/month, saves money at 4+ visits/week
* Continue button disabled until amount or membership selected
  **Edge Cases:** Amount below \$12 shows inline error; selecting membership hides donation presets

---

**4. Waiver and Policy**
**Purpose:** Cover legal consent and set expectations on refunds and late entry.
**Key UI Components:**

* Single scroll card with yoga liability waiver
* Line: "Early sign-ups do not guarantee a mat; missed class forfeits donation"
* Checkbox: "I Agree"; Continue button
  **Edge Cases:** Must scroll to bottom before "Agree" is enabled

---

**5. Payment**
**Purpose:** Finish transaction in one tap.
**Key UI Components:**

* Apple Pay or stored card shown at top
* Add new card form collapsible
* Summary line: Donation amount or Membership \$98
* "Pay and Reserve" button
  **Edge Cases:** Card declined triggers inline retry; Apple Pay not available shows card form first

---

**6. Confirmation**
**Purpose:** Reassure user and add next steps.
**Key UI Components:**

* Checkmark animation with class date, time, location
* Add to Calendar; View Directions; Share with Friend
* Reminder chips: Arrive 10 minutes early; parking tips; bring mat
* CTA: "Join Membership" if paid single class

---

**7. Account Dashboard**
**Purpose:** Central hub for upcoming classes, past visits, membership status.
**Entry Points:** Auto redirect post-login; persistent "Account" tab
**Key UI Components:**

* Next Class card with cancel button
* History list collapsible by month
* Membership panel shows plan details, renewal date, cancel link
* Payment methods and personal info editors
  **Edge Cases:** No upcoming classes shows "Book Now" card; no membership shows "Join" card

---

**8. Sign In · Sign Up**
**Purpose:** Seamless entry for new and returning yogis.
**Entry Points:** Triggered during reserve flow if not signed in; "Account" tab tap
**Key UI Components:**

* Email input (magic link default); password option under "Need Password" link
* Social login buttons (optional)
* "Continue to Booking" button maintains chosen class context
  **Edge Cases:** Duplicate email during sign-up prompts Sign In; expired magic link prompts resend

---

**Design Principles Reference**

* Everything reachable in 30 seconds from open to confirmation
* Positive, inclusive language at each step; no jargon
* Clear donation guidance but zero guilt
* Minimal typing; reuse stored data
* Live class capacity syncing every 5 seconds
