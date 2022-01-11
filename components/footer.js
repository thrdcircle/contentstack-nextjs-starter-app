import React, { useState } from 'react';
import Link from 'next/link';
import parse from 'html-react-parser';
import store from '../redux/store';

export default function Footer(props) {
  const { footer } = props;
  const [getFooter, setFooter] = useState(footer);

  store.subscribe(() => {
    const check = store.getState().main;
    if (check.footer === getFooter) {
      setFooter(check.footer);
    }
  });

  return (
    <footer>
      <div className="max-width footer-div">
        <div className="col-quarter">
          <Link href="/" className="logo-tag">
            <img
              {...getFooter.logo.$?.url}
              src={getFooter.logo.url}
              alt={getFooter.title}
              title={getFooter.title}
              className="logo footer-logo"
            />
          </Link>
        </div>
        <div className="col-half">
          <nav>
            <ul className="nav-ul">
              {getFooter.navigation.link?.map((menu) => (
                <li className="footer-nav-li" key={menu.title}>
                  <Link href={menu.href} {...menu.$?.title}>
                    {menu.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="col-quarter social-link">
          <div className="social-nav">
            {getFooter.social.social_share?.map((social) => (
              <a
                href={social.link.href}
                title={social.link.title}
                key={social.link.title}
                {...social.icon.$?.url}
              >
                {social.icon && (
                  <img
                    src={social.icon.url}
                    alt={social.link.title}
                    {...footer.$?.copyright}
                  />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="copyright">
        {typeof getFooter.copyright === 'string' && parse(getFooter.copyright)}
      </div>
    </footer>
  );
}
