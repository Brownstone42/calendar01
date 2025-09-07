<template>
	<div class="my-container">
		<div class="columns">
			<div class="column is-3"></div>
			<div class="column is-3">Year</div>
			<div class="column is-3">Month</div>
			<div class="column is-3">Day</div>
		</div>
		<div class="columns">
			<div class="column is-3">Stem</div>
			<div class="column is-3">
				{{ pillars.yearStem.name + ' ' + pillars.yearStem.character }}
			</div>
			<div class="column is-3">
				{{ pillars.monthStem.name + ' ' + pillars.monthStem.character }}
			</div>
			<div class="column is-3">
				{{ pillars.dayStem.name + ' ' + pillars.dayStem.character }}
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">Branch</div>
			<div class="column is-3">
				{{ pillars.yearBranch.animal + ' ' + pillars.yearBranch.character }}
			</div>
			<div class="column is-3">
				{{ pillars.monthBranch.animal + ' ' + pillars.monthBranch.character }}
			</div>
			<div class="column is-3">
				{{ pillars.dayBranch.animal + ' ' + pillars.dayBranch.character }}
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">Hidden</div>
			<div class="column is-3">
				<div v-for="item in getYearHidden" :key="item">{{ item }}</div>
			</div>
			<div class="column is-3">
				<div v-for="item in getMonthHidden" :key="item">{{ item }}</div>
			</div>
			<div class="column is-3">
				<div v-for="item in getDayHidden" :key="item">{{ item }}</div>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">Season</div>
			<div class="column is-9">
				<div>{{ getSeason.name }}</div>
				<div class="score">
					<span v-for="el in ELEMENT_KEYS" :key="el">
						{{ el }}: {{ getSeason.score[el] }}
					</span>
				</div>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">Weight Count</div>
			<div class="column is-9">
				<div class="score">
					<span v-for="el in ELEMENT_KEYS" :key="'s1-' + el">
						{{ el }}: {{ weightScore.totals[el].toFixed(2) }}
					</span>
				</div>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">Season Applied</div>
			<div class="column is-9">
				<div class="score">
					<span v-for="el in ELEMENT_KEYS" :key="'s2-' + el">
						{{ el }}: {{ seasonScore.totals[el].toFixed(2) }}
					</span>
				</div>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">Add Root</div>
			<div class="column is-9">
				<div class="score">
					<span v-for="el in ELEMENT_KEYS" :key="'s3-' + el">
						{{ el }}: {{ rootScore.totals[el].toFixed(2) }}
					</span>
				</div>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">Luck Pillars 1</div>
			<div class="column is-9">
				{{
					'stem: ' +
					getLuckPillars[0].elementType +
					' | branch: ' +
					getLuckPillars[0].animal +
					' | hidden: ' +
					getLuckPillars[0].hiddenStems
				}}
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">+ LP1</div>
			<div class="column is-9">
				<div class="score">
					{{ finalScore[0] }}
				</div>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">+ LP1%</div>
			<div class="column is-9">
				<div class="score">
					{{ finalScorePercent1 }}
				</div>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">Luck Pillars 2</div>
			<div class="column is-9">
				{{
					'stem: ' +
					getLuckPillars[1].elementType +
					' | branch: ' +
					getLuckPillars[1].animal +
					' | hidden: ' +
					getLuckPillars[1].hiddenStems
				}}
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">+ LP2</div>
			<div class="column is-9">
				<div class="score">
					{{ finalScore[1] }}
				</div>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">+ LP2%</div>
			<div class="column is-9">
				<div class="score">
					{{ finalScorePercent2 }}
				</div>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">Luck Pillars 3</div>
			<div class="column is-9">
				{{
					'stem: ' +
					getLuckPillars[2].elementType +
					' | branch: ' +
					getLuckPillars[2].animal +
					' | hidden: ' +
					getLuckPillars[2].hiddenStems
				}}
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">+ LP3</div>
			<div class="column is-9">
				<div class="score">
					{{ finalScore[2] }}
				</div>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">+ LP3%</div>
			<div class="column is-9">
				<div class="score">
					{{ finalScorePercent3 }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import dominantCalculator from '@/utils/dominant'

export default {
	name: 'dominant',
	props: [
		'pillars',
		'weightScore',
		'seasonScore',
		'rootScore',
		'finalScore',
		'finalScorePercent1',
		'finalScorePercent2',
		'finalScorePercent3',
		'luckPillars',
	],
	data() {
		return {
			ROOT_BONUS: { primary: 0.3, secondary: 0.2, tertiary: 0.1 },
			STEM_CHAR_TO_ELEMENT: {
				甲: 'Wood',
				乙: 'Wood',
				丙: 'Fire',
				丁: 'Fire',
				戊: 'Earth',
				己: 'Earth',
				庚: 'Metal',
				辛: 'Metal',
				壬: 'Water',
				癸: 'Water',
			},
			ELEMENT_KEYS: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'],
		}
	},
	computed: {
		getYearHidden() {
			return this.pillars.yearBranch.hiddenStems.map((h) => `${h.name} ${h.character}`)
		},
		getMonthHidden() {
			return this.pillars.monthBranch.hiddenStems.map((h) => `${h.name} ${h.character}`)
		},
		getDayHidden() {
			return this.pillars.dayBranch.hiddenStems.map((h) => `${h.name} ${h.character}`)
		},
		getSeason() {
			return dominantCalculator.getSeason(this.pillars)
		},
		getLuckPillars() {
			return this.luckPillars.map((p) => ({
				elementType: p.heavenlyStem.elementType,
				animal: p.earthlyBranch.animal,
				hiddenStems: p.earthlyBranch.hiddenStems.map((h) => h.elementType),
			}))
		},
	},
}
</script>

<style scoped>
.my-container {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.columns {
	width: 100%;
	border: 1px solid black;
}
.columns:not(:first-child) {
	width: 100%;
	border-top: 0;
}
.column {
	text-align: center;
}
.column:not(:first-child) {
	border-left: 1px solid black;
}
hr {
	width: 100%;
}
.score {
	width: 100%;
	gap: 5px;
	display: flex;
	justify-content: center;
}
</style>
