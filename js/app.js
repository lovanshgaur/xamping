// --- Core Setup & Lenis ---
const lenis = new Lenis({ duration: 1.2, smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

const checkIconSVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
let globalData = { forge: null, dsa: null };
let activeDay = 1;
let hasCelebrated = false; // Tracks if we've already fired confetti today

// --- Phase 1: State Management ---
const StateManager = {
    get: () => JSON.parse(localStorage.getItem('xrashxourseState')) || {},
    set: (state) => localStorage.setItem('xrashxourseState', JSON.stringify(state)),
    update: (id, value) => {
        const state = StateManager.get();
        state[id] = value;
        StateManager.set(state);
    },
    getName: () => localStorage.getItem('xrashName') || 'Operative',
    setName: (name) => localStorage.setItem('xrashName', name),
    getNotes: () => localStorage.getItem('xrashxourseNotes') || '',
    setNotes: (notes) => localStorage.setItem('xrashxourseNotes', notes)
};

// Phase 1: Debounce Helper
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// --- Temporal Engine ---
function getOperationDay() {
    let startDate = localStorage.getItem('xrashStartDate');
    if (!startDate) {
        startDate = new Date().setHours(0, 0, 0, 0);
        localStorage.setItem('xrashStartDate', startDate);
    }
    const today = new Date().setHours(0, 0, 0, 0);
    const day = Math.floor((today - parseInt(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(Math.max(day, 1), 5);
}

// --- Initialization ---
async function initApp() {
    try {
        const [dataRes, dsaRes] = await Promise.all([fetch('data.json'), fetch('dsa.json')]);
        globalData.forge = await dataRes.json();
        globalData.dsa = await dsaRes.json();
        
        activeDay = getOperationDay();
        setupDaySwitcher();
        renderActiveDay();
        bindGlobalEvents();
        updateProgress();
    } catch (e) { console.error("Initialization Failed:", e); }
}

function setupDaySwitcher() {
    const nav = document.getElementById('day-switcher');
    let html = '';
    for(let d = 1; d <= 5; d++) {
        const isActive = d === activeDay ? 'active' : '';
        html += `<button class="day-chip ${isActive}" data-day="${d}" aria-label="Switch to Day ${d}">DAY ${d}</button>`;
    }
    nav.innerHTML = html;

    document.querySelectorAll('.day-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            document.querySelectorAll('.day-chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            activeDay = parseInt(e.target.getAttribute('data-day'));
            renderActiveDay();
            
            // Auto close Profile Panel when switching days
            document.getElementById('profile-panel').classList.remove('active');
            document.getElementById('profile-overlay').classList.remove('active');
            lenis.start();
        });
    });
}

// --- Phase 1: Componentized UI Rendering ---
function renderActiveDay() {
    const d = activeDay;
    const state = StateManager.get();

    renderForge(d, globalData.forge.days[d - 1], state);
    renderHabits(globalData.forge.dailyHabits, state);
    renderDSA(d, globalData.dsa.days[d - 1], state);
    renderNNs(globalData.forge.nonNegotiables, state);

    bindDynamicEvents();
    
    gsap.fromTo('.view.active .bento-card, .view.active .task-item', 
        { y: 15, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.02, ease: 'back.out(1.2)' }
    );
}

function renderForge(d, forgeDay, state) {
    document.getElementById('forge-subtitle').innerHTML = `<i class="ph ph-fire"></i> Day ${d}: ${forgeDay.title}`;
    let html = '';
    forgeDay.tasks.forEach((t, i) => {
        const parentId = `d${d}-f-${i}`;
        const isDone = state[parentId];
        
        let subHtml = '';
        if(t.topics) {
            subHtml = `<div class="subtopics-grid">` + t.topics.map((topic, tIdx) => {
                const subId = `${parentId}-s-${tIdx}`;
                const isSubDone = state[subId];
                // Phase 2: aria-checked implemented
                return `
                    <button class="subtopic-btn ${isSubDone ? 'done' : ''}" data-id="${subId}" role="checkbox" aria-checked="${isSubDone ? 'true' : 'false'}">
                        <div class="sub-checkbox">${checkIconSVG}</div><span>${topic}</span>
                    </button>`;
            }).join('') + `</div>`;
        }
        
        html += `
            <div class="bento-card task-item ${isDone ? 'done' : ''}" aria-checked="${isDone ? 'true' : 'false'}">
                <div class="task-header-row" role="checkbox" aria-checked="${isDone ? 'true' : 'false'}" tabindex="0">
                    <button class="checkbox" data-id="${parentId}" tabindex="-1">${checkIconSVG}</button>
                    <div class="task-meta">
                        <span class="task-title">${t.title}</span>
                        ${t.duration ? `<span class="task-target">${t.duration}</span>` : ''}
                    </div>
                </div>
                ${subHtml}
            </div>`;
    });
    document.getElementById('forge-grid').innerHTML = html;
}

function renderHabits(habits, state) {
    let html = '';
    for (const [cat, items] of Object.entries(habits)) {
        html += `
            <div class="bento-card">
                <h2 class="card-title" style="text-transform:capitalize; margin-bottom:0.5rem; font-size:1.1rem; color:var(--text-muted);"><i class="ph ph-check-circle"></i> ${cat}</h2>
                <ul class="task-list" role="list">`;
        items.forEach((h, i) => {
            const id = `hab-${cat}-${i}`; 
            const isDone = state[id];
            html += `
                <li class="task-item ${isDone ? 'done' : ''}" aria-checked="${isDone ? 'true' : 'false'}">
                    <div class="task-header-row" role="checkbox" aria-checked="${isDone ? 'true' : 'false'}" tabindex="0">
                        <button class="checkbox" data-id="${id}" tabindex="-1">${checkIconSVG}</button>
                        <div class="task-meta">
                            <span class="task-title">${h.title}</span>
                            ${h.target ? `<span class="task-target">${h.target}</span>` : ''}
                        </div>
                    </div>
                </li>`;
        });
        html += `</ul></div>`;
    }
    document.getElementById('habits-grid').innerHTML = html;
}

function renderDSA(d, dsaDay, state) {
    document.getElementById('dsa-subtitle').innerHTML = `<i class="ph ph-code-block"></i> Day ${d}: ${dsaDay.title}`;
    
    // Topics
    const allDsaTopics = [...dsaDay.topics, ...dsaDay.patterns];
    let topHtml = `<h2 class="card-title" style="font-size:1rem; margin-bottom:0;"><i class="ph ph-book-open"></i> Day ${d} Core Concepts</h2>
                   <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.5rem;">${dsaDay.objective}</p>
                   <div class="subtopics-grid" style="border-top:none; padding-top:0;">`;
    allDsaTopics.forEach((topic, i) => {
        const id = `d${d}-dsa-topic-${i}`;
        const isDone = state[id];
        topHtml += `
            <button class="subtopic-btn ${isDone ? 'done' : ''}" data-id="${id}" role="checkbox" aria-checked="${isDone ? 'true' : 'false'}">
                <div class="sub-checkbox">${checkIconSVG}</div><span>${topic}</span>
            </button>`;
    });
    topHtml += `</div>`;
    document.getElementById('dsa-topics-container').innerHTML = topHtml;

    // Problems
    let probHtml = '';
    dsaDay.problems.forEach((q, i) => {
        const id = `d${d}-dsa-prob-${i}`;
        const isDone = state[id];
        const diffClass = q.difficulty === 'Easy' ? 'diff-easy' : q.difficulty === 'Medium' ? 'diff-medium' : 'diff-hard';
        
        // Phase 3: Dynamic LeetCode Search Link
        const lcTag = q.leetcode 
            ? `<a href="https://leetcode.com/problemset/?search=${encodeURIComponent(q.title)}" target="_blank" class="lc-tag" aria-label="Solve ${q.title} on LeetCode">LC ${q.leetcode}</a>` 
            : '';
            
        probHtml += `
            <div class="bento-card task-item ${isDone ? 'done' : ''}" style="padding:1rem;" aria-checked="${isDone ? 'true' : 'false'}">
                <div class="task-header-row" role="checkbox" aria-checked="${isDone ? 'true' : 'false'}" tabindex="0">
                    <button class="checkbox" data-id="${id}" tabindex="-1">${checkIconSVG}</button>
                    <div class="task-meta">
                        <span class="task-title">${q.title}</span>
                        <div class="dsa-meta">
                            <div class="dsa-meta-left">
                                ${lcTag}
                                <span class="${diffClass}">${q.difficulty}</span>
                            </div>
                            <span class="platform-tag">${q.platform || 'LeetCode'}</span>
                        </div>
                    </div>
                </div>
            </div>`;
    });
    document.getElementById('dsa-grid').innerHTML = probHtml;
}

function renderNNs(nns, state) {
    let html = '';
    nns.forEach((nn, i) => {
        const id = `nn-${i}`; 
        const isDone = state[id];
        html += `
            <li class="task-item star-task ${isDone ? 'done' : ''}" aria-checked="${isDone ? 'true' : 'false'}">
                <div class="task-header-row" role="checkbox" aria-checked="${isDone ? 'true' : 'false'}" tabindex="0">
                    <button class="checkbox" data-id="${id}" tabindex="-1">${checkIconSVG}</button>
                    <div class="task-meta">
                        <span class="task-title">${nn.title}</span>
                        ${nn.target ? `<span class="task-target" style="color:var(--star)">${nn.target}</span>` : ''}
                    </div>
                </div>
            </li>`;
    });
    document.getElementById('nn-list').innerHTML = html;
}

// --- Event Binding ---
function bindDynamicEvents() {
    // Phase 2: Accessibility and Keyboard Navigation included
    const toggleTask = (row) => {
        const item = row.closest('.task-item');
        const checkbox = row.querySelector('.checkbox');
        const id = checkbox.getAttribute('data-id');
        
        item.classList.toggle('done');
        const isDone = item.classList.contains('done');
        
        item.setAttribute('aria-checked', isDone);
        row.setAttribute('aria-checked', isDone);
        
        StateManager.update(id, isDone);
        
        // Auto toggle internal subtopics
        item.querySelectorAll('.subtopic-btn').forEach(sub => {
            sub.classList.toggle('done', isDone);
            sub.setAttribute('aria-checked', isDone);
            StateManager.update(sub.getAttribute('data-id'), isDone);
        });
        
        updateProgress();
    };

    document.querySelectorAll('.task-header-row').forEach(row => {
        row.addEventListener('click', () => toggleTask(row));
        row.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTask(row); } });
    });

    const toggleSubtopic = (btn, e) => {
        e.stopPropagation();
        btn.classList.toggle('done');
        const isDone = btn.classList.contains('done');
        btn.setAttribute('aria-checked', isDone);
        StateManager.update(btn.getAttribute('data-id'), isDone);
        updateProgress();
    };

    document.querySelectorAll('.subtopic-btn').forEach(btn => {
        btn.addEventListener('click', (e) => toggleSubtopic(btn, e));
        btn.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSubtopic(btn, e); } });
    });
}

