<script lang="ts">
import { onMount } from 'svelte';
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-svelte';

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

let agreed = false;
let errorMessage = '';

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
    level: bookingDetails.level
  });
  goto(`/booking-info?${params.toString()}`);
}

function proceedToDonation() {
  if (!agreed) {
    errorMessage = 'Please agree to the waiver to continue';
    return;
  }
  
  errorMessage = '';
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

<section class="waiver-page">
  <!-- Header -->
  <div class="header">
    <div class="header-content">
      <FileText size={24} color="#7C3AED" />
      <h1>Liability Waiver</h1>
    </div>
  </div>

  <!-- Waiver Content -->
  <div class="waiver-content">
    <div class="waiver-text">
      <h2>Release of Liability and Assumption of Risk</h2>
      
      <p>I understand that yoga, fitness, and wellness activities involve inherent risks of injury. I voluntarily participate in classes and activities offered by Black Swan Yoga with full knowledge of the dangers involved.</p>
      
      <p><strong>I hereby agree to:</strong></p>
      <ul>
        <li>Assume all risks of injury, illness, or damage</li>
        <li>Release Black Swan Yoga from any liability for injury or damage</li>
        <li>Follow all safety guidelines and instructor directions</li>
        <li>Inform instructors of any physical limitations or injuries</li>
        <li>Take responsibility for my own safety and well-being</li>
      </ul>
      
      <p>I understand that I should consult a physician before participating if I have any concerns about my physical condition. I acknowledge that I am in good physical condition and able to participate in yoga activities.</p>
      
      <p><strong>By signing below, I agree to this waiver and acknowledge that I have read and understood its terms.</strong></p>
    </div>

    <!-- Agreement Section -->
    <div class="agreement-section">
      <label class="agreement-checkbox">
        <input 
          type="checkbox" 
          bind:checked={agreed}
          on:change={() => errorMessage = ''}
        />
        <span class="checkmark"></span>
        <span class="agreement-text">
          I have read and agree to the liability waiver and release of claims. I understand the risks involved and voluntarily assume them.
        </span>
      </label>
      
      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}
    </div>
  </div>

  <!-- Navigation -->
  <div class="navigation">
    <button class="back-btn" on:click={goBack}>
      <ChevronLeft size={18} />
      Previous
    </button>
    
    <button class="continue-btn {agreed ? '' : 'disabled'}" on:click={proceedToDonation}>
      Continue to Donation
      <ChevronRight size={18} />
    </button>
  </div>
</section>

<style>
.waiver-page {
  max-width: 420px;
  margin: 0 auto;
  padding: 0 1rem 2rem 1rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 1.5rem 0 1rem 0;
  margin-bottom: 1rem;
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

.waiver-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.waiver-text {
  background: white;
  border: 2px solid #f3f4f6;
  border-radius: 1rem;
  padding: 1.5rem;
  line-height: 1.6;
  max-height: 400px;
  overflow-y: auto;
}

.waiver-text h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #000;
  margin: 0 0 1rem 0;
}

.waiver-text p {
  font-size: 0.9rem;
  color: #374151;
  margin: 0 0 1rem 0;
}

.waiver-text ul {
  margin: 0 0 1rem 1.5rem;
  padding: 0;
}

.waiver-text li {
  font-size: 0.9rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.waiver-text strong {
  color: #000;
  font-weight: 600;
}

.agreement-section {
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.25rem;
}

.agreement-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  line-height: 1.5;
}

.agreement-checkbox input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.1rem;
  transition: all 0.2s;
}

.agreement-checkbox input[type="checkbox"]:checked + .checkmark {
  background: #7C3AED;
  border-color: #7C3AED;
}

.agreement-checkbox input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}

.agreement-text {
  font-size: 0.9rem;
  color: #374151;
  flex: 1;
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
  margin-top: 1.5rem;
  padding-top: 1rem;
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

.continue-btn {
  background: #7C3AED;
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
}

.continue-btn:hover:not(.disabled) {
  background: #5B21B6;
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.35);
}

.continue-btn.disabled {
  background: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
}
</style> 