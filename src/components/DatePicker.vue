<template>
  <div class="date-picker">
    <div class="date-picker-row">
      <select v-model="localDate.year" class="date-select">
        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>
      <span class="separator">년</span>
      
      <select v-model="localDate.month" class="date-select">
        <option v-for="month in months" :key="month.value" :value="month.value">
          {{ month.label }}
        </option>
      </select>
      <span class="separator">월</span>
      
      <select v-model="localDate.day" class="date-select">
        <option v-for="day in days" :key="day.value" :value="day.value">
          {{ day.label }}
        </option>
      </select>
      <span class="separator">일</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value'],
  data() {
    return {
      localDate: {
        year: '2025',
        month: '01',
        day: '01'
      },
      years: ['2024', '2025', '2026', '2027'],
      months: [
        { value: '01', label: '1' },
        { value: '02', label: '2' },
        { value: '03', label: '3' },
        { value: '04', label: '4' },
        { value: '05', label: '5' },
        { value: '06', label: '6' },
        { value: '07', label: '7' },
        { value: '08', label: '8' },
        { value: '09', label: '9' },
        { value: '10', label: '10' },
        { value: '11', label: '11' },
        { value: '12', label: '12' }
      ],
      days: []
    }
  },
  created() {
    if (this.value) {
      this.localDate = { ...this.value }
    }
    this.generateDays()
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal && JSON.stringify(newVal) !== JSON.stringify(this.localDate)) {
          this.localDate = { ...newVal }
        }
      },
      deep: true
    },
    localDate: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.value)) {
          this.$emit('input', { ...val })
        }
      },
      deep: true
    }
  },
  methods: {
    generateDays() {
      this.days = []
      for (let i = 1; i <= 31; i++) {
        const value = i.toString().padStart(2, '0')
        this.days.push({
          value: value,
          label: i.toString()
        })
      }
    }
  }
}
</script>

<style scoped>
.date-picker {
  margin-top: 5px;
}

.date-picker-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.date-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.date-select:focus {
  outline: none;
  border-color: #007bff;
}

.separator {
  font-size: 14px;
  color: #666;
}
</style>