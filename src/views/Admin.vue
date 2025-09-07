<template>
	<div class="wrap section">
		<birthday-input v-model="birthday" @enter="handleEnter"></birthday-input>
		<div class="menu mt-5">
			<button
				class="button"
				@click="getSelfPower"
				:class="{ 'is-active': currentMenu === 'sp' }"
				:disabled="!birthday"
			>
				Self-Power
			</button>
			<button
				class="button ml-4"
				@click="getDominant"
				:class="{ 'is-active': currentMenu === 'do' }"
				:disabled="!birthday"
			>
				Dominant
			</button>
		</div>
		<div class="display mt-5">
			<self-power
				v-if="currentMenu == 'sp' && birthday"
				:score="relationshipScore"
				:scoreLP1="relationshipScoreLP1"
				:scoreLP2="relationshipScoreLP2"
				:scoreLP3="relationshipScoreLP3"
				:scoreLPY="relationshipScoreLPY"
				:scoreLPYM="relationshipScoreLPYM"
				:pillars="pillars"
				:luckPillars="luckPillars"
				:currentPillars="currentPillars"
			></self-power>
			<dominant
				v-if="currentMenu == 'do' && birthday"
				:pillars="pillars"
				:weightScore="weightScore"
				:seasonScore="seasonScore"
				:rootScore="rootScore"
				:finalScore="finalScore"
				:finalScorePercent1="finalScorePercent1"
				:finalScorePercent2="finalScorePercent2"
				:finalScorePercent3="finalScorePercent3"
				:luckPillars="luckPillars"
			></dominant>
		</div>
	</div>
</template>

<script>
import { format } from 'date-fns'

import birthdayInput from '@/components/common/birthdayInput.vue'
import selfPower from '@/components/admin/selfPower.vue'
import dominant from '@/components/admin/dominant.vue'
import calculator from '@/utils/calculator'
import dominantCalculator from '@/utils/dominant'

export default {
	name: 'admin',
	components: {
		birthdayInput,
		selfPower,
		dominant,
	},
	data() {
		return {
			birthday: '1989-08-26',
			currentMenu: null,
			relationshipScore: {},
			relationshipScoreLP1: {},
			relationshipScoreLP2: {},
			relationshipScoreLP3: {},
			relationshipScoreLPY: {},
			relationshipScoreLPYM: {},
			currentPillars: {},
			pillars: {},
			luckPillars: [],
			weightScore: {},
			seasonScore: {},
			rootScore: {},
			finalScore: [],
		}
	},
	methods: {
		getSelfPower() {
			this.currentMenu = 'sp'

			const pillars = calculator.getPillars(this.birthday, false)
			const luckPillars = calculator.getLuckPillars(pillars.luckPillars)
			const elementScore = calculator.getElementScore(pillars)
			const relationshipScore = calculator.getRelationshipScore(pillars.dayStem, elementScore)

			this.pillars = pillars
			this.luckPillars = luckPillars
			this.relationshipScore = relationshipScore

			//LUCK PILLAR

			const elementScoreLP1 = calculator.getElementScore(pillars, luckPillars[0])
			const relationshipScoreLP1 = calculator.getRelationshipScore(
				pillars.dayStem,
				elementScoreLP1,
			)

			this.relationshipScoreLP1 = relationshipScoreLP1

			const elementScoreLP2 = calculator.getElementScore(pillars, luckPillars[1])
			const relationshipScoreLP2 = calculator.getRelationshipScore(
				pillars.dayStem,
				elementScoreLP2,
			)

			this.relationshipScoreLP2 = relationshipScoreLP2

			const elementScoreLP3 = calculator.getElementScore(pillars, luckPillars[2])
			const relationshipScoreLP3 = calculator.getRelationshipScore(
				pillars.dayStem,
				elementScoreLP3,
			)

			this.relationshipScoreLP3 = relationshipScoreLP3

			//CURRENT DATE
			const currentDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
			const currentPillars = calculator.getPillars(currentDate, true)

			const elementScoreLPY = calculator.getElementScore(
				pillars,
				luckPillars[0],
				currentPillars,
				'year',
			)
			const relationshipScoreLPY = calculator.getRelationshipScore(
				currentPillars.dayStem,
				elementScoreLPY,
			)

			this.currentPillars = currentPillars
			this.relationshipScoreLPY = relationshipScoreLPY

			const elementScoreLPYM = calculator.getElementScore(
				pillars,
				luckPillars[0],
				currentPillars,
				'month',
			)
			const relationshipScoreLPYM = calculator.getRelationshipScore(
				currentPillars.dayStem,
				elementScoreLPYM,
			)

			this.relationshipScoreLPYM = relationshipScoreLPYM
		},
		getDominant() {
			this.currentMenu = 'do'

			const pillars = calculator.getFullPillars(this.birthday, false)
			const luckPillars = calculator.getLuckPillars(pillars.luckPillars)
			const weightScore = dominantCalculator.getWeightScore(pillars)
			const seasonScore = dominantCalculator.getSeasonScore(pillars, weightScore)
			const rootScore = dominantCalculator.getRootScore(pillars, seasonScore)
			const finalScore = dominantCalculator.getFinalScore(rootScore, luckPillars)
			const finalScorePercent1 = dominantCalculator.getFinalScorePercent(finalScore[0])
			const finalScorePercent2 = dominantCalculator.getFinalScorePercent(finalScore[1])
			const finalScorePercent3 = dominantCalculator.getFinalScorePercent(finalScore[2])

			console.log(finalScore)

			this.pillars = pillars
			this.luckPillars = luckPillars
			this.weightScore = weightScore
			this.seasonScore = seasonScore
			this.rootScore = rootScore
			this.finalScore = finalScore
			this.finalScorePercent1 = finalScorePercent1
			this.finalScorePercent2 = finalScorePercent2
			this.finalScorePercent3 = finalScorePercent3
		},
		handleEnter() {
			console.log(this.birthday)
		},
	},
	watch: {
		birthday(val) {
			if (!val) {
				this.currentMenu = null
			}
		},
	},
}
</script>

<style scoped lang="scss">
.wrap {
	margin-top: 4rem;
	padding: 1.5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.display {
	width: 100%;
}
</style>
