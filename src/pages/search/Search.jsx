import React, { useState } from 'react';

import { Link } from "react-router-dom";

import API from "../../redux/api/axios";
import { useNavigate } from 'react-router-dom';
import styles from "./styles.module.css";

const API_URL = '/api/acts/search'; 

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
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

  const goToActDetails = (actId) => {
    navigate(`/act/${actId}`);
  };

  return (
    <div className={styles.searchPageContainer}>
      <div className={styles.searchPageCard}>
        <h1 className={styles.searchTitle}>Пошук актів та зразків</h1>

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

        {results.length > 0 ? (
          <div className={styles.resultsList}>
            {results.map((act) => (
              act.samples.map((sample, index) => {
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