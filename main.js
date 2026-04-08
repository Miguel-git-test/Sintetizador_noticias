import { createWorker } from 'tesseract.js';
import { pipeline, env } from '@xenova/transformers';
import { createIcons, PlusCircle, Clipboard, RefreshCw, Copy, Share2, HelpCircle, Zap } from 'lucide';

// Global error handling for mobile debugging
window.onerror = function(msg, url, line, col, error) {
    alert(`ERROR: ${msg}\nEn: ${url}:${line}\nDetalle: ${error ? error.stack : 'S/D'}`);
    return false;
};

window.onunhandledrejection = function(event) {
    alert(`PROMISE ERROR: ${event.reason}`);
};

// Initial version confirm
alert('NewsSynth v1.0.2-diag cargado');

// Skip local check to download from Hugging Face
env.allowLocalModels = false;

// Initialize Lucide icons
createIcons({
    icons: { PlusCircle, Clipboard, RefreshCw, Copy, Share2, HelpCircle, Zap }
});

// App State
const state = {
    summarizer: null,
    classifier: null,
    isInitializing: false,
    content: ''
};

// UI Elements
const dropZone = document.getElementById('drop-zone');
const pasteBtn = document.getElementById('paste-btn');
const manualText = document.getElementById('manual-text');
const statusSection = document.getElementById('status-section');
const resultSection = document.getElementById('result-section');
const inputSection = document.getElementById('input-section');
const statusText = document.getElementById('status-text');
const progressBar = document.getElementById('progress-bar');
const summaryText = document.getElementById('summary-text');
const answerText = document.getElementById('answer-text');
const toneBadge = document.getElementById('tone-badge');
const newBtn = document.getElementById('new-btn');
const copyBtn = document.getElementById('copy-summary');

// Initialize AI Models
async function initAI(progressCallback) {
    if (state.summarizer && state.classifier) return;
    
    state.isInitializing = true;
    statusSection.classList.remove('hidden');
    inputSection.classList.add('hidden');
    
    try {
        statusText.textContent = 'Cargando modelos de IA (aprox. 50MB)...';
        
        // Summarizer
        state.summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6', {
            progress_callback: (p) => {
                if (p.status === 'progress') {
                    progressCallback(p.progress * 0.8);
                }
            }
        });

        statusText.textContent = 'Inicializando detector de tono...';
        
        // Classifier for Tone
        state.classifier = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english', {
            progress_callback: (p) => {
                if (p.status === 'progress') {
                    progressCallback(80 + (p.progress * 0.2));
                }
            }
        });

        statusText.textContent = 'Listo para procesar.';
    } catch (error) {
        console.error('Error loading AI models:', error);
        statusText.textContent = 'Error cargando modelos. Revisa tu conexión.';
    } finally {
        state.isInitializing = false;
    }
}

function updateProgress(progress) {
    progressBar.style.width = `${progress}%`;
}

// Processing Logic
async function processContent(text) {
    if (!text || text.trim().length < 5) {
        alert('Por favor, introduce al menos 5 caracteres (un enlace o texto corto).');
        return;
    }
    
    // Show loading UI immediately
    statusSection.classList.remove('hidden');
    inputSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    statusText.textContent = 'Iniciando proceso...';
    updateProgress(10);

    await initAI(updateProgress);
    
    statusText.textContent = 'Sintetizando noticia...';
    updateProgress(100);

    try {
        // Summary
        const summaryOutput = await state.summarizer(text, {
            max_new_tokens: 100,
            chunk_length: 512,
            callback_function: (x) => {
                // Optional streaming feedback
            }
        });
        const summary = summaryOutput[0].summary_text;

        // Tone
        const toneOutput = await state.classifier(text.substring(0, 500));
        const tone = toneOutput[0].label === 'POSITIVE' ? 'Positivo' : 'Negativo/Crítico';
        
        // Headline Answer Simulation
        // For a true answer, we'd need a QA model, but for "maximum synthesis" 
        // we can try to find if there's a question in the first part and check summary for answer
        let answer = "Noticia analizada con éxito.";
        const firstLine = text.split('\n')[0];
        if (firstLine.includes('?')) {
            answer = "La noticia sugiere que: " + summary.split('.')[0];
        }

        displayResults(summary, tone, answer);
    } catch (error) {
        console.error('Processing error:', error);
        statusText.textContent = 'Error procesando la noticia.';
    } finally {
        statusSection.classList.add('hidden');
    }
}

function displayResults(summary, tone, answer) {
    summaryText.textContent = summary;
    toneBadge.textContent = `Tono: ${tone}`;
    answerText.textContent = answer;
    
    resultSection.classList.remove('hidden');
    inputSection.classList.add('hidden');
}

// OCR Logic
async function processImage(file) {
    statusSection.classList.remove('hidden');
    inputSection.classList.add('hidden');
    statusText.textContent = 'Leyendo imagen (OCR)...';
    updateProgress(20);

    const worker = await createWorker('spa');
    const { data: { text } } = await worker.recognize(file);
    await worker.terminate();
    
    updateProgress(100);
    processContent(text);
}

// Event Listeners
pasteBtn.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        if (text) {
            manualText.value = text;
            processContent(text);
        }
    } catch (err) {
        console.error('Failed to read clipboard:', err);
    }
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        processImage(files[0]);
    } else if (e.dataTransfer.getData('text')) {
        processContent(e.dataTransfer.getData('text'));
    }
});

document.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
            processImage(item.getAsFile());
            return;
        }
    }
    const text = e.clipboardData.getData('text');
    if (text) processContent(text);
});

newBtn.addEventListener('click', () => {
    resultSection.classList.add('hidden');
    inputSection.classList.remove('hidden');
    manualText.value = '';
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(summaryText.textContent);
    copyBtn.innerHTML = '<i data-lucide="check"></i> Copiado';
    setTimeout(() => {
        copyBtn.innerHTML = '<i data-lucide="copy"></i> Copiar';
        createIcons({ icons: { Copy } });
    }, 2000);
    createIcons({ icons: { Copy } });
});

const processManualBtn = document.getElementById('process-manual');
processManualBtn.addEventListener('click', () => {
    try {
        const text = manualText.value;
        alert('DEBUG: Click detectado. Texto: ' + (text ? text.substring(0, 20) + '...' : 'vacío'));
        if (text) {
            processContent(text);
        } else {
            alert('El cuadro de texto está vacío.');
        }
    } catch (e) {
        alert('ERROR en el click listener: ' + e.message);
    }
});

// URL & Share Target Handling
async function handleSharedContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedUrl = urlParams.get('url');
    const sharedText = urlParams.get('text');
    const sharedTitle = urlParams.get('title');

    let contentToProcess = sharedUrl || sharedText || sharedTitle;

    if (sharedUrl) {
        // Try to fetch or just notify user we are analyzing the URL
        statusText.textContent = `Analizando URL: ${sharedUrl}...`;
        // In a real browser PWA, we might need a proxy or the user to copy-paste 
        // due to CORS, but we can try basic fetch or just use the title/text if provided.
        if (!sharedText) {
            contentToProcess = `Noticia compartida desde: ${sharedUrl}. `;
        }
    }

    if (contentToProcess) {
        processContent(contentToProcess);
    }
}

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js');
    });
}

// Init
handleSharedContent();
