<template>
	<div class="header-container">
		<div class="nav-main">
			<a
				class="navbar-brand"
				href="https://github.com/SilveryStar/simple-picbed"
			>SPB</a>
			<div class="collapse navbar-collapse">
				<ul class="navbar-nav">
					<li class="nav-item">
						<router-link class="nav-link" to="album">相册</router-link>
					</li>
					<li class="nav-item">
						<router-link class="nav-link" to="upload">上传</router-link>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.header-container {
	position: relative;
	top: 0;
	left: 0;
	right: 0;
	padding: 0.5rem 1rem;
	width: 100vw;
	background-color: #343A40;
	display: flex;
	align-items: center;
}

.nav-main {
	max-width: 78%;
	padding: 0 3px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-right: auto;
	margin-left: auto;
	width: 100%;
}

.navbar-brand {
	display: inline-block;
	padding: 0.3125rem 0;
	margin-right: 1.75rem;
	font-size: 1.25rem;
	line-height: inherit;
	white-space: nowrap;
	color: #FFF;
	user-select: none;
}

.navbar-collapse {
	display: flex !important;
	flex-grow: 1;
	align-items: center;
}

.navbar-nav {
	margin-right: auto;
	display: flex;
	padding-left: 0;
	margin-bottom: 0;
	list-style: none;
	margin-top: 0;
}

.nav-item {
	display: list-item;
	user-select: none;
}

.nav-link {
	display: block;
	padding: 0.5rem 1rem;
	color: rgba( #fff, .5 );

	&:hover {
		text-decoration: none;
		color: rgba( #fff, .75 );
	}
}

@media (min-width: 768px) {
	.header-container {
		flex-flow: row nowrap;
		justify-content: flex-start;
	}

	.nav-main {
		flex-wrap: nowrap;
	}

	.navbar-collapse {
		display: flex !important;
		flex-basis: auto;
	}

	.navbar-nav {
		flex-direction: row;
	}

	.nav-link {
		padding-right: 0.5rem;
		padding-left: 0.5rem;
	}
}
</style>