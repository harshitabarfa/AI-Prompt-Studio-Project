/* ════════════════════════════════════════════════════════
   AI PROMPT STUDIO — COMPLETE SCRIPT
   Features: AI Generation, Prompt Management, Analytics,
   Voice I/O, TTS, Export, i18n, Keyboard Shortcuts, Drag
════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   CONSTANTS & STATE
───────────────────────────────────────── */
const STORAGE_KEYS = {
    PROMPTS:   'aps_prompts',
    SETTINGS:  'aps_settings',
    ANALYTICS: 'aps_analytics',
    HISTORY:   'aps_history',
    THEME:     'aps_theme',
    LANG:      'aps_lang',
};

const PROMPT_TEMPLATES = [
    // Coding
    { title: 'Debug My Code', category: 'Coding', tags: ['#debug', '#code'], icon: '🐛',
      text: 'Act as a senior software engineer. Debug the following code, identify errors, and provide a corrected version with explanation:\n\n[PASTE CODE HERE]' },
    { title: 'Code Review', category: 'Coding', tags: ['#review', '#code'], icon: '🔍',
      text: 'Act as a code reviewer. Review the following code for bugs, performance issues, security vulnerabilities, and code quality. Provide actionable improvements:\n\n[PASTE CODE HERE]' },
    { title: 'Explain This Algorithm', category: 'Coding', tags: ['#algorithm', '#learning'], icon: '📊',
      text: 'Explain the [ALGORITHM NAME] algorithm in simple terms. Include time/space complexity, real-world use cases, and a step-by-step walkthrough with an example.' },
    { title: 'Build a REST API', category: 'Coding', tags: ['#api', '#backend'], icon: '⚙️',
      text: 'Act as a backend developer. Design a RESTful API for [FEATURE] using [TECHNOLOGY]. Include endpoints, request/response schemas, error handling, and authentication approach.' },
    { title: 'React Component', category: 'Coding', tags: ['#react', '#frontend'], icon: '⚛️',
      text: 'Build a React functional component for [COMPONENT]. Include props, state management with hooks, proper TypeScript types, and CSS module styles.' },
    // Writing
    { title: 'Blog Post Outline', category: 'Writing', tags: ['#blog', '#content'], icon: '📝',
      text: 'Create a detailed blog post outline on "[TOPIC]". Include an engaging headline, introduction hook, 5-7 main sections with subpoints, and a compelling CTA conclusion.' },
    { title: 'LinkedIn Post', category: 'Writing', tags: ['#linkedin', '#social'], icon: '💼',
      text: 'Write a high-engagement LinkedIn post about [TOPIC]. Use a strong hook, personal insights, bullet points, and end with a question to drive comments. Keep it under 300 words.' },
    { title: 'Email Newsletter', category: 'Writing', tags: ['#email', '#marketing'], icon: '📧',
      text: 'Write a professional email newsletter for [BRAND] about [TOPIC]. Include subject line, preview text, greeting, body with 3 key points, and CTA button text.' },
    { title: 'Product Description', category: 'Writing', tags: ['#copywriting', '#ecommerce'], icon: '🛍️',
      text: 'Write a compelling product description for [PRODUCT]. Highlight key features, benefits, solve a pain point, and include sensory language. Target audience: [AUDIENCE].' },
    // Business
    { title: 'Business Plan Section', category: 'Business', tags: ['#startup', '#planning'], icon: '📈',
      text: 'Write the [SECTION] section of a business plan for [BUSINESS IDEA]. Be detailed, include market data references, realistic projections, and a competitive analysis framework.' },
    { title: 'SWOT Analysis', category: 'Business', tags: ['#strategy', '#analysis'], icon: '🎯',
      text: 'Perform a comprehensive SWOT analysis for [COMPANY/PRODUCT] in the [INDUSTRY] industry. Provide actionable strategic recommendations for each quadrant.' },
    { title: 'Marketing Strategy', category: 'Business', tags: ['#marketing', '#growth'], icon: '🚀',
      text: 'Create a 90-day marketing strategy for [PRODUCT/SERVICE] targeting [AUDIENCE]. Include channel mix, content calendar outline, KPIs, and budget allocation percentages.' },
    { title: 'Meeting Agenda', category: 'Business', tags: ['#productivity', '#meetings'], icon: '📅',
      text: 'Create a professional meeting agenda for a [MEETING TYPE] lasting [DURATION]. Include time slots, discussion points, responsible persons, and expected outcomes.' },
    // Study
    { title: 'Study Plan', category: 'Study', tags: ['#learning', '#study'], icon: '📚',
      text: 'Create a [DURATION] study plan for learning [SUBJECT/TECHNOLOGY]. Include daily schedule, resources for each phase, practice exercises, and milestone checkpoints.' },
    { title: 'Interview Prep Q&A', category: 'Study', tags: ['#interview', '#preparation'], icon: '🎯',
      text: 'Generate 15 interview questions and detailed answers for [ROLE] position. Cover technical skills, behavioral questions, system design concepts, and company culture fit.' },
    { title: 'Concept Explainer', category: 'Study', tags: ['#learning', '#concepts'], icon: '💡',
      text: 'Explain [CONCEPT] using the Feynman Technique — as if explaining to a 10-year-old first, then gradually increasing technical depth. Include analogies and real examples.' },
    { title: 'Flashcard Set', category: 'Study', tags: ['#revision', '#flashcards'], icon: '🃏',
      text: 'Create 10 flashcards (Q&A format) for studying [TOPIC]. Make questions specific and answers concise but complete. Include memory tips where helpful.' },
    // Career
    { title: 'Resume Summary', category: 'Career', tags: ['#resume', '#job'], icon: '📄',
      text: 'Write a compelling professional summary for a [ROLE] with [X] years of experience in [INDUSTRY]. Highlight top skills, achievements, and career value proposition. Keep under 4 lines.' },
    { title: 'Cover Letter', category: 'Career', tags: ['#coverletter', '#job'], icon: '✉️',
      text: 'Write a personalized cover letter for a [ROLE] position at [COMPANY]. Connect my experience in [BACKGROUND] to their requirements, show company research, and express enthusiasm authentically.' },
    { title: 'Career Roadmap', category: 'Career', tags: ['#career', '#growth'], icon: '🗺️',
      text: 'Create a 2-year career roadmap for a [CURRENT ROLE] wanting to become a [TARGET ROLE]. Include skills to learn, certifications, projects to build, and networking strategies.' },
    { title: 'Salary Negotiation Script', category: 'Career', tags: ['#salary', '#negotiation'], icon: '💰',
      text: 'Write a professional salary negotiation script for someone offered [AMOUNT] but targeting [TARGET]. Include data backup points, alternative benefits to negotiate, and response to pushback.' },
];

