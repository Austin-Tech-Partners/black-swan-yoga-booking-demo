<script lang="ts">
import { onMount } from 'svelte';
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { Clock, User, ChevronLeft, ChevronRight, Calendar, ChevronDown, ChevronUp } from 'lucide-svelte';

// Get studio info from URL params
let selectedStudio = '';
let selectedCity = '';

// Date selector state
let selectedDate = new Date(); // Default to today
let showDatePicker = false;
let scrollContainer: HTMLDivElement;
let calendarMonth = new Date(); // For calendar navigation
let loadingClasses = false; // Loading state for classes
let expandedClasses = new Set(); // Track which classes are expanded

// Mock class data
interface YogaClass {
  id: string;
  instructor: string;
  time: string;
  duration: number;
  type: string;
  level: string;
  spotsLeft: number;
  totalSpots: number;
  description: string;
  instructorBio: string;
}

const mockClasses: YogaClass[] = [
  { 
    id: '1', 
    instructor: 'Sarah Chen', 
    time: '08:00', 
    duration: 60, 
    type: 'Flow', 
    level: 'All Levels', 
    spotsLeft: 3, 
    totalSpots: 20,
    description: 'Flow yoga is our signature class. This is a great class for all levels of people to enjoy. It is a style of yoga that strengthens and stretches the entire body with an emphasis on the power and importance of your breath. It\'s a great class to begin with!',
    instructorBio: 'Sarah is a certified 500-hour instructor with over 8 years of teaching experience. She specializes in breath work and alignment, bringing a calm and grounding presence to every class.'
  },
  { 
    id: '2', 
    instructor: 'Marcus Johnson', 
    time: '09:30', 
    duration: 75, 
    type: 'Power Flow', 
    level: 'Advanced', 
    spotsLeft: 8, 
    totalSpots: 25,
    description: 'Our strongest yoga class. Explore your physical edge with power yoga! This is a vinyasa flow class at the next level. Teachers offer a strong, advanced practice that can up level your body and mind. During this class, you might learn new poses such as arm balances and inversions, or maybe you will hold the poses for a longer amount of time. Expect to sweat, be challenged, and grow.',
    instructorBio: 'Marcus brings 10+ years of athletic training and yoga practice to his teaching. Former college athlete turned yogi, he loves helping students discover their strength and push their limits safely.'
  },
  { 
    id: '3', 
    instructor: 'Elena Rodriguez', 
    time: '11:00', 
    duration: 60, 
    type: 'Beginner Flow', 
    level: 'Beginner', 
    spotsLeft: 12, 
    totalSpots: 18,
    description: 'This class is for people seeking the foundations of yoga, refinement of the practice, as well as anyone who is new to yoga. This is a great class to learn pose alignment and ensure you\'re practicing safely for your body. Beginner classes are not necessarily easy. This class is empowering and educational.',
    instructorBio: 'Elena has been teaching for 6 years and has a passion for making yoga accessible to everyone. She holds additional certifications in trauma-informed yoga and loves working with new students.'
  },
  { 
    id: '4', 
    instructor: 'David Park', 
    time: '12:30', 
    duration: 45, 
    type: 'Flow', 
    level: 'All Levels', 
    spotsLeft: 5, 
    totalSpots: 15,
    description: 'Flow yoga is our signature class. This is a great class for all levels of people to enjoy. It is a style of yoga that strengthens and stretches the entire body with an emphasis on the power and importance of your breath. Perfect for your lunch break!',
    instructorBio: 'David is known for his uplifting energy and creative sequences. With 7 years of teaching experience, he loves helping busy professionals find balance through their yoga practice.'
  },
  { 
    id: '5', 
    instructor: 'Ava Thompson', 
    time: '17:30', 
    duration: 60, 
    type: 'Hot Onnit', 
    level: 'All Levels', 
    spotsLeft: 7, 
    totalSpots: 22,
    description: 'Fitness, mindful movement and yoga all included. This is our fitness class that is rooted in the movement principles taught at Onnit Academy. You might experience exercises that incorporate kettlebells, the steel mace or just your body weight. Cool down with some yoga and enjoy the empowering experience. Leave feeling STRONG!',
    instructorBio: 'Ava is a certified Onnit coach and 200-hour yoga instructor. She combines her background in functional fitness with mindful movement to create empowering, strength-building classes.'
  },
  { 
    id: '6', 
    instructor: 'Jordan Lee', 
    time: '18:00', 
    duration: 90, 
    type: 'Ashtanga', 
    level: 'Intermediate', 
    spotsLeft: 4, 
    totalSpots: 16,
    description: 'Ashtanga Yoga is a traditional practice. The set sequence of poses includes many Sun Salutations. This series of poses offer a challenging and foundational practice to build upper body and core strength. This practice is the first form of "flow" yoga. Join this class to develop a solid base of strength and body/breath connection, while honoring yoga\'s roots.',
    instructorBio: 'Jordan has been practicing Ashtanga for over 12 years and teaching for 8. They studied with traditional teachers in Mysore, India, and bring authentic Ashtanga instruction to students of all levels.'
  },
  { 
    id: '7', 
    instructor: 'Maya Patel', 
    time: '19:30', 
    duration: 75, 
    type: 'Candlelight Slow Flow', 
    level: 'All Levels', 
    spotsLeft: 15, 
    totalSpots: 20,
    description: 'This class is a heated slow flow in which you will experience a chill vibe in order to wind down before bedtime. Enjoy a slower practice with added deep stretching. Plus, the ambiance of candlelight at night will add an extra bonus to your practice. We will see you on your mat for candlelight soon!',
    instructorBio: 'Maya creates magical experiences through her candlelight classes. With 9 years of teaching experience, she specializes in restorative practices and believes in the healing power of gentle movement.'
  }
];

