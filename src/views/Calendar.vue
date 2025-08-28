<template>
    <div class="wrap section">
        <h1 class="title is-2 has-text-centered mb-5">BaZi Calendar</h1>

        <div class="calendar-controls">
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
        </div>
    </div>
</template>

<script>
export default {
    name: 'calendar',
}
</script>

<style scoped lang="scss">
div.wrap {
    margin-top: 4rem;
    padding: 1.5rem;
}
</style>