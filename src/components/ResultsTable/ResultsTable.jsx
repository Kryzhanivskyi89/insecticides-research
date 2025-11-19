
import styles from "./styles.module.css";

function average(arr) {
  if (!arr || arr.length === 0) return "-";
  const validValues = arr.filter(v => v !== "" && v !== null && v !== undefined && !isNaN(parseFloat(v)));
  if (validValues.length === 0) return "-";
  const sum = validValues.reduce((s, v) => s + parseFloat(v), 0);
  return (sum / validValues.length).toFixed(2);
}

const ResultsTable = ({ experiment = {}, activityData = [], conclusion = "", onConclusionChange }) => {
  const control = experiment.control || { before: [], days: [] };
  const samplesData = experiment.samplesData || [];

  const allDaysSet = new Set();
  control.days.forEach(d => d?.day && allDaysSet.add(d.day));
  samplesData.forEach(sample => {
    sample.repetitions?.forEach(rep => {
      rep.days?.forEach(d => d?.day && allDaysSet.add(d.day));
    });
  });
  const days = Array.from(allDaysSet).sort((a, b) => {
    const dayNumA = parseInt(a.replace('День ', ''));
    const dayNumB = parseInt(b.replace('День ', ''));
    return dayNumA - dayNumB;
  });

  const isBitoxDry = (sample) => {
    if (!sample.name || !sample.state) return false;
    const name = sample.name.toLowerCase().trim();
    const state = sample.state.toLowerCase().trim();
    const isBitox = name.includes("бітоксибацилін") || name.includes("битоксибацилин") || name.includes("bitoxybacillin");
    const isDry = state === "сухий" || state === "сухой" || state === "dry";
    return isBitox && isDry;
  };

  const hasBitoxDry = samplesData.some(sample => isBitoxDry(sample));

  const renderControlRow = () => {
    const valuesByDay = {};
    control.days.forEach(d => {
      if (d.day && d.values) valuesByDay[d.day] = d.values;
    });

    return (
      <tr className={styles.rowControl} key="control">
        <td className={styles.cell}>Контроль</td>
        <td className={styles.cell}>-</td> 
        {hasBitoxDry && <td className={styles.cell}>{average(control.before)}</td>}
        {hasBitoxDry && days.map(day => (
          <td className={styles.cell} key={`ctrl-val-day-${day}`}>{valuesByDay[day] ? average(valuesByDay[day]) : "-"}</td>
        ))}
        {days.map(day => (
          <td className={styles.cell} key={`ctrl-activity-${day}`}>-</td>
        ))}
      </tr>
    );
  };

  const renderSampleRows = () => {
    return samplesData.map(sample => {
      const sampleActivity = activityData.find(a => a.sampleId === sample.sampleId);
      const bitoxDry = isBitoxDry(sample);
      
      const beforeValues = sample.repetitions?.map(rep => rep.before) || [];

      const avgValuesByDayForBitox = {};
      if (bitoxDry) {
        days.forEach(day => {
          const valuesForDay = [];
          sample.repetitions?.forEach(rep => {
            const dayEntry = rep.days?.find(d => d.day === day);
            if (dayEntry && dayEntry.value !== "" && dayEntry.value !== null && dayEntry.value !== undefined) {
              valuesForDay.push(dayEntry.value);
            }
          });
          avgValuesByDayForBitox[day] = valuesForDay;
        });
      }

      return (
        <tr className={styles.rowSample} key={sample.sampleId}>
          <td className={styles.cell}>
            {`${sample.name || "-"} ${sample.form ? `(${sample.form})` : ""}`}
            {sample.base ? `, ${sample.base}` : ""}
          </td>
          <td className={styles.cell}>{sample.concentration || "-"}</td>
          {hasBitoxDry && (
            <td className={styles.cell}>{bitoxDry ? average(beforeValues) : "-"}</td>
          )}
          {hasBitoxDry && days.map(day => (
            <td className={styles.cell} key={`val-${sample.sampleId}-${day}`}>
              {bitoxDry ? average(avgValuesByDayForBitox[day]) : "-"}
            </td>
          ))}
          {days.map(day => {
            const activityEntry = sampleActivity?.activities?.find(a => a.day === day);
            const activityValue = activityEntry?.activity !== undefined && activityEntry.activity !== null
              ? `${activityEntry.activity}%`
              : "-";
            return (
              <td className={styles.cell} key={`act-${sample.sampleId}-${day}`}>{activityValue}</td>
            );
          })}
        </tr>
      );
    });
  };

  return (
    <div className={styles.resultsTableWrapper}>
      <h3 className={styles.title}>Результати досліду</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.header}>Препарат</th>
            <th className={styles.header}>Концентрація</th>
            {hasBitoxDry && <th className={styles.header}>До обробки</th>}
            {hasBitoxDry && days.map(day => (
              <th className={styles.header} key={`header-val-${day}`}>Чисельність {day}</th>
            ))}
            {days.map(day => (
              <th className={styles.header} key={`header-act-${day}`}>Активність {day} (%)</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderControlRow()}
          {renderSampleRows()}
        </tbody>
      </table>
      <div className={styles.conclusionBlock}>
        <label htmlFor="conclusion" className={styles.conclusionLabel}>Висновок:</label>
        <textarea
          id="conclusion"
          className={styles.conclusionInput}
          value={conclusion}
          onChange={e => onConclusionChange(e.target.value)}
          placeholder="Введіть висновок за результатами досліду"
        />
      </div>
    </div>
  );
};

export default ResultsTable;