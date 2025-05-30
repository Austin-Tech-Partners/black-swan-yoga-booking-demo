<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { MapPin } from 'lucide-svelte';
let locationStatus = '';
let showRequestButton = false;
let userLocation: { lat: number; lng: number } | null = null;

function handleLocationSuccess(pos: GeolocationPosition) {
	locationStatus = 'Location received!';
	userLocation = {
		lat: pos.coords.latitude,
		lng: pos.coords.longitude
	};
	setTimeout(() => goto('/select-studio'), 600);
}

function handleLocationError(err: GeolocationPositionError) {
	if (err.code === 1) {
		locationStatus = 'Location access denied.';
	} else {
		locationStatus = 'Unable to retrieve your location.';
	}
	showRequestButton = true;
}

function requestLocation() {
	if (!navigator.geolocation) {
		locationStatus = 'Geolocation is not supported by your browser.';
		return;
	}
	locationStatus = 'Requesting location...';
	navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);
}

function skipLocation() {
	goto('/select-studio');
}

onMount(() => {
	requestLocation();
});
</script>

<section class="location-screen">
	<div class="icon-circle">
		<MapPin size={36} color="#fff" />
	</div>
	<h1>Share Your Location</h1>
	<p class="desc">Allow us to find the nearest Black Swan Yoga studio to you for the best booking experience.</p>
	{#if showRequestButton}
		<button class="location-btn" on:click={requestLocation}>Allow Location Access</button>
	{/if}
	<button class="skip-btn" on:click={skipLocation}>Skip for now</button>
	{#if locationStatus}
		<p class="status">{locationStatus}</p>
	{/if}
</section>

<style>
.location-screen {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 70vh;
	text-align: center;
}
.icon-circle {
	display: flex;
	align-items: center;
	justify-content: center;
	background: #7C3AED;
	border-radius: 50%;
	height: 64px;
	width: 64px;
	margin-bottom: 2rem;
	color: white;
}
h1 {
	font-size: 1.6rem;
	font-weight: 700;
	color: #000;
	margin-bottom: 0.7rem;
}
.desc {
	color: #444;
	font-size: 1.08rem;
	margin-bottom: 2.2rem;
	max-width: 320px;
}
.location-btn {
	width: 100%;
	max-width: 340px;
	margin: 0 auto 1rem auto;
	padding: 1rem 0;
	font-size: 1.1rem;
	border-radius: 0.7rem;
	border: none;
	background: #7C3AED;
	color: #fff;
	font-weight: 700;
	box-shadow: 0 2px 8px rgba(0,0,0,0.07);
	cursor: pointer;
	transition: background 0.2s;
}
.location-btn:hover {
	background: #5B21B6;
}
.skip-btn {
	width: 100%;
	max-width: 340px;
	padding: 1rem 0;
	font-size: 1.1rem;
	border-radius: 0.7rem;
	border: 2px solid #7C3AED;
	background: #fff;
	color: #7C3AED;
	font-weight: 700;
	margin-bottom: 1.2rem;
	cursor: pointer;
	transition: background 0.2s, color 0.2s;
}
.skip-btn:hover {
	background: #f6f5ff;
	color: #000;
}
.status {
	margin-top: 1rem;
	color: #7C3AED;
	font-size: 1rem;
}
</style>
