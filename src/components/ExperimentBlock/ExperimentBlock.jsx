import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const ExperimentBlock = ({ title, data, onChange, showConcentration = false, concentration: propConcentration }) => {
  const [blockData, setBlockData] = useState(data);
  const [concentration, setConcentration] = useState(propConcentration || "");

  useEffect(() => {
    setBlockData(data);
  }, [data]);

  useEffect(() => {
    setConcentration(propConcentration || "");
  }, [propConcentration]);

  const handleBeforeChange = (index, value) => {
    const newBefore = [...(blockData.before || ["", "", ""])];
    newBefore[index] = value;
    const newData = { ...blockData, before: newBefore };
    setBlockData(newData);
    
    if (showConcentration) {
      onChange({ data: newData, concentration });
    } else {
      onChange(newData);
    }
  };

  const handleDayLabelChange = (dayIndex, value) => {
    const newDays = [...(blockData.days || [])];
    if (!newDays[dayIndex]) {
      newDays[dayIndex] = { day: "", values: ["", "", ""] };
    }
    newDays[dayIndex].day = value;
    const newData = { ...blockData, days: newDays };
    setBlockData(newData);
    
    if (showConcentration) {
      onChange({ data: newData, concentration });
    } else {
      onChange(newData);
    }
  };

  const handleDayChange = (dayIndex, repetitionIndex, value) => {
    const newDays = [...(blockData.days || [])];
    if (!newDays[dayIndex]) {
      newDays[dayIndex] = { day: "", values: ["", "", ""] };
    }
    if (!newDays[dayIndex].values) {
      newDays[dayIndex].values = ["", "", ""];
    }
    newDays[dayIndex].values[repetitionIndex] = value;
    const newData = { ...blockData, days: newDays };
    setBlockData(newData);
    
    if (showConcentration) {
      onChange({ data: newData, concentration });
    } else {
      onChange(newData);
    }
  };

  const handleConcentrationChange = (e) => {
    const newConcentration = e.target.value;
    setConcentration(newConcentration);
    onChange({ data: blockData, concentration: newConcentration });
  };

  const addDay = () => {
    const newDayLabel = `День ${(blockData.days?.length || 0) + 1}`;
    const newDays = [...(blockData.days || []), { day: newDayLabel, values: ["", "", ""] }];
    const newData = { ...blockData, days: newDays };
    setBlockData(newData);
    
    if (showConcentration) {
      onChange({ data: newData, concentration });
    } else {
      onChange(newData);
    }
  };

  const safeData = {
    before: blockData.before || ["", "", ""],
    days: blockData.days || []
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
            value={safeData.before[i] || ""}
            onChange={e => handleBeforeChange(i, e.target.value)}
            placeholder={`Повторність ${i + 1}`}
          />
        ))}
      </div>

      <div className={styles.dayLabel}>Дні обліку:</div>
      {safeData.days.map((dayEntry, dayIndex) => (
        <div key={dayIndex} className={styles.inputRow}>
          <input
            type="text"
            className={styles.input}
            placeholder="День"
            value={dayEntry?.day || ""}
            onChange={e => handleDayLabelChange(dayIndex, e.target.value)}
          />
          {[0, 1, 2].map(i => (
            <input
              key={i}
              type="number"
              className={styles.input}
              value={(dayEntry?.values && dayEntry.values[i]) || ""}
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