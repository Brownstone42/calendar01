<template>
	<div class="wrap section">
		<!--<h1 class="title is-2 has-text-centered mb-5">BaZi Calendar</h1>-->

		<div class="carousel-wrapper">
			<div class="slider-nav">
				<button class="slider-nav__item slider-nav__item_prev" aria-label="Previous">
					<svg
						width="16"
						height="28"
						viewBox="0 0 16 28"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M14 26L2 14L14 2"
							stroke="currentColor"
							stroke-width="4"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
				<button class="slider-nav__item slider-nav__item_next" aria-label="Next">
					<svg
						width="16"
						height="28"
						viewBox="0 0 16 28"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M2 26L14 14L2 2"
							stroke="currentColor"
							stroke-width="4"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			</div>
			<card-carousel></card-carousel>
		</div>

		<!--<div class="calendar-controls">
            <div class="buttons is-centered">
                <router-link to="/Calendar/SelfAnalysis" class="button calendar-nav-button">
                    Self Analysis
                </router-link>
                <router-link to="/Calendar/SelfYearly" class="button calendar-nav-button">
                    Self Yearly
                </router-link>
            </div>
        </div>

        <div class="calendar-content mt-5">
            <router-view></router-view>
        </div>-->
	</div>
</template>

<script>
import cardCarousel from '@/components/common/cardCarousel.vue'

export default {
	name: 'calendar',
	components: {
		cardCarousel,
	},
}
</script>

<style scoped lang="scss">
div.wrap {
	margin-top: 4rem;
	padding: 1.5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.carousel-wrapper {
	width: 800px;
	padding-inline: 100px;
	position: relative;
	overflow: visible;
}
.slider-nav {
	pointer-events: none;
	position: absolute;
	inset: 0;
	top: 50%;
	transform: translateY(-50%);
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.slider-nav__item {
	pointer-events: auto;
	width: 48px;
	aspect-ratio: 1;
	display: grid;
	place-items: center;
	border: none;
	background: transparent;
	cursor: pointer;
	color: #8a8a8a;
	transition:
		color 0.2s ease,
		opacity 0.2s ease;
}
.slider-nav__item:hover {
	color: #3b82f6;
} /* ฟ้า */
.slider-nav__item.disabled,
.slider-nav__item:disabled {
	opacity: 0.4;
	cursor: default;
}
</style>
