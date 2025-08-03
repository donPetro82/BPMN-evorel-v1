import React from 'react';
import { useTranslation } from 'react-i18next';

function MainPage() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '40px' }}>
      <h1>{t('title')}</h1>
      <div>
        <button style={{ margin: '15px', fontSize: '20px' }}>{t('processes')}</button>
        <button style={{ margin: '15px', fontSize: '20px' }}>{t('directories')}</button>
      </div>
      {/* Здесь будут компоненты дерева процессов и справочников */}
    </div>
  );
}

export default MainPage;