
import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const ActCard = ({ act }) => {
  const actNumber = act.actNumber || act.actInfo?.actNumber || "—";
  const layingDateRaw = act.experiment?.layingDate || "";
  const layingDate = layingDateRaw ? new Date(layingDateRaw).toLocaleDateString() : "—";

  // Визначаємо, чи у samples є хоч один зразок з непорожнім name
  const hasValidSamples = act.samples && act.samples.some(s => s.name && s.name.trim() !== "");

  // Вибираємо звідки брати зразки: з samples, якщо є валідні, інакше з experiment.samplesData
  const samples = hasValidSamples
    ? act.samples
    : act.experiment?.samplesData || [];

console.log("ActCard отримав act:", act);
console.log("Зразок для рендера:", samples);
console.log("ID для переходу:", act._id);
  return (
    <div className={styles.card}>
      <p><strong>№ акту:</strong> {actNumber}</p>
      <p><strong>Дата закладання:</strong> {layingDate}</p>

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
      

      <Link to={`/act/${act._id}`} className={styles.viewLink}>
        🔍 Переглянути
      </Link>
    </div>
  );
};

export default ActCard;

// // src/components/ActCard/ActCard.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import styles from "./styles.module.css";


// const ActCard = ({ act }) => {
//   const actNumber = act.actNumber || act.actInfo?.actNumber || "—";
//   const layingDate = act.experiment?.layingDate || "—";
//   const samples = act.samples || act.experiment?.samplesData || [];
// console.log("ActCard отримав act:", act);
// console.log("Зразок для рендера:", samples);
//   return (
//     <div className={styles.card}>
//       <p><strong>№ акту:</strong> {actNumber}</p>
//       <p><strong>Дата закладання:</strong> {layingDate ? new Date(layingDate).toLocaleDateString() : "—"}</p>

//       {samples.length > 0 ? (
//         <div className={styles.samplesBlock}>
//           <p><strong>Зразки:</strong></p>
//           <ul className={styles.samplesList}>
//             {samples.map((s, i) => (
//               <li key={i}>
//                 <span>{s.name || "—"} / {s.subtype || "—"} / {s.base || "—"}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p> Зразків немає</p>
//       )}
      
//       <Link to={`/act/${act._id}`} className={styles.viewLink}>
//       {/* <Link to={`/act/${act._id.toString()}`} className={styles.viewLink} > */}
//         🔍 Переглянути
//       </Link>
//     </div>
//   );
// };

// export default ActCard;