<template>
	<div class="my-container">
		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Day Master :</h1>
			</div>
			<div class="column">
				<h1>{{ pillars.dayStem }}</h1>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Element Score :</h1>
			</div>
			<div class="column">
				<h1>{{ getScore(this.score, 'element') }}</h1>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Relationship Score :</h1>
			</div>
			<div class="column">
				<h1>{{ getScore(this.score, 'type') }}</h1>
			</div>
		</div>

		<hr />

		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Luck Pillars 1 :</h1>
			</div>
			<div class="column">
				<h1>{{ luckPillarsView[0] }}</h1>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Element Score + LP1 :</h1>
			</div>
			<div class="column">
				<h1>{{ getScore(this.scoreLP1, 'element') }}</h1>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Relationship Score + LP1 :</h1>
			</div>
			<div class="column">
				<h1>{{ getScore(this.scoreLP1, 'type') }}</h1>
			</div>
		</div>

		<hr />

		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Luck Pillars 2 :</h1>
			</div>
			<div class="column">
				<h1>{{ luckPillarsView[1] }}</h1>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Element Score + LP2 :</h1>
			</div>
			<div class="column">
				<h1>{{ getScore(this.scoreLP2, 'element') }}</h1>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Relationship Score + LP2 :</h1>
			</div>
			<div class="column">
				<h1>{{ getScore(this.scoreLP2, 'type') }}</h1>
			</div>
		</div>

		<hr />

		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Luck Pillars 3 :</h1>
			</div>
			<div class="column">
				<h1>{{ luckPillarsView[2] }}</h1>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Element Score + LP3 :</h1>
			</div>
			<div class="column">
				<h1>{{ getScore(this.scoreLP3, 'element') }}</h1>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Relationship Score + LP3 :</h1>
			</div>
			<div class="column">
				<h1>{{ getScore(this.scoreLP3, 'type') }}</h1>
			</div>
		</div>

		<hr />

		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Current Year Pillars :</h1>
			</div>
			<div class="column">
				<h1>{{ getYearPillars }}</h1>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Element Score + LP + Y :</h1>
			</div>
			<div class="column">
				<h1>{{ getScore(this.scoreLPY, 'element') }}</h1>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Relationship Score + LP + Y :</h1>
			</div>
			<div class="column">
				<h1>{{ getScore(this.scoreLPY, 'type') }}</h1>
			</div>
		</div>

		<hr />

		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Current Month Pillars :</h1>
			</div>
			<div class="column">
				<h1>{{ getMonthPillars }}</h1>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Element Score + LP + YM :</h1>
			</div>
			<div class="column">
				<h1>{{ getScore(this.scoreLPYM, 'element') }}</h1>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3 has-text-right">
				<h1>Relationship Score + LP + YM :</h1>
			</div>
			<div class="column">
				<h1>{{ getScore(this.scoreLPYM, 'type') }}</h1>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'selfPower',
	props: [
		'score',
		'pillars',
		'luckPillars',
		'currentPillars',
		'scoreLP1',
		'scoreLP2',
		'scoreLP3',
		'scoreLPY',
		'scoreLPYM',
	],
	computed: {
		getScore() {
			const ELEMENT_KEYS = ['WOOD', 'FIRE', 'EARTH', 'METAL', 'WATER']
			const REL_KEYS = ['Self', 'Output', 'Wealth', 'Control', 'Support']

			const DEFAULTS = {
				element: ELEMENT_KEYS.reduce((acc, k) => ((acc[k] = 0), acc), {}),
				type: REL_KEYS.reduce((acc, k) => ((acc[k] = 0), acc), {}),
			}

			return (source, mode) => {
				const base = { ...DEFAULTS[mode] }
				for (const item of source) {
					const key = mode === 'element' ? item.element : item.type
					if (key in base) base[key] = Number(item.score)
				}
				return base
			}
		},
		getYearPillars() {
			const {
				yearStem: elementType,
				yearBranchAnimal: animal,
				yearBranchHidden = [],
			} = this.currentPillars

			return {
				elementType,
				animal,
				hiddenStems: yearBranchHidden.map((item) => item.elementType),
			}
		},
		getMonthPillars() {
			const {
				monthStem: elementType,
				monthBranchAnimal: animal,
				monthBranchHidden = [],
			} = this.currentPillars

			return {
				elementType,
				animal,
				hiddenStems: monthBranchHidden.map((item) => item.elementType),
			}
		},
		luckPillarsView() {
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
}
hr {
	width: 100%;
}
</style>
