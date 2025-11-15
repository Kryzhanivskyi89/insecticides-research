
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const ActCard = ({ act }) => {
  const actNumber = act.actNumber || act.actInfo?.actNumber || "—";
  const layingDateRaw = act.experiment?.layingDate || "";
  const layingDate = layingDateRaw ? new Date(layingDateRaw).toLocaleDateString() : "—";

  const hasValidSamples = act.samples && act.samples.some(s => s.name && s.name.trim() !== "");

  const samples = hasValidSamples
    ? act.samples
    : act.experiment?.samplesData || [];

  return (
    <Link to={`/act/${act._id}`} className={styles.viewLink}>
      <div className={styles.card}>
        <p><strong>Aкт № </strong> {actNumber}</p>
        {!layingDate && <p><strong>Дата закладання:</strong> {layingDate}</p>}

        {samples.length > 0 ? (
          <div className={styles.samplesBlock}>
            <p><strong>Зразки:</strong></p>
            <ul className={styles.samplesList}>
              {samples.map((s, i) => (
                <li key={s._id || i}>
                  <span>
                    {s.name || "—"} / {s.subtype || "—"} / {s.base || "—"}  / {s.form || "—"} / {s.state || "—"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Зразків немає</p>
        )}
      </div>
    </Link>
  );
};

export default ActCard;
