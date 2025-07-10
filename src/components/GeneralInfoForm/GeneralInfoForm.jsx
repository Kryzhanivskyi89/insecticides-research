import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";

const GeneralInfoForm = ({ onChange }) => {
  const [form, setForm] = useState({
    actNumber: "",
    year: new Date().getFullYear(),
    actDate: "",
    receivedDate: "",
    transferredBy: "",
    executor: "",      
    status: "todo",
  });

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    onChange(updated); 
  };

  return (
    <div className={styles.form}>
      <div className={styles.fieldGroup}>
        <label>Номер акту</label>
        <input
          type="text"
          value={form.actNumber}
          onChange={(e) => handleChange("actNumber", e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label>Рік</label>
        <select
          value={form.year}
          onChange={(e) => handleChange("year", e.target.value)}
        >
          {[2023, 2024, 2025, 2026].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label>Дата акту</label>
        <input
          type="date"
          value={form.actDate}
          onChange={(e) => handleChange("actDate", e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label>Дата надходження</label>
        <input
          type="date"
          value={form.receivedDate}
          onChange={(e) => handleChange("receivedDate", e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label>Хто передав</label>
        <input
          type="text"
          value={form.transferredBy}
          onChange={(e) => handleChange("transferredBy", e.target.value)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label>Виконавець</label>
        <input
          type="text"
          value={form.executor}
          onChange={(e) => handleChange("executor", e.target.value)}
        />
      </div>
    </div>
  );
};

export default GeneralInfoForm;