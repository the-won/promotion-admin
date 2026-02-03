<template>
  <div class="date-picker">
    <div class="form-row">
      <div class="form-group">
        <select v-model="localDate.year" class="form-select">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <span class="date-separator">년</span>
      
      <div class="form-group">
        <select v-model="localDate.month" class="form-select">
          <option v-for="month in months" :key="month.value" :value="month.value">
            {{ month.label }}
          </option>
        </select>
      </div>
      <span class="date-separator">월</span>
      
      <div class="form-group">
        <select v-model="localDate.day" class="form-select">
          <option v-for="day in days" :key="day.value" :value="day.value">
            {{ day.label }}
          </option>
        </select>
      </div>
      <span class="date-separator">일</span>
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
/* .date-picker {
  margin-top: 8px;
} */

.date-picker .form-row {
  align-items: center;
  gap: 0;
}

.date-picker .form-group {
  flex: 0 0 auto;
  min-width: 70px;
}

.date-separator {
  font-size: 11px;
  color: var(--color-text-secondary, #64748b);
  padding: 0 4px;
}
</style>