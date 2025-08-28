<template>
    <div class="calendar-container">
        <span class="is-5 title">Self Analysis</span>
        <div class="date-input-wrapper columns mt-4">
            <div class="column is-12-mobile is-8-tablet">
                <div class="date-input-container box">
                    <div class="date-input-row columns py-0 mb-0">
                        <div class="column is-7 py-0">
                            <span>Birth date</span>
                        </div>
                        <div class="column is-5 py-0">
                            <span>Birth time</span>
                        </div>
                    </div>
                    <div class="date-input-row columns">
                        <div class="column is-7">
                            <vue-date-picker
                                v-model="date"
                                placeholder="yyyy-MM-dd"
                                :enable-time-picker="false"
                                model-type="format"                        
                                :format="'yyyy-MM-dd'"
                                :year-range="[1850, 2150]"                                
                                text-input>
                            </vue-date-picker>
                        </div>
                        <div class="column is-5">
                            <vue-date-picker 
                                v-model="time"
                                placeholder="HH:mm"
                                model-type="format"
                                :format="'HH:mm'"
                                time-picker
                                text-input
                                :disabled="!isTimeKnown">
                            </vue-date-picker>
                        </div>
                    </div>
                    <div class="date-input-row columns pt-0">
                        <div class="column is-7 pt-0">
                            <button class="button is-primary" @click="calculate">Calculate</button>
                            <button class="button is-info ml-4" @click="report">Report</button>
                        </div>
                        <div class="column is-5 pt-0">
                            <input type="checkbox" v-model="isTimeKnown" disabled>
                            <span class="ml-2">Know time? (PREMIUM)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-wrapper columns mt-4" v-if="dayStem">            
            <div class="column is-6-tablet is-12-mobile">
                <div class="card card-container">
                    <div class="status-wrapper p-4" 
                        :style="{ backgroundImage: `url(${cardMonkeyWater})` }">
                        <div class="logo-wrapper">
                            <img src="/images/logo-monkey-water.png" alt="">
                        </div>

                        <div class="status-container">
                            <div class="status-row">
                                <img :src="getImgPath('self1', score.self1)" alt="">
                            </div>
                            <div class="status-row">
                                <img :src="getImgPath('self2', score.self2)" alt="">
                            </div>
                            <div class="status-row">
                                <img :src="getImgPath('support1', score.support1)" alt="">
                            </div>
                            <div class="status-row">
                                <img :src="getImgPath('support2', score.support2)" alt="">
                            </div>
                            <div class="status-row">
                                <img :src="getImgPath('output1', score.output1)" alt="">
                            </div>
                            <div class="status-row">
                                <img :src="getImgPath('output2', score.output2)" alt="">
                            </div>
                            <div class="status-row">
                                <img :src="getImgPath('wealth1', score.wealth1)" alt="">
                            </div>
                            <div class="status-row">
                                <img :src="getImgPath('wealth2', score.wealth2)" alt="">
                            </div>
                            <div class="status-row">
                                <img :src="getImgPath('control1', score.control1)" alt="">
                            </div>
                            <div class="status-row">
                                <img :src="getImgPath('control2', score.control2)" alt="">
                            </div>                          
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { toDate, formatInTimeZone } from 'date-fns-tz'
import { parse, addHours, isBefore, isValid, format, addDays } from 'date-fns'
import { BaziCalculator } from '@aharris02/bazi-calculator-by-alvamind'
import * as XLSX from 'xlsx'

