<script lang="ts">
    import { onMount } from 'svelte';
    import mapboxgl from 'mapbox-gl';
    import 'mapbox-gl/dist/mapbox-gl.css';
    import { MapPin, Navigation } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    
    // Mock studio data
    interface Studio {
      name: string;
      city: string;
      lat: number;
      lng: number;
      address: string;
    }
    const studios: Studio[] = [
      { name: 'Anderson', city: 'Austin', lat: 30.3583, lng: -97.7191, address: '1417 W Anderson Ln' },
      { name: 'Cedar Park', city: 'Austin', lat: 30.5052, lng: -97.8203, address: '1050 Lakeline Blvd. Suite 105' },
      { name: 'Cesar Chavez', city: 'Austin', lat: 30.2588, lng: -97.7362, address: '913 E Cesar Chavez St' },
      { name: 'Orchard', city: 'Austin', lat: 30.2871, lng: -97.7437, address: '403 Orchard St' },
      { name: 'Round Rock', city: 'Austin', lat: 30.5083, lng: -97.6789, address: '2800 S I-35 Frontage Rd #310' },
      { name: 'Westgate', city: 'Austin', lat: 30.2267, lng: -97.8167, address: '4534 West Gate Blvd' },
      { name: 'Bishop', city: 'Dallas', lat: 32.7442, lng: -96.8286, address: '407 W 10th St, Ste. 100' },
      { name: 'Lovers', city: 'Dallas', lat: 32.8618, lng: -96.7716, address: '5118 W Lovers Ln' },
      { name: 'Skillman', city: 'Dallas', lat: 32.8235, lng: -96.7476, address: '1920 Skillman St' },
      { name: 'Capitol Hill', city: 'Denver', lat: 39.7340, lng: -104.9790, address: '1308 N. Pearl St' },
      { name: 'South Broadway', city: 'Denver', lat: 39.6547, lng: -104.9878, address: '2815 S Broadway' },
      { name: 'Fannin', city: 'Houston', lat: 29.7420, lng: -95.3727, address: '2850 Fannin St #300' },
      { name: 'Kirby', city: 'Houston', lat: 29.7147, lng: -95.4186, address: '5310 Kirby Dr' },
      { name: 'White Oak', city: 'Houston', lat: 29.7792, lng: -95.3776, address: '3210 White Oak Dr' },
      { name: 'Midtown', city: 'Phoenix', lat: 33.4942, lng: -112.0736, address: '4530 North 7th Street' },
      { name: 'Old Town', city: 'Phoenix', lat: 33.4942, lng: -111.9261, address: '7620 E. Indian Rd' },
      { name: 'Paradise Valley', city: 'Phoenix', lat: 33.5312, lng: -111.9561, address: '4657 E. Cactus Road' },
      { name: 'Downtown', city: 'San Antonio', lat: 29.4241, lng: -98.4936, address: '914 E Elmira St #201' },
      { name: 'Vineyard', city: 'San Antonio', lat: 29.6061, lng: -98.5047, address: '1201 N Loop 1604 W #105' }
    ];
    
    let userLocation: { lat: number; lng: number } | null = null;
    let selectedStudio: Studio | null = null;
    let mapContainer: HTMLDivElement | null = null;
    let map: mapboxgl.Map | null = null;
    let userMarker: mapboxgl.Marker | null = null;
    let studioMarkers: { [key: string]: mapboxgl.Marker } = {};
    let showStickyButton = false;
    let scrollY = 0;
    
    function getDistance(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
      // Haversine formula
      const toRad = (x: number) => (x * Math.PI) / 180;
      const R = 6371;
      const dLat = toRad(b.lat - a.lat);
      const dLng = toRad(b.lng - a.lng);
      const lat1 = toRad(a.lat);
      const lat2 = toRad(b.lat);
      const aVal = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
      return R * c;
    }
    
    function autoSelectClosestStudio() {
      if (!userLocation) return;
      let minDist = Infinity;
      let closest: Studio | null = null;
      for (const studio of studios) {
        const dist = getDistance(userLocation, { lat: studio.lat, lng: studio.lng });
        if (dist < minDist) {
          minDist = dist;
          closest = studio;
        }
      }
      selectedStudio = closest;
      updateMapMarkers();
    }
    
    function selectStudio(studio: Studio) {
      selectedStudio = studio;
      updateMapMarkers();
      if (map) {
        map.flyTo({
          center: [studio.lng, studio.lat],
          zoom: 11,
          duration: 1000
        });
      }
    }
    
    function updateMapMarkers() {
      // Update all studio markers
      studios.forEach((studio) => {
        const marker = studioMarkers[studio.name];
        if (marker) {
          const isSelected = selectedStudio?.name === studio.name;
          const markerEl = marker.getElement();
          markerEl.style.backgroundColor = isSelected ? '#7C3AED' : '#000';
          markerEl.style.borderColor = isSelected ? '#5B21B6' : '#333';
          markerEl.style.transform = isSelected ? 'scale(1.2)' : 'scale(1)';
        }
      });
    }
    
    function handleScroll() {
      scrollY = window.scrollY;
      // Show sticky button when scrolled past 300px and studio is selected
      showStickyButton = scrollY > 300 && selectedStudio !== null;
    }
    
    function confirmAndProceed() {
      if (selectedStudio) {
        // Pass selected studio to the schedule page
        goto(`/schedule?studio=${encodeURIComponent(selectedStudio.name)}&city=${encodeURIComponent(selectedStudio.city)}`);
      }
    }
    
    onMount(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            autoSelectClosestStudio();
            
            if (map) {
              // Add user location marker
              const userEl = document.createElement('div');
              userEl.className = 'user-marker';
              userEl.innerHTML = '<div class="user-marker-inner"></div>';
              
              userMarker = new mapboxgl.Marker({ element: userEl })
                .setLngLat([userLocation.lng, userLocation.lat])
                .addTo(map);
                
              map.setCenter([userLocation.lng, userLocation.lat]);
            }
          },
          () => {
            userLocation = null;
          }
        );
      }
      
      map = new mapboxgl.Map({
        container: mapContainer!,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-97.7431, 30.2672], // Default to Austin
        zoom: 8
      });
      
      studios.forEach((studio) => {
        const markerEl = document.createElement('div');
        markerEl.className = 'studio-marker';
        markerEl.addEventListener('click', () => selectStudio(studio));
        
        const marker = new mapboxgl.Marker({ element: markerEl })
          .setLngLat([studio.lng, studio.lat])
          .addTo(map!);
          
        studioMarkers[studio.name] = marker;
      });

      // Add scroll listener
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    });
    </script>
    
    <svelte:window bind:scrollY />
    
    <section class="studio-select">
      <div class="header">
        <button class="back-btn" aria-label="Go back">
          ← Back
        </button>
        <h1>Select Location</h1>
      </div>
      
      {#if selectedStudio}
        <div class="selected-studio">
          <div class="studio-info">
            <div class="studio-icon">
              <MapPin size={20} color="#7C3AED" />
            </div>
            <div class="studio-details">
              <h3>{selectedStudio.name}</h3>
              <p class="city">{selectedStudio.city}</p>
              <p class="address">{selectedStudio.address}</p>
            </div>
          </div>
          <button class="confirm-btn" on:click={confirmAndProceed}>View Classes</button>
        </div>
      {/if}
      
      <!-- <div class="search-container">
        <input class="search-box" placeholder="Search locations" />
      </div> -->
      
      <div bind:this={mapContainer} class="map-container"></div>
      
      <div class="studio-list">
        {#each Array.from(new Set(studios.map(s => s.city))) as city}
          <div class="city-section">
            <h3 class="city-title">{city}</h3>
            {#each studios.filter(s => s.city === city) as studio}
              <button 
                type="button" 
                class="studio-card {selectedStudio?.name === studio.name ? 'selected' : ''}" 
                on:click={() => selectStudio(studio)} 
                aria-label={`Select ${studio.name} in ${studio.city}`}
              >
                <div class="studio-card-icon">
                  <MapPin size={18} color={selectedStudio?.name === studio.name ? '#7C3AED' : '#666'} />
                </div>
                <div class="studio-card-content">
                  <h4>{studio.name}</h4>
                  <p class="studio-address">{studio.address}</p>
                  <p class="studio-city">{studio.city}</p>
                </div>
              </button>
            {/each}
          </div>
        {/each}
      </div>
    </section>
    
    <!-- Sticky bottom button -->
    {#if showStickyButton && selectedStudio}
      <div class="sticky-bottom" class:visible={showStickyButton}>
        <div class="sticky-content">
          <div class="sticky-studio-info">
            <strong>{selectedStudio.name}</strong>
            <span>{selectedStudio.city}</span>
          </div>
          <button class="sticky-confirm-btn" on:click={confirmAndProceed}>
            View Classes
          </button>
        </div>
      </div>
    {/if}
    
    <style>
    .studio-select {
      max-width: 420px;
      margin: 0 auto;
      padding: 0 1rem 2rem 1rem;
    }
    
    .header {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-top: 0.5rem;
    }
    
    .back-btn {
      background: none;
      border: none;
      font-size: 1rem;
      color: #7C3AED;
      cursor: pointer;
      padding: 0.5rem;
      margin-left: -0.5rem;
      margin-right: 0.5rem;
      border-radius: 0.5rem;
      transition: background 0.2s;
    }
    
    .back-btn:hover {
      background: #f6f5ff;
    }
    
    h1 {
      font-size: 1.4rem;
      font-weight: 700;
      color: #000;
      margin: 0;
    }
    
    .selected-studio {
      background: linear-gradient(135deg, #f6f5ff 0%, #ede9fe 100%);
      border: 2px solid #7C3AED;
      border-radius: 1rem;
      padding: 1rem;
      margin-bottom: 1.2rem;
    }
    
    .studio-info {
      display: flex;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    
    .studio-icon {
      background: white;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.75rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .studio-details h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: #000;
    }
    
    .studio-details .city {
      margin: 0 0 0.25rem 0;
      font-size: 0.9rem;
      color: #7C3AED;
      font-weight: 600;
    }
    
    .studio-details .address {
      margin: 0;
      font-size: 0.85rem;
      color: #666;
    }
    
    .confirm-btn {
      width: 100%;
      padding: 0.9rem 0;
      background: #7C3AED;
      color: #fff;
      font-weight: 700;
      border: none;
      border-radius: 0.7rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .confirm-btn:hover {
      background: #5B21B6;
    }
    
    .search-container {
      margin-bottom: 1rem;
    }
    
    .search-box {
      width: 100%;
      padding: 0.9rem 1rem;
      border-radius: 0.7rem;
      border: 2px solid #e5e7eb;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    
    .search-box:focus {
      outline: none;
      border-color: #7C3AED;
    }
    
    .map-container {
      width: 100%;
      height: 240px;
      border-radius: 1rem;
      margin-bottom: 1.5rem;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .city-section {
      margin-bottom: 1.5rem;
    }
    
    .city-title {
      margin: 0 0 0.75rem 0;
      color: #7C3AED;
      font-size: 1.1rem;
      font-weight: 700;
      padding-left: 0.5rem;
    }
    
    .studio-card {
      background: #fff;
      border: 2px solid #f3f4f6;
      border-radius: 0.75rem;
      padding: 1rem;
      margin-bottom: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      width: 100%;
      font: inherit;
      outline: none;
      display: flex;
      align-items: flex-start;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .studio-card:hover, .studio-card:focus {
      border-color: #7C3AED;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
      transform: translateY(-1px);
    }
    
    .studio-card.selected {
      border-color: #7C3AED;
      background: #f6f5ff;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
    }
    
    .studio-card-icon {
      background: #f8fafc;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.75rem;
      flex-shrink: 0;
    }
    
    .studio-card-content h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: #000;
    }
    
    .studio-card-content .studio-address {
      margin: 0 0 0.25rem 0;
      font-size: 0.85rem;
      color: #666;
    }
    
    .studio-card-content .studio-city {
      margin: 0;
      font-size: 0.8rem;
      color: #7C3AED;
      font-weight: 500;
    }
    
    /* Sticky bottom button */
    .sticky-bottom {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      border-top: 1px solid #e5e7eb;
      padding: 1rem;
      transform: translateY(100%);
      transition: transform 0.3s ease;
      box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
      z-index: 20;
    }
    
    .sticky-bottom.visible {
      transform: translateY(0);
    }
    
    .sticky-content {
      max-width: 420px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .sticky-studio-info {
      display: flex;
      flex-direction: column;
    }
    
    .sticky-studio-info strong {
      font-size: 1rem;
      font-weight: 600;
      color: #000;
    }
    
    .sticky-studio-info span {
      font-size: 0.85rem;
      color: #7C3AED;
      font-weight: 500;
    }
    
    .sticky-confirm-btn {
      background: #7C3AED;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.7rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .sticky-confirm-btn:hover {
      background: #5B21B6;
    }
    
    /* Map marker styles */
    :global(.studio-marker) {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #000;
      border: 3px solid #333;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    :global(.studio-marker:hover) {
      transform: scale(1.1);
    }
    
    :global(.user-marker) {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    :global(.user-marker-inner) {
      width: 12px;
      height: 12px;
      background-color: #007AFF;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,122,255,0.3);
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(0,122,255,0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(0,122,255,0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(0,122,255,0);
      }
    }
    </style> 