import React, { useEffect, useState } from "react";
import API from "../../redux/api/axios";
import GeneralInfoForm from "../../components/GeneralInfoForm/GeneralInfoForm";
import SampleForm from "../../components/SampleForm/SampleForm";
import ExperimentForm from "../../components/ExperimentForm/ExperimentForm";
import ResultsTable from "../../components/ResultsTable/ResultsTable";
import { calculateActivity } from "../../utils/calculateActivity";
import styles from "./styles.module.css";

const ActForm = () => {
  const [generalInfo, setGeneralInfo] = useState({});
  const [samples, setSamples] = useState([]);
  const [experiment, setExperiment] = useState({
    control: { before: ["", "", ""], days: [] },
    samplesData: [],
    plantingDate: ""
  });
  const [activityData, setActivityData] = useState([]);
  const [conclusion, setConclusion] = useState("");
  const [actId, setActId] = useState(null);

  useEffect(() => {
    if (experiment.control && experiment.samplesData) {
      const result = calculateActivity(experiment);
      setActivityData(result);
    }
  }, [experiment]);

const handleSubmitRegistration = async () => {
  const payload = {
    actInfo: generalInfo,
    samples: samples
  };

  try {
    const res = await API.post("/api/acts/register", payload);
    const { act, created } = res.data;

    if (!act?._id) throw new Error("Не отримано ID акту");

    alert(created ? "✅ Акт створено!" : "📝 Акт оновлено!");

    setActId(act._id); // обов'язково зберігаємо ID для подальших дій
  } catch (error) {
    console.error("Помилка при збереженні реєстрації:", error);
    alert("❌ Не вдалося зберегти реєстрацію акту");
  }
};

  const handleSubmitResults = async () => {
    if (!actId) {
      alert("Спочатку потрібно зберегти реєстрацію акту.");
      return;
    }

    const payload = {
      control: experiment.control,
      samplesData: experiment.samplesData,
      plantingDate: experiment.plantingDate,
      activityData: activityData,
      conclusion: conclusion
    };

    try {
      await API.post(`/api/acts/results/${actId}`, payload);
      alert("Результати досліду успішно збережені!");
    } catch (error) {
      console.error("Помилка при збереженні результатів:", error);
      alert("Не вдалося зберегти результати досліду");
    }
  };

  return (
    <form>
      <h2>Загальна інформація по акту</h2>
      <GeneralInfoForm onChange={setGeneralInfo} />

      <h2>Інформація про зразки</h2>
      <SampleForm onChange={setSamples} />

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button type="button" onClick={handleSubmitRegistration}>
          Зберегти реєстрацію
        </button>
        {/* <button type="button" onClick={handleSubmitResults}>
          Зберегти результати
        </button> */}
      </div>

      <h2>Інформація по досліду</h2>
      <ExperimentForm samples={samples} onChange={setExperiment} />

      <ResultsTable 
        experiment={experiment} 
        activityData={activityData} 
        conclusion={conclusion} 
        onConclusionChange={setConclusion} 
      />

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        {/* <button type="button" onClick={handleSubmitRegistration}>
          Зберегти реєстрацію
        </button> */}
        <button type="button" onClick={handleSubmitResults}>
          Зберегти результати
        </button>
      </div>
    </form>
  );
};

export default ActForm;