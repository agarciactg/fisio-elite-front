import { ConfigProvider } from 'antd';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#006874',
          colorInfo: '#006874',
          colorSuccess: '#286b33',
          colorWarning: '#006a63',
          colorError: '#ba1a1a',
          borderRadius: 8,
          fontFamily: "'Inter', sans-serif",
        },
        components: {
          Layout: {
            headerBg: 'rgba(255, 255, 255, 0.8)',
            bodyBg: '#f8f9fa',
            siderBg: 'rgba(255, 255, 255, 0.8)',
          },
          Typography: {
            fontFamilyCode: "'Manrope', sans-serif",
          }
        }
      }}
    >
      <AppRouter />
    </ConfigProvider>
  );
}

export default App;
