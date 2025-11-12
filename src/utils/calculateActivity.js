// src/utils/calculateActivity.js

function average(arr) {
  if (!arr || arr.length === 0) return 0;
  // Фільтруємо нечислові значення (порожні рядки, null, undefined)
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
    const activities = []; // Зберігатимемо тут об'єкти { day: "День X", activity: N }
    
    // Збираємо всі унікальні дні з контролю, щоб переконатися, що обчислюємо для всіх наявних днів
    const allControlDaysLabels = control.days.map(d => d.day);

    allControlDaysLabels.forEach(dayLabel => {
      const activitiesForDay = [];
      
      const controlDayEntry = control.days.find(d => d.day === dayLabel);
      
      // Якщо немає даних контролю для цього дня, пропускаємо
      if (!controlDayEntry) {
        // console.warn(`calculateActivity: Відсутні дані контролю для ${dayLabel}`);
        return; 
      }

      const avgControlDayValue = average(controlDayEntry.values);

      // Проходимося по кожному повторенню зразка
      sample.repetitions.forEach(rep => {
        const dayEntry = rep.days.find(d => d.day === dayLabel);
        
        // Якщо немає даних зразка для цього повторення або дня, пропускаємо
        if (!dayEntry) {
          // console.warn(`calculateActivity: Відсутні дані для зразка ${sample.sampleId}, повторення, день ${dayLabel}`);
          return;
        }

        const sampleBefore = parseFloat(rep.before);
        const sampleDayValue = parseFloat(dayEntry.value);

        // Перевірка на валідність вхідних даних для розрахунку
        if (isNaN(sampleBefore) || isNaN(sampleDayValue) || isNaN(avgControlBefore) || isNaN(avgControlDayValue)) {
            // console.warn(`calculateActivity: Нечислові дані для розрахунку активності для зразка ${sample.sampleId}, день ${dayLabel}. Пропускаємо це повторення.`);
            return;
        }

        if (avgControlDayValue === 0 || sampleBefore === 0) {
            // console.warn(`calculateActivity: Ділення на нуль для зразка ${sample.sampleId}, день ${dayLabel}. avgControlDayValue: ${avgControlDayValue}, sampleBefore: ${sampleBefore}`);
            return; // Уникаємо ділення на нуль
        }

        const A = (1 - (avgControlBefore / avgControlDayValue) * (sampleDayValue / sampleBefore)) * 100;
        activitiesForDay.push(A);
      });

      // Середня активність за день, якщо є хоча б одне валідне значення
      if (activitiesForDay.length > 0) {
        activities.push({
          day: dayLabel,
          activity: parseFloat(average(activitiesForDay).toFixed(2)) // Обмежуємо до 2 знаків після коми
        });
      }
    });

    return {
      sampleId: sample.sampleId,
      name: sample.name,
      form: sample.form,
      state: sample.state, // Додано state для перевірки "Бітоксибациліну сухого"
      concentration: sample.concentration,
      activities: activities
    };
  });
}

// function average(arr) {
//   if (!arr || !arr.length) return 0;
//   return arr.reduce((sum, v) => sum + parseFloat(v || 0), 0) / arr.length;
// }

// export function calculateActivity({ control, samplesData }) {
//   if (!control || !samplesData) return [];

//   const avgControlBefore = average(control.before);

//   return samplesData.map(sample => {
//     const activitiesByDay = {};
    
//     // Збираємо всі дні з усіх повторностей для цього зразка
//     const allDays = new Set();
//     sample.repetitions.forEach(rep => {
//       rep.days.forEach(dayEntry => {
//         if (dayEntry.day) allDays.add(dayEntry.day);
//       });
//     });

//     // Для кожного дня рахуємо активність по всіх повторностях
//     Array.from(allDays).forEach(dayLabel => {
//       const activitiesForDay = [];
      
//       sample.repetitions.forEach(rep => {
//         const dayEntry = rep.days.find(d => d.day === dayLabel);
//         if (!dayEntry) return;

//         const controlDay = control.days.find(d => d.day === dayLabel);
//         if (!controlDay) return;

//         const avgControlDayValue = average(controlDay.values);
//         const sampleBefore = parseFloat(rep.before) || 0;
//         const sampleDayValue = parseFloat(dayEntry.value) || 0;

//         if (avgControlDayValue === 0 || sampleBefore === 0) return;

//         const A = (1 - (avgControlBefore / avgControlDayValue) * (sampleDayValue / sampleBefore)) * 100;
//         activitiesForDay.push(A);
//       });

//       // Середня активність за день
//       if (activitiesForDay.length > 0) {
//         activitiesByDay[dayLabel] = parseFloat(average(activitiesForDay).toFixed(2));
//       }
//     });

//     // Конвертуємо у формат який очікує таблиця
//     const activities = Object.entries(activitiesByDay).map(([day, activity]) => ({
//       day,
//       activity
//     }));

//     return {
//       sampleId: sample.sampleId,
//       name: sample.name,
//       form: sample.form,
//       concentration: sample.concentration,
//       activities
//     };
//   });
// }