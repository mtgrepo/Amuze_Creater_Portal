import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router/routes.tsx'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import store from './redux/store/store.ts'
import { ThemeProvider } from './components/common/Themes/theme-provider.tsx'
import { toast } from 'sonner'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import './i18n.ts'
import { Toaster } from './components/ui/sonner.tsx'
import { registerServiceWorker } from './registerSW.ts'

const queryClient = new QueryClient(({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error?.message || "An error occured")
    }
  })
}));

registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider >
      <StrictMode>
          <Provider store={store}>
            <RouterProvider router={router} />  
          </Provider>
          <Toaster richColors position='top-right'/>
      </StrictMode>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
