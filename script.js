const bgInput = document.getElementById('bg-color');
const winInput = document.getElementById('window-color');
const borderInput = document.getElementById('border-color');
const fontSelect = document.getElementById('font-select');
const readTextColorInput = document.getElementById('read-text-color');
const storyContent = document.getElementById('story-content');
const resetBtn = document.getElementById('reset-colors');
const defBg = '#ffb7e2'; 
const defWin = '#ffe4e1';
const defBorder = '#3b3bff';
function applyStyles() {
    document.documentElement.style.setProperty('--bg-color', localStorage.getItem('webcoreBg') || defBg);
    document.documentElement.style.setProperty('--window-bg', localStorage.getItem('webcoreWin') || defWin);
    const savedBorder = localStorage.getItem('webcoreBorder') || defBorder;
    document.documentElement.style.setProperty('--primary-color', savedBorder);
    document.documentElement.style.setProperty('--border-dark', savedBorder);
    document.body.style.fontFamily = localStorage.getItem('customFont') || "'DotGothic16', sans-serif";    
    if(storyContent) {
        storyContent.style.color = localStorage.getItem('readTextColor') || ''; 
    }    
    if(bgInput) bgInput.value = localStorage.getItem('webcoreBg') || defBg;
    if(winInput) winInput.value = localStorage.getItem('webcoreWin') || defWin;
    if(borderInput) borderInput.value = savedBorder;
    if(fontSelect) fontSelect.value = localStorage.getItem('customFont') || "'DotGothic16', sans-serif";
    if(readTextColorInput) readTextColorInput.value = localStorage.getItem('readTextColor') || '#000000';
}
applyStyles();
if (bgInput) bgInput.addEventListener('input', e => { localStorage.setItem('webcoreBg', e.target.value); applyStyles(); });
if (winInput) winInput.addEventListener('input', e => { localStorage.setItem('webcoreWin', e.target.value); applyStyles(); });
if (borderInput) borderInput.addEventListener('input', e => { localStorage.setItem('webcoreBorder', e.target.value); applyStyles(); });
if (fontSelect) fontSelect.addEventListener('change', e => { localStorage.setItem('customFont', e.target.value); applyStyles(); });
if (readTextColorInput && storyContent) readTextColorInput.addEventListener('input', e => { localStorage.setItem('readTextColor', e.target.value); applyStyles(); });
if (resetBtn) resetBtn.addEventListener('click', () => { 
    localStorage.removeItem('webcoreBg'); 
    localStorage.removeItem('webcoreWin'); 
    localStorage.removeItem('webcoreBorder'); 
    localStorage.removeItem('customFont'); 
    localStorage.removeItem('readTextColor');
    applyStyles(); 
});
const themeBtn = document.getElementById('theme-toggle');
if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
if(themeBtn){
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
}
const urlParams = new URLSearchParams(window.location.search);
const novelId = urlParams.get('id'); 
const chapterNum = parseInt(urlParams.get('chap')); 
const extraNum = parseInt(urlParams.get('extra'));
const isExtra = !isNaN(extraNum);
const currentReadingNum = isExtra ? extraNum : chapterNum; 
if (document.getElementById('track-done')) {
    const trackDone = document.getElementById('track-done');
    const trackWip = document.getElementById('track-wip');
    if (typeof DATA !== 'undefined') {
        for (const [id, info] of Object.entries(DATA)) {
            const html = `<a href="novel.html?id=${id}" class="story-card" draggable="false"><img src="${info.cover}" loading="lazy" decoding="async" draggable="false"><p>${info.title}</p></a>`;
            if (info.status === 'done' && trackDone) trackDone.innerHTML += html;
            if (info.status === 'wip' && trackWip) trackWip.innerHTML += html;
        }
    } else {
        console.error("Biến DATA không tồn tại! Hãy kiểm tra lại file data.js");
    }
    function setupInfiniteScroll(containerId, speed, direction) {
        const container = document.getElementById(containerId);
        if(!container) return;
        const track = container.querySelector('.story-track');
        track.innerHTML += track.innerHTML;
        let isHovered = false, isDown = false, startX, scrollLeftPos;
        
        container.addEventListener('mousedown', (e) => {
            isDown = true; isHovered = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeftPos = container.scrollLeft;
        });
        container.addEventListener('mouseleave', () => { isDown = false; isHovered = false; });
        container.addEventListener('mouseup', () => { isDown = false; isHovered = false; });
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            container.scrollLeft = scrollLeftPos - ((x - startX) * 1.5);
        });
        container.addEventListener('mouseenter', () => isHovered = true);
        container.addEventListener('touchstart', () => isHovered = true, {passive: true});
        container.addEventListener('touchend', () => isHovered = false);
        function step() {
            if (!isHovered && !isDown) {
                if (direction === 'left') {
                    container.scrollLeft += speed;
                    if (container.scrollLeft >= track.scrollWidth / 2) container.scrollLeft -= track.scrollWidth / 2;
                } else {
                    container.scrollLeft -= speed;
                    if (container.scrollLeft <= 0) container.scrollLeft += track.scrollWidth / 2;
                }
            }
            requestAnimationFrame(step);
        }
        if (direction === 'right') container.scrollLeft = track.scrollWidth / 2;
        requestAnimationFrame(step);
    }
    window.addEventListener('load', () => {
        setupInfiniteScroll('scroll-done', 0.8, 'left');
        setupInfiniteScroll('scroll-wip', 0.8, 'right');
    });
    const updateBox = document.getElementById('update-list-box');
    if (updateBox && typeof NOTIFICATIONS !== 'undefined') {
        updateBox.innerHTML = '';
        NOTIFICATIONS.forEach(noti => {
            updateBox.innerHTML += `
                <li><span class="badge" style="width: 45px; text-align:center;">${noti.tag}</span> 
                <a href="${noti.link}" style="color:var(--text-color); text-decoration:none;"><b>[${noti.date}]</b> ${noti.text}</a></li>
            `;
        });
    }
}
if (document.getElementById('chapter-list') && DATA && DATA[novelId]) {
    const info = DATA[novelId];
    document.getElementById('novel-title').innerText = info.title;
    document.getElementById('novel-desc').innerText = info.desc;
    document.getElementById('novel-cover').src = info.cover;    
    if(document.getElementById('novel-author')) {
        document.getElementById('novel-author').innerText = info.author || "Đang cập nhật";
        document.getElementById('novel-genre').innerText = info.genre || "Đang cập nhật";
        document.getElementById('novel-chars').innerText = info.characters || "Đang cập nhật";
        document.getElementById('novel-status').innerText = info.status === 'done' ? "Đã Hoàn Thành" : "Đang Tiến Hành";
    }    
    const chapListDiv = document.getElementById('chapter-list');
    let finalHtml = '<div style="width:100%;"><h4 style="margin:5px 0; border-bottom:2px dashed var(--primary-color);">[ CHƯƠNG CHÍNH ]</h4></div>';
    for (let i = 1; i <= info.totalChapters; i++) {
        finalHtml += `<a href="read.html?id=${novelId}&chap=${i}" class="win-btn">Chap_${i}.txt</a>`;
    }
    if (info.extras && info.extras > 0) {
        finalHtml += '<div style="width:100%; margin-top:15px;"><h4 style="margin:5px 0; border-bottom:2px dashed var(--primary-color);">[ NGOẠI TRUYỆN ]</h4></div>';
        for (let i = 1; i <= info.extras; i++) {
            finalHtml += `<a href="read.html?id=${novelId}&extra=${i}" class="win-btn">NgoaiTruyen_${i}.txt</a>`;
        }
    }
    chapListDiv.innerHTML = finalHtml;
}
if (document.getElementById('story-content') && typeof DATA !== 'undefined') {
    const info = DATA[novelId];
    if(document.getElementById('back-to-novel')) {
        document.getElementById('back-to-novel').href = `novel.html?id=${novelId}`;
    }    
    const fileName = isExtra ? `nt${currentReadingNum}.txt` : `${currentReadingNum}.txt`;
    const titleText = isExtra ? `NgoaiTruyen_${currentReadingNum}.txt` : `Chap_${currentReadingNum}.txt`;
    
    if(document.getElementById('chapter-title')) {
        document.getElementById('chapter-title').innerText = `${titleText} - Notepad`;
    }   
    if(info) {
        const modalList = document.getElementById('modal-chapter-list');
        if(modalList) {
            let html = '<div style="background:var(--primary-color); color:var(--inner-bg); padding:2px; font-weight:bold; margin-bottom:5px;">[ CHƯƠNG CHÍNH ]</div>';        
            for (let i = 1; i <= info.totalChapters; i++) {
                let activeStyle = (!isExtra && i === currentReadingNum) ? 'background:var(--primary-color); color:var(--inner-bg);' : '';
                html += `<a href="read.html?id=${novelId}&chap=${i}" class="win-btn" style="text-align:left; ${activeStyle}">Chapter ${i}</a>`;
            }       
            if (info.extras && info.extras > 0) {
                html += '<div style="background:var(--primary-color); color:var(--inner-bg); padding:2px; font-weight:bold; margin-top:10px; margin-bottom:5px;">[ NGOẠI TRUYỆN ]</div>';
                for (let i = 1; i <= info.extras; i++) {
                    let activeStyle = (isExtra && i === currentReadingNum) ? 'background:var(--primary-color); color:var(--inner-bg);' : '';
                    html += `<a href="read.html?id=${novelId}&extra=${i}" class="win-btn" style="text-align:left; ${activeStyle}">Ngoại Truyện ${i}</a>`;
                }
            }
            modalList.innerHTML = html;
        }
    }
    fetch(`${novelId}/${fileName}`)
        .then(res => { if (!res.ok) throw new Error(`Tác giả chưa up file này! (404)`); return res.text(); })
        .then(text => {
            let cleanText = text.replace(/\n{3,}/g, '\n\n'); 
            cleanText = cleanText.replace(/\n/g, '<br>');
            document.getElementById('story-content').innerHTML = cleanText;
        })
        .catch(err => {
            document.getElementById('story-content').innerHTML = `<b style="color:red;">SYSTEM ERROR:</b> ${err.message}`;
        });
    const typeParam = isExtra ? 'extra' : 'chap';
    const maxNum = isExtra ? info.extras : info.totalChapters;

    const prevAction = () => { 
        if (currentReadingNum > 1) window.location.href = `read.html?id=${novelId}&${typeParam}=${currentReadingNum - 1}`; 
    };
    const nextAction = () => { 
        if (currentReadingNum < maxNum) window.location.href = `read.html?id=${novelId}&${typeParam}=${currentReadingNum + 1}`; 
        else alert("SYSTEM NOTIFICATION: Đã hết chương! Tác giả chưa up chương tiếp theo! Đừng hối nha 🌸"); 
    };
    if(document.getElementById('prev-btn')) document.getElementById('prev-btn').onclick = prevAction; 
    if(document.getElementById('next-btn')) document.getElementById('next-btn').onclick = nextAction; 
    if(document.getElementById('prev-btn-bottom')) document.getElementById('prev-btn-bottom').onclick = prevAction; 
    if(document.getElementById('next-btn-bottom')) document.getElementById('next-btn-bottom').onclick = nextAction;
}
function toggleTOC() {
    const overlay = document.getElementById('toc-overlay');
    const modal = document.getElementById('toc-modal');
    if(!overlay || !modal) return;
    if(overlay.style.display === 'block') {
        overlay.style.display = 'none'; modal.style.display = 'none';
    } else {
        overlay.style.display = 'block'; modal.style.display = 'block';
    }
}
document.addEventListener('mousemove', e => { 
    if (Math.random() > 0.8) {
        const sparkle = document.createElement('div'); 
        sparkle.innerHTML = '✧'; sparkle.className = 'magic-sparkle'; 
        sparkle.style.left = e.pageX + 'px'; sparkle.style.top = e.pageY + 'px'; 
        document.body.appendChild(sparkle); 
        setTimeout(() => sparkle.remove(), 1000); 
    }
});
document.addEventListener('mousedown', e => {
    if(e.target.tagName.toLowerCase() === 'input' || e.target.classList.contains('tool-btn')) return;
    const burst = document.createElement('div');
    const icons = ['♡', '✩', '❀', '⟡']; 
    burst.innerHTML = icons[Math.floor(Math.random() * icons.length)];
    burst.className = 'click-burst';
    burst.style.left = (e.pageX - 10) + 'px'; burst.style.top = (e.pageY - 10) + 'px';
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 600);
});
function renderCalendar() {
    const calDates = document.getElementById("calendar-dates");
    if(!calDates) return;
    const now = new Date(); const month = now.getMonth(); const year = now.getFullYear(); const today = now.getDate();
    document.getElementById("calendar-month-year").innerText = `[ M${month + 1} - Y${year} ]`;
    calDates.innerHTML = "";
    ["M", "T", "W", "T", "F", "S", "S"].forEach(d => { const e = document.createElement("div"); e.innerText = d; calDates.appendChild(e); });
    const firstDay = new Date(year, month, 1).getDay();
    const startingDay = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < startingDay; i++) { const e = document.createElement("div"); calDates.appendChild(e); }
    for (let day = 1; day <= daysInMonth; day++) {
        const e = document.createElement("div"); e.className = "cal-date inner-box"; e.innerText = day;
        if (day === today) e.classList.add("cal-today");
        calDates.appendChild(e);
    }
}
window.addEventListener('load', renderCalendar);
const audio = document.getElementById("audio-core");
let isPlaying = false; 
const playlist = [{ title: "INTERNET_YAMERO.mp3", src: "https://files.catbox.moe/dummy1.mp3" }];
function loadTrack(i) { 
    if(!audio) return; 
    audio.src = playlist[i].src; 
    const titleElem = document.getElementById("song-title");
    if(titleElem) titleElem.innerText = `Playing: ${playlist[i].title}`; 
}
function togglePlay() { 
    const pBtn = document.getElementById("play-btn");
    if (!isPlaying) { 
        audio.play().catch(()=>{}); isPlaying = true; 
        if(pBtn) pBtn.innerText = "||"; 
    } else { 
        audio.pause(); isPlaying = false; 
        if(pBtn) pBtn.innerText = ">||"; 
    } 
}
window.addEventListener("load", () => loadTrack(0));
const canvas = document.getElementById('draw-board');
if(canvas){
    const ctx = canvas.getContext('2d');
    let isDrawing = false; let currentColor = '#3b3bff'; let undoHistory = [];
    function resizeCanvas() { 
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width - 4; 
        canvas.height = 150; 
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
    }
    window.addEventListener('load', resizeCanvas); 
    window.addEventListener('resize', resizeCanvas);
    function getCanvasPos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    }
    function startPos(e) {
        if(e.type === 'touchstart') e.preventDefault(); 
        isDrawing = true; undoHistory.push(canvas.toDataURL());
        const pos = getCanvasPos(e); ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
    }
    function endPos() { isDrawing = false; ctx.beginPath(); }
    function draw(e) {
        if (!isDrawing) return;
        if(e.type === 'touchmove') e.preventDefault();
        const pos = getCanvasPos(e);
        ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.strokeStyle = currentColor;
        ctx.lineTo(pos.x, pos.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
    }
    canvas.addEventListener('mousedown', startPos); canvas.addEventListener('mouseup', endPos);
    canvas.addEventListener('mousemove', draw); canvas.addEventListener('mouseout', endPos);
    canvas.addEventListener('touchstart', startPos, {passive: false}); canvas.addEventListener('touchend', endPos);
    canvas.addEventListener('touchmove', draw, {passive: false});
    window.setColor = (c) => { currentColor = c; ctx.globalCompositeOperation = "source-over"; }
    window.setEraser = () => { currentColor = "transparent"; ctx.globalCompositeOperation = "destination-out"; }
    window.clearCanvas = () => { resizeCanvas(); }
    window.undoArt = () => { 
        if(undoHistory.length > 0) { 
            let img = new Image(); img.src = undoHistory.pop(); 
            img.onload = () => { ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(img,0,0); } 
        } 
    }
}