const LANGUAGE_PACKS = {
    en: {
        promptConfig: 'Prompt Configuration',
        promptType: 'Prompt Type',
        role: 'Role',
        tone: 'Tone',
        length: 'Length',
        format: 'Format',
        topicLabel: 'Topic / Code',
        topicPlaceholder: 'Enter your topic, question, or code snippet...',
        tags: 'Tags',
        category: 'Category',
        generatePrompt: 'Generate Prompt',
        generatedPrompt: 'Generated Prompt',
        aiResponse: 'AI Response',
        aiEmptyState: 'Generate a prompt first, then click Run AI to see the response.',
        runAI: 'Run AI',
        copyResponse: 'Copy Response',
        copy: 'Copy',
        save: 'Save',
        improve: 'Improve',
        share: 'Share',
        savedPrompts: 'Saved Prompts',
        templates: 'Prompt Templates',
        analytics: 'Analytics & Insights',
        settings: 'Settings',
        totalGenerated: 'Total Generated',
        totalSaved: 'Total Saved',
        favorites: 'Favorites',
        aiRuns: 'AI Runs',
        mostUsedTypes: 'Most Used Prompt Types',
        recentHistory: 'Recent History',
        noHistory: 'No history yet.',
        apiConfig: 'AI API Configuration',
        apiMode: 'API Mode',
        geminiKey: 'Gemini API Key',
        demoModeInfo: 'Demo mode uses JSONPlaceholder API — no key needed. Switch to Gemini for real AI responses.',
        language: 'Language',
        appearance: 'Appearance',
        shortcuts: 'Keyboard Shortcuts',
        noSaved: 'No saved prompts yet',
        noSavedSub: 'Generate a prompt in Studio and save it here.',
    },
    mr: {
        promptConfig: 'प्रॉम्प्ट सेटिंग',
        promptType: 'प्रॉम्प्ट प्रकार',
        role: 'भूमिका',
        tone: 'शैली',
        length: 'लांबी',
        format: 'स्वरूप',
        topicLabel: 'विषय / कोड',
        topicPlaceholder: 'तुमचा विषय, प्रश्न किंवा कोड येथे लिहा...',
        tags: 'टॅग्ज',
        category: 'श्रेणी',
        generatePrompt: 'प्रॉम्प्ट तयार करा',
        generatedPrompt: 'तयार केलेला प्रॉम्प्ट',
        aiResponse: 'AI चे उत्तर',
        aiEmptyState: 'आधी प्रॉम्प्ट तयार करा, नंतर Run AI दाबा.',
        runAI: 'AI चालवा',
        copyResponse: 'उत्तर कॉपी करा',
        copy: 'कॉपी',
        save: 'जतन करा',
        improve: 'सुधारा',
        share: 'शेअर करा',
        savedPrompts: 'जतन केलेले प्रॉम्प्ट',
        templates: 'प्रॉम्प्ट टेम्पलेट्स',
        analytics: 'विश्लेषण',
        settings: 'सेटिंग्ज',
        totalGenerated: 'एकूण तयार केले',
        totalSaved: 'एकूण जतन',
        favorites: 'आवडते',
        aiRuns: 'AI वापर',
        mostUsedTypes: 'सर्वाधिक वापरलेले प्रकार',
        recentHistory: 'अलीकडील इतिहास',
        noHistory: 'अद्याप इतिहास नाही.',
        apiConfig: 'AI API सेटिंग',
        apiMode: 'API मोड',
        geminiKey: 'Gemini API की',
        demoModeInfo: 'डेमो मोड JSONPlaceholder वापरतो — की आवश्यक नाही.',
        language: 'भाषा',
        appearance: 'देखावा',
        shortcuts: 'कीबोर्ड शॉर्टकट्स',
        noSaved: 'अद्याप प्रॉम्प्ट जतन नाहीत',
        noSavedSub: 'Studio मध्ये प्रॉम्प्ट तयार करा आणि येथे जतन करा.',
    }
};

// App State
let state = {
    currentTab: 'studio',
    currentType: 'explain',
    currentPrompt: '',
    currentAIResponse: '',
    apiMode: 'demo',
    language: 'en',
    theme: 'light',
    sidebarCollapsed: false,
    editingIndex: null,
    currentLibraryFilter: 'all',
    isTTSSpeaking: false,
    isRecording: false,
    suggestionDebounce: null,
    dragSrcIndex: null,
};

let analytics = { total: 0, saved: 0, favorites: 0, aiRuns: 0, types: {}, history: [] };

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
    loadState();
    initLoader();
    initSidebar();
    initTheme();
    initTabs();
    initTypeChips();
    initCharCount();
    initVoiceInput();
    initKeyboardShortcuts();
    renderLibrary();
    renderTemplates();
    renderAnalytics();
    initI18n();
    checkSharedPrompt();
    updateLibraryBadge();
    syncTopbarStats();
});

function initLoader() {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.classList.add('fade-out');
        setTimeout(() => loader.remove(), 500);
    }, 2400);
}

function loadState() {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
    state.apiMode = saved.apiMode || 'demo';
    state.language = localStorage.getItem(STORAGE_KEYS.LANG) || 'en';
    state.theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    analytics = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || JSON.stringify(analytics));

    // Restore API key display
    if (saved.geminiKey) {
        document.getElementById('geminiApiKey').value = saved.geminiKey;
    }
    // Restore API mode buttons
    setApiMode(state.apiMode, true);
}

function saveSettings() {
    const settings = {
        apiMode: state.apiMode,
        geminiKey: document.getElementById('geminiApiKey').value,
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

function saveAnalytics() {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
}

/* ─────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────── */
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainWrapper = document.getElementById('mainWrapper');
    const toggle = document.getElementById('sidebarToggle');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const overlay = document.getElementById('sidebarOverlay');

    // Desktop collapse toggle
    toggle.addEventListener('click', () => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
        mainWrapper.classList.toggle('sidebar-collapsed', state.sidebarCollapsed);
    });

    // Mobile hamburger
    mobileBtn.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active', isOpen);
    });

    // Overlay click closes sidebar on mobile
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
    });
}

