<script lang="ts">
	import '../app.css';
</script>

<nav class="navbar">
	<div class="brand">
		<img src="/bsy_logo.svg" alt="Black Swan Yoga" class="logo" />
		<span class="brand-text">Black Swan Yoga</span>
	</div>
	<button class="menu-btn" aria-label="Menu">
		<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
	</button>
</nav>
<main class="main-content">
	<slot />
</main>

<style>
.navbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem 1.2rem;
	background: #fff;
	box-shadow: 0 2px 8px rgba(0,0,0,0.03);
	position: sticky;
	top: 0;
	z-index: 10;
}

.brand {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.logo {
	height: 32px;
}

.brand-text {
	font-size: 1.1rem;
	font-weight: 700;
	color: #000;
}

.menu-btn {
	background: none;
	border: none;
	padding: 0.3rem;
	cursor: pointer;
}

.main-content {
	padding: 1.2rem 0.8rem 0 0.8rem;
}
</style>
