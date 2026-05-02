const ScreenAbout = (() => {
    const VERSIONS = [
        { v:'3.0', date:'מאי 2026', notes:['שיחזור מלא לפי מפרט','מסך בתים עם 12 בתים ו-48 נבחרות','בחירת קפטן','Picker modal עם סינון','פרופיל משתמש','ארכיטקטורה רב-קבצית'] },
        { v:'2.0', date:'מאי 2026', notes:['תיקון סינון מחירים','יישור modals','תמיכה דו-לשונית','שמירת משתמשים'] },
        { v:'1.0', date:'אפריל 2026', notes:['גרסה ראשונה','48 קבוצות, 1,152 שחקנים','בניית קבוצה ותקציב','PWA offline'] }
    ];

    function render() {
        const el = document.getElementById('screen-about');
        el.innerHTML = `
            <div class="screen-header"><h2>${t('about')}</h2></div>
            <div class="about-content">
                <div class="about-hero">
                    <div class="about-trophy">🏆</div>
                    <h2>${t('appName')}</h2>
                    <p>48 נבחרות · 1,152 שחקנים · מונדיאל 2026</p>
                </div>
                <div class="about-scoring">
                    <h3>⚽ מערכת הניקוד</h3>
                    <div class="scoring-grid">
                        <div>גול (שוער): +8</div><div>גול (הגנה): +6</div>
                        <div>גול (קישור): +5</div><div>גול (התקפה): +6</div>
                        <div>בישול: +3</div><div>שער נקי (GK/DEF): +4</div>
                        <div>שער נקי (MID): +1</div><div>כרטיס צהוב: -1</div>
                        <div>כרטיס אדום: -3</div>
                    </div>
                </div>
                <div class="about-changelog">
                    <h3>📋 ${t('changelog')}</h3>
                    ${VERSIONS.map(v => `
                        <div class="changelog-item">
                            <div class="cl-header">${t('version')} ${v.v} — ${v.date}</div>
                            <ul>${v.notes.map(n=>`<li>${n}</li>`).join('')}</ul>
                        </div>`).join('')}
                </div>
            </div>`;
    }

    return { render };
})();