function bindGlobalEvents() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('.nav-btn');
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            targetBtn.classList.add('active');

            const targetId = targetBtn.getAttribute('data-target');
            document.querySelectorAll('.view').forEach(v => { v.classList.remove('active'); gsap.set(v, { opacity: 0 }); });
            
            const targetView = document.getElementById(targetId);
            if(targetView) {
                targetView.classList.add('active');
                gsap.to(targetView, { opacity: 1, duration: 0.3 });
                gsap.fromTo(`#${targetId} .header h1, #${targetId} .header .subtitle`, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 });
            }
            window.scrollTo(0, 0); 
        });
    });

    // Profile & Modals
    const toggleProf = (active) => {
        document.getElementById('profile-panel').classList.toggle('active', active);
        document.getElementById('profile-overlay').classList.toggle('active', active);
        active ? lenis.stop() : lenis.start();
    };
    document.getElementById('profile-trigger').addEventListener('click', () => toggleProf(true));
    document.getElementById('close-profile').addEventListener('click', () => toggleProf(false));
    document.getElementById('profile-overlay').addEventListener('click', () => toggleProf(false));

    document.getElementById('reset-btn').addEventListener('click', () => document.getElementById('reset-modal').classList.add('active'));
    document.getElementById('modal-cancel').addEventListener('click', () => document.getElementById('reset-modal').classList.remove('active'));
    document.getElementById('modal-confirm').addEventListener('click', () => { localStorage.clear(); window.location.reload(); });

    // User Name
    const nameInput = document.getElementById('editable-name');
    const nameDisplay = document.getElementById('display-name');
    if(nameInput) {
        const saved = StateManager.getName();
        nameInput.textContent = saved; nameDisplay.textContent = saved;
        
        nameInput.addEventListener('input', debounce((e) => {
            StateManager.setName(e.target.textContent);
            nameDisplay.textContent = e.target.textContent || 'Operative';
        }, 300));
        
        nameInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') { e.preventDefault(); nameInput.blur(); } });
    }

    // Phase 1: Debounced Notes
    const notesArea = document.getElementById('quick-notes');
    if(notesArea) {
        notesArea.value = StateManager.getNotes();
        notesArea.addEventListener('input', debounce((e) => {
            StateManager.setNotes(e.target.value);
        }, 500));
    }
    
    // Exports
    document.getElementById('export-btn').addEventListener('click', exportLogData);
    document.getElementById('share-btn').addEventListener('click', shareBriefing);
    
    // Phase 3: Pomodoro Binding
    document.getElementById('pomodoro-trigger').addEventListener('click', togglePomodoro);
}