/* ─────────────────────────────────────────
   TABS
───────────────────────────────────────── */
function initTabs() {
    // Sidebar nav buttons
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    // Mobile bottom tabs
    document.querySelectorAll('.bottom-tab').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
}

function switchTab(tab) {
    state.currentTab = tab;

    // Update panels
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(`tab-${tab}`);
    if (panel) panel.classList.add('active');

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(n => {
        n.classList.toggle('active', n.dataset.tab === tab);
    });
    document.querySelectorAll('.bottom-tab').forEach(n => {
        n.classList.toggle('active', n.dataset.tab === tab);
    });

    // Update topbar title
    const titles = { studio: '✨ Studio', library: '📚 Library', templates: '📋 Templates', analytics: '📊 Analytics', settings: '⚙️ Settings' };
    document.getElementById('topbarTitle').textContent = titles[tab] || '';

    // Refresh data when switching to analytics
    if (tab === 'analytics') renderAnalytics();
    if (tab === 'library') renderLibrary();

    // Also close sidebar when switching tabs on mobile
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) overlay.classList.remove('active');
}

/* ─────────────────────────────────────────
   THEME
───────────────────────────────────────── */
function initTheme() {
    setTheme(state.theme, true);

    document.getElementById('themeToggle').addEventListener('click', () => {
        setTheme(state.theme === 'light' ? 'dark' : 'light');
    });
    document.getElementById('themeToggleMobile').addEventListener('click', () => {
        setTheme(state.theme === 'light' ? 'dark' : 'light');
    });
}

function setTheme(theme, silent = false) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);

    const isDark = theme === 'dark';
    const icon = isDark ? 'fa-sun' : 'fa-moon';
    const label = isDark ? 'Light Mode' : 'Dark Mode';
    document.getElementById('themeIcon').className = `fas ${icon}`;
    document.getElementById('themeIconMobile').className = `fas ${icon}`;
    document.getElementById('themeLabel').textContent = label;

    // Settings toggle buttons
    document.getElementById('themeLight').classList.toggle('active', theme === 'light');
    document.getElementById('themeDark').classList.toggle('active', theme === 'dark');

    if (!silent) showToast(`${isDark ? '🌙 Dark' : '☀️ Light'} mode enabled`, 'info');
}

/* ─────────────────────────────────────────
   LANGUAGE (i18n)
───────────────────────────────────────── */
function initI18n() {
    setLanguage(state.language, true);

    document.getElementById('langToggle').addEventListener('click', () => {
        setLanguage(state.language === 'en' ? 'mr' : 'en');
    });
}

function setLanguage(lang, silent = false) {
    state.language = lang;
    localStorage.setItem(STORAGE_KEYS.LANG, lang);

    const pack = LANGUAGE_PACKS[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (pack[key]) el.textContent = pack[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (pack[key]) el.placeholder = pack[key];
    });

    document.getElementById('langLabel').textContent = lang === 'en' ? 'EN' : 'मर';

    // Settings buttons
    document.getElementById('langEN').classList.toggle('active', lang === 'en');
    document.getElementById('langMR').classList.toggle('active', lang === 'mr');

    if (!silent) showToast(lang === 'en' ? '🇺🇸 Switched to English' : '🇮🇳 मराठीत बदलले', 'info');
}

/* ─────────────────────────────────────────
   TYPE CHIPS
───────────────────────────────────────── */
function initTypeChips() {
    document.querySelectorAll('.type-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.type-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.currentType = chip.dataset.type;
        });
    });
}

/* ─────────────────────────────────────────
   CHAR COUNT + AUTO-SUGGESTIONS
───────────────────────────────────────── */
function initCharCount() {
    const textarea = document.getElementById('topicInput');
    const counter = document.getElementById('charCount');
    textarea.addEventListener('input', () => {
        counter.textContent = textarea.value.length;
        handleAutoSuggestions(textarea.value);
    });
}

function handleAutoSuggestions(value) {
    clearTimeout(state.suggestionDebounce);
    const box = document.getElementById('suggestionsBox');

    if (value.trim().length < 4) {
        box.classList.add('hidden');
        box.innerHTML = '';
        return;
    }

    state.suggestionDebounce = setTimeout(() => {
        const suggestions = generateSuggestions(value.trim(), state.currentType);
        if (suggestions.length === 0) { box.classList.add('hidden'); return; }

        box.innerHTML = suggestions.map(s =>
            `<div class="suggestion-item" onclick="applySuggestion('${escapeAttr(s)}')">
                <i class="fas fa-lightbulb"></i> ${escapeHtml(s)}
            </div>`
        ).join('');
        box.classList.remove('hidden');
    }, 600);
}

function generateSuggestions(input, type) {
    const suggestions = [];
    const lower = input.toLowerCase();
    if (type === 'explain') {
        suggestions.push(`Explain ${input} with real-world examples`);
        suggestions.push(`Compare ${input} with alternatives`);
        if (lower.includes('js') || lower.includes('python') || lower.includes('java'))
            suggestions.push(`${input} best practices and pitfalls`);
    } else if (type === 'debug') {
        suggestions.push(`Debug and optimize: ${input}`);
        suggestions.push(`Find security issues in: ${input}`);
    } else if (type === 'write') {
        suggestions.push(`Write a ${input} for beginners`);
        suggestions.push(`Write a comprehensive guide on ${input}`);
    } else if (type === 'career') {
        suggestions.push(`Career roadmap for ${input}`);
        suggestions.push(`Top skills needed to become ${input}`);
    } else if (type === 'idea') {
        suggestions.push(`Innovative project ideas using ${input}`);
        suggestions.push(`${input} startup ideas for 2025`);
    }
    return suggestions.slice(0, 3);
}

function applySuggestion(text) {
    document.getElementById('topicInput').value = text;
    document.getElementById('charCount').textContent = text.length;
    document.getElementById('suggestionsBox').classList.add('hidden');
}

