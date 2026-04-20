import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router/routes.tsx'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import store from './redux/store/store.ts'
import { ThemeProvider, useTheme } from './components/common/Themes/theme-provider.tsx'
import { toast } from 'sonner'
import { Toaster } from './components/ui/sonner.tsx'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import './i18n.ts'
// Include Global Error Handler For Queries ( Mutation will be handled manually )
const queryClient = new QueryClient(({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error?.message || "An error occured")
    }
  })
}));

// Toast Wrapper
function ThemedToaster() {
  const { theme } = useTheme()
  return <Toaster richColors position="top-right" theme={theme === "system" ? "system" : theme} />
}

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider >
      <StrictMode>
          <Provider store={store}>
            <RouterProvider router={router} />  
            <ThemedToaster />
          </Provider>
      </StrictMode>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
