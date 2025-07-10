function average(arr) {
  if (!arr || !arr.length) return 0;
  return arr.reduce((sum, v) => sum + parseFloat(v || 0), 0) / arr.length;
}

export function calculateActivity({ control, samplesData }) {
  if (!control || !samplesData) return [];

  const avgControlBefore = average(control.before);

  return samplesData.map(sample => {
    const activitiesByDay = {};
    
    // Збираємо всі дні з усіх повторностей для цього зразка
    const allDays = new Set();
    sample.repetitions.forEach(rep => {
      rep.days.forEach(dayEntry => {
        if (dayEntry.day) allDays.add(dayEntry.day);
      });
    });

    // Для кожного дня рахуємо активність по всіх повторностях
    Array.from(allDays).forEach(dayLabel => {
      const activitiesForDay = [];
      
      sample.repetitions.forEach(rep => {
        const dayEntry = rep.days.find(d => d.day === dayLabel);
        if (!dayEntry) return;

        const controlDay = control.days.find(d => d.day === dayLabel);
        if (!controlDay) return;

        const avgControlDayValue = average(controlDay.values);
        const sampleBefore = parseFloat(rep.before) || 0;
        const sampleDayValue = parseFloat(dayEntry.value) || 0;

        if (avgControlDayValue === 0 || sampleBefore === 0) return;

        const A = (1 - (avgControlBefore / avgControlDayValue) * (sampleDayValue / sampleBefore)) * 100;
        activitiesForDay.push(A);
      });

      // Середня активність за день
      if (activitiesForDay.length > 0) {
        activitiesByDay[dayLabel] = parseFloat(average(activitiesForDay).toFixed(2));
      }
    });

    // Конвертуємо у формат який очікує таблиця
    const activities = Object.entries(activitiesByDay).map(([day, activity]) => ({
      day,
      activity
    }));

    return {
      sampleId: sample.sampleId,
      name: sample.name,
      form: sample.form,
      concentration: sample.concentration,
      activities
    };
  });
}