/* ─────────────────────────────────────────
   PROMPT GENERATION
───────────────────────────────────────── */
function generatePrompt() {
    const type    = state.currentType;
    const role    = document.getElementById('role').value;
    const tone    = document.getElementById('tone').value;
    const length  = document.getElementById('length').value;
    const format  = document.getElementById('format').value;
    const input   = document.getElementById('topicInput').value.trim();

    if (!input) {
        showToast('⚠️ Please enter a topic or code first', 'warning');
        document.getElementById('topicInput').focus();
        return;
    }

    const promptMap = {
        explain:   `Act as a ${role}.\nExplain "${input}" in a ${tone} tone.\nLength: ${length}. Format: ${format}.\nInclude real-world examples, key concepts, and a concise summary.`,
        debug:     `Act as a senior ${role}.\nDebug the following code snippet. Identify all bugs, explain why they occur, and provide a corrected version.\nTone: ${tone}. Format: ${format}.\n\nCode:\n${input}`,
        write:     `Act as a ${role}.\nWrite ${length} content about "${input}" in a ${tone} tone.\nFormat: ${format}.\nEnsure the content is engaging, well-structured, and targets the right audience.`,
        interview: `Act as a ${role} interviewer.\nGenerate ${length === 'Short' ? '5' : length === 'Medium' ? '10' : '15'} interview questions and detailed model answers for "${input}".\nFormat: ${format}.\nCover beginner to advanced levels.`,
        idea:      `Act as an innovative ${role}.\nSuggest creative project ideas related to "${input}" in a ${tone} tone.\nLength: ${length}. Format: ${format}.\nFor each idea, include concept, core features, recommended tech stack, and potential impact.`,
        career:    `Act as a ${role}.\nProvide ${length} career guidance for "${input}" in a ${tone} tone.\nFormat: ${format}.\nInclude skill roadmap, industry insights, certifications, and growth strategies.`,
        seo:       `Act as an SEO specialist.\nCreate an ${length} SEO strategy for "${input}" in a ${tone} tone.\nFormat: ${format}.\nInclude keyword targeting, on-page optimization, content strategy, and backlink approach.`,
        email:     `Act as a ${role} and expert copywriter.\nWrite a ${tone} email about "${input}".\nLength: ${length}. Format: ${format}.\nInclude: subject line, preview text, engaging body, and a clear call-to-action.`,
    };

    const prompt = promptMap[type] || promptMap.explain;
    state.currentPrompt = prompt;

    document.getElementById('outputPrompt').value = prompt;
    document.getElementById('suggestionsBox').classList.add('hidden');

    // Score prompt
    const score = scorePrompt(prompt);
    displayScore(score);

    // Track
    analytics.total++;
    analytics.types[type] = (analytics.types[type] || 0) + 1;
    addHistory({ type, input: input.substring(0, 60), prompt: prompt.substring(0, 120) });
    saveAnalytics();
    syncTopbarStats();

    // Robot bounce
    const robot = document.getElementById('robot');
    robot.classList.add('active');
    setTimeout(() => robot.classList.remove('active'), 600);

    showToast('✨ Prompt generated!', 'success');

    // Reset AI response
    document.getElementById('aiResponseArea').innerHTML = `
        <div class="ai-empty-state">
            <div class="ai-empty-icon">🤖</div>
            <p>Click <strong>Run AI</strong> to generate a response for this prompt.</p>
        </div>`;
    state.currentAIResponse = '';
}

/* ─────────────────────────────────────────
   PROMPT SCORING
───────────────────────────────────────── */
function scorePrompt(prompt) {
    let score = 0;
    if (prompt.length > 50) score += 2;
    if (prompt.length > 150) score += 1;
    if (/act as/i.test(prompt)) score += 2;
    if (/tone|format|length/i.test(prompt)) score += 1.5;
    if (/example|include|provide/i.test(prompt)) score += 1.5;
    if (prompt.split('\n').length > 2) score += 1;
    if (/beginner|advanced|level/i.test(prompt)) score += 1;
    return Math.min(Math.round(score), 10);
}

function displayScore(score) {
    const badge = document.getElementById('scoreBadge');
    const val = document.getElementById('scoreVal');
    val.textContent = score;
    badge.className = 'score-badge ' + (score >= 7 ? 'high' : score >= 4 ? 'medium' : 'low');
    badge.classList.remove('hidden');
}

/* ─────────────────────────────────────────
   AI RESPONSE — JSONPlaceholder / Gemini
───────────────────────────────────────── */
async function runAI() {
    if (!state.currentPrompt) {
        showToast('⚠️ Generate a prompt first', 'warning');
        return;
    }

    const area = document.getElementById('aiResponseArea');
    area.innerHTML = `<div style="padding:10px;">
        <div class="ai-typing"><span></span><span></span><span></span></div>
        <p style="color:var(--text-muted);font-size:0.82rem;margin-top:10px;">Thinking...</p>
    </div>`;

    try {
        let responseText = '';

        if (state.apiMode === 'gemini') {
            responseText = await callGeminiAPI(state.currentPrompt);
        } else {
            responseText = await callDemoAPI(state.currentPrompt);
        }

        state.currentAIResponse = responseText;
        renderAIResponse(responseText);

        analytics.aiRuns++;
        saveAnalytics();
        syncTopbarStats();
        showToast('🤖 AI response ready!', 'success');
    } catch (err) {
        area.innerHTML = `<div class="ai-empty-state">
            <div class="ai-empty-icon">⚠️</div>
            <p style="color:var(--red);">${err.message || 'Failed to fetch response. Check your API key or connection.'}</p>
        </div>`;
        showToast('❌ AI request failed', 'error');
    }
}

async function callDemoAPI(prompt) {
    // Use JSONPlaceholder — fetch a post whose id is based on prompt length
    const postId = (prompt.length % 100) + 1;
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    if (!res.ok) throw new Error('Demo API unavailable');
    const data = await res.json();

    // Build a structured "AI-style" response using the real API data
    const type = state.currentType;
    const topic = document.getElementById('topicInput').value.trim();
    const role = document.getElementById('role').value;
    const tone = document.getElementById('tone').value;

    return buildDemoResponse(type, topic, role, tone, data);
}

function buildDemoResponse(type, topic, role, tone, apiData) {
    const intros = {
        explain: `As a ${role}, here's a ${tone.toLowerCase()} explanation of **${topic}**:\n\n`,
        debug:   `Code Analysis & Debug Report:\n\n`,
        write:   `Here's your ${tone.toLowerCase()} content on **${topic}**:\n\n`,
        interview: `Interview Q&A for **${topic}**:\n\n`,
        idea:    `Creative project ideas for **${topic}**:\n\n`,
        career:  `Career guidance for **${topic}**:\n\n`,
        seo:     `SEO strategy for **${topic}**:\n\n`,
        email:   `Email draft for **${topic}**:\n\n`,
    };

    const bodyFromAPI = apiData.body
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    const sections = [
        `## Overview\n${intros[type] || ''}${bodyFromAPI}.`,
        `\n\n## Key Points\n• ${topic} is a widely discussed topic in modern technology.\n• Understanding it requires both theoretical knowledge and practical application.\n• The ${tone.toLowerCase()} approach recommended here ensures maximum clarity.`,
        `\n\n## Recommendation\nAs a ${role}, focus on applying these concepts in real projects. Start small, iterate, and document your learning. Consistent practice leads to mastery.`,
        `\n\n---\n*🔬 Demo Mode: This response was simulated using JSONPlaceholder API (Post #${apiData.id}). Switch to Gemini AI in Settings for real AI responses.*`
    ];

    return sections.join('');
}

