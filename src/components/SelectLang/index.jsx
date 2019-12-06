import { Icon, Menu } from 'antd';
import { formatMessage, getLocale, setLocale } from 'umi-plugin-react/locale';
import React from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const SelectLang = props => {
  const { className, dispatch } = props;
  const selectedLang = getLocale();

  const setLanguageCode = lang => {
    dispatch({
      type: 'global/changeLanguageCode',
      payload: lang,
    });
  };

  setLanguageCode(selectedLang);

  const changeLang = ({ key }) => {
    document.documentElement.setAttribute('lang', key);
    // 切换语言时某些组件语言无法切换 https://pro.ant.design/docs/faq-cn
    // 可以将 setLocale 的第二个参数设置为 true，即可强制刷新
    setLocale(key, false);
    setLanguageCode(key);
  };

  const locales = ['zh-CN', 'en-US'];
  const languageLabels = {
    'zh-CN': '简体中文',
    'en-US': 'English',
  };
  const languageIcons = {
    'zh-CN': '🇨🇳',
    'en-US': '🇺🇸',
  };

  const langMenu = (
    <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={changeLang}>
      {locales.map(locale => (
        <Menu.Item key={locale}>
          <span role="img" aria-label={languageLabels[locale]}>
            {languageIcons[locale]}
          </span>{' '}
          {languageLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <HeaderDropdown overlay={langMenu} placement="bottomRight">
      <span className={classNames(styles.dropDown, className)}>
        <Icon
          type="global"
          title={formatMessage({
            id: 'navBar.lang',
          })}
        />
      </span>
    </HeaderDropdown>
  );
};

export default connect(({ global }) => ({
  languageCode: global.languageCode,
}))(SelectLang);
