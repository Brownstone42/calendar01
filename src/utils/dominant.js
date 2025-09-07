const ELEMENT_KEYS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']

const STEM_CHAR_TO_ELEMENT = {
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
}

const SEASON_MAP = {
	Tiger: {
		name: 'Early Spring',
		score: {
			Wood: 1.3,
			Fire: 1.0,
			Earth: 1.0,
			Metal: 0.7,
			Water: 1.0,
		},
	},
	Rabbit: {
		name: 'Spring',
		score: {
			Wood: 1.3,
			Fire: 1.0,
			Earth: 1.0,
			Metal: 0.7,
			Water: 1.0,
		},
	},
	Dragon: {
		name: 'Late Spring',
		score: {
			Wood: 1.3,
			Fire: 1.0,
			Earth: 1.3,
			Metal: 0.7,
			Water: 0.7,
		},
	},
	Snake: {
		name: 'Early Summer',
		score: {
			Wood: 0.7,
			Fire: 1.3,
			Earth: 1.0,
			Metal: 0.7,
			Water: 0.7,
		},
	},
	Horse: {
		name: 'Summer',
		score: {
			Wood: 0.7,
			Fire: 1.3,
			Earth: 1.0,
			Metal: 0.7,
			Water: 0.7,
		},
	},
	Goat: {
		name: 'Late Summer',
		score: {
			Wood: 0.7,
			Fire: 1.3,
			Earth: 1.3,
			Metal: 0.7,
			Water: 0.7,
		},
	},
	Monkey: {
		name: 'Early Autumn',
		score: {
			Wood: 0.7,
			Fire: 1.0,
			Earth: 1.0,
			Metal: 1.3,
			Water: 1.0,
		},
	},
	Rooster: {
		name: 'Autumn',
		score: {
			Wood: 0.7,
			Fire: 1.0,
			Earth: 1.0,
			Metal: 1.3,
			Water: 1.0,
		},
	},
	Dog: {
		name: 'Late Autumn',
		score: {
			Wood: 0.7,
			Fire: 1.0,
			Earth: 1.3,
			Metal: 1.3,
			Water: 0.7,
		},
	},
	Pig: {
		name: 'Early Winter',
		score: {
			Wood: 1.0,
			Fire: 0.7,
			Earth: 1.0,
			Metal: 1.0,
			Water: 1.3,
		},
	},
	Rat: {
		name: 'Winter',
		score: {
			Wood: 1.0,
			Fire: 0.7,
			Earth: 1.0,
			Metal: 1.0,
			Water: 1.3,
		},
	},
	Ox: {
		name: 'Late Winter',
		score: {
			Wood: 0.7,
			Fire: 0.7,
			Earth: 1.3,
			Metal: 1.0,
			Water: 1.3,
		},
	},
}

const ROOT_BONUS = { primary: 0.3, secondary: 0.2, tertiary: 0.1 }

function zeroTotals() {
	return ELEMENT_KEYS.reduce((acc, k) => ((acc[k] = 0), acc), {})
}

function normalizeElement(el) {
	if (!el) return null
	const up = String(el).trim().toUpperCase()
	if (up === 'WOOD') return 'Wood'
	if (up === 'FIRE') return 'Fire'
	if (up === 'EARTH') return 'Earth'
	if (up === 'METAL') return 'Metal'
	if (up === 'WATER') return 'Water'
	return null
}

function stemToElement(stem) {
	const raw = stem?.elementType || STEM_CHAR_TO_ELEMENT[stem?.character]
	return normalizeElement(raw)
}

function hiddenWeights(len) {
	if (len === 1) return [1.0]
	if (len === 2) return [0.7, 0.3]
	if (len >= 3) return [0.7, 0.2, 0.1].slice(0, len)
	return []
}

function rankFromIndex(idx) {
	if (idx === 0) return 'primary'
	if (idx === 1) return 'secondary'
	if (idx === 2) return 'tertiary'
	return null
}

