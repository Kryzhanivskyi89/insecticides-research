import EditableGeneralInfo from './EditableGeneralInfo';
import styles from "./styles.module.css";

export default function GeneralInfoSection({
  generalInfo,
  editMode,
  onToggleEdit,
  onChange
}) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2>Загальна інформація</h2>
        <button
          onClick={onToggleEdit}
          className={editMode ? styles.cancelButton : styles.editButton}
        >
          {editMode ? 'Скасувати' : 'Редагувати'}
        </button>
      </div>

      {editMode ? (
        <EditableGeneralInfo
          initialData={generalInfo}
          onChange={onChange}
        />
      ) : (
        <div className={styles.infoBlock}>
          <p><strong>Номер акту:</strong> {generalInfo.actNumber || '—'}</p>
          <p><strong>Рік:</strong> {generalInfo.year || '—'}</p>
          <p>
            <strong>Дата акту:</strong>{" "}
            {generalInfo.actDate
              ? new Date(generalInfo.actDate).toLocaleDateString()
              : '—'}
          </p>
          <p>
            <strong>Дата отримання:</strong>{" "}
            {generalInfo.receivedDate
              ? new Date(generalInfo.receivedDate).toLocaleDateString()
              : '—'}
          </p>
          <p><strong>Передав:</strong> {generalInfo.transferredBy || '—'}</p>
          <p><strong>Виконавець:</strong> {generalInfo.executor || '—'}</p>
          <p><strong>Статус:</strong> {generalInfo.status || '—'}</p>
          <p><strong>Опис:</strong> {generalInfo.description || '—'}</p>
        </div>
      )}
    </div>
  );
}