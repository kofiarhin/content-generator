import { NavLink } from 'react-router-dom';
import content from '../data/uiContent.json';
import styles from './Navigation.module.scss';

const Navigation = () => (
  <aside className={styles.sidebar}>
    <div className={styles.brand}>{content.navigation.brand}</div>
    <nav>
      <ul className={styles.list}>
        {content.navigation.items.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                [styles.link, isActive ? styles.active : ''].filter(Boolean).join(' ')
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

export default Navigation;
