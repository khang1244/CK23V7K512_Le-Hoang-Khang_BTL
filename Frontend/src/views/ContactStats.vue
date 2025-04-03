<template>
  <div class="max-w-6xl mx-auto px-6 py-8">
    <h2 class="text-3xl font-bold mb-6 flex items-center gap-2">📊 Thống kê danh bạ</h2>

    <div class="grid gap-8">
      <!-- Cột trái -->
      <div class="space-y-6">
        <div class="card">
          <h3>👥 Tổng số liên hệ:</h3>
          <p class="font-bold">{{ stats.total }}</p>
        </div>

        <div class="mt-4 card">
          <h3>❤️ Liên hệ yêu thích</h3>
          <p>{{ stats.favoriteCount }} liên hệ yêu thích</p>
        </div>

        <div class="mt-4 card">
          <h3>❌ Liên hệ không yêu thích</h3>
          <p>{{ stats.total - stats.favoriteCount }} liên hệ không yêu thích</p>
        </div>
      </div>

      <!-- Cột phải: Biểu đồ -->
      <div class="w-full pie-chart">
        <h3 class="text-lg font-semibold text-center">👫 Tỉ lệ giới tính</h3>
        <div>
          <Pie v-if="genderData" :data="genderData" :options="pieOptions" />
        </div>

        <!-- Hiển thị số lượng nam và nữ -->
        <div class="gender-info">
          <span>Nam: {{ stats.genderStats.nam }}</span> |
          <span>Nữ: {{ stats.genderStats.nu }}</span>
        </div>

        <!-- Nút quay lại trang chủ -->
        <div class="mt-6 text-center">
          <router-link to="/" class="btn-return-home">
            Quay lại trang chủ
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const stats = ref({
  total: 0,
  genderStats: {},
  favoriteCount: 0,
});

const genderData = ref(null);

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const total = stats.value.total;
          const value = context.parsed;
          const percent = ((value / total) * 100).toFixed(1);
          return `${context.label}: ${value} (${percent}%)`;
        },
      },
    },
  },
};

onMounted(async () => {
  const res = await axios.get("http://localhost:3000/api/contacts/stats");
  stats.value = res.data;

  genderData.value = {
    labels: ['Nam', 'Nữ'],
    datasets: [
      {
        data: [
          res.data.genderStats.nam,
          res.data.genderStats.nu,
        ],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };
});
</script>

<style scoped>
@import "@/assets/ContactStats.css";
</style>
