import React, { useState } from 'react';

import { Link } from "react-router-dom";

import API from "../../redux/api/axios";
import { useNavigate } from 'react-router-dom';
import styles from "./styles.module.css";

const API_URL = '/api/acts/search'; 

// Головний компонент сторінки пошуку
const SearchPage = () => {
  // Використовуємо один стан для всього пошукового запиту
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Хук для навігації між сторінками
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // Відправляємо запит з одним параметром 'query'
      const response = await API.get(API_URL, { params: { query: searchTerm } });
      setResults(response.data);
    } catch (e) {
      if (e.response && e.response.status === 500) {
        setError('Помилка сервера. Перевірте лог бекенду.');
      } else if (e.response && e.response.status === 401) {
        setError('Неавторизований доступ. Перевірте токен.');
      } else {
        setError('Не вдалося виконати запит. Спробуйте пізніше.');
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Функція для переходу на сторінку з деталями
  const goToActDetails = (actId) => {
    navigate(`/act/${actId}`);
  };

  return (
    <div className={styles.searchPageContainer}>
      <div className={styles.searchPageCard}>
        <h1 className={styles.searchTitle}>Пошук актів та зразків</h1>

        {/* Інтерфейс для пошуку */}
        <div className={styles.searchInputGroup}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Введіть номер акта, замовника або зразок..."
            className={styles.searchInput}
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className={styles.searchButton}
          >
            {loading ? 'Пошук...' : 'Знайти'}
          </button>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        {/* Відображення результатів в рядковому форматі */}
        {results.length > 0 ? (
          <div className={styles.resultsList}>
            {results.map((act) => (
              act.samples.map((sample, index) => {
                // Отримання активності за останній день з activityData
                const lastActivity = act.activityData && act.activityData.length > 0
                  ? act.activityData[act.activityData.length - 1]
                  : null;

                return (
                  <div
                    key={`${act._id}-${index}`}
                    className={styles.resultRow}
                    onClick={() => goToActDetails(act._id)}
                  >
                    <div className={styles.resultDataGroup}>
                      <span className={styles.resultYear}>{act.year || '—'}</span>
                      <span className={styles.resultActNumber}>{act.actNumber || '—'}</span>
                      <span className={styles.resultText}>{sample.name || 'Назва відсутня'}</span>
                      <span className={styles.resultText}>{sample.subtype || '—'}</span>
                      <span className={styles.resultText}>{sample.base || '—'}</span>
                      <span className={styles.resultText}>{sample.date || '—'}</span>
                    </div>

                    {/* Відображення результату активності в окремому блоці */}
                    <div className={styles.resultActivityBlock}>
                      {lastActivity ? (
                        <p>Результат: {lastActivity.value || '—'}</p>
                      ) : (
                        <p>Результат: —</p>
                      )}
                    </div>
                  </div>
                );
              })
            ))}
          </div>
        ) : (
          !loading && <p className={styles.noResultsMessage}>Результатів не знайдено.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;