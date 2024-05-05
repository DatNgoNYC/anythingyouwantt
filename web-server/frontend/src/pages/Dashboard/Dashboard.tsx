import { useContext, useState } from 'react';
import { SidePanel } from './components/SidePanel';
import { You } from './components/You';
import { PageProps } from '../../types';
import { Orders } from './components/Orders';
import { DashboardContext } from '../../context/DashboardContext';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
  const { isDashboardActive } = useContext(DashboardContext);
  const [currentPage, setCurrentPage] = useState('you');

  return (
    <div
      className={`
    ${styles.Dashboard} 
    ${isDashboardActive ? styles.active : ''}`}

    >
      <SidePanel currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <Page currentPage={currentPage} />
    </div>
  );
};

const Page = ({ currentPage }: PageProps): React.JSX.Element => {
  const renderCurrentPage = (currentPage: string): React.JSX.Element => {
    switch (currentPage) {
      case 'you':
        return <You />;

      case 'orders':
        return <Orders />;

      default:
        return <You />;
    }
  };

  return <div className={`${styles.page}`}>{renderCurrentPage(currentPage)}</div>;
};

export { Dashboard };
