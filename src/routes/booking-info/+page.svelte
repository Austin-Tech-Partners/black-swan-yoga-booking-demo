<script lang="ts">
import { onMount } from 'svelte';
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-svelte';

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

// Form state
let currentStep = 1;
const totalSteps = 5;
let formData = {
  name: '',
  birthday: '',
  email: '',
  phone: '',
  password: ''
};

// Date picker state
let selectedMonth = '';
let selectedDay = '';
let selectedYear = '';

// Form validation
let errors = {
  name: '',
  birthday: '',
  email: '',
  phone: '',
  password: ''
};

const stepTitles = [
  'What should we call you?',
  'When\'s your birthday?',
  'What\'s your email?',
  'What\'s your phone number?',
  'Secure your account'
];

const stepSubtitles = [
  'We\'ll let your instructor know who you are',
  'We need this for age verification and special birthday offers',
  'We\'ll send your booking confirmation here',
  'For class updates and important notifications',
  'Create a password to easily book future classes'
];

const months = [
  { value: '01', name: 'January' },
  { value: '02', name: 'February' },
  { value: '03', name: 'March' },
  { value: '04', name: 'April' },
  { value: '05', name: 'May' },
  { value: '06', name: 'June' },
  { value: '07', name: 'July' },
  { value: '08', name: 'August' },
  { value: '09', name: 'September' },
  { value: '10', name: 'October' },
  { value: '11', name: 'November' },
  { value: '12', name: 'December' }
];

function generateYears() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= currentYear - 100; year--) {
    years.push(year.toString());
  }
  return years;
}

function getDaysInMonth(month: string) {
  if (!month) return [];
  
  const daysInMonths: { [key: string]: number } = {
    '01': 31, // January
    '02': 29, // February (assume leap year)
    '03': 31, // March
    '04': 30, // April
    '05': 31, // May
    '06': 30, // June
    '07': 31, // July
    '08': 31, // August
    '09': 30, // September
    '10': 31, // October
    '11': 30, // November
    '12': 31  // December
  };
  
  const daysCount = daysInMonths[month] || 31;
  const days = [];
  for (let day = 1; day <= daysCount; day++) {
    days.push(day.toString().padStart(2, '0'));
  }
  return days;
}

function updateBirthday() {
  if (selectedMonth && selectedDay && selectedYear) {
    formData.birthday = `${selectedYear}-${selectedMonth}-${selectedDay}`;
  } else {
    formData.birthday = '';
  }
}

$: if (selectedMonth && selectedDay && selectedYear) {
  updateBirthday();
}

function validateCurrentStep(): boolean {
  errors = { name: '', birthday: '', email: '', phone: '', password: '' };
  
  switch (currentStep) {
    case 1:
      if (!formData.name.trim()) {
        errors.name = 'Please enter your name';
        return false;
      }
      if (formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
        return false;
      }
      break;
      
    case 2:
      if (!formData.birthday) {
        errors.birthday = 'Please enter your birthday';
        return false;
      }
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      
      // Adjust age if birthday hasn't occurred this year
      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      
      if (actualAge < 13) {
        errors.birthday = 'You must be at least 13 years old to book classes';
        return false;
      }
      if (actualAge > 120 || birthDate > today) {
        errors.birthday = 'Please enter a valid birth date';
        return false;
      }
      break;
      
    case 3:
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        errors.email = 'Please enter your email';
        return false;
      }
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
        return false;
      }
      break;
      
    case 4:
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (!formData.phone.trim()) {
        errors.phone = 'Please enter your phone number';
        return false;
      }
      if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
        errors.phone = 'Please enter a valid phone number';
        return false;
      }
      break;
      
    case 5:
      if (!formData.password) {
        errors.password = 'Please create a password';
        return false;
      }
      if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
        return false;
      }
      break;
  }
  
  return true;
}

function nextStep() {
  if (!validateCurrentStep()) return;
  
  if (currentStep < totalSteps) {
    currentStep++;
  } else {
    completeBooking();
  }
}

function prevStep() {
  if (currentStep === 1) {
    // Go back to booking review
    goBack();
  } else {
    currentStep--;
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
    level: bookingDetails.level
  });
  goto(`/booking-review?${params.toString()}`);
}

function completeBooking() {
  // Navigate to waiver signing
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
    name: formData.name,
    email: formData.email,
    phone: formData.phone
  });
  goto(`/waiver?${params.toString()}`);
}

function formatPhoneNumber(value: string) {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
}

function handlePhoneInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const formatted = formatPhoneNumber(target.value);
  formData.phone = formatted;
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

