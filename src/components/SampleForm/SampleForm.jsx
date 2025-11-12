
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

const defaultSample = () => ({
  id: Date.now().toString(),
  name: "",
  subtype: "",
  base: "",
  date: "",
  quantity: "",
  unit: "мл",
  form: "",
  state: "",
  concentration: "",
  ph: "",
  titerInitial: "",
  titerStorage: "",
});

const sampleTypes = {
  Метавайт: ["Інтенсив", "моно Beauveria", "моно Metarhizium"],
  Бітоксибацилін: [],
  Лепідоцид: [],
  Актоверм: [],
  "Актоверм формула": [],
  Інший: [],
};

const formOptions = ["Культуральна рідина", "Продукт"];
const stateOptions = ["Рідкий", "Сухий"];
const units = ["мл", "г"];

const SampleForm = ({ onChange }) => {
  const [samples, setSamples] = useState([defaultSample()]);

  useEffect(() => {
    onChange(samples);
  }, [samples, onChange]);

  const updateSample = (id, field, value) => {
    const updated = samples.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    );
    setSamples(updated);
  };

  const addSample = () => {
    setSamples([...samples, defaultSample()]);
  };

  const removeSample = (id) => {
    setSamples(samples.filter(s => s.id !== id));
  };

  return (
    <div className={styles.samples}>

      <h2 className={styles.samplesTitle}>Інформація про зразки</h2>
      {samples.map((sample, index) => (
        <div key={sample.id} className={styles.sampleCard}>
          <h4 style={{ textAlign: "center" }}>Зразок #{index + 1}</h4>

          <select value={sample.name} onChange={e => updateSample(sample.id, "name", e.target.value)}>
            <option value="">Оберіть препарат</option>
            {Object.keys(sampleTypes).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          {sample.name === "Метавайт" && (
            <select value={sample.subtype} onChange={e => updateSample(sample.id, "subtype", e.target.value)}>
              <option value="">Оберіть підтип</option>
              {sampleTypes["Метавайт"].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          )}

          <div className={styles.inline}>
            <input type="date" value={sample.date} onChange={e => updateSample(sample.id, "date", e.target.value)} placeholder="Дата виготовлення" />
            <input type="text" placeholder="Основа / розпорядження" value={sample.base} onChange={e => updateSample(sample.id, "base", e.target.value)} />
          </div>

          <div className={styles.inline}>
            <input type="number" placeholder="Кількість" value={sample.quantity} onChange={e => updateSample(sample.id, "quantity", e.target.value)} />
            <select value={sample.unit} onChange={e => updateSample(sample.id, "unit", e.target.value)}>
              {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
            </select>
          </div>

          <select value={sample.form} onChange={e => updateSample(sample.id, "form", e.target.value)}>
            <option value="">Оберіть тип</option>
            {formOptions.map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          <select value={sample.state} onChange={e => updateSample(sample.id, "state", e.target.value)}>
            <option value="">Оберіть форму</option>
            {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {sample.name === "Актоверм" && (
            <input type="number" placeholder="Концентрація (%)" value={sample.concentration} onChange={e => updateSample(sample.id, "concentration", e.target.value)} />
          )}

          <input type="number" placeholder="pH" value={sample.ph} onChange={e => updateSample(sample.id, "ph", e.target.value)} />

          <div className={styles.inline}>
            <input type="text" placeholder="Титр (початковий), 1e3" value={sample.titerInitial} onChange={e => updateSample(sample.id, "titerInitial", e.target.value)} />
            <input type="text" placeholder="Титр (зберігання), 1e3" value={sample.titerStorage} onChange={e => updateSample(sample.id, "titerStorage", e.target.value)} />
          </div>

          <button className={styles.removeSample} type="button" onClick={() => removeSample(sample.id)}>Видалити зразок</button>
        </div>
      ))}

      <button className={styles.addSample} type="button" onClick={addSample}>➕ Додати зразок</button>
    </div>
  );
};

export default SampleForm;