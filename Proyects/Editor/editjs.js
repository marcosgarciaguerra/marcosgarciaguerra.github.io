require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });

require(['vs/editor/editor.main'], function () {

    // Configuración común para los editores
    const editorConfig = {
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false }, // Ocultamos el minimapa para ahorrar espacio
        fontSize: 14,
        scrollBeyondLastLine: false
    };

    const htmlEditor = monaco.editor.create(document.getElementById('html-editor'), {
        ...editorConfig,
        value: `<p>Hola Mundo</p>`,
        language: 'html'
    });

    // 2. Inicializar CSS
    const cssEditor = monaco.editor.create(document.getElementById('css-editor'), {
        ...editorConfig,
        value: `/* Escribe tu CSS aquí */`,
        language: 'css'
    });

    // 3. Inicializar JS
    const jsEditor = monaco.editor.create(document.getElementById('js-editor'), {
        ...editorConfig,
        value: `// Escribe tu JS aquí`,
        language: 'javascript'
    });

    // --- FUNCIÓN DE ACTUALIZACIÓN MEJORADA ---
    function updatePreview() {
        const html = htmlEditor.getValue();
        const css = cssEditor.getValue();
        const js = jsEditor.getValue();

        const iframe = document.getElementById('preview');


        const doc = iframe.contentDocument || iframe.contentWindow.document;

        doc.open();
        doc.write(`
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <style>${css}</style>
                    </head>
                    <body>
                        ${html}
                        </body>
                    </html>
                `);

        // Inyectamos el JS creando un elemento Script real
        // Esto evita que caracteres como < / script > rompan el string
        const scriptElement = doc.createElement('script');
        scriptElement.textContent = js;

        // Manejo de errores básico dentro del iframe
        const errorHandler = doc.createElement('script');
        errorHandler.textContent = `
                    window.onerror = function(message, source, lineno, colno, error) {
                        console.error("Error en el Iframe:", message);
                    };
                `;

        doc.body.appendChild(errorHandler);
        doc.body.appendChild(scriptElement);

        doc.close();
    }

    let timeout;
    function onCodeChange() {
        clearTimeout(timeout);
        timeout = setTimeout(updatePreview, 800); // Espera 800ms después de dejar de escribir
    }

    htmlEditor.onDidChangeModelContent(onCodeChange);
    cssEditor.onDidChangeModelContent(onCodeChange);
    jsEditor.onDidChangeModelContent(onCodeChange);

    document.querySelector(".download").addEventListener("click", function () {
        const iframe = document.getElementById('preview');

        const doc = iframe.contentDocument || iframe.contentWindow.document;
        let htmlContent = doc.documentElement.outerHTML;

        const fullHtml = `<!DOCTYPE html>\n${htmlContent}`;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = 'output.html';
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    updatePreview();
});