// --- Phase 3: Pomodoro Focus Timer Logic ---
let timerInterval;
let timeLeft = 25 * 60; // 25 minutes
let isTimerRunning = false;

function togglePomodoro() {
    const display = document.getElementById('timer-display');
    const btn = document.getElementById('pomodoro-trigger');
    
    if (isTimerRunning) {
        // Pause Timer
        clearInterval(timerInterval);
        isTimerRunning = false;
        btn.classList.remove('timer-active');
        display.style.opacity = '0.7';
    } else {
        // Start Timer
        isTimerRunning = true;
        btn.classList.add('timer-active');
        display.style.opacity = '1';
        
        timerInterval = setInterval(() => {
            timeLeft--;
            const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');
            display.textContent = `${m}:${s}`;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                timeLeft = 25 * 60; // Reset
                btn.classList.remove('timer-active');
                display.textContent = "25:00";
                alert("Deep Work Session Complete. Take a 5 minute break, Operative.");
            }
        }, 1000);
    }
}

// --- Phase 3: HTML2Canvas Share Briefing ---
async function shareBriefing() {
    const shareBtn = document.getElementById('share-btn');
    const originalText = shareBtn.innerHTML;
    shareBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Generating...';
    shareBtn.disabled = true;

    try {
        const element = document.getElementById('exportable-briefing');
        const canvas = await html2canvas(element, {
            backgroundColor: '#0A0D0B',
            scale: 2, // High Res
            logging: false,
            useCORS: true 
        });
        
        const link = document.createElement('a');
        link.download = `Op_HireMe_Day${activeDay}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch(e) {
        console.error("Briefing export failed:", e);
        alert("Failed to generate briefing image. Check console for details.");
    } finally {
        shareBtn.innerHTML = originalText;
        shareBtn.disabled = false;
    }
}

// --- Data Logic & Metrics ---
function calculateMetrics() {
    const state = StateManager.get();
    let metrics = {
        mission: { total: 0, completed: 0 },
        stars: { total: 0, completed: 0 },
        daily: { 1: {t:0, c:0}, 2: {t:0, c:0}, 3: {t:0, c:0}, 4: {t:0, c:0}, 5: {t:0, c:0} },
        rawState: state
    };

    // Persistent Global Items
    for (const [cat, items] of Object.entries(globalData.forge.dailyHabits)) {
        items.forEach((h, i) => {
            const id = `hab-${cat}-${i}`; 
            metrics.mission.total++; 
            if(state[id]) metrics.mission.completed++; 
        });
    }
    
    globalData.forge.nonNegotiables.forEach((nn, i) => {
        const id = `nn-${i}`; 
        metrics.stars.total++;
        if(state[id]) metrics.stars.completed++;
    });

    // Day-Specific Items
    for(let d = 1; d <= 5; d++) {
        // Forge
        globalData.forge.days[d-1].tasks.forEach((t, i) => {
            const id = `d${d}-f-${i}`; metrics.mission.total++; metrics.daily[d].t++;
            if(state[id]) { metrics.mission.completed++; metrics.daily[d].c++; }
            if(t.topics) t.topics.forEach((sub, sIdx) => {
                const sId = `${id}-s-${sIdx}`; metrics.mission.total++; metrics.daily[d].t++;
                if(state[sId]) { metrics.mission.completed++; metrics.daily[d].c++; }
            });
        });
        
        // DSA Topics
        const allTopics = [...globalData.dsa.days[d-1].topics, ...globalData.dsa.days[d-1].patterns];
        allTopics.forEach((top, i) => {
            const id = `d${d}-dsa-topic-${i}`; metrics.mission.total++; metrics.daily[d].t++;
            if(state[id]) { metrics.mission.completed++; metrics.daily[d].c++; }
        });
        
        // DSA Probs
        globalData.dsa.days[d-1].problems.forEach((p, i) => {
            const id = `d${d}-dsa-prob-${i}`; metrics.mission.total++; metrics.daily[d].t++;
            if(state[id]) { metrics.mission.completed++; metrics.daily[d].c++; }
        });
    }
    
    return metrics;
}

// --- Phase 3: 100% Celebration logic added ---
function updateProgress() {
    if(!globalData.forge) return;
    const metrics = calculateMetrics();
    
    const overallPct = metrics.mission.total > 0 ? Math.round((metrics.mission.completed / metrics.mission.total) * 100) : 0;
    
    // Rings and Bars
    const circle = document.getElementById('avatar-progress');
    if(circle) circle.style.strokeDashoffset = 138.2 - ((overallPct/100) * 138.2);
    
    document.getElementById('profile-bar-fill').style.width = `${overallPct}%`;
    document.getElementById('profile-percentage').textContent = `${overallPct}%`;
    
    // Stars
    document.getElementById('star-bar-fill').style.width = `${(metrics.stars.completed / metrics.stars.total) * 100}%`;
    document.getElementById('star-percentage').textContent = `${metrics.stars.completed} / ${metrics.stars.total}`;
    document.getElementById('header-star-count').textContent = metrics.stars.completed;
    
    // Daily Breakdown
    let dailyHtml = '';
    for(let d=1; d<=5; d++) {
        const data = metrics.daily[d];
        const pct = data.t > 0 ? Math.round((data.c / data.t) * 100) : 0;
        dailyHtml += `
            <div class="daily-row ${d === activeDay ? 'current-day' : ''}">
                <span class="day-lbl">Day ${d}</span>
                <div class="day-bar-bg"><div class="day-bar-fill" style="width:${pct}%"></div></div>
                <span class="day-pct">${pct}%</span>
            </div>`;
    }
    document.getElementById('daily-analytics-container').innerHTML = dailyHtml;
    
    // Confetti Celebration
    if (overallPct === 100 && !hasCelebrated) {
        hasCelebrated = true;
        if (typeof confetti === "function") {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.3 }, colors: ['#E54637', '#FFC107', '#F2EFE9'] });
        }
    } else if (overallPct < 100) {
        hasCelebrated = false;
    }
}

function exportLogData() {
    const metrics = calculateMetrics();
    const exportObj = {
        operative: StateManager.getName(),
        timestamp: new Date().toISOString(),
        missionProgress: {
            completedTasks: metrics.mission.completed,
            totalTasks: metrics.mission.total,
            completionPercentage: Math.round((metrics.mission.completed / metrics.mission.total) * 100)
        },
        commendations: {
            starsEarned: metrics.stars.completed,
            totalAvailable: metrics.stars.total
        },
        fieldNotes: StateManager.getNotes(),
        rawStateData: metrics.rawState
    };
    
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Op_HireMe_Log_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', initApp);