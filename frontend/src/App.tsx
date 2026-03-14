import './index.css';
import AppRouter from './router';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="sanskriti-theme">
      <AppRouter />
      <Toaster richColors position="bottom-right" />
    </ThemeProvider>
  );
}

export default App;

