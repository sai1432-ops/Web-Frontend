/**
 * Suppress known Recharts duplicate key warnings
 * These warnings come from inside the Recharts library and cannot be fixed in our code
 */
export function suppressRechartsWarnings() {
  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args: any[]) => {
    const warningMessage = args[0]?.toString() || '';
    
    // Suppress Recharts duplicate key warnings
    if (
      warningMessage.includes('Encountered two children with the same key') &&
      (warningMessage.includes('recharts') || args.some((arg: any) => 
        arg?.toString().includes('recharts') || 
        arg?.toString().includes('Surface') ||
        arg?.toString().includes('ChartLayoutContextProvider')
      ))
    ) {
      return;
    }
    
    originalWarn.apply(console, args);
  };

  console.error = (...args: any[]) => {
    const errorMessage = args[0]?.toString() || '';
    
    // Suppress Recharts duplicate key errors
    if (
      errorMessage.includes('Encountered two children with the same key') &&
      (errorMessage.includes('recharts') || args.some((arg: any) => 
        arg?.toString().includes('recharts') || 
        arg?.toString().includes('Surface') ||
        arg?.toString().includes('ChartLayoutContextProvider')
      ))
    ) {
      return;
    }
    
    originalError.apply(console, args);
  };
}