function matchRootRank(stem, branch) {
	if (!stem || !branch) return null
	const stemChar = stem.character
	const hs = branch.hiddenStems || []
	const idx = hs.findIndex((h) => h?.character === stemChar) // match ตัวอักษรก้านตรง ๆ
	return rankFromIndex(idx)
}

function getSeason(pillars) {
	const animal = pillars.monthBranch.animal
	return SEASON_MAP[animal]
}

function getWeightScore(pillars) {
	const totals = zeroTotals()
	const add = (el, amt) => {
		if (!el || !Number.isFinite(amt)) return
		totals[el] += amt
	}

	// Stems: +1.0 each
	const stems = [pillars?.yearStem, pillars?.monthStem, pillars?.dayStem]
	for (const s of stems) {
		const el = stemToElement(s)
		add(el, 1.0)
	}

	// Branch hidden stems with weights
	const branches = [pillars?.yearBranch, pillars?.monthBranch, pillars?.dayBranch]
	for (const b of branches) {
		const hs = b?.hiddenStems || []
		const w = hiddenWeights(hs.length)
		hs.forEach((h, idx) => {
			const el = stemToElement(h)
			add(el, w[idx] ?? 0)
		})
	}

	return { totals }
}

function getSeasonScore(pillars, weightScore) {
	const multipliers = getSeason(pillars).score
	const totals = zeroTotals()
	const baseTotals = weightScore.totals

	for (const el of ELEMENT_KEYS) {
		const base = Number(baseTotals[el])
		const mul = Number(multipliers[el])
		totals[el] = base * mul
	}

	return { totals }
}

function getRootScore(pillars, seasonScore) {
	const totals = zeroTotals()

	for (const el of ELEMENT_KEYS) {
		totals[el] = seasonScore.totals?.[el]
	}

	const pairs = [
		{ pos: 'year', stem: pillars?.yearStem, branch: pillars?.yearBranch },
		{ pos: 'month', stem: pillars?.monthStem, branch: pillars?.monthBranch },
		{ pos: 'day', stem: pillars?.dayStem, branch: pillars?.dayBranch },
	]

	for (const p of pairs) {
		const rank = matchRootRank(p.stem, p.branch)
		if (!rank) continue
		const element = stemToElement(p.stem)
		const bonus = ROOT_BONUS[rank] ?? 0
		if (element && Number.isFinite(bonus)) {
			totals[element] += bonus
		}
	}

	return { totals }
}

function getFinalScore(rootScore, luckPillars) {
	const baseTotals = rootScore?.totals ?? rootScore ?? {}
	const KEYS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']

	return luckPillars.map((lp) => {
		// clone base เป็น “เลข” ต่อธาตุเท่านั้น
		const out = Object.fromEntries(KEYS.map((k) => [k, Number(baseTotals[k] || 0)]))

		const add = (el, amt) => {
			if (!el || !Number.isFinite(amt)) return
			out[el] += amt
		}

		// +1 จาก heavenly stem
		const stemEl = stemToElement(lp?.heavenlyStem)
		add(stemEl, 1.0)

		// +weights จาก hidden stems
		const hs = lp?.earthlyBranch?.hiddenStems || []
		const weights = hiddenWeights(hs.length) // [1] | [0.7,0.3] | [0.7,0.2,0.1]
		hs.forEach((h, idx) => add(stemToElement(h), weights[idx] ?? 0))

		// ✅ คืน plain object เช่น {Wood:0.2, Fire:1.4, ...}
		return out
	})
}

function getFinalScorePercent(finalScore) {
	const total = Object.values(finalScore).reduce((sum, v) => sum + v, 0)
	const out = {}

	for (const [key, value] of Object.entries(finalScore)) {
		const percent = (value / total) * 100
		out[key] = percent.toFixed(2)
	}

	return out
}

export default {
	getWeightScore,
	getSeasonScore,
	getSeason,
	getRootScore,
	getFinalScore,
	getFinalScorePercent,
}