async function callGeminiAPI(prompt) {
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
    const apiKey = settings.geminiKey;

    if (!apiKey) {
        throw new Error('No Gemini API key configured. Go to Settings → API Configuration.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
        })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || `Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
}

function renderAIResponse(text) {
    const area = document.getElementById('aiResponseArea');
    // Simple markdown-lite rendering
    const html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/## (.*?)(\n|$)/g, '<h3 style="color:var(--text-primary);font-family:Space Grotesk;margin:12px 0 6px;">$1</h3>')
        .replace(/^• (.*?)$/gm, '<li style="margin:4px 0;list-style:none;padding-left:4px;">→ $1</li>')
        .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--surface-border);margin:12px 0;">')
        .replace(/\*(.*?)\*/g, '<em style="color:var(--text-muted);font-size:0.8rem;">$1</em>')
        .replace(/\n/g, '<br>');

    area.innerHTML = `<div style="animation:fadeSlideIn 0.4s ease;">${html}</div>`;
}

/* ─────────────────────────────────────────
   IMPROVE PROMPT
───────────────────────────────────────── */
async function improvePrompt() {
    const current = document.getElementById('outputPrompt').value.trim();
    if (!current) {
        showToast('⚠️ No prompt to improve', 'warning');
        return;
    }

    showToast('🔧 Improving prompt...', 'info');

    const improvements = [
        `ROLE: Add clear expert persona → "Act as a senior [ROLE] with 10+ years of experience..."`,
        `CONTEXT: Add specific constraints → specify length, format, audience level`,
        `OUTPUT: Define expected output format → bullet points, code blocks, Q&A format`,
        `QUALITY: Add quality markers → "provide 3 practical examples", "include a real-world use case"`,
    ];

    const improved = current +
        `\n\n[IMPROVEMENT SUGGESTIONS]\n` +
        improvements.map((tip, i) => `${i + 1}. ${tip}`).join('\n') +
        `\n\n[FORMATTED VERSION]\nAct as a world-class expert. ${current.replace('Act as a', '').trim()}\nProvide:\n• 3 detailed, practical examples\n• Step-by-step breakdown\n• Common mistakes to avoid\n• Real-world applications`;

    document.getElementById('outputPrompt').value = improved;
    state.currentPrompt = improved;
    displayScore(scorePrompt(improved));
    showToast('✅ Prompt improved!', 'success');
}

/* ─────────────────────────────────────────
   COPY / TTS
───────────────────────────────────────── */
function copyPrompt() {
    const text = document.getElementById('outputPrompt').value;
    if (!text) { showToast('⚠️ No prompt to copy', 'warning'); return; }
    copyToClipboard(text);
    animateCopyBtn();
    showToast('✅ Prompt copied to clipboard!', 'success');
}

function copyAIResponse() {
    if (!state.currentAIResponse) { showToast('⚠️ No AI response to copy', 'warning'); return; }
    copyToClipboard(state.currentAIResponse);
    showToast('✅ AI response copied!', 'success');
}

function copyMarkdown() {
    const text = document.getElementById('outputPrompt').value;
    if (!text) { showToast('⚠️ No prompt to format', 'warning'); return; }
    const md = `# AI Prompt\n\n\`\`\`\n${text}\n\`\`\`\n\n*Generated by AI Prompt Studio*`;
    copyToClipboard(md);
    showToast('📋 Copied as Markdown!', 'success');
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(() => legacyCopy(text));
    } else {
        legacyCopy(text);
    }
}

function legacyCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
}

function animateCopyBtn() {
    const btn = document.getElementById('copyBtn');
    const icon = document.getElementById('copyIcon');
    icon.className = 'fas fa-check';
    btn.style.color = 'var(--green)';
    setTimeout(() => {
        icon.className = 'fas fa-copy';
        btn.style.color = '';
    }, 1500);
}

// Text to Speech
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('ttsBtn').addEventListener('click', () => {
        speakText(document.getElementById('outputPrompt').value, 'ttsBtn');
    });
    document.getElementById('aiTtsBtn').addEventListener('click', () => {
        speakText(state.currentAIResponse, 'aiTtsBtn');
    });
});

function speakText(text, btnId) {
    if (!text) { showToast('⚠️ Nothing to read', 'warning'); return; }
    if (!window.speechSynthesis) { showToast('❌ TTS not supported in this browser', 'error'); return; }

    if (state.isTTSSpeaking) {
        window.speechSynthesis.cancel();
        state.isTTSSpeaking = false;
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text.substring(0, 2000));
    utterance.lang = state.language === 'mr' ? 'mr-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.onstart = () => { state.isTTSSpeaking = true; showToast('🔊 Reading aloud...', 'info'); };
    utterance.onend = () => { state.isTTSSpeaking = false; };
    window.speechSynthesis.speak(utterance);
}

/* ─────────────────────────────────────────
   VOICE INPUT
───────────────────────────────────────── */
function initVoiceInput() {
    const btn = document.getElementById('voiceInputBtn');
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        btn.title = 'Voice input not supported in this browser';
        btn.style.opacity = '0.4';
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = state.language === 'mr' ? 'mr-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    btn.addEventListener('click', () => {
        if (state.isRecording) {
            recognition.stop();
            return;
        }
        recognition.start();
    });

    recognition.onstart = () => {
        state.isRecording = true;
        btn.classList.add('recording');
        showToast('🎙️ Listening...', 'info');
    };
    recognition.onresult = (e) => {
        const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
        document.getElementById('topicInput').value = transcript;
        document.getElementById('charCount').textContent = transcript.length;
    };
    recognition.onend = () => {
        state.isRecording = false;
        btn.classList.remove('recording');
    };
    recognition.onerror = (e) => {
        state.isRecording = false;
        btn.classList.remove('recording');
        showToast('❌ Voice recognition error: ' + e.error, 'error');
    };
}

