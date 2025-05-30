<script lang="ts">
import { onMount } from 'svelte';
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { ChevronLeft, CreditCard, Smartphone } from 'lucide-svelte';

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
  phone: '',
  donationAmount: 0,
  membershipAmount: 0,
  isMembership: false
};

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
  goto(`/donation?${params.toString()}`);
}

function processPayment(method: string) {
  // TODO: Implement actual payment processing
  console.log('Processing payment:', { ...bookingDetails, paymentMethod: method });
  alert(`Payment successful! Your ${bookingDetails.className} class is booked for ${formatDate(bookingDetails.date)} at ${formatTime(bookingDetails.time)}. Thank you for your $${bookingDetails.isMembership ? bookingDetails.membershipAmount : bookingDetails.donationAmount}${bookingDetails.isMembership ? '/month' : ''}!`);
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
    phone: urlParams.get('phone') || '',
    donationAmount: parseFloat(urlParams.get('donationAmount') || '0'),
    membershipAmount: parseFloat(urlParams.get('membershipAmount') || '0'),
    isMembership: urlParams.get('isMembership') === 'true'
  };
});
</script>

<section class="payment-page">
  <!-- Header -->
  <div class="header">
    <div class="header-content">
      <CreditCard size={24} color="#7C3AED" />
      <h1>Payment</h1>
    </div>
  </div>

  <!-- Booking Summary -->
  <div class="booking-summary">
    <h3>{bookingDetails.className}</h3>
    <div class="summary-details">
      <span>{formatDate(bookingDetails.date)} • {formatTime(bookingDetails.time)}</span>
      <span>{bookingDetails.studio}, {bookingDetails.city}</span>
    </div>
    <div class="donation-amount">
      <span class="amount-label">{bookingDetails.isMembership ? 'Membership:' : 'Donation:'}</span>
      <span class="amount-value">${bookingDetails.isMembership ? bookingDetails.membershipAmount : bookingDetails.donationAmount}{bookingDetails.isMembership ? '/month' : ''}</span>
    </div>
  </div>

  <!-- Payment Methods -->
  <div class="payment-methods">
    <h2>Choose Payment Method</h2>
    
    <div class="payment-options">
      <button class="payment-option" on:click={() => processPayment('card')}>
        <CreditCard size={24} color="#7C3AED" />
        <div class="payment-info">
          <span class="payment-title">Credit or Debit Card</span>
          <span class="payment-desc">Visa, Mastercard, American Express</span>
        </div>
      </button>
      
      <button class="payment-option" on:click={() => processPayment('apple-pay')}>
        <Smartphone size={24} color="#7C3AED" />
        <div class="payment-info">
          <span class="payment-title">Apple Pay</span>
          <span class="payment-desc">Quick and secure payment</span>
        </div>
      </button>
      
      <button class="payment-option" on:click={() => processPayment('google-pay')}>
        <Smartphone size={24} color="#7C3AED" />
        <div class="payment-info">
          <span class="payment-title">Google Pay</span>
          <span class="payment-desc">Quick and secure payment</span>
        </div>
      </button>
    </div>
  </div>

  <!-- Navigation -->
  <div class="navigation">
    <button class="back-btn" on:click={goBack}>
      <ChevronLeft size={18} />
      Previous
    </button>
  </div>
</section>

<style>
.payment-page {
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

.booking-summary {
  background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%);
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  color: white;
  text-align: center;
}

.booking-summary h3 {
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
  margin-bottom: 0.75rem;
}

.donation-amount {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.amount-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.amount-value {
  font-size: 1.2rem;
  font-weight: 700;
}

.payment-methods {
  flex: 1;
  margin-bottom: 1rem;
}

.payment-methods h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #000;
  margin: 0 0 1rem 0;
  text-align: center;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.payment-option {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
}

.payment-option:hover {
  border-color: #7C3AED;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.15);
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.payment-title {
  font-size: 1rem;
  font-weight: 600;
  color: #000;
}

.payment-desc {
  font-size: 0.85rem;
  color: #6b7280;
}

.navigation {
  display: flex;
  justify-content: flex-start;
  align-items: center;
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
</style> 