// Generate date options that ensure selected date is always visible
function getDateOptions() {
  const today = new Date();
  const selected = selectedDate || today;
  
  // Start from either today or 7 days before selected date, whichever is later
  const startDate = new Date(Math.max(today.getTime(), selected.getTime() - (7 * 24 * 60 * 60 * 1000)));
  
  return Array.from({ length: 14 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });
}

// Update dateOptions to be reactive
$: dateOptions = getDateOptions();

function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  const hour24 = parseInt(hours);
  const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
}

function selectClass(classItem: YogaClass) {
  // Navigate to booking review with class, studio, and date info
  const params = new URLSearchParams({
    classId: classItem.id,
    studio: selectedStudio,
    city: selectedCity,
    date: selectedDate.toISOString(),
    className: classItem.type,
    instructor: classItem.instructor,
    time: classItem.time,
    duration: classItem.duration.toString(),
    level: classItem.level
  });
  goto(`/booking-review?${params.toString()}`);
}

function selectDate(date: Date) {
  if (selectedDate.toDateString() === date.toDateString()) return; // Don't reload if same date
  
  selectedDate = date;
  showDatePicker = false;
  
  // Simulate loading classes for the new date
  loadingClasses = true;
  setTimeout(() => {
    loadingClasses = false;
  }, 100);
}

function scrollLeft() {
  if (scrollContainer) {
    scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
  }
}

function scrollRight() {
  if (scrollContainer) {
    scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
  }
}

function isToday(date: Date) {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function getDateDisplayText(date: Date) {
  if (isToday(date)) {
    return `Today, ${date.getDate()}`;
  }
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

function goBack() {
  goto('/select-studio');
}

// Calendar functions
function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }
  
  return days;
}

function navigateMonth(direction: number) {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + direction, 1);
}

function selectDateFromCalendar(date: Date) {
  if (selectedDate.toDateString() === date.toDateString()) {
    showDatePicker = false;
    return; // Don't reload if same date
  }
  
  selectedDate = date;
  showDatePicker = false;
  
  // Simulate loading classes for the new date
  loadingClasses = true;
  setTimeout(() => {
    loadingClasses = false;
  }, 100);
  
  // Update the horizontal date scroll to show the selected date
  setTimeout(() => {
    if (scrollContainer) {
      const selectedElement = scrollContainer.querySelector('.date-option.selected');
      if (selectedElement) {
        selectedElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest', 
          inline: 'center' 
        });
      }
    }
  }, 150); // Slight delay to account for loading
}

function isSelectedDate(date: Date) {
  return selectedDate.toDateString() === date.toDateString();
}

