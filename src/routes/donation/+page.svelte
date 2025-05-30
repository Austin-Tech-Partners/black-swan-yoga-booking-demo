<script lang="ts">
import { onMount } from 'svelte';
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { ChevronLeft, Heart, DollarSign } from 'lucide-svelte';

// Booking and user details from URL params
let bookingDetails = {
  classId: '',
  studio: '',
  city: '',
  date: new Date(),
  className: '',
  instructor: '',
  time: '',
  duration: 0,
  level: '',
  name: '',
  email: '',
  phone: ''
};

let selectedAmount = 20; // Pre-select $20 (recommended)
let customAmount = '';
let showCustomInput = false;
let selectedMembership = false;
let errorMessage = '';

const donationOptions = [
  { amount: 12, label: '$12', description: 'Minimum' },
  { amount: 20, label: '$20', description: 'Supporter', recommended: true },
  { amount: 30, label: '$30', description: 'Generous' }
];

function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  const hour24 = parseInt(hours);
  const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

function selectAmount(amount: number) {
  selectedAmount = amount;
  showCustomInput = false;
  customAmount = '';
  selectedMembership = false;
  errorMessage = '';
}

function selectCustom() {
  showCustomInput = true;
  selectedAmount = 0;
  selectedMembership = false;
  errorMessage = '';
}

function selectMembership() {
  selectedMembership = true;
  selectedAmount = 88; // Set to membership price
  showCustomInput = false;
  customAmount = '';
  errorMessage = '';
}

function handleCustomInput() {
  const amount = parseFloat(customAmount);
  if (amount && amount >= 12) {
    selectedAmount = amount;
    errorMessage = '';
  }
}

function goBack() {
  const params = new URLSearchParams({
    classId: bookingDetails.classId,
    studio: bookingDetails.studio,
    city: bookingDetails.city,
    date: bookingDetails.date.toISOString(),
    className: bookingDetails.className,
    instructor: bookingDetails.instructor,
    time: bookingDetails.time,
    duration: bookingDetails.duration.toString(),
    level: bookingDetails.level,
    name: bookingDetails.name,
    email: bookingDetails.email,
    phone: bookingDetails.phone
  });
  goto(`/waiver?${params.toString()}`);
}

function completeDonation() {
  if (selectedMembership) {
    // Handle membership purchase
    const params = new URLSearchParams({
      classId: bookingDetails.classId,
      studio: bookingDetails.studio,
      city: bookingDetails.city,
      date: bookingDetails.date.toISOString(),
      className: bookingDetails.className,
      instructor: bookingDetails.instructor,
      time: bookingDetails.time,
      duration: bookingDetails.duration.toString(),
      level: bookingDetails.level,
      name: bookingDetails.name,
      email: bookingDetails.email,
      phone: bookingDetails.phone,
      membershipAmount: '88',
      isMembership: 'true'
    });
    goto(`/payment?${params.toString()}`);
    return;
  }

  const finalAmount = showCustomInput ? parseFloat(customAmount) || 0 : selectedAmount;
  
  if (finalAmount < 12) {
    errorMessage = 'Online bookings require a minimum $12 donation';
    return;
  }
  
  errorMessage = '';
  
  // Navigate to payment methods
  const params = new URLSearchParams({
    classId: bookingDetails.classId,
    studio: bookingDetails.studio,
    city: bookingDetails.city,
    date: bookingDetails.date.toISOString(),
    className: bookingDetails.className,
    instructor: bookingDetails.instructor,
    time: bookingDetails.time,
    duration: bookingDetails.duration.toString(),
    level: bookingDetails.level,
    name: bookingDetails.name,
    email: bookingDetails.email,
    phone: bookingDetails.phone,
    donationAmount: finalAmount.toString()
  });
  goto(`/payment?${params.toString()}`);
}

onMount(() => {
  const urlParams = $page.url.searchParams;
  bookingDetails = {
    classId: urlParams.get('classId') || '',
    studio: urlParams.get('studio') || '',
    city: urlParams.get('city') || '',
    date: new Date(urlParams.get('date') || Date.now()),
    className: urlParams.get('className') || '',
    instructor: urlParams.get('instructor') || '',
    time: urlParams.get('time') || '',
    duration: parseInt(urlParams.get('duration') || '0'),
    level: urlParams.get('level') || '',
    name: urlParams.get('name') || '',
    email: urlParams.get('email') || '',
    phone: urlParams.get('phone') || ''
  };
});
</script>

