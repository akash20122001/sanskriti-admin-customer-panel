import './index.css';
import AppRouter from './router';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <AppRouter />
      <Toaster richColors position="bottom-right" />
    </>
  );
}

export default App;