function isPastDate(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

// Toggle expanded state for class details
function toggleClassDetails(classId: string) {
  if (expandedClasses.has(classId)) {
    expandedClasses.delete(classId);
  } else {
    expandedClasses.add(classId);
  }
  expandedClasses = expandedClasses; // Trigger reactivity
}

onMount(() => {
  selectedStudio = $page.url.searchParams.get('studio') || 'Studio';
  selectedCity = $page.url.searchParams.get('city') || '';
  calendarMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
});
</script>

<section class="schedule-page">
  <!-- Compact Header with back button and studio info in same row -->
  <div class="header">
    <button class="back-btn" on:click={goBack} aria-label="Go back to studio selection">
      <ChevronLeft size={20} />
      Back
    </button>
    <div class="studio-info">
      <h1 class="studio-name">{selectedStudio}</h1>
      <span class="city-name">{selectedCity}</span>
    </div>
  </div>

  <!-- Compact Date Selector -->
  <div class="date-selector">
    <div class="date-selector-header">
      <h2>Select Date</h2>
      <button 
        class="calendar-btn"
        on:click={() => showDatePicker = !showDatePicker}
        aria-label="Open calendar"
      >
        <Calendar size={16} />
        Calendar
      </button>
    </div>
    
    <!-- Horizontal Date Scroll -->
    <div class="date-scroll-container">
      <button class="scroll-btn" on:click={scrollLeft} aria-label="Scroll left">
        <ChevronLeft size={18} />
      </button>
      
      <div class="date-scroll" bind:this={scrollContainer}>
        {#each dateOptions as date}
          <button 
            class="date-option {selectedDate.toDateString() === date.toDateString() ? 'selected' : ''} {isToday(date) ? 'today' : ''}"
            on:click={() => selectDate(date)}
          >
            <span class="day">{date.getDate()}</span>
            <span class="weekday">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
          </button>
        {/each}
      </div>
      
      <button class="scroll-btn" on:click={scrollRight} aria-label="Scroll right">
        <ChevronRight size={18} />
      </button>
    </div>
    
    <!-- Selected Date Display -->
    <div class="selected-date-display">
      <span class="selected-date-text">{getDateDisplayText(selectedDate)}</span>
    </div>
    
    <!-- Calendar Modal -->
    {#if showDatePicker}
      <div class="calendar-modal" on:click={() => showDatePicker = false}>
        <div class="calendar-content" on:click|stopPropagation>
          <div class="calendar-header">
            <button class="nav-btn" on:click={() => navigateMonth(-1)}>
              <ChevronLeft size={20} />
            </button>
            <h3>{calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
            <button class="nav-btn" on:click={() => navigateMonth(1)}>
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div class="calendar-grid">
            <div class="weekday-header">Sun</div>
            <div class="weekday-header">Mon</div>
            <div class="weekday-header">Tue</div>
            <div class="weekday-header">Wed</div>
            <div class="weekday-header">Thu</div>
            <div class="weekday-header">Fri</div>
            <div class="weekday-header">Sat</div>
            
            {#each getDaysInMonth(calendarMonth) as day}
              {#if day}
                <button 
                  class="calendar-day {isSelectedDate(day) ? 'selected' : ''} {isToday(day) ? 'today' : ''}"
                  on:click={() => selectDateFromCalendar(day)}
                  disabled={isPastDate(day)}
                >
                  {day.getDate()}
                </button>
              {:else}
                <div class="calendar-day empty"></div>
              {/if}
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Class List -->
  <div class="class-list">
    <h2>Available Classes</h2>
    {#if loadingClasses}
      <!-- Loading skeleton -->
      {#each Array(3) as _, i}
        <div class="class-card loading">
          <div class="class-main-info">
            <div class="class-header">
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton skeleton-badge"></div>
            </div>
            <div class="class-details">
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text"></div>
            </div>
            <div class="skeleton skeleton-small"></div>
          </div>
          <div class="class-availability">
            <div class="skeleton skeleton-small"></div>
            <div class="skeleton skeleton-button"></div>
          </div>
        </div>
      {/each}
    {:else}
      {#each mockClasses as yogaClass}
        <div class="class-card">
          <div class="class-main-info">
            <div class="class-header">
              <h3>{yogaClass.type}</h3>
            </div>
            <div class="class-details">
              <div class="detail-item">
                <User size={16} color="#666" />
                <span>{yogaClass.instructor}</span>
              </div>
              <div class="detail-item">
                <Clock size={16} color="#666" />
                <span>{formatTime(yogaClass.time)} • {yogaClass.duration}min</span>
              </div>
            </div>
            <div class="class-level-row">
              <div class="class-level">{yogaClass.level}</div>
              <button 
                class="more-details-btn"
                on:click={() => toggleClassDetails(yogaClass.id)}
                aria-label="More details"
              >
                {expandedClasses.has(yogaClass.id) ? 'Less Details' : 'More Details'}
                {#if expandedClasses.has(yogaClass.id)}
                  <ChevronUp size={14} />
                {:else}
                  <ChevronDown size={14} />
                {/if}
              </button>
            </div>
            
            {#if expandedClasses.has(yogaClass.id)}
              <div class="expanded-details">
                <div class="class-description">
                  <h4>About This Class</h4>
                  <p>{yogaClass.description}</p>
                </div>
                <div class="instructor-bio">
                  <h4>About {yogaClass.instructor}</h4>
                  <p>{yogaClass.instructorBio}</p>
                </div>
              </div>
            {/if}
          </div>
          <div class="class-availability">
            <div class="spots-info">
              <span class="spots-left {yogaClass.spotsLeft <= 3 ? 'low' : ''}">{yogaClass.spotsLeft} spots left</span>
              <span class="spots-separator">of</span>
              <span class="total-spots">{yogaClass.totalSpots}</span>
            </div>
            <button class="book-btn" on:click={() => selectClass(yogaClass)}>Book</button>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</section>

<style>
.schedule-page {
  max-width: 420px;
  margin: 0 auto;
  padding: 0 1rem 2rem 1rem;
}

.header {
  background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%);
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  color: white;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 0.9rem;
  color: white;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  flex-shrink: 0;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.studio-info {
  margin-left: 1rem;
}

.studio-name {
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
  line-height: 1.1;
  color: white;
}

.city-name {
  font-size: 0.85rem;
  opacity: 0.9;
  color: white;
  font-weight: 500;
}

.date-selector {
  margin-bottom: 1.5rem;
}

.date-selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.date-selector h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #000;
  margin: 0;
}

.calendar-btn {
  background: white;
  border: 2px solid #e5e7eb;
  color: #7C3AED;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.calendar-btn:hover {
  border-color: #7C3AED;
  background: #f6f5ff;
}

.date-scroll-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.scroll-btn {
  background: white;
  border: 2px solid #e5e7eb;
  color: #7C3AED;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
}

.scroll-btn:hover {
  border-color: #7C3AED;
  background: #f6f5ff;
}

.date-scroll {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.25rem 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex: 1;
}

.date-scroll::-webkit-scrollbar {
  display: none;
}

.date-option {
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  min-width: 60px;
  flex-shrink: 0;
}

.date-option:hover {
  border-color: #7C3AED;
}

.date-option.selected {
  background: #7C3AED;
  border-color: #7C3AED;
  color: white;
}

.date-option.today:not(.selected) {
  background: #f3f4ff;
  border-color: #7C3AED;
}

.date-option .day {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.1rem;
}

.date-option .weekday {
  display: block;
  font-size: 0.7rem;
  opacity: 0.8;
}

.selected-date-display {
  text-align: center;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.selected-date-text {
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
}

.calendar-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.calendar-content {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 1rem;
  max-width: 400px;
  width: 100%;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
}

.nav-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.weekday-header {
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #666;
}

.calendar-day {
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  min-width: 40px;
  height: 40px;
}

.calendar-day:hover {
  border-color: #7C3AED;
}

.calendar-day.selected {
  background: #7C3AED;
  border-color: #7C3AED;
  color: white;
}

.calendar-day.today:not(.selected) {
  background: #f3f4ff;
  border-color: #7C3AED;
}

.calendar-day.empty {
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.5rem;
  cursor: default;
  min-width: 40px;
  height: 40px;
}

.class-list h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #000;
  margin: 0 0 1rem 0;
}

.class-card {
  background: white;
  border: 2px solid #f3f4f6;
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
  font: inherit;
  outline: none;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.class-card:hover {
  border-color: #7C3AED;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
  transform: translateY(-1px);
}

.class-main-info {
  flex: 1;
  min-width: 0;
  width: 100%;
}

.class-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  width: 100%;
}

.class-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #000;
  margin: 0;
}

.more-details-btn {
  background: none;
  border: none;
  color: #7C3AED;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.more-details-btn:hover {
  background: #f6f5ff;
}

.class-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  width: 100%;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #666;
}

.class-level-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  width: 100%;
  gap: 1rem;
  min-width: 0;
}

.class-level {
  background: #ede9fe;
  color: #7C3AED;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.expanded-details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  width: 100%;
}

.class-description,
.instructor-bio {
  margin-bottom: 1rem;
}

.class-description:last-child,
.instructor-bio:last-child {
  margin-bottom: 0;
}

.expanded-details h4 {
  font-size: 0.9rem;
  font-weight: 700;
  color: #000;
  margin: 0 0 0.5rem 0;
  width: 100%;
}

.expanded-details p {
  font-size: 0.85rem;
  line-height: 1.5;
  color: #555;
  margin: 0;
  width: 100%;
}

.class-availability {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.spots-info {
  text-align: right;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.spots-left {
  font-size: 0.85rem;
  font-weight: 600;
  color: #059669;
}

.spots-left.low {
  color: #dc2626;
}

.spots-separator {
  font-size: 0.75rem;
  color: #9ca3af;
}

.total-spots {
  font-size: 0.75rem;
  color: #9ca3af;
}

.book-btn {
  background: #7C3AED;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.book-btn:hover {
  background: #5B21B6;
}

.class-card.loading {
  pointer-events: none;
  cursor: default;
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 0.25rem;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-title {
  height: 1.2rem;
  width: 60%;
  margin-bottom: 0.25rem;
}

.skeleton-badge {
  height: 1rem;
  width: 3rem;
  border-radius: 0.375rem;
}

.skeleton-text {
  height: 0.85rem;
  width: 70%;
  margin-bottom: 0.25rem;
}

.skeleton-small {
  height: 0.8rem;
  width: 40%;
}

.skeleton-button {
  height: 2rem;
  width: 3rem;
  border-radius: 0.5rem;
}
</style> 