<section class="donation-page">
  <!-- Header -->
  <div class="header">
    <div class="header-content">
      <Heart size={24} color="#7C3AED" />
      <h1>Support Our Community</h1>
    </div>
  </div>

  <!-- Class Summary -->
  <div class="class-summary">
    <h3>{bookingDetails.className}</h3>
    <div class="summary-details">
      <span>{formatDate(bookingDetails.date)} • {formatTime(bookingDetails.time)}</span>
      <span>{bookingDetails.studio}, {bookingDetails.city}</span>
    </div>
  </div>

  <!-- Donation Options - Front and Center -->
  <div class="donation-options">
    <h2>Choose Your Donation</h2>
    
    <div class="amount-grid">
      {#each donationOptions as option}
        <button 
          class="amount-option {selectedAmount === option.amount && !showCustomInput && !selectedMembership ? 'selected' : ''} {option.recommended ? 'most-popular' : ''}"
          on:click={() => selectAmount(option.amount)}
        >
          <span class="amount">{option.label}</span>
          <span class="description">{option.description}</span>
          {#if option.recommended}
            <span class="rec-badge">Most Popular</span>
          {/if}
        </button>
      {/each}
      
      <button 
        class="amount-option custom {showCustomInput ? 'selected' : ''}"
        on:click={selectCustom}
      >
        <span class="amount">Custom</span>
        <span class="description">Your choice</span>
      </button>
    </div>

    <!-- Membership Option -->
    <div class="membership-section">
      <button 
        class="membership-option {selectedMembership ? 'selected' : ''}"
        on:click={selectMembership}
      >
        <div class="membership-header">
          <span class="membership-title">Join Membership</span>
          <span class="membership-price">$88/month</span>
        </div>
        <span class="membership-description">Unlimited classes • Cancel anytime</span>
      </button>
    </div>

    {#if showCustomInput}
      <div class="custom-input-section">
        <label for="custom-amount">Custom Amount</label>
        <div class="input-with-symbol">
          <DollarSign size={18} color="#7C3AED" />
          <input
            id="custom-amount"
            type="number"
            min="12"
            step="1"
            bind:value={customAmount}
            on:input={handleCustomInput}
            placeholder="12"
            class="custom-input"
          />
        </div>
        <p class="min-note">Minimum $12 required for online bookings</p>
      </div>
    {/if}

    {#if errorMessage}
      <div class="error-message">{errorMessage}</div>
    {/if}
  </div>

  <!-- Donation Content -->
  <div class="donation-content">
    <div class="intro-text">
      <p>Black Swan Yoga operates on a donation-based model to make yoga accessible to everyone.</p>
      <p class="note">💡 <strong>Walk-ins welcome!</strong> Choose your own donation amount when you visit in person.</p>
    </div>
  </div>

  <!-- Navigation -->
  <div class="navigation">
    <button class="back-btn" on:click={goBack}>
      <ChevronLeft size={18} />
      Previous
    </button>
    
    <button class="complete-btn" on:click={completeDonation}>
      Continue to Payment
    </button>
  </div>
</section>

<style>
.donation-page {
  max-width: 420px;
  margin: 0 auto;
  padding: 0 1rem 1.5rem 1rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 1rem 0 0.5rem 0;
  margin-bottom: 0.75rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header h1 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #000;
  margin: 0;
}

.class-summary {
  background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%);
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  color: white;
  text-align: center;
}

.class-summary h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
  opacity: 0.9;
}

.donation-options {
  margin-bottom: 1rem;
}

.donation-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.intro-text {
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1rem;
}

.intro-text p {
  font-size: 0.9rem;
  color: #374151;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.intro-text p:last-child {
  margin-bottom: 0;
}

.note {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.85rem !important;
  color: #047857 !important;
}

.donation-options h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #000;
  margin: 0 0 1rem 0;
  text-align: center;
}

.amount-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.amount-option {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.amount-option:hover {
  border-color: #7C3AED;
}

.amount-option.selected {
  border-color: #7C3AED;
  background: #f6f5ff;
}

.amount-option.recommended {
  border-color: #059669;
}

.amount-option.recommended.selected {
  border-color: #7C3AED;
  background: #f6f5ff;
}

.amount {
  font-size: 1.2rem;
  font-weight: 700;
  color: #000;
}

.description {
  font-size: 0.8rem;
  color: #6b7280;
}

.rec-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #059669;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.custom-input-section {
  margin-top: 0.5rem;
}

.custom-input-section label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.input-with-symbol {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-symbol svg {
  position: absolute;
  left: 1rem;
  z-index: 1;
}

.custom-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  color: #000;
  transition: border-color 0.2s;
}

.custom-input:focus {
  outline: none;
  border-color: #7C3AED;
}

.min-note {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0.5rem 0 0 0;
}

.error-message {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
  font-size: 0.85rem;
  text-align: center;
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
}

.back-btn {
  background: white;
  border: 2px solid #e5e7eb;
  color: #7C3AED;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-btn:hover {
  border-color: #7C3AED;
  background: #f6f5ff;
}

.complete-btn {
  background: #7C3AED;
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  transition: background 0.2s;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
}

.complete-btn:hover {
  background: #5B21B6;
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.35);
}

.membership-section {
  margin-top: 0.75rem;
}

.membership-option {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.membership-option:hover {
  border-color: #7C3AED;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.15);
}

.membership-option.selected {
  border-color: #7C3AED;
  background: #f6f5ff;
}

.membership-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.membership-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #000;
}

.membership-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #7C3AED;
}

.membership-description {
  font-size: 0.9rem;
  color: #6b7280;
}
</style> 