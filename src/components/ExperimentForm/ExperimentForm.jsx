
import { useCallback } from 'react';
import ExperimentBlock from '../ExperimentBlock/ExperimentBlock';
import styles from './styles.module.css';

const ExperimentForm = ({ initialSamples = [], onChange, initialExperimentData = {} }) => {
  const formatDataForDisplay = useCallback(() => {
    const samplesData = initialExperimentData.samplesData || [];
    
    const initializedSamplesData = samplesData.length > 0 
      ? samplesData 
      : initialSamples.flatMap(sample => [
          {
            sampleId: `${sample.id}-conc1`,
            name: sample.name,
            form: sample.form,
            state: sample.state,
            concentration: "",
            base: sample.base,
            repetitions: [{ before: "", days: [] }, { before: "", days: [] }, { before: "", days: [] }]
          },
          {
            sampleId: `${sample.id}-conc2`,
            name: sample.name,
            form: sample.form,
            state: sample.state,
            concentration: "",
            base: sample.base,
            repetitions: [{ before: "", days: [] }, { before: "", days: [] }, { before: "", days: [] }]
          }
        ]);

    const formattedSamples = initializedSamplesData.map(sample => {
      const sampleBaseInfo = initialSamples.find(s => s.id === sample.sampleId.split("-")[0]);
      
      const beforeValues = (sample.repetitions || [{ before: "" }]).map(rep => rep.before);
      const days = (sample.repetitions?.[0]?.days || []).map((day, dayIndex) => ({
        day: day.day,
        values: (sample.repetitions || []).map(rep => rep.days?.[dayIndex]?.value || "")
      }));

      return {
        ...sample,
        name: sampleBaseInfo?.name || sample.name,
        form: sampleBaseInfo?.form || sample.form,
        state: sampleBaseInfo?.state || sample.state,
        data: {
          before: beforeValues,
          days: days
        }
      };
    });

    return {
      control: initialExperimentData.control || { before: ["", "", ""], days: [] },
      samplesData: formattedSamples,
      layingDate: initialExperimentData.layingDate || ""
    };
  }, [initialExperimentData, initialSamples]);

  const displayData = formatDataForDisplay();

  const handleLayingDateChange = (e) => {
    onChange({
      ...initialExperimentData,
      layingDate: e.target.value
    });
  };

  const handleControlChange = useCallback((newData) => {
    onChange({
      ...initialExperimentData,
      control: newData
    });
  }, [initialExperimentData, onChange]);

  const handleSampleDataChange = useCallback((index, newData) => {
    const currentSamples = initialExperimentData.samplesData || [];
    
    if (!newData || !currentSamples[index]) {
      console.error("Некоректні дані або відсутній зразок для оновлення.");
      return;
    }

    const sampleToUpdate = currentSamples[index];
    const newSamplesDataForBackend = [...currentSamples];

    const updatedSample = {
      ...sampleToUpdate,
      concentration: newData.concentration !== undefined ? newData.concentration : sampleToUpdate.concentration,
    };
    
    if (newData.data) {
      const { before, days } = newData.data;
      
      const newRepetitions = (before || []).map((beforeValue, repIndex) => {
        const existingRepetition = updatedSample.repetitions?.[repIndex] || { before: "", days: [] };
        
        const newDays = (days || []).map(dayData => ({
          day: dayData.day,
          value: dayData.values[repIndex] || ""
        }));

        return {
          ...existingRepetition,
          before: beforeValue,
          days: newDays
        };
      });

      updatedSample.repetitions = newRepetitions;
    }

    newSamplesDataForBackend[index] = updatedSample;
    
    onChange({
      ...initialExperimentData,
      samplesData: newSamplesDataForBackend
    });
  }, [initialExperimentData, onChange]);

  return (
    <div className={styles.experimentFormWrapper}>
      <div className={styles.plantingDateBlock}>
        <label className={styles.plantingDateLabel}>Дата закладання досліду:</label>
        <input
          type="date"
          className={styles.plantingDateInput}
          value={displayData.layingDate || ""}
          onChange={handleLayingDateChange}
        />
      </div>

      <ExperimentBlock 
        title="Контроль" 
        data={displayData.control} 
        onChange={handleControlChange} 
        showConcentration={false}
      />

      {displayData.samplesData.map((sample, i) => (
        <ExperimentBlock
          key={sample.sampleId}
          title={`${sample.name} (${sample.form})${sample.concentration ? " - " + sample.concentration + "%" : ""}${sample.base ? ", " + sample.base : ""}`}
          data={sample.data}
          concentration={sample.concentration}
          onChange={(newData) => handleSampleDataChange(i, newData)}
          showConcentration={true}
        />
      ))}
    </div>
  );
};

export default ExperimentForm;