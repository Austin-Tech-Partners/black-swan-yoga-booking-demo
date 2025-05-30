<script lang="ts">
import { onMount } from 'svelte';
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { ChevronLeft, MapPin, Clock, User, Calendar } from 'lucide-svelte';

// Booking details from URL params
let bookingDetails = {
  classId: '',
  studio: '',
  city: '',
  date: new Date(),
  className: '',
  instructor: '',
  time: '',
  duration: 0,
  level: ''
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
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function goBack() {
  const params = new URLSearchParams({
    studio: bookingDetails.studio,
    city: bookingDetails.city
  });
  goto(`/schedule?${params.toString()}`);
}

function proceedToCheckout() {
  // Navigate to the booking information collection flow
  const params = new URLSearchParams({
    classId: bookingDetails.classId,
    studio: bookingDetails.studio,
    city: bookingDetails.city,
    date: bookingDetails.date.toISOString(),
    className: bookingDetails.className,
    instructor: bookingDetails.instructor,
    time: bookingDetails.time,
    duration: bookingDetails.duration.toString(),
    level: bookingDetails.level
  });
  goto(`/booking-info?${params.toString()}`);
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
    level: urlParams.get('level') || ''
  };
});
</script>

<section class="booking-review">
  <!-- Header -->
  <div class="header">
    <button class="back-btn" on:click={goBack} aria-label="Go back to schedule">
      <ChevronLeft size={20} />
      Back
    </button>
    <h1>Booking Review</h1>
  </div>

  <!-- Booking Summary Card -->
  <div class="booking-card">
    <div class="class-header">
      <h2 class="class-name">{bookingDetails.className}</h2>
      <div class="class-level">{bookingDetails.level}</div>
    </div>

    <div class="booking-details">
      <div class="detail-row">
        <div class="detail-item">
          <User size={18} color="#7C3AED" />
          <span class="detail-label">Instructor</span>
          <span class="detail-value">{bookingDetails.instructor}</span>
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-item">
          <Calendar size={18} color="#7C3AED" />
          <span class="detail-label">Date</span>
          <span class="detail-value">{formatDate(bookingDetails.date)}</span>
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-item">
          <Clock size={18} color="#7C3AED" />
          <span class="detail-label">Time</span>
          <span class="detail-value">{formatTime(bookingDetails.time)} • {bookingDetails.duration}min</span>
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-item">
          <MapPin size={18} color="#7C3AED" />
          <span class="detail-label">Studio</span>
          <span class="detail-value">{bookingDetails.studio}, {bookingDetails.city}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Continue Button -->
  <div class="action-section">
    <button class="continue-btn" on:click={proceedToCheckout}>
      Finalize Booking in 5 Steps
    </button>
    <p class="signup-note">
      We'll just need a few quick details to complete your reservation.
    </p>
  </div>

  <!-- Login Option -->
  <div class="login-section">
    <p class="login-text">
      Already have an account? 
      <button class="login-link" on:click={() => alert('Coming soon')}>Log in</button> 
      to skip ahead
    </p>
  </div>
</section>

<style>
.booking-review {
  max-width: 420px;
  margin: 0 auto;
  padding: 0 1rem 2rem 1rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem 0;
}

.header h1 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #000;
  margin: 0;
}

.back-btn {
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  color: #7C3AED;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  flex-shrink: 0;
}

.back-btn:hover {
  border-color: #7C3AED;
  background: #f6f5ff;
}

.booking-card {
  background: white;
  border: 2px solid #f3f4f6;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.class-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.class-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: #000;
  margin: 0;
  flex: 1;
}

.class-level {
  background: #ede9fe;
  color: #7C3AED;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

.booking-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-row {
  display: flex;
  align-items: center;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.detail-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  min-width: 80px;
}

.detail-value {
  font-size: 0.9rem;
  color: #000;
  font-weight: 500;
  flex: 1;
}

.action-section {
  text-align: center;
}

.continue-btn {
  width: 100%;
  padding: 1rem 0;
  background: #7C3AED;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 0.75rem;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
}

.continue-btn:hover {
  background: #5B21B6;
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.35);
}

.signup-note {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.login-section {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.login-text {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

.login-link {
  background: none;
  border: none;
  color: #7C3AED;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.login-link:hover {
  color: #5B21B6;
}
</style> 