export default {
    name: 'SelfAnalysis',
    data() {
        return {
            date: '1989-08-26',
            time: '',
            isTimeKnown: false,
            gender: 'male',
            timeZone: 'Asia/Bangkok',
            score: {},
            dayStem: '',
            dayBranchAnimal: '',

            cardMonkeyWater: '/images/card-monkey-water.png'
        }
    },
    methods: {
        getImgPath(topic, score) {
            //bar-v1-water-self2-6-14.png
            const path = `/images/status-bar/bar-v1-water-${topic}-${score}-14.png`
            console.log(path)
            return path
        },
        exportToExcel(results, from, to) {
            const worksheet = XLSX.utils.json_to_sheet(results)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, `${from}-${to}`)
            XLSX.writeFile(workbook, `report-${from}-${to}.xlsx`)
        },
        calculate() {
            const dateTime = this.isTimeKnown ? this.date + 'T' + this.time + ':00' : this.date + 'T12:00:00'
            const birthDate = toDate(dateTime, { timeZone: this.timeZone })
            
            if (!isValid(birthDate)) {
                alert('Invalid Date')
                return
            }

            const calculator = new BaziCalculator(birthDate, this.gender, this.timeZone, this.isTimeKnown)
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
                yearBranchHidden: detailedPillars.year.earthlyBranch.hiddenStems
            }

            this.dayStem = pillars.dayStem.toLowerCase()

            const elementScore = this.calculateElementScore(pillars)
            const finalScore = this.calculateFinalScore(pillars.dayStem, elementScore.percentageScore)

            console.log(finalScore)

            for (const item of finalScore) {
                if (item.type == 'Self') {
                    switch (true) {
                        case item.score >= 80:
                            this.score.self1 = 14
                            this.score.self2 = 14
                            break;
                        case item.score >= 70:
                            this.score.self1 = 14
                            this.score.self2 = 12
                            break;
                        case item.score >= 60:
                            this.score.self1 = 12
                            this.score.self2 = 10
                            break;
                        case item.score >= 50:
                            this.score.self1 = 12
                            this.score.self2 = 8
                            break;
                        case item.score >= 40:
                            this.score.self1 = 12
                            this.score.self2 = 8
                            break;
                        case item.score >= 30:
                            this.score.self1 = 10
                            this.score.self2 = 6
                            break;
                        case item.score >= 20:
                            this.score.self1 = 10
                            this.score.self2 = 4
                            break;
                        case item.score >= 10:
                            this.score.self1 = 6
                            this.score.self2 = 2
                            break;
                        case item.score > 0:
                            this.score.self1 = 4
                            this.score.self2 = 0
                            break;
                        case item.score == 0:
                            this.score.self1 = 0
                            this.score.self2 = 0
                            break;
                    }
                } else if (item.type == 'Support') {
                    switch (true) {
                        case item.score >= 80:
                            this.score.support1 = 14
                            this.score.support2 = 14
                            break;
                        case item.score >= 70:
                            this.score.support1 = 12
                            this.score.support2 = 12
                            break;
                        case item.score >= 60:
                            this.score.support1 = 12
                            this.score.support2 = 10
                            break;
                        case item.score >= 50:
                            this.score.support1 = 12
                            this.score.support2 = 10
                            break;
                        case item.score >= 40:
                            this.score.support1 = 10
                            this.score.support2 = 8
                            break;
                        case item.score >= 30:
                            this.score.support1 = 10
                            this.score.support2 = 6
                            break;
                        case item.score >= 20:
                            this.score.support1 = 8
                            this.score.support2 = 2
                            break;
                        case item.score >= 10:
                            this.score.support1 = 6
                            this.score.support2 = 0
                            break;
                        case item.score > 0:
                            this.score.support1 = 4
                            this.score.support2 = 0
                            break;
                        case item.score == 0:
                            this.score.support1 = 0
                            this.score.support2 = 0
                            break;
                    }
                } else if (item.type == 'Output') {
                    switch (true) {
                        case item.score >= 80:
                            this.score.output1 = 10
                            this.score.output2 = 2
                            break;
                        case item.score >= 70:
                            this.score.output1 = 10
                            this.score.output2 = 2
                            break;
                        case item.score >= 60:
                            this.score.output1 = 10
                            this.score.output2 = 4
                            break;
                        case item.score >= 50:
                            this.score.output1 = 12
                            this.score.output2 = 4
                            break;
                        case item.score >= 40:
                            this.score.output1 = 12
                            this.score.output2 = 6
                            break;
                        case item.score >= 30:
                            this.score.output1 = 14
                            this.score.output2 = 8
                            break;
                        case item.score >= 20:
                            this.score.output1 = 10
                            this.score.output2 = 12
                            break;
                        case item.score >= 10:
                            this.score.output1 = 6
                            this.score.output2 = 8
                            break;
                        case item.score > 0:
                            this.score.output1 = 4
                            this.score.output2 = 6
                            break;
                        case item.score == 0:
                            this.score.output1 = 0
                            this.score.output2 = 2
                            break;
                    }
                } else if (item.type == 'Wealth') {
                    switch (true) {
                        case item.score >= 80:
                            this.score.wealth1 = 14
                            this.score.wealth2 = 2
                            break;
                        case item.score >= 70:
                            this.score.wealth1 = 14
                            this.score.wealth2 = 2
                            break;
                        case item.score >= 60:
                            this.score.wealth1 = 14
                            this.score.wealth2 = 4
                            break;
                        case item.score >= 50:
                            this.score.wealth1 = 12
                            this.score.wealth2 = 6
                            break;
                        case item.score >= 40:
                            this.score.wealth1 = 12
                            this.score.wealth2 = 8
                            break;
                        case item.score >= 30:
                            this.score.wealth1 = 10
                            this.score.wealth2 = 10
                            break;
                        case item.score >= 20:
                            this.score.wealth1 = 8
                            this.score.wealth2 = 12
                            break;
                        case item.score >= 10:
                            this.score.wealth1 = 8
                            this.score.wealth2 = 8
                            break;
                        case item.score > 0:
                            this.score.wealth1 = 6
                            this.score.wealth2 = 6
                            break;
                        case item.score == 0:
                            this.score.wealth1 = 4
                            this.score.wealth2 = 4
                            break;
                    }
                } else if (item.type == 'Control') {
                    switch (true) {
                        case item.score >= 80:
                            this.score.control1 = 14
                            this.score.control2 = 8
                            break;
                        case item.score >= 70:
                            this.score.control1 = 14
                            this.score.control2 = 10
                            break;
                        case item.score >= 60:
                            this.score.control1 = 12
                            this.score.control2 = 10
                            break;
                        case item.score >= 50:
                            this.score.control1 = 10
                            this.score.control2 = 8
                            break;
                        case item.score >= 40:
                            this.score.control1 = 8
                            this.score.control2 = 6
                            break;
                        case item.score >= 30:
                            this.score.control1 = 8
                            this.score.control2 = 8
                            break;
                        case item.score >= 20:
                            this.score.control1 = 6
                            this.score.control2 = 8
                            break;
                        case item.score >= 10:
                            this.score.control1 = 4
                            this.score.control2 = 6
                            break;
                        case item.score > 0:
                            this.score.control1 = 2
                            this.score.control2 = 4
                            break;
                        case item.score == 0:
                            this.score.control1 = 0
                            this.score.control2 = 2
                            break;
                    }
                }
            }
            
            console.log(this.score)
        },
        getRelationship(dayMaster, element) {
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
        },
        calculateFinalScore(dayMaster, score){
            let finalScore = []
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
                        score: score[element]
                    }
                } else {
                    const relationship = this.getRelationship(dayMaster, element)
                    
                    switch(relationship) {
                        case 'Output':
                            outputObject = {
                                element,
                                type: 'Output',
                                score: score[element]
                            }
                            break
                        case 'Wealth':
                            wealthObject = {
                                element,
                                type: 'Wealth',
                                score: score[element]
                            }
                            break
                        case 'Control':
                            controlObject = {
                                element,
                                type: 'Control',
                                score: score[element]
                            }
                            break
                        case 'Support':
                            supportObject = {
                                element,
                                type: 'Support',
                                score: score[element]
                            }
                            break
                    }
                }
            }

            finalScore.push(selfObject)
            finalScore.push(outputObject)
            finalScore.push(wealthObject)
            finalScore.push(controlObject)
            finalScore.push(supportObject)

            return finalScore
        },
        calculateElementScore(pillars) {
            let score = {
                WOOD: 0,
                FIRE: 0,
                EARTH: 0,
                METAL: 0,
                WATER: 0
            }

            let percentageScore = {
                WOOD: 0,
                FIRE: 0,
                EARTH: 0,
                METAL: 0,
                WATER: 0
            }

            let totalScore = 0            

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
                    score[elementType] += 0.5
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

            for (const element in score) {
                percentageScore[element] = (score[element] / totalScore) * 100;
            }

            return { score, totalScore, percentageScore }
        },
        report() {
            const startDate = '1989-01-01'
            const endDate = '2002-12-31'
            const report = []

            let currentDate = parse(startDate, 'yyyy-MM-dd', new Date())
            const finalDate = parse(endDate, 'yyyy-MM-dd', new Date())

            while (!isBefore(finalDate, currentDate)) {
                const displayDate = format(currentDate, 'yyyy-MM-dd')
                const dateTime = displayDate + 'T12:00:00'
                //console.log(dateTime)
                const birthDate = toDate(dateTime, { timeZone: this.timeZone })

                if (!isValid(birthDate)) {
                    alert('Invalid Date')
                    return
                }

                const calculator = new BaziCalculator(birthDate, this.gender, this.timeZone, false)
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
                    yearBranchHidden: detailedPillars.year.earthlyBranch.hiddenStems
                }

                const elementScore = this.calculateElementScore(pillars)
                const finalScore = this.calculateFinalScore(pillars.dayStem, elementScore.percentageScore)

                const reportObject = {
                    displayDate,
                    self: parseFloat(finalScore[0].score.toFixed(1)),
                    output: parseFloat(finalScore[1].score.toFixed(1)),
                    wealth: parseFloat(finalScore[2].score.toFixed(1)),
                    control: parseFloat(finalScore[3].score.toFixed(1)),
                    support: parseFloat(finalScore[4].score.toFixed(1))
                }

                report.push(reportObject)

                currentDate = addDays(currentDate, 1)
            }

            console.log(report)
            this.exportToExcel(report, '1989', '2002')
        },
    }
}
</script>

<style scoped lang="scss">
.columns {
    display: flex;
    width: 100%;
}
.column {
    display: flex;
}
.calendar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.date-input-wrapper {
    justify-content: center;
}
.date-input-container {
    flex-wrap: wrap;
    display: flex;
}
.date-input-row {
    align-items: center;
}
span.title {
    margin-bottom: 0;
}

.card-wrapper {
    max-width: 700px;
    flex-wrap: wrap;
    font-family: 'D-DIN Condensed', sans-serif;
}
@media (max-width: 768px) {
    .card-wrapper {
        max-width: 345px !important;
    }
}
.logo-wrapper {
    display: flex;
    width: 100%;
    justify-content: end;
}
.logo-wrapper img {
    width: 30%;
    margin-right: -20px;
    margin-top: -15px;
}
.card-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
}
.status-wrapper {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    padding-bottom: 150% !important;
}
.status-container {
    position: absolute;
    top: 49%;
    left: 0;
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
}
.status-container span {
    font-size: 10px;
}
.status-row {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
}
.status-row img {
    width: 100%;
}
@media (max-width: 400px) {
    .status-row img {
        width: 90% !important;
    }
}
@media (max-width: 340px) {
    .status-row img {
        width: 85% !important;
    }
}
</style>