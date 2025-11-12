import EditableSamplesInfo from './EditableSamplesInfo';
import styles from "./styles.module.css";

export default function SamplesSection({
  samples,
  editMode,
  onToggleEdit,
  onChange
}) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2>Зразки в акті</h2>
        <button
          onClick={onToggleEdit}
          className={editMode ? styles.cancelButton : styles.editButton}
        >
          {editMode ? 'Скасувати' : 'Редагувати'}
        </button>
      </div>

      {editMode ? (
        <EditableSamplesInfo
          initialSamples={samples}
          onChange={onChange}
        />
      ) : (
        <div className={styles.samplesInfoBlock}>
          {samples && samples.length > 0 ? (
            <div className={styles.sampleCard}>
              {samples.map((sample, index) => (
                <>
                  <h4 className={styles.sampleCardTitle}>Зразок #{index + 1}</h4>
                  <div key={sample.id || index} className={styles.sampleCardDisplay}>
                    <p><strong>Назва:</strong> {sample.name || '—'}</p>
                    {sample.subtype && <p><strong>Підтип:</strong> {sample.subtype}</p>}
                    <p><strong>Основа:</strong> {sample.base || '—'}</p>
                    <p>
                      <strong>Дата виготовлення:</strong>{" "}
                      {sample.date ? new Date(sample.date).toLocaleDateString() : '—'}
                    </p>
                    <p><strong>Кількість:</strong> {sample.quantity || '—'} {sample.unit || ''}</p>
                    <p><strong>Тип:</strong> {sample.form || '—'}</p>
                    <p><strong>Форма:</strong> {sample.state || '—'}</p>
                    {sample.concentration && (
                      <p><strong>Концентрація:</strong> {sample.concentration}%</p>
                    )}
                    <p><strong>pH:</strong> {sample.ph || '—'}</p>
                    <p><strong>Титр (початковий):</strong> {sample.titerInitial || '—'}</p>
                    <p><strong>Титр (зберігання):</strong> {sample.titerStorage || '—'}</p>
                  </div>
                </>
              ))}
            </div>
          ) : (
            <p>Зразків для цього акту не знайдено.</p>
          )}
        </div>
      )}
    </div>
  );
}