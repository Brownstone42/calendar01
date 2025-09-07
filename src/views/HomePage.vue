<template>
	<div class="home-hero">
		<div class="hero-content">
			<h1 class="title is-2 has-text-black has-text-centered">Discover Your BaZi</h1>
			<div class="body-content mt-5">
				<birthday-input v-model="birthday" @enter="handleEnter"></birthday-input>
				<!--<router-link to="/calendar" class="button is-primary is-large is-rounded mt-6"> Start Now! </router-link>-->
			</div>
		</div>
	</div>
</template>

<script>
import birthdayInput from '@/components/common/birthdayInput.vue'

export default {
	name: 'HomePage',
	components: {
		birthdayInput,
	},
	data() {
		return {
			birthday: null,
		}
	},
	methods: {
		handleEnter() {
			console.log(this.birthday)
		},
	},
}
</script>

<style scoped lang="scss">
.home-hero {
	height: calc(100vh - 4rem);
	width: 100vw;
	//background-image: url('/images/home-bg.jpg');
	margin-top: 4rem;
	background-size: cover;
	background-position: center center;
	background-repeat: no-repeat;
	display: flex;
	justify-content: center;
	align-items: start;
	position: relative;
	overflow: hidden;
}
.hero-content {
	position: relative;
	z-index: 2;
	text-align: center;
	padding: 1.5rem;
	max-width: 900px;
	margin-top: 150px;
}
.title,
.subtitle {
	text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}
.body-content {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
