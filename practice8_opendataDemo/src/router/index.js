import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../components/HomeView.vue';
import AirQualityView from '../components/AirQualityView.vue';
import BikeStationInfo from '../components/BikeStationInfo.vue';
import CWADatasetView from '../components/CWADatasetView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/airquality',
        name: 'airquality',
        component: AirQualityView,
    },
    {
        path: '/youbikemap',
        name: 'youbikemap',
        component: BikeStationInfo,
    },
    {
      path: '/cwadataset',
      name: 'cwadataset',
      component: CWADatasetView,
    }
  ]
})

export default router