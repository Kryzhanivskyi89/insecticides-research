import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import html2pdf from 'html2pdf.js';

import GeneralInfoSection from '../../components/GeneralInfoSection/GeneralInfoSection';
import SamplesSection from '../../components/Samples/SamplesSection';
import ExperimentForm from '../../components/ExperimentForm/ExperimentForm';
import ResultsTable from '../../components/ResultsTable/ResultsTable';
import { calculateActivity } from "../../utils/calculateActivity";
import { generatePdfHtml } from '../../utils/generatePdfHtml'; 
import styles from "./styles.module.css";
import API from '../../redux/api/axios';

function ActDetails() {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [actInfo, setActInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editableGeneralInfo, setEditableGeneralInfo] = useState({});
  const [editableSamples, setEditableSamples] = useState([]);
  const [experimentData, setExperimentData] = useState({});
  const [activityResults, setActivityResults] = useState([]);
  const [conclusion, setConclusion] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [editModes, setEditModes] = useState({
    general: false,
    samples: false
  });

  const getInitializedSamplesData = useCallback((samples) => {
    return (samples || []).flatMap(sample => [
      {
        sampleId: `${sample.id}-conc1`,
        name: sample.name,
        form: sample.form,
        state: sample.state,
        concentration: "",
        base: sample.base,
        repetitions: [{ before: "", days: [] }, { before: "", days: [] }, { before: "", days: [] }]
      },
      {
        sampleId: `${sample.id}-conc2`,
        name: sample.name,
        form: sample.form,
        state: sample.state,
        concentration: "",
        base: sample.base,
        repetitions: [{ before: "", days: [] }, { before: "", days: [] }, { before: "", days: [] }]
      }
    ]);
  }, []);

  useEffect(() => {
    const fetchActData = async () => {
      try {
        setLoading(true);
        setError(null);
        setSaveSuccess(false);
        
        const res = await API.get(`/api/acts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setActInfo(data);
        
        console.log('Fetched data status:', data.status);

        const initialGeneralInfo = {
          actNumber: data.actNumber || "",
          year: data.year || new Date().getFullYear(),
          actDate: data.actDate || "",
          receivedDate: data.receivedDate || "",
          transferredBy: data.transferredBy || "",
          executor: data.executor || "",
          status: data.status || "todo", 
          description: data.description || ""
        };
        
        console.log('Setting initial general info:', initialGeneralInfo);
        setEditableGeneralInfo(initialGeneralInfo);

        const fetchedSamples = data.samples || [];
        setEditableSamples(fetchedSamples);

        const fetchedExperimentData = data.experiment || {};
        
        const initializedSamplesData = fetchedExperimentData.samplesData?.length > 0
          ? fetchedExperimentData.samplesData
          : getInitializedSamplesData(fetchedSamples);

        setExperimentData({
          layingDate: fetchedExperimentData.layingDate || "",
          control: fetchedExperimentData.control || { before: ["", "", ""], days: [] },
          samplesData: initializedSamplesData
        });

        setActivityResults(data.activityData || []);
        setConclusion(data.conclusion || "");

      } catch (err) {
        setError(`Помилка: ${err.response?.status || 'невідомо'} - ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchActData();
    } else if (!id) {
      setError("ID акту не вказано в URL.");
    } else if (!token) {
      setError("Користувач не авторизований. Будь ласка, увійдіть.");
    }
  }, [id, token, getInitializedSamplesData]);

  useEffect(() => {
    if (experimentData && experimentData.control && experimentData.samplesData) {
      const calculatedActivities = calculateActivity(experimentData);
      setActivityResults(calculatedActivities);
    } else {
      setActivityResults([]);
    }
  }, [experimentData]);

  const toggleEditMode = (section) => {
    setEditModes(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleGeneralInfoChange = useCallback((newGeneralInfo) => {
    console.log('handleGeneralInfoChange called with:', newGeneralInfo);
    console.log('New status:', newGeneralInfo.status);
    
    setEditableGeneralInfo(prevInfo => {
      const updated = { ...prevInfo, ...newGeneralInfo };
      console.log('Updated editableGeneralInfo:', updated);
      return updated;
    });
  }, []);

  const handleSamplesChange = useCallback((newSamples) => {
    setEditableSamples(newSamples);
    setExperimentData(prev => ({
      ...prev,
      samplesData: getInitializedSamplesData(newSamples)
    }));
  }, [getInitializedSamplesData]);

  const handleExperimentFormChange = useCallback((newExperimentData) => {
    setExperimentData(newExperimentData);
  }, []);
  console.log(actInfo);

  const handleSaveAct = async () => {
    
    const payload = {
      actNumber: editableGeneralInfo.actNumber,
      year: editableGeneralInfo.year,
      actDate: editableGeneralInfo.actDate,
      receivedDate: editableGeneralInfo.receivedDate,
      transferredBy: editableGeneralInfo.transferredBy,
      executor: editableGeneralInfo.executor,
      status: editableGeneralInfo.status, 
      description: editableGeneralInfo.description,
      samples: editableSamples,
      experiment: experimentData,
      activityData: activityResults,
      conclusion: conclusion
    };

    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      const response = await API.patch(`/api/acts/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaveSuccess(true);
        
      setActInfo(prev => ({ 
        ...prev, 
        ...editableGeneralInfo,
        samples: editableSamples,
        experiment: experimentData,
        activityData: activityResults,
        conclusion: conclusion
      }));

      setEditModes({
        general: false,
        samples: false
      });

    } catch (err) {
        console.error('Save error:', err);
        setSaveError("Не вдалося зберегти дані. Спробуйте ще раз.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleGeneratePdf = () => {
    const pdfActInfo = {
      ...actInfo,
      ...editableGeneralInfo,
      samples: editableSamples
    };

    const htmlContent = generatePdfHtml(pdfActInfo, experimentData, activityResults, conclusion);
    const element = document.createElement('div');
    element.innerHTML = htmlContent;

    html2pdf()
        .from(element)
        .set({
            margin: 10,
            filename: `Акт-${editableGeneralInfo.actNumber || 'невідомо'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .save();
  };

  if (loading) {
    return <div className={styles.loadingMessage}>Завантаження даних акту...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  if (!actInfo) {
    return <div className={styles.noDataMessage}>Дані акту не знайдено.</div>;
  }

  return (
    <div className={styles.detailsContainer}>
      <h1>Акт # {editableGeneralInfo.actNumber || actInfo._id}</h1>

      <GeneralInfoSection
        generalInfo={editableGeneralInfo}
        editMode={editModes.general}
        onToggleEdit={() => toggleEditMode('general')}
        onChange={handleGeneralInfoChange}
      />

      <SamplesSection
        samples={editableSamples}
        editMode={editModes.samples}
        onToggleEdit={() => toggleEditMode('samples')}
        onChange={handleSamplesChange}
      />

      <ExperimentForm 
        initialSamples={editableSamples} 
        onChange={handleExperimentFormChange} 
        initialExperimentData={experimentData}
      />

      <ResultsTable 
        experiment={experimentData} 
        activityData={activityResults} 
        conclusion={conclusion}
        onConclusionChange={setConclusion}
      />
      
      <div className={styles.saveContainer}>
        <button onClick={handleSaveAct} disabled={isSaving} className={styles.saveButton}>
          {isSaving ? "Збереження..." : "Зберегти всі зміни"}
        </button>
        <button onClick={handleGeneratePdf} className={styles.saveButton}>
          Згенерувати PDF
        </button>
        {saveSuccess && <p className={styles.saveSuccessMessage}>Зміни успішно збережено!</p>}
        {saveError && <p className={styles.saveErrorMessage}>{saveError}</p>}
      </div>
    </div>
  );
}

export default ActDetails;