/* ─────────────────────────────────────────
   SAVE / LIBRARY MANAGEMENT
───────────────────────────────────────── */
function getPrompts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROMPTS) || '[]');
}

function setPrompts(arr) {
    localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(arr));
    updateLibraryBadge();
    renderLibrary();
}

function savePrompt() {
    const text = document.getElementById('outputPrompt').value.trim();
    if (!text) { showToast('⚠️ No prompt to save', 'warning'); return; }

    const tags  = document.getElementById('tagsInput').value
        .split(',').map(t => t.trim()).filter(Boolean);
    const cat   = document.getElementById('categoryInput').value;
    const type  = state.currentType;

    const prompts = getPrompts();
    prompts.unshift({
        id: Date.now(),
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Prompt`,
        text,
        category: cat,
        tags,
        type,
        pinned: false,
        date: new Date().toLocaleDateString(),
    });

    setPrompts(prompts);
    analytics.saved++;
    saveAnalytics();
    syncTopbarStats();
    updateLibraryBadge();
    showToast('📌 Prompt saved to Library!', 'success');
}

function updateLibraryBadge() {
    const count = getPrompts().length;
    document.getElementById('libraryBadge').textContent = count;
}

function renderLibrary(filter = state.currentLibraryFilter, search = '') {
    const grid = document.getElementById('libraryGrid');
    const empty = document.getElementById('libraryEmpty');
    let prompts = getPrompts();

    // Sort: pinned first
    prompts.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    // Filter by category / favorites
    if (filter === 'favorites') prompts = prompts.filter(p => p.pinned);
    else if (filter !== 'all') prompts = prompts.filter(p => p.category === filter);

    // Search
    if (search) {
        const q = search.toLowerCase();
        prompts = prompts.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.text.toLowerCase().includes(q) ||
            (p.tags || []).some(t => t.toLowerCase().includes(q))
        );
    }

    // Remove existing cards (preserve empty state)
    grid.querySelectorAll('.prompt-card').forEach(c => c.remove());

    if (prompts.length === 0) {
        if (empty) empty.style.display = '';
        return;
    }
    if (empty) empty.style.display = 'none';

    prompts.forEach((p, i) => {
        const card = createPromptCard(p, i);
        grid.appendChild(card);
    });

    initDragAndDrop();
}

function createPromptCard(p, idx) {
    const allPrompts = getPrompts();
    const realIdx = allPrompts.findIndex(x => x.id === p.id);
    const card = document.createElement('div');
    card.className = `prompt-card${p.pinned ? ' pinned' : ''}`;
    card.draggable = true;
    card.dataset.id = p.id;

    card.innerHTML = `
        <div class="prompt-card-header">
            <div class="prompt-card-title">${escapeHtml(p.title)}</div>
            <div class="prompt-card-actions">
                <button class="prompt-card-btn fav-btn ${p.pinned ? 'active' : ''}"
                    title="Favorite" onclick="toggleFavorite(${realIdx});event.stopPropagation();">
                    <i class="fas fa-star"></i>
                </button>
                <button class="prompt-card-btn" title="Edit"
                    onclick="openEditModal(${realIdx});event.stopPropagation();">
                    <i class="fas fa-pencil"></i>
                </button>
                <button class="prompt-card-btn" title="Duplicate"
                    onclick="duplicatePrompt(${realIdx});event.stopPropagation();">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="prompt-card-btn" title="Load"
                    onclick="loadPrompt(${realIdx});event.stopPropagation();">
                    <i class="fas fa-arrow-up-right-from-square"></i>
                </button>
                <button class="prompt-card-btn delete-btn" title="Delete"
                    onclick="deletePrompt(${realIdx});event.stopPropagation();">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="prompt-card-body">${escapeHtml(p.text)}</div>
        <div class="prompt-card-meta">
            <span class="prompt-cat-badge">${p.category || 'General'}</span>
            ${(p.tags || []).slice(0, 3).map(t => `<span class="prompt-tag">${escapeHtml(t)}</span>`).join('')}
            <span class="prompt-date">${p.date || ''}</span>
        </div>`;

    card.addEventListener('dblclick', () => loadPrompt(realIdx));
    return card;
}

function loadPrompt(idx) {
    const prompts = getPrompts();
    if (!prompts[idx]) return;
    document.getElementById('outputPrompt').value = prompts[idx].text;
    state.currentPrompt = prompts[idx].text;
    switchTab('studio');
    showToast('📝 Prompt loaded to Studio', 'info');
}

function deletePrompt(idx) {
    const prompts = getPrompts();
    prompts.splice(idx, 1);
    setPrompts(prompts);
    analytics.saved = Math.max(0, analytics.saved - 1);
    saveAnalytics();
    showToast('🗑️ Prompt deleted', 'info');
}

function toggleFavorite(idx) {
    const prompts = getPrompts();
    prompts[idx].pinned = !prompts[idx].pinned;
    analytics.favorites = prompts.filter(p => p.pinned).length;
    setPrompts(prompts);
    saveAnalytics();
    showToast(prompts[idx].pinned ? '⭐ Added to favorites' : '☆ Removed from favorites', 'info');
}

function duplicatePrompt(idx) {
    const prompts = getPrompts();
    const clone = { ...prompts[idx], id: Date.now(), title: prompts[idx].title + ' (Copy)', pinned: false };
    prompts.splice(idx, 0, clone);
    setPrompts(prompts);
    showToast('📋 Prompt duplicated!', 'success');
}

/* ── Library filter & search ── */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#categoryFilter .filter-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#categoryFilter .filter-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentLibraryFilter = btn.dataset.cat;
            renderLibrary(state.currentLibraryFilter, document.getElementById('searchInput').value);
        });
    });
});

function filterLibrary() {
    const search = document.getElementById('searchInput').value;
    document.getElementById('searchClear').classList.toggle('hidden', !search);
    renderLibrary(state.currentLibraryFilter, search);
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchClear').classList.add('hidden');
    renderLibrary(state.currentLibraryFilter, '');
}

/* ── Drag & Drop reorder ── */
function initDragAndDrop() {
    const cards = document.querySelectorAll('.prompt-card');
    cards.forEach(card => {
        card.addEventListener('dragstart', e => {
            state.dragSrcId = card.dataset.id;
            card.style.opacity = '0.5';
        });
        card.addEventListener('dragend', () => { card.style.opacity = ''; });
        card.addEventListener('dragover', e => { e.preventDefault(); card.style.borderColor = 'var(--gold)'; });
        card.addEventListener('dragleave', () => { card.style.borderColor = ''; });
        card.addEventListener('drop', e => {
            e.preventDefault();
            card.style.borderColor = '';
            if (state.dragSrcId === card.dataset.id) return;

            const prompts = getPrompts();
            const srcIdx = prompts.findIndex(p => String(p.id) === String(state.dragSrcId));
            const dstIdx = prompts.findIndex(p => String(p.id) === card.dataset.id);
            if (srcIdx === -1 || dstIdx === -1) return;

            const [item] = prompts.splice(srcIdx, 1);
            prompts.splice(dstIdx, 0, item);
            setPrompts(prompts);
        });
    });
}

/* ── Edit Modal ── */
function openEditModal(idx) {
    state.editingIndex = idx;
    const prompts = getPrompts();
    document.getElementById('editTextarea').value = prompts[idx].text;
    document.getElementById('editModal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    state.editingIndex = null;
}

function saveEditedPrompt() {
    if (state.editingIndex === null) return;
    const prompts = getPrompts();
    prompts[state.editingIndex].text = document.getElementById('editTextarea').value.trim();
    setPrompts(prompts);
    closeEditModal();
    showToast('✅ Prompt updated', 'success');
}

/* ─────────────────────────────────────────
   TEMPLATES
───────────────────────────────────────── */
function renderTemplates(filter = 'all') {
    const grid = document.getElementById('templatesGrid');
    grid.innerHTML = '';

    const filtered = filter === 'all' ? PROMPT_TEMPLATES : PROMPT_TEMPLATES.filter(t => t.category === filter);

    filtered.forEach(tpl => {
        const card = document.createElement('div');
        card.className = 'prompt-card';
        card.innerHTML = `
            <div class="prompt-card-header">
                <div class="prompt-card-title">${tpl.icon} ${escapeHtml(tpl.title)}</div>
                <div class="prompt-card-actions">
                    <button class="prompt-card-btn" style="opacity:1;" title="Use template"
                        onclick="useTemplate(\`${escapeAttr(tpl.text)}\`)">
                        <i class="fas fa-arrow-up-right-from-square"></i>
                    </button>
                    <button class="prompt-card-btn" style="opacity:1;" title="Copy template"
                        onclick="copyToClipboard(\`${escapeAttr(tpl.text)}\`);showToast('📋 Template copied!','success')">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
            <div class="prompt-card-body">${escapeHtml(tpl.text)}</div>
            <div class="prompt-card-meta">
                <span class="prompt-cat-badge">${tpl.category}</span>
                ${tpl.tags.map(t => `<span class="prompt-tag">${escapeHtml(t)}</span>`).join('')}
            </div>`;
        grid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#templateFilter .filter-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#templateFilter .filter-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTemplates(btn.dataset.tcat);
        });
    });
});

function useTemplate(text) {
    document.getElementById('outputPrompt').value = text;
    state.currentPrompt = text;
    displayScore(scorePrompt(text));
    switchTab('studio');
    showToast('📋 Template loaded to Studio!', 'success');
}

/* ─────────────────────────────────────────
   ANALYTICS
───────────────────────────────────────── */
function renderAnalytics() {
    const prompts = getPrompts();
    analytics.saved = prompts.length;
    analytics.favorites = prompts.filter(p => p.pinned).length;

    document.getElementById('statTotal').textContent  = analytics.total;
    document.getElementById('statSaved').textContent  = analytics.saved;
    document.getElementById('statFav').textContent    = analytics.favorites;
    document.getElementById('statAI').textContent     = analytics.aiRuns;

    // Type chart
    const chart = document.getElementById('typeChart');
    const types = analytics.types;
    const maxCount = Math.max(...Object.values(types), 1);
    const typeLabels = { explain:'Explain', debug:'Debug', write:'Write', interview:'Interview', idea:'Ideas', career:'Career', seo:'SEO', email:'Email' };

    chart.innerHTML = Object.entries(types).sort((a,b) => b[1]-a[1]).map(([type, count]) => `
        <div class="chart-row">
            <div class="chart-label">${typeLabels[type] || type}</div>
            <div class="chart-bar-track">
                <div class="chart-bar-fill" style="width:${Math.round((count/maxCount)*100)}%"></div>
            </div>
            <div class="chart-count">${count}</div>
        </div>`).join('') || '<div class="empty-state-sm">No data yet. Generate some prompts!</div>';

    // History
    renderHistory();
}

function addHistory(entry) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
    history.unshift({ ...entry, time: new Date().toLocaleTimeString() });
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 30)));
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
    const list = document.getElementById('historyList');
    if (!history.length) { list.innerHTML = '<div class="empty-state-sm">No history yet.</div>'; return; }

    const typeIcons = { explain:'💡', debug:'🐛', write:'✍️', interview:'🎯', idea:'🚀', career:'💼', seo:'📈', email:'📧' };

    list.innerHTML = history.slice(0, 20).map(item => `
        <div class="history-item" onclick="reloadFromHistory('${escapeAttr(item.prompt)}')">
            <span class="history-item-icon">${typeIcons[item.type] || '📄'}</span>
            <span class="history-item-text">${escapeHtml(item.input)}</span>
            <span class="history-item-time">${item.time || ''}</span>
        </div>`).join('');
}

function reloadFromHistory(prompt) {
    document.getElementById('outputPrompt').value = prompt;
    state.currentPrompt = prompt;
    switchTab('studio');
    showToast('🕐 Prompt restored from history', 'info');
}

function clearHistory() {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    renderHistory();
    showToast('🗑️ History cleared', 'info');
}

function syncTopbarStats() {
    document.getElementById('topbarTotal').textContent = analytics.total;
}

/* ─────────────────────────────────────────
   EXPORT
───────────────────────────────────────── */
function downloadTXT() {
    const text = document.getElementById('outputPrompt').value;
    if (!text) { showToast('⚠️ No prompt to download', 'warning'); return; }
    downloadBlob(text, 'ai-prompt.txt', 'text/plain');
    showToast('📄 Downloaded as TXT', 'success');
}

function downloadPDF() {
    const text = document.getElementById('outputPrompt').value;
    if (!text) { showToast('⚠️ No prompt to export', 'warning'); return; }

    if (!window.jspdf) { showToast('❌ PDF library not loaded', 'error'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('AI Prompt Studio', 20, 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(text, 170);
    doc.text(lines, 20, 45);
    doc.save('ai-prompt.pdf');
    showToast('📕 Downloaded as PDF', 'success');
}

function downloadJSON() {
    const text = document.getElementById('outputPrompt').value;
    if (!text) { showToast('⚠️ No prompt to export', 'warning'); return; }

    const data = {
        prompt: text,
        type: state.currentType,
        role: document.getElementById('role').value,
        tone: document.getElementById('tone').value,
        length: document.getElementById('length').value,
        format: document.getElementById('format').value,
        category: document.getElementById('categoryInput').value,
        tags: document.getElementById('tagsInput').value.split(',').map(t => t.trim()).filter(Boolean),
        aiResponse: state.currentAIResponse || null,
        generatedAt: new Date().toISOString(),
        app: 'AI Prompt Studio'
    };

    downloadBlob(JSON.stringify(data, null, 2), 'ai-prompt.json', 'application/json');
    showToast('💾 Downloaded as JSON', 'success');
}

function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/* ─────────────────────────────────────────
   SHARE VIA LINK
───────────────────────────────────────── */
function sharePrompt() {
    const text = document.getElementById('outputPrompt').value;
    if (!text) { showToast('⚠️ No prompt to share', 'warning'); return; }

    const encoded = btoa(encodeURIComponent(text.substring(0, 2000)));
    const url = `${location.href.split('?')[0]}?p=${encoded}`;

    if (navigator.share) {
        navigator.share({ title: 'AI Prompt Studio', text: 'Check out this AI prompt!', url })
            .then(() => showToast('🔗 Shared successfully!', 'success'))
            .catch(() => fallbackShare(url));
    } else {
        fallbackShare(url);
    }
}

function fallbackShare(url) {
    copyToClipboard(url);
    showToast('🔗 Share link copied to clipboard!', 'success');
}

function checkSharedPrompt() {
    const params = new URLSearchParams(location.search);
    const encoded = params.get('p');
    if (encoded) {
        try {
            const text = decodeURIComponent(atob(encoded));
            document.getElementById('outputPrompt').value = text;
            state.currentPrompt = text;
            displayScore(scorePrompt(text));
            showToast('🔗 Prompt loaded from shared link!', 'success');
            history.replaceState({}, '', location.pathname);
        } catch (_) {}
    }
}

/* ─────────────────────────────────────────
   SETTINGS ACTIONS
───────────────────────────────────────── */
function setApiMode(mode, silent = false) {
    state.apiMode = mode;
    const geminiGroup = document.getElementById('geminiKeyGroup');
    const badge = document.getElementById('apiModeBadge');

    document.getElementById('modeDemo').classList.toggle('active', mode === 'demo');
    document.getElementById('modeGemini').classList.toggle('active', mode === 'gemini');

    if (mode === 'gemini') {
        if (geminiGroup) geminiGroup.style.display = '';
        if (badge) badge.textContent = '🤖 Gemini AI';
    } else {
        if (geminiGroup) geminiGroup.style.display = 'none';
        if (badge) badge.textContent = '🧪 Demo Mode';
    }

    saveSettings();
    if (!silent) showToast(mode === 'gemini' ? '🤖 Switched to Gemini AI' : '🧪 Demo mode active', 'info');
}

function saveApiKey() {
    saveSettings();
    showToast('🔐 API key saved!', 'success');
}

function toggleKeyVisibility() {
    const input = document.getElementById('geminiApiKey');
    const icon  = document.getElementById('eyeIcon');
    const show  = input.type === 'password';
    input.type  = show ? 'text' : 'password';
    icon.className = show ? 'fas fa-eye-slash' : 'fas fa-eye';
}

function clearAllData() {
    if (!confirm('⚠️ This will delete ALL saved prompts and history. This cannot be undone. Continue?')) return;
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    analytics = { total: 0, saved: 0, favorites: 0, aiRuns: 0, types: {}, history: [] };
    updateLibraryBadge();
    syncTopbarStats();
    renderLibrary();
    renderAnalytics();
    showToast('🗑️ All data cleared', 'info');
}

/* ─────────────────────────────────────────
   CLEAR FORM
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('clearBtn').addEventListener('click', () => {
        document.getElementById('topicInput').value = '';
        document.getElementById('tagsInput').value = '';
        document.getElementById('charCount').textContent = '0';
        document.getElementById('outputPrompt').value = '';
        document.getElementById('suggestionsBox').classList.add('hidden');
        state.currentPrompt = '';
        state.currentAIResponse = '';
        showToast('🔄 Form cleared', 'info');
    });
});

/* ─────────────────────────────────────────
   KEYBOARD SHORTCUTS
───────────────────────────────────────── */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        const tag = e.target.tagName;
        const isInput = tag === 'TEXTAREA' || tag === 'INPUT';

        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'Enter') { e.preventDefault(); generatePrompt(); }
            if (e.key === 's') { e.preventDefault(); savePrompt(); }
            if (e.shiftKey && e.key === 'C') { e.preventDefault(); copyPrompt(); }
            if (e.key === 'r') { e.preventDefault(); runAI(); }
            if (e.key === 'd') { e.preventDefault(); setTheme(state.theme === 'light' ? 'dark' : 'light'); }
            if (e.key === 'l') { e.preventDefault(); switchTab('library'); }
        }
        if (e.key === 'Escape') {
            document.getElementById('editModal').classList.add('hidden');
            document.getElementById('suggestionsBox').classList.add('hidden');
        }
    });
}

/* ─────────────────────────────────────────
   TOAST SYSTEM
───────────────────────────────────────── */
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    const icon = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icon[type] || ''}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/* ─────────────────────────────────────────
   ROBOT MASCOT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('robot').addEventListener('click', () => {
        const tips = [
            '💡 Tip: Use Ctrl+Enter to generate!',
            '🎙️ Try voice input!',
            '📋 Load a template from the Templates tab!',
            '⭐ Star your favorite prompts!',
            '🔗 Share prompts with the Share button!',
            '🌙 Toggle dark mode with Ctrl+D!',
            '📊 Check Analytics to track your usage!',
        ];
        showToast(tips[Math.floor(Math.random() * tips.length)], 'info', 4000);
    });
});

/* ─────────────────────────────────────────
   UTILITY
───────────────────────────────────────── */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
    return String(str)
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '');
}
