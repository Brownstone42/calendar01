import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import Calendar from '../views/Calendar.vue'
import Admin from '../views/Admin.vue'

import SelfAnalysis from '@/components/calendar/SelfAnalysis.vue'
import SelfYearly from '@/components/calendar/SelfYearly.vue'



const routes = [
	{
        path: '/',
        name: 'HomePage',
        component: HomePage,
    },
    {
        path: '/admin',
        name: 'Admin',
        component: Admin,
    },
	{
        path: '/Calendar',
        component: Calendar,
		children: [
			{
                path: 'SelfAnalysis',
                name: 'Calendar-SelfAnalysis',
                component: SelfAnalysis,
            },
			{
                path: 'SelfYearly',
                name: 'Calendar-SelfYearly',
                component: SelfYearly,
            },
		]
    }
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
})

export default router