<section class="booking-info">
  <!-- Header -->
  <div class="header">
    <div class="progress-container">
      <span class="progress-text">Step {currentStep} of {totalSteps}</span>
      <div class="progress-bar">
        <div class="progress-fill" style="width: {(currentStep / totalSteps) * 100}%"></div>
      </div>
    </div>
  </div>

  <!-- Step Content -->
  <div class="step-content">
    <div class="step-header">
      <h1>{stepTitles[currentStep - 1]}</h1>
      <p class="step-subtitle">{stepSubtitles[currentStep - 1]}</p>
    </div>

    <div class="form-container">
      {#if currentStep === 1}
        <div class="input-group">
          <label for="name">Full Name</label>
          <input
            id="name"
            type="text"
            bind:value={formData.name}
            placeholder="Enter your full name"
            class="form-input {errors.name ? 'error' : ''}"
            autocomplete="name"
          />
          {#if errors.name}
            <span class="error-message">{errors.name}</span>
          {/if}
        </div>
      {/if}

      {#if currentStep === 2}
        <div class="input-group">
          <label for="birthday">Birthday</label>
          <div class="date-picker">
            <select 
              bind:value={selectedMonth} 
              class="date-select {errors.birthday ? 'error' : ''}"
              on:change={() => selectedDay = ''}
            >
              <option value="">Month</option>
              {#each months as month}
                <option value={month.value}>{month.name}</option>
              {/each}
            </select>
            
            <select 
              bind:value={selectedDay} 
              class="date-select {errors.birthday ? 'error' : ''}"
              disabled={!selectedMonth}
            >
              <option value="">Day</option>
              {#each getDaysInMonth(selectedMonth) as day}
                <option value={day}>{parseInt(day)}</option>
              {/each}
            </select>
            
            <select 
              bind:value={selectedYear} 
              class="date-select {errors.birthday ? 'error' : ''}"
            >
              <option value="">Year</option>
              {#each generateYears() as year}
                <option value={year}>{year}</option>
              {/each}
            </select>
          </div>
          {#if errors.birthday}
            <span class="error-message">{errors.birthday}</span>
          {/if}
        </div>
      {/if}

      {#if currentStep === 3}
        <div class="input-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            type="email"
            bind:value={formData.email}
            placeholder="your@email.com"
            class="form-input {errors.email ? 'error' : ''}"
            autocomplete="email"
          />
          {#if errors.email}
            <span class="error-message">{errors.email}</span>
          {/if}
        </div>
      {/if}

      {#if currentStep === 4}
        <div class="input-group">
          <label for="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            bind:value={formData.phone}
            on:input={handlePhoneInput}
            placeholder="(555) 123-4567"
            class="form-input {errors.phone ? 'error' : ''}"
            autocomplete="tel"
          />
          {#if errors.phone}
            <span class="error-message">{errors.phone}</span>
          {/if}
        </div>
      {/if}

      {#if currentStep === 5}
        <div class="input-group">
          <label for="password">Create Password</label>
          <input
            id="password"
            type="password"
            bind:value={formData.password}
            placeholder="Minimum 8 characters"
            class="form-input {errors.password ? 'error' : ''}"
            autocomplete="new-password"
          />
          {#if errors.password}
            <span class="error-message">{errors.password}</span>
          {/if}
          <!-- <div class="account-reveal">
            <h3>Almost done! 🎉</h3>
            <p>We're creating your Black Swan Yoga account so you can easily book future classes, track your progress, and manage your bookings.</p>
          </div> -->
        </div>
      {/if}
    </div>

    <!-- Navigation -->
    <div class="step-navigation">
      <button class="prev-btn" on:click={prevStep}>
        <ChevronLeft size={18} />
        Previous
      </button>
      
      <button class="next-btn" on:click={nextStep}>
        {currentStep === totalSteps ? 'Continue to Waiver' : 'Continue'}
        {#if currentStep < totalSteps}
          <ChevronRight size={18} />
        {/if}
      </button>
    </div>

    <!-- Login Option -->
    <div class="login-section">
      <p class="login-text">
        Already have an account? 
        <button class="login-link" on:click={() => alert('Coming soon')}>Log in</button> 
        to skip ahead
      </p>
    </div>
  </div>
</section>

<style>
.booking-info {
  max-width: 420px;
  margin: 0 auto;
  padding: 0 1rem 2rem 1rem;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem 0;
}

.progress-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #7C3AED;
  text-align: center;
}

.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #7C3AED, #5B21B6);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
}

.step-header {
  text-align: center;
}

.step-header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #000;
  margin: 0 0 0.5rem 0;
}

.step-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.form-input {
  padding: 1rem;
  font-size: 1.1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  color: #000;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #7C3AED;
}

.form-input.error {
  border-color: #dc2626;
}

.error-message {
  font-size: 0.85rem;
  color: #dc2626;
  margin-top: 0.25rem;
}

.date-picker {
  display: flex;
  gap: 0.5rem;
}

.date-select {
  flex: 1;
  padding: 0.75rem 0.5rem;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  color: #000;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.2em 1.2em;
  padding-right: 2rem;
  min-width: 0;
}

.date-select:focus {
  outline: none;
  border-color: #7C3AED;
}

.date-select.error {
  border-color: #dc2626;
}

.date-select:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.account-reveal {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: #f0fdf4;
  border: 2px solid #bbf7d0;
  border-radius: 0.75rem;
  text-align: center;
}

.account-reveal h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #065f46;
  margin: 0 0 0.5rem 0;
}

.account-reveal p {
  font-size: 0.9rem;
  color: #047857;
  margin: 0;
  line-height: 1.4;
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.prev-btn {
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

.prev-btn:hover {
  border-color: #7C3AED;
  background: #f6f5ff;
}

.next-btn {
  background: #7C3AED;
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
}

.next-btn:hover {
  background: #5B21B6;
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.35);
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