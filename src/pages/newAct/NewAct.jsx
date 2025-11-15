import { useState } from "react";
import API from "../../redux/api/axios";
import GeneralInfoForm from "../../components/GeneralInfoForm/GeneralInfoForm";
import SampleForm from "../../components/SampleForm/SampleForm";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const CreateActForm = () => {
  const [generalInfo, setGeneralInfo] = useState({});
  const [samples, setSamples] = useState([]);
  const navigate = useNavigate();
  
  const [actId, setActId] = useState(null);

const handleSubmitRegistration = async () => {
  const payload = {
    actInfo: generalInfo,
    samples: samples,
    status: "todo" 
  };

  try {
    const res = await API.post("/api/acts/register", payload);
    const { act, created } = res.data;
    if (!act?._id) throw new Error("Не отримано ID акту");
    alert(created ? "✅ Акт створено!" : "📝 Акт оновлено!");
    setActId(act._id); 
    navigate(`/act/${act._id}`);
  } catch (error) {
    console.error("Помилка при збереженні реєстрації:", error);
    alert("❌ Не вдалося зберегти реєстрацію акту");
  }
};

  return (
    <div className={styles.pageContainer}>
    <h1 className={styles.pageTitle}>Реєстрація нового акту</h1>
    <form className={styles.formWrapper}>
      <GeneralInfoForm onChange={setGeneralInfo} />

        <SampleForm onChange={setSamples} />

        <div className={styles.buttonGroup}>
          <button className={styles.addButton} type="button" onClick={handleSubmitRegistration}>
            Зареєструвати акт
          </button>
        </div>
    </form>
</div>
   
  );
};

export default CreateActForm;