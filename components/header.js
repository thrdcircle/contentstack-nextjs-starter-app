import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import parse from 'html-react-parser';
import store from '../redux/store';

export default function Header(props) {
  const { header } = props;
  const router = useRouter();
  const [getHeader, setHeader] = useState(header);

  store.subscribe(() => {
    const check = store.getState().main;
    if (check.header === getHeader) {
      setHeader(check.header);
    }
  });

  return (
    <header className="header">
      <div
        className="note-div"
        {...getHeader.notification_bar.$?.announcement_text}
      >
        {getHeader.notification_bar.show_announcement ? (
          typeof getHeader.notification_bar.announcement_text === 'string'
          && parse(getHeader.notification_bar.announcement_text)
        ) : (
          <div style={{ visibility: 'hidden' }}>Devtools section</div>
        )}
      </div>
      <div className="max-width header-div">
        <div className="wrapper-logo">
          <Link href="/" className="logo-tag" title="Contentstack">
            <img
              className="logo"
              src={getHeader.logo.url}
              alt={getHeader.title}
              title={getHeader.title}
              {...getHeader.logo.$?.url}
            />
          </Link>
        </div>
        <input className="menu-btn" type="checkbox" id="menu-btn" />
        <label className="menu-icon" htmlFor="menu-btn">
          <span className="navicon" />
        </label>
        <nav className="menu">
          <ul className="nav-ul header-ul">
            {getHeader.navigation_menu?.map((list) => (
              <li key={list.label} className="nav-li">
                <Link href={list.page_reference[0].url}>
                  <a
                    className={
                      router.pathname === list.page_reference[0].url
                        ? 'active'
                        : ''
                    }
                    {...list.$?.label}
                  >
                    {list.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
