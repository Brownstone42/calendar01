import { toDate } from 'date-fns-tz'
import { BaziCalculator } from '@aharris02/bazi-calculator-by-alvamind'

function getFullPillars(birthday, isTimeKnown) {
	const dateTime = isTimeKnown ? birthday : birthday + 'T12:00:00'
	const birthDate = toDate(dateTime, { timeZone: 'Asia/Bangkok' })

	const calculator = new BaziCalculator(birthDate, 'male', 'Asia/Bangkok', true)
	const completeAnalysis = calculator.getCompleteAnalysis()
	const detailedPillars = completeAnalysis.detailedPillars

	const pillars = {
		dayStem: detailedPillars.day.heavenlyStem,
		monthStem: detailedPillars.month.heavenlyStem,
		yearStem: detailedPillars.year.heavenlyStem,
		dayBranch: detailedPillars.day.earthlyBranch,
		monthBranch: detailedPillars.month.earthlyBranch,
		yearBranch: detailedPillars.year.earthlyBranch,
		luckPillars: completeAnalysis.luckPillars.pillars,
	}

	return pillars
}

function getPillars(birthday, isTimeKnown) {
	const dateTime = isTimeKnown ? birthday : birthday + 'T12:00:00'
	const birthDate = toDate(dateTime, { timeZone: 'Asia/Bangkok' })

	const calculator = new BaziCalculator(birthDate, 'male', 'Asia/Bangkok', true)
	const completeAnalysis = calculator.getCompleteAnalysis()
	const detailedPillars = completeAnalysis.detailedPillars

	const pillars = {
		dayStem: detailedPillars.day.heavenlyStem.elementType,
		monthStem: detailedPillars.month.heavenlyStem.elementType,
		yearStem: detailedPillars.year.heavenlyStem.elementType,
		dayBranchAnimal: detailedPillars.day.earthlyBranch.animal,
		monthBranchAnimal: detailedPillars.month.earthlyBranch.animal,
		yearBranchAnimal: detailedPillars.year.earthlyBranch.animal,
		dayBranchHidden: detailedPillars.day.earthlyBranch.hiddenStems,
		monthBranchHidden: detailedPillars.month.earthlyBranch.hiddenStems,
		yearBranchHidden: detailedPillars.year.earthlyBranch.hiddenStems,
		luckPillars: completeAnalysis.luckPillars.pillars,
	}

	return pillars
}

function getLuckPillars(luckPillars) {
	const currentDate = new Date()
	const currentYear = currentDate.getFullYear()
	let startIndex = -1

	for (let i = 0; i < luckPillars.length; i++) {
		const pillar = luckPillars[i]
		const isYearMatch = currentYear >= pillar.yearStart && currentYear <= pillar.yearEnd

		if (isYearMatch) {
			startIndex = i
			break
		}
	}

	if (startIndex !== -1) {
		const endIndex = Math.min(startIndex + 3, luckPillars.length)
		return luckPillars.slice(startIndex, endIndex)
	}

	return []
}

