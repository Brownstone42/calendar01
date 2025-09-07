<template>
	<section class="base-template">
		<div class="emotions-slider" ref="root">
			<!-- ตัว Swiper -->
			<div class="emotions-slider__slider swiper" ref="swiperEl">
				<div class="emotions-slider__wrapper swiper-wrapper">
					<!-- สไลด์ -->
					<div
						class="emotions-slider__slide swiper-slide"
						v-for="(item, i) in itemsToShow"
						:key="i"
					>
						<div class="emotions-slider__item emotions-slider-item">
							<div
								class="emotions-slider-item__image"
								:style="{ backgroundImage: `url(${cardMonkeyWater})` }"
							>
								<!--<img :src="item.image" :alt="item.title" />-->
							</div>

							<div class="emotions-slider-item__content">
								<div class="emotions-slider-item__info">
									<h2 class="emotions-slider-item__title">{{ item.title }}</h2>
									<div class="emotions-slider-item__text">{{ item.text }}</div>
								</div>
							</div>
						</div>
					</div>
					<!-- /สไลด์ -->
				</div>
			</div>
			<!-- /ตัว Swiper -->
			<!-- ✅ เพิ่ม pagination element -->
			<div class="slider-pagination" ref="paginationEl"></div>
		</div>
	</section>
</template>

<script>
/**
 * ใช้ Options API ตามสไตล์ที่คุณถนัด (ไม่ใช้ <script setup>)
 */
import Swiper from 'swiper' // core
import 'swiper/css' // css พื้นฐานของ Swiper
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'

export default {
	name: 'cardCarousel',
	props: {
		items: {
			type: Array,
			default: () => [], // ถ้าไม่มี prop จะใช้ demo items ด้านล่าง
		},
	},
	data() {
		return {
			swiper: null,
			demoItems: [
				{
					image: '/images/card-rat-fire01.png',
					title: 'Winds of Change',
					text: 'Gentle pink and blue hues remind us of moments when everything changes for the better.',
				},
				{
					image: '/images/card-rat-fire02.png',
					title: 'Flames of Passion',
					text: 'Feel the warmth of emotions in a swirl of red and yellow tones.',
				},
				{
					image: '/images/card-rat-fire03.png',
					title: 'Oceans of Serenity',
					text: 'Blue waves of art take you into a world of meditation and inner balance.',
				},
			],
			cardMonkeyWater: '/images/card-monkey-water.png',
		}
	},
	computed: {
		itemsToShow() {
			return this.items?.length ? this.items : this.demoItems
		},
	},
	mounted() {
		const wrapper = this.$el.closest('.carousel-wrapper')
		const prevEl = wrapper?.querySelector('.slider-nav__item_prev')
		const nextEl = wrapper?.querySelector('.slider-nav__item_next')

		this.swiper = new Swiper(this.$refs.swiperEl, {
			modules: [Pagination, Navigation], // <— ใส่โมดูลที่ใช้
			slidesPerView: 'auto',
			spaceBetween: 20,
			speed: 600,
			centeredSlides: true,
			centerInsufficientSlides: false,
			pagination: {
				el: this.$refs.paginationEl, // <— อ้างอิง div.pagination ของคุณ
				type: 'bullets',
				bulletClass: 'slider-pagination__item',
				bulletActiveClass: 'active',
				clickable: true,
			},
			navigation: {
				prevEl,
				nextEl,
				disabledClass: 'disabled', // ให้ปุ่มติดคลาสนี้เมื่อเลื่อนต่อไม่ได้
			},
		})
	},
	beforeUnmount() {
		if (this.swiper) {
			this.swiper.destroy(true, true)
			this.swiper = null
		}
	},
}
</script>

<style scoped>
/* ================== Layout Vars (คุมความสูงคงที่ + ขนาดการ์ด) ================== */
.emotions-slider {
	/* ปรับได้ตามคอนเทนต์จริง */
	--content-max: 120px; /* ความสูงแถบดำตอนโชว์สุด */
	--card-w: min(300px, calc(100dvw - 60px));
	--img-h: calc(var(--card-w) * 4 / 3); /* 3:4 → สูง = กว้าง * 4/3 */
	--pagination-h: 38px;

	position: relative;
	padding-inline: 0;
	padding-bottom: var(--pagination-h); /* กันพื้นที่ให้ bullets */
}

