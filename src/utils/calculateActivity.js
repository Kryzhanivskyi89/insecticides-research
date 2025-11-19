

function average(arr) {
  if (!arr || arr.length === 0) return 0;
  const validValues = arr.filter(v => v !== "" && v !== null && v !== undefined && !isNaN(parseFloat(v)));
  if (validValues.length === 0) return 0;
  return validValues.reduce((sum, v) => sum + parseFloat(v), 0) / validValues.length;
}

export function calculateActivity({ control, samplesData }) {
  if (!control || !samplesData || samplesData.length === 0) {
    console.warn("calculateActivity: Відсутні дані для розрахунку.");
    return [];
  }

  const avgControlBefore = average(control.before);

  return samplesData.map(sample => {
    const activities = [];
    const allControlDaysLabels = control.days.map(d => d.day);

    allControlDaysLabels.forEach(dayLabel => {
      const activitiesForDay = [];
      
      const controlDayEntry = control.days.find(d => d.day === dayLabel);
      
      if (!controlDayEntry) {
        return; 
      }

      const avgControlDayValue = average(controlDayEntry.values);

      sample.repetitions.forEach(rep => {
        const dayEntry = rep.days.find(d => d.day === dayLabel);
        
        if (!dayEntry) {
          return;
        }

        const sampleBefore = parseFloat(rep.before);
        const sampleDayValue = parseFloat(dayEntry.value);

        if (isNaN(sampleBefore) || isNaN(sampleDayValue) || isNaN(avgControlBefore) || isNaN(avgControlDayValue)) {
            return;
        }

        if (avgControlDayValue === 0 || sampleBefore === 0) {
           return; 
        }

        const A = (1 - (avgControlBefore / avgControlDayValue) * (sampleDayValue / sampleBefore)) * 100;
        activitiesForDay.push(A);
      });

      if (activitiesForDay.length > 0) {
        activities.push({
          day: dayLabel,
          activity: parseFloat(average(activitiesForDay).toFixed(2)) 
        });
      }
    });

    return {
      sampleId: sample.sampleId,
      name: sample.name,
      form: sample.form,
      state: sample.state, 
      concentration: sample.concentration,
      activities: activities
    };
  });
}
