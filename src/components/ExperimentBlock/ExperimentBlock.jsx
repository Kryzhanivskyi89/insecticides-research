import React from "react";
import styles from "./styles.module.css";

const ExperimentBlock = ({ title, data = { before: ["", "", ""], days: [] }, concentration = "", onChange, showConcentration = false }) => {
  // Зміна концентрації
  const handleConcentrationChange = (e) => {
    onChange({ ...data, concentration: e.target.value });
  };

  // Зміна before
  const handleBeforeChange = (index, value) => {
    const newBefore = [...data.before];
    newBefore[index] = value;
    onChange({ ...data, before: newBefore });
  };

  // Зміна значення у дні, для повторності valueIndex
  const handleDayChange = (dayIndex, valueIndex, value) => {
    const newDays = [...data.days];
    if (!newDays[dayIndex]) {
      newDays[dayIndex] = { day: "", values: ["", "", ""] };
    }
    newDays[dayIndex].values[valueIndex] = value;
    onChange({ ...data, days: newDays });
  };

  // Зміна мітки дня (номер дня)
  const handleDayLabelChange = (dayIndex, value) => {
    const newDays = [...data.days];
    if (!newDays[dayIndex]) {
      newDays[dayIndex] = { day: "", values: ["", "", ""] };
    }
    newDays[dayIndex].day = value;
    onChange({ ...data, days: newDays });
  };

  // Додати новий день
  const addDay = () => {
    onChange({
      ...data,
      days: [...data.days, { day: "", values: ["", "", ""] }]
    });
  };

  return (
   <div className={styles.container}>
    <h3 className={styles.header}>
    {title}
    {showConcentration && (
      <input
        type="text"
        value={concentration || ""}
        onChange={handleConcentrationChange}
        placeholder="Концентрація"
        className={styles.input}
      />
    )}
  </h3>
    
  <div className={styles.beforeLabel}>Чисельність до обробки:</div>
  <div className={styles.inputRow}>
    {[0, 1, 2].map(i => (
      <input
        key={i}
        type="number"
        className={styles.input}
        value={data.before[i] || ""}
        onChange={e => handleBeforeChange(i, e.target.value)}
        placeholder={`Повторність${i + 1}`}
      />
    ))}
  </div>

  <div className={styles.dayLabel}>Дні обліку:</div>
  {data.days.map((dayEntry, dayIndex) => (
    <div key={dayIndex} className={styles.inputRow}>
      <input
        type="text"
        className={styles.input}
        placeholder="День"
        value={dayEntry.day || ""}
        onChange={e => handleDayLabelChange(dayIndex, e.target.value)}
      />
      {[0, 1, 2].map(i => (
        <input
          key={i}
          type="number"
          className={styles.input}
          value={(dayEntry.values && dayEntry.values[i]) || ""}
          onChange={e => handleDayChange(dayIndex, i, e.target.value)}
          placeholder={`Повторність ${i + 1}`}
        />
      ))}
    </div>
  ))}
  <button type="button" onClick={addDay} className={styles.addButton}>
    + Додати день
  </button>
</div>
  );
};

export default ExperimentBlock;