function getElementScore(pillars, luckPillars, currentPillars, mode) {
	let totalScore = 0
	let score = {
		WOOD: 0,
		FIRE: 0,
		EARTH: 0,
		METAL: 0,
		WATER: 0,
	}

	let percentageScore = {
		WOOD: 0,
		FIRE: 0,
		EARTH: 0,
		METAL: 0,
		WATER: 0,
	}

	score[pillars.monthStem] += 1.25
	score[pillars.yearStem] += 1
	totalScore += 2.25

	pillars.dayBranchHidden.forEach((element, index) => {
		const elementType = element.elementType
		if (index === 0) {
			score[elementType] += 1
			totalScore += 1
		} else {
			score[elementType] += 0.5
			totalScore += 0.5
		}
	})

	pillars.monthBranchHidden.forEach((element, index) => {
		const elementType = element.elementType
		if (index === 0) {
			score[elementType] += 2
			totalScore += 2
		} else {
			score[elementType] += 0.6
			totalScore += 0.5
		}
	})

	pillars.yearBranchHidden.forEach((element, index) => {
		const elementType = element.elementType
		if (index === 0) {
			score[elementType] += 0.75
			totalScore += 0.75
		} else {
			score[elementType] += 0.5
			totalScore += 0.5
		}
	})

	if (luckPillars) {
		score[luckPillars.heavenlyStem.elementType] += 1.5
		totalScore += 1.5

		luckPillars.earthlyBranch.hiddenStems.forEach((element, index) => {
			const elementType = element.elementType
			if (index === 0) {
				score[elementType] += 1
				totalScore += 1
			} else {
				score[elementType] += 0.5
				totalScore += 0.5
			}
		})
	}

	if (currentPillars) {
		score[currentPillars.yearStem] += 1.5
		totalScore += 1.5

		currentPillars.yearBranchHidden.forEach((element, index) => {
			const elementType = element.elementType
			if (index === 0) {
				score[elementType] += 1
				totalScore += 1
			} else {
				score[elementType] += 0.5
				totalScore += 0.5
			}
		})

		if (mode == 'month') {
			score[currentPillars.monthStem] += 1.5
			totalScore += 1.5

			currentPillars.monthBranchHidden.forEach((element, index) => {
				const elementType = element.elementType
				if (index === 0) {
					score[elementType] += 1
					totalScore += 1
				} else {
					score[elementType] += 0.5
					totalScore += 0.5
				}
			})
		}
	}

	for (const element in score) {
		percentageScore[element] = parseFloat(((score[element] / totalScore) * 100).toFixed(1))
	}

	return percentageScore
}

function getRelationship(dayMaster, element) {
	switch (dayMaster) {
		case 'WOOD':
			if (element === 'FIRE') return 'Output'
			if (element === 'EARTH') return 'Wealth'
			if (element === 'METAL') return 'Control'
			if (element === 'WATER') return 'Support'
			break
		case 'FIRE':
			if (element === 'EARTH') return 'Output'
			if (element === 'METAL') return 'Wealth'
			if (element === 'WATER') return 'Control'
			if (element === 'WOOD') return 'Support'
			break
		case 'EARTH':
			if (element === 'METAL') return 'Output'
			if (element === 'WATER') return 'Wealth'
			if (element === 'WOOD') return 'Control'
			if (element === 'FIRE') return 'Support'
			break
		case 'METAL':
			if (element === 'WATER') return 'Output'
			if (element === 'WOOD') return 'Wealth'
			if (element === 'FIRE') return 'Control'
			if (element === 'EARTH') return 'Support'
			break
		case 'WATER':
			if (element === 'WOOD') return 'Output'
			if (element === 'FIRE') return 'Wealth'
			if (element === 'EARTH') return 'Control'
			if (element === 'METAL') return 'Support'
			break
	}
}

function getRelationshipScore(dayMaster, score) {
	let relationshipScore = []
	let selfObject = {}
	let outputObject = {}
	let wealthObject = {}
	let controlObject = {}
	let supportObject = {}

	for (const element in score) {
		if (element == dayMaster) {
			selfObject = {
				element,
				type: 'Self',
				score: score[element],
			}
		} else {
			const relationship = getRelationship(dayMaster, element)

			switch (relationship) {
				case 'Output':
					outputObject = {
						element,
						type: 'Output',
						score: score[element],
					}
					break
				case 'Wealth':
					wealthObject = {
						element,
						type: 'Wealth',
						score: score[element],
					}
					break
				case 'Control':
					controlObject = {
						element,
						type: 'Control',
						score: score[element],
					}
					break
				case 'Support':
					supportObject = {
						element,
						type: 'Support',
						score: score[element],
					}
					break
			}
		}
	}

	relationshipScore.push(selfObject)
	relationshipScore.push(outputObject)
	relationshipScore.push(wealthObject)
	relationshipScore.push(controlObject)
	relationshipScore.push(supportObject)

	return relationshipScore
}

export default {
	getFullPillars,
	getPillars,
	getLuckPillars,
	getElementScore,
	getRelationshipScore,
}