/* ล็อกความสูงของตัวสไลเดอร์ = สูงรูป + สูง content สูงสุด (pagination แยกจาก padding-bottom ด้านบน) */
.emotions-slider__slider {
	min-height: calc(var(--img-h) + var(--content-max));
}

/* ================== Pagination ================== */
:deep(.slider-pagination) {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0; /* ปักไว้ก้นคอมโพเนนต์ */
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	flex-wrap: wrap;
}
:deep(.slider-pagination__item) {
	display: inline-block;
	width: 8px;
	height: 8px;
	border-radius: 99px;
	background: #333;
	opacity: 0.6;
	transition: all 0.3s ease-out;
}
:deep(.slider-pagination__item.active) {
	width: 30px;
	opacity: 1;
}

/* ================== Swiper Base ================== */
.swiper {
	user-select: none;
}

/* ================== Slides ================== */
.emotions-slider__slide {
	display: flex;
	align-items: stretch; /* ตัวการ์ดจะไม่ถูกยืดเพราะเราตั้ง align-self ด้านล่าง */
	min-height: 300px;
}
.swiper-slide {
	width: auto;
	height: auto;
}

/* ================== Card ================== */
.emotions-slider-item {
	--border-radius: 10px;
	width: var(--card-w);
	color: #fff;
	border-radius: var(--border-radius);
	position: relative;
	overflow: hidden;
	background: transparent; /* ให้แถบดำมาจาก content เท่านั้น */
}

/* Image (อยู่ชั้นบนกว่าแถบดำเสมอ) */
.emotions-slider-item__image {
	aspect-ratio: 3 / 4;
	overflow: hidden;
	border-radius: 12px;
	background: #ffffff;
	position: relative;
	z-index: 2;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	width: 100%;
}
/*.emotions-slider-item__image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition:
		filter 400ms ease,
		opacity 400ms ease,
		transform 400ms ease;
}*/

/* Content bar (ต่อจากรูป ไม่ทับรูป, z-index ต่ำกว่ารูป) */
.emotions-slider-item__content {
	position: relative;
	z-index: 1; /* ต่ำกว่ารูป */
	background: #1e1e1e;

	overflow: hidden;
	max-height: 0; /* ซ่อน: ไม่กินพื้นที่ */
	opacity: 0;
	transform: translateY(-6px); /* แอบอยู่หลังริมรูปนิด ๆ */
	pointer-events: none;

	padding: 0 20px; /* คง padding ซ้าย-ขวา */
	transition:
		max-height 1300ms ease,
		padding-top 1300ms ease,
		padding-bottom 1300ms ease,
		opacity 1300ms ease,
		transform 1300ms ease;
	will-change: max-height, transform;
	border-bottom-left-radius: 12px;
	border-bottom-right-radius: 12px;
}

/* Typography */
.emotions-slider-item__title {
	font-weight: 600;
	font-size: 18px;
	line-height: 1.25;
	margin-bottom: 6px;
}
.emotions-slider-item__text {
	font-weight: 300;
	font-size: 14px;
	line-height: 1.5;
	opacity: 0.85;
}

/* โชว์เฉพาะสไลด์ที่ active: แถบดำเลื่อนลงมาต่อกับรูป */
:deep(.swiper-slide-active .emotions-slider-item__content),
:deep(.swiper-slide-duplicate-active .emotions-slider-item__content) {
	max-height: var(--content-max);
	padding-top: 20px;
	padding-bottom: 10px;
	opacity: 1;
	transform: translateY(-10px);
	pointer-events: auto;
}

/* กันไม่ให้การ์ดของสไลด์ที่ไม่ active ถูก “ยืดสูง” ตาม min-height ของสไลด์ */
:deep(.swiper-slide:not(.swiper-slide-active) .emotions-slider-item) {
	align-self: flex-start;
}

:deep(.swiper-slide:not(.swiper-slide-active) .emotions-slider-item__image img) {
	filter: blur(2px);
	opacity: 0.7;
	transform: scale(0.98);
}

:deep(.swiper-slide-active .emotions-slider-item__image img) {
	filter: none;
	opacity: 1;
	transform: none;
}
</style>
