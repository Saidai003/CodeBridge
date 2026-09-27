let pyodideInstance: any = null;
let loadingPromise: Promise<any> | null = null;

export async function initPyodide(): Promise<any> {
  if (pyodideInstance) return pyodideInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise(async (resolve, reject) => {
    try {
      const pyodide = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      });
      pyodideInstance = pyodide;
      resolve(pyodide);
    } catch (err) {
      loadingPromise = null;
      reject(err);
    }
  });

  return loadingPromise;
}

export async function executePython(code: string): Promise<string> {
  const pyodide = await initPyodide();
  
  pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
  `);

  try {
    await pyodide.runPythonAsync(code);
    const output = pyodide.runPython('sys.stdout.getvalue()');
    return output || '(no output)';
  } catch (err: any) {
    return `Error: ${err.message}`;
  }
}

export function isPyodideLoaded(): boolean {
  return pyodideInstance !== null;
}
