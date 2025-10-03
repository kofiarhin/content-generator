import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import styles from './Layout.module.scss';

const Layout = () => (
  <div className={styles.layout}>
    <Navigation />
    <main className={styles.content}>
      <Outlet />
    </main>
  </div>
);

export default Layout;
