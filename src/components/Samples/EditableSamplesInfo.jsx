import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

const defaultSample = () => ({
  id: Date.now().toString() + Math.random(),
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

const EditableSamplesInfo = ({ initialSamples = [], onChange }) => {
  const [samples, setSamples] = useState([defaultSample()]);

  useEffect(() => {
    if (initialSamples && initialSamples.length > 0) {
      const samplesWithIds = initialSamples.map(sample => ({
        ...sample,
        id: sample.id || (Date.now().toString() + Math.random()),
        date: sample.date ? sample.date.split('T')[0] : ""
      }));
      setSamples(samplesWithIds);
    }
  }, []);

  useEffect(() => {
    onChange(samples);
  }, [samples, onChange]);

  const updateSample = (id, field, value) => {
    setSamples(prev => prev.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const addSample = () => {
    setSamples(prev => [...prev, defaultSample()]);
  };

  const removeSample = (id) => {
    if (samples.length > 1) {
      setSamples(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className={styles.editableSamples}>
      {samples.map((sample, index) => (
        <div key={sample.id} className={styles.sampleEditCard}>
          <h4>Зразок #{index + 1}</h4>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label>Препарат</label>
              <select 
                value={sample.name || ""} 
                onChange={e => updateSample(sample.id, "name", e.target.value)}
              >
                <option value="">Оберіть препарат</option>
                {Object.keys(sampleTypes).map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {sample.name === "Метавайт" && (
              <div className={styles.fieldGroup}>
                <label>Підтип</label>
                <select 
                  value={sample.subtype || ""} 
                  onChange={e => updateSample(sample.id, "subtype", e.target.value)}
                >
                  <option value="">Оберіть підтип</option>
                  {sampleTypes["Метавайт"].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label>Дата виготовлення</label>
              <input 
                type="date" 
                value={sample.date || ""} 
                onChange={e => updateSample(sample.id, "date", e.target.value)} 
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Основа / розпорядження</label>
              <input 
                type="text" 
                value={sample.base || ""} 
                onChange={e => updateSample(sample.id, "base", e.target.value)} 
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label>Кількість</label>
              <input 
                type="number" 
                value={sample.quantity || ""} 
                onChange={e => updateSample(sample.id, "quantity", e.target.value)} 
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Одиниця</label>
              <select 
                value={sample.unit || "мл"} 
                onChange={e => updateSample(sample.id, "unit", e.target.value)}
              >
                {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label>Тип</label>
              <select 
                value={sample.form || ""} 
                onChange={e => updateSample(sample.id, "form", e.target.value)}
              >
                <option value="">Оберіть тип</option>
                {formOptions.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label>Форма</label>
              <select 
                value={sample.state || ""} 
                onChange={e => updateSample(sample.id, "state", e.target.value)}
              >
                <option value="">Оберіть форму</option>
                {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {sample.name === "Актоверм" && (
            <div className={styles.fieldGroup}>
              <label>Концентрація (%)</label>
              <input 
                type="number" 
                value={sample.concentration || ""} 
                onChange={e => updateSample(sample.id, "concentration", e.target.value)} 
              />
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label>pH</label>
            <input 
              type="number" 
              step="0.1"
              value={sample.ph || ""} 
              onChange={e => updateSample(sample.id, "ph", e.target.value)} 
            />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label>Титр (початковий), 1e3</label>
              <input 
                type="text" 
                value={sample.titerInitial || ""} 
                onChange={e => updateSample(sample.id, "titerInitial", e.target.value)} 
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Титр (зберігання), 1e3</label>
              <input 
                type="text" 
                value={sample.titerStorage || ""} 
                onChange={e => updateSample(sample.id, "titerStorage", e.target.value)} 
              />
            </div>
          </div>

          <div className={styles.cardActions}>
            <button 
              className={styles.removeSample} 
              type="button" 
              onClick={() => removeSample(sample.id)}
              disabled={samples.length === 1}
            >
              Видалити зразок
            </button>
          </div>
        </div>
      ))}

      <button className={styles.addSample} type="button" onClick={addSample}>
        ➕ Додати зразок
      </button>
    </div>
  );
};

export default EditableSamplesInfo;