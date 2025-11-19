import { useState, useEffect } from "react";
import styles from "./styles.module.css";

const EditableGeneralInfo = ({ initialData, onChange }) => {
  const [form, setForm] = useState({
    actNumber: "",
    year: new Date().getFullYear(),
    actDate: "",
    receivedDate: "",
    transferredBy: "",
    executor: "",      
    status: "todo",
    description: ""
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        actNumber: initialData.actNumber || "",
        year: initialData.year || new Date().getFullYear(),
        actDate: initialData.actDate ? initialData.actDate.split('T')[0] : "",
        receivedDate: initialData.receivedDate ? initialData.receivedDate.split('T')[0] : "",
        transferredBy: initialData.transferredBy || "",
        executor: initialData.executor || "",
        status: initialData.status || "todo",
        description: initialData.description || ""
      });
    }
  }, []); 

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
          onChange={(e) => handleChange("year", parseInt(e.target.value))}
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

      <div className={styles.fieldGroup}>
        <label>Статус</label>
        <select
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="todo">До виконання</option>
          <option value="in_progress">В процесі</option>
          <option value="completed">Завершено</option>
          <option value="cancelled">Скасовано</option>
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label>Опис</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Додатковий опис акту"
          rows={3}
        />
      </div>
    </div>
  );
};

export default EditableGeneralInfo;