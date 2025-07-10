import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../../redux/api/axios";
import styles from "./styles.module.css";

const ActDetails = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [act, setAct] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  console.log("ID з useParams:", id);
  const fetchAct = async () => {
    try {
      const res = await API.get(`/api/acts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAct(res.data);
    } catch (err) {
      console.error("Помилка при завантаженні акту:", err);
    } finally {
      setLoading(false); // ⬅️ Гарантовано завершення завантаження
    }
  };

  if (id) fetchAct();
}, [id]);

  if (loading) return <p>Завантаження...</p>;
  if (!act) return <p>Акт не знайдено</p>;

  const {
    actNumber,
    actDate,
    receivedDate,
    transferredBy,
    executor,
    samples = [],
    experiment = {},
    activityData = [],
    conclusion,
    createdBy,
    status,
  } = act;
console.log("useParams id:", id);
  return (
    <div className={styles.actDetails}>
      <h2>Деталі акту №{actNumber || "—"}</h2>
      <p><strong>Дата акту:</strong> {actDate ? new Date(actDate).toLocaleDateString() : "—"}</p>
      <p><strong>Отримано:</strong> {receivedDate ? new Date(receivedDate).toLocaleDateString() : "—"}</p>
      <p><strong>Передав:</strong> {transferredBy || "—"}</p>
      <p><strong>Виконавець:</strong> {executor || "—"}</p>
      <p><strong>Статус:</strong> {status || "—"}</p>
      <p><strong>Заклав:</strong> {createdBy?.name || "—"}</p>

      <h3>🔬 Зразки</h3>
      {experiment.samplesData?.length > 0 ? (
        <ul>
          {experiment.samplesData?.map((s, i) => (
            <li key={i}>
              {s.name || "—"} / {s.subtype || "—"} / {s.base || "—"}
            </li>
          ))}
        </ul>
      ) : (
        <p>Зразків немає</p>
      )}

      <h3>🧪 Дослід</h3>
      <p><strong>Дата закладання:</strong> {experiment.layingDate ? new Date(experiment.layingDate).toLocaleDateString() : "—"}</p>
      <p><strong>Контроль:</strong> {experiment.control?.before?.length ? experiment.control.before.join(", ") : "—"}</p>

      <h3>📊 Активність</h3>
        {activityData.length > 0 ? (
        <ul>
            {activityData.map((a, i) => (
            <li key={i}>
                <strong>{a.name} (конц. {a.concentration}):</strong>{" "}
                {a.activities?.map((val, idx) => (
                <span key={idx}>
                    День {val.day}: {val.activity}%{" "}
                </span>
                ))}
            </li>
            ))}
        </ul>
        ) : (
        <p>Даних про активність немає</p>
        )}

      <h3>📝 Висновок</h3>
      <p>{conclusion || "—"}</p>

      <Link to="/dashboard" className={styles.backLink}>⬅️ Назад до дашборду</Link>
    </div>
  );
};

export default ActDetails;