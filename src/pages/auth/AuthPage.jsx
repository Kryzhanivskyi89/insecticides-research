
import LoginForm from '../../components/LoginForm/LoginForm';
import styles from './style.module.css';

export default function AuthPage() {

  return (
    <div className={styles.container}>
      
      <div className={styles.containerForm}>
        <LoginForm />
      </div>

    </div>
  );}