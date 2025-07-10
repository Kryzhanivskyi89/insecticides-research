import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import ExperimentBlock from "../ExperimentBlock/ExperimentBlock";

const ExperimentForm = ({ samples, onChange }) => {
  const [controlData, setControlData] = useState({ before: ["", "", ""], days: [] });
  const [samplesData, setSamplesData] = useState([]);
  const [plantingDate, setPlantingDate] = useState("");

  useEffect(() => {
    const initializedSamples = samples.flatMap(sample => [
      {
        sampleId: `${sample.id}-conc1`,
        name: sample.name,
        form: sample.form,
        state: sample.state,
        concentration: "",
        base: sample.base,
        data: { before: ["", "", ""], days: [] }
      },
      {
        sampleId: `${sample.id}-conc2`,
        name: sample.name,
        form: sample.form,
        state: sample.state,
        concentration: "",
        base: sample.base,
        data: { before: ["", "", ""], days: [] }
      }
    ]);
    setSamplesData(initializedSamples);
  }, [samples]);

  useEffect(() => {
    const formattedSamples = samplesData.map(s => ({
      sampleId: s.sampleId,
      name: s.name,
      form: s.form,
      state: s.state,
      concentration: s.concentration,
      base: s.base,
      repetitions: [
        {
          before: s.data.before[0],
          days: s.data.days.map(d => ({ day: d.day, value: d.values[0] }))
        },
        {
          before: s.data.before[1],
          days: s.data.days.map(d => ({ day: d.day, value: d.values[1] }))
        },
        {
          before: s.data.before[2],
          days: s.data.days.map(d => ({ day: d.day, value: d.values[2] }))
        }
      ]
    }));

    onChange({
      control: controlData,
      samplesData: formattedSamples,
      plantingDate: plantingDate
    });
  }, [controlData, samplesData, onChange]);

  const handleSampleChange = (index, newData) => {
    const updated = [...samplesData];
    updated[index].data = newData;
    setSamplesData(updated);
  };

  const handleSampleConcentrationChange = (index, concentration) => {
    const updated = [...samplesData];
    updated[index].concentration = concentration;
    setSamplesData(updated);
  };

  return (
    <div className={styles.experimentFormWrapper}>
      <div className={styles.plantingDateBlock}>
        <label className={styles.plantingDateLabel}>Дата закладання досліду:</label>
        <input
          type="date"
          className={styles.plantingDateInput}
          value={plantingDate}
          onChange={e => setPlantingDate(e.target.value)}
        />
      </div>

      <ExperimentBlock 
        title="Контроль" 
        data={controlData} 
        onChange={setControlData} 
        showConcentration={false}
      />

      {samplesData.map((sample, i) => (
        <ExperimentBlock
          key={sample.sampleId}
          title={`${sample.name} (${sample.form}) - ${sample.concentration}%${sample.base ? ", " + sample.base : ""}`}
          data={sample.data}
          concentration={sample.concentration}
          onChange={data => {
            if (data.concentration !== undefined) {
              handleSampleConcentrationChange(i, data.concentration);
            } else {
              handleSampleChange(i, data);
            }
          }}
          showConcentration={true}
        />
      ))}
    </div>
  );
};


export default ExperimentForm;

// const ExperimentForm = ({ samples, onChange }) => {
//   const [controlData, setControlData] = useState({ before: ["", "", ""], days: [] });
//   const [samplesData, setSamplesData] = useState([]);
//   const [plantingDate, setPlantingDate] = useState("");

//   useEffect(() => {
//     const initializedSamples = samples.flatMap(sample => [
//       {
//         sampleId: `${sample.id}-conc1`,
//         name: sample.name,
//         form: sample.form,
//         state: sample.state,
//         concentration: "",
//         data: { before: ["", "", ""], days: [] }
//       },
//       {
//         sampleId: `${sample.id}-conc2`,
//         name: sample.name,
//         form: sample.form,
//         state: sample.state,
//         concentration: "",
//         data: { before: ["", "", ""], days: [] }
//       }
//     ]);
//     setSamplesData(initializedSamples);
//   }, [samples]);

//   useEffect(() => {
//     const formattedSamples = samplesData.map(s => ({
//       sampleId: s.sampleId,
//       name: s.name,
//       form: s.form,
//       state: s.state,
//       concentration: s.concentration,
//       repetitions: [
//         {
//           before: s.data.before[0],
//           days: s.data.days.map(d => ({ day: d.day, value: d.values[0] }))
//         },
//         {
//           before: s.data.before[1],
//           days: s.data.days.map(d => ({ day: d.day, value: d.values[1] }))
//         },
//         {
//           before: s.data.before[2],
//           days: s.data.days.map(d => ({ day: d.day, value: d.values[2] }))
//         }
//       ]
//     }));

//     onChange({
//       control: controlData,
//       samplesData: formattedSamples,
//       plantingDate: plantingDate
//     });
//   }, [controlData, samplesData, onChange]);

//   const handleSampleChange = (index, newData) => {
//     const updated = [...samplesData];
//     updated[index].data = newData;
//     setSamplesData(updated);
//   };

//   const handleSampleConcentrationChange = (index, concentration) => {
//     const updated = [...samplesData];
//     updated[index].concentration = concentration;
//     setSamplesData(updated);
//   };

//   return (
//     <div className={styles.experimentFormWrapper}>

//       <div className={styles.plantingDateBlock}>
//         <label className={styles.plantingDateLabel}>Дата закладання досліду:</label>
//         <input
//           type="date"
//           className={styles.plantingDateInput}
//           value={plantingDate}
//           onChange={e => setPlantingDate(e.target.value)}
//         />
//       </div>

//       <ExperimentBlock 
//         title="Контроль" 
//         data={controlData} 
//         onChange={setControlData} 
//         showConcentration={false}
//       />
//       {samplesData.map((sample, i) => (
//         <ExperimentBlock
//           key={sample.sampleId}
//           title={`${sample.name} (${sample.form}) - ${sample.concentration}%`}
//           data={sample.data}
//           concentration={sample.concentration}
//           onChange={data => {
//             if (data.concentration !== undefined) {
//               handleSampleConcentrationChange(i, data.concentration);
//             } else {
//               handleSampleChange(i, data);
//             }
//           }}
//           showConcentration={true}
//         />
//       ))}
//     </div>
//   );
// };