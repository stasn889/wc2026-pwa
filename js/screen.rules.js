const ScreenRules = (() => {
    function render() {
        const el = document.getElementById('screen-rules');
        el.innerHTML = `
            <div class="screen-header"><h2>📋 ${t('rules')}</h2></div>
            <div class="rules-content">

                <div class="rules-section">
                    <div class="rules-icon">⚽</div>
                    <h3>${t('teamRules')}</h3>
                    <div class="rules-grid">
                        <div class="rules-row"><span>${t('budget')}</span><strong>100M</strong></div>
                        <div class="rules-row"><span>${t('players')}</span><strong>11</strong></div>
                        <div class="rules-row"><span>GK</span><strong>×1</strong></div>
                        <div class="rules-row"><span>DEF</span><strong>×5</strong></div>
                        <div class="rules-row"><span>MID</span><strong>×5</strong></div>
                        <div class="rules-row"><span>FWD</span><strong>×3</strong></div>
                        <div class="rules-row"><span>${t('teamLimit')}</span><strong>2</strong></div>
                    </div>
                </div>

                <div class="rules-section">
                    <div class="rules-icon">📊</div>
                    <h3>${t('scoringRules')}</h3>
                    <div class="scoring-grid-full">
                        <div class="sg-row"><span>${t('goals')} GK</span><strong class="sg-pos">+8</strong></div>
                        <div class="sg-row"><span>${t('goals')} DEF</span><strong class="sg-pos">+6</strong></div>
                        <div class="sg-row"><span>${t('goals')} MID</span><strong class="sg-pos">+5</strong></div>
                        <div class="sg-row"><span>${t('goals')} FWD</span><strong class="sg-pos">+6</strong></div>
                        <div class="sg-row"><span>${t('assists')}</span><strong class="sg-pos">+3</strong></div>
                        <div class="sg-row"><span>${t('cleanSheet')} GK/DEF</span><strong class="sg-pos">+4</strong></div>
                        <div class="sg-row"><span>${t('cleanSheet')} MID</span><strong class="sg-pos">+1</strong></div>
                        <div class="sg-row"><span>${t('yellowCards')}</span><strong class="sg-neg">-1</strong></div>
                        <div class="sg-row"><span>${t('redCard')}</span><strong class="sg-neg">-3</strong></div>
                    </div>
                </div>

                <div class="rules-section">
                    <div class="rules-icon">👑</div>
                    <h3>${t('captainRules')}</h3>
                    <div class="rules-list">
                        <div class="rules-item">
                            <span class="ri-badge ri-c1">C1</span>
                            <span>${t('captainRuleC1')}</span>
                        </div>
                        <div class="rules-item">
                            <span class="ri-badge ri-c2">C2</span>
                            <span>${t('captainRuleC2')}</span>
                        </div>
                        <div class="rules-item">
                            <span class="ri-badge ri-b">B</span>
                            <span>${t('bankerRule')}</span>
                        </div>
                    </div>
                </div>

                <div class="rules-section">
                    <div class="rules-icon">🎲</div>
                    <h3>${t('betsRules')}</h3>
                    <div class="rules-list">
                        <div class="rules-item">🪙 <span>${t('betsRuleCoins')}</span></div>
                        <div class="rules-item">📝 <span>${t('betsRuleCreate')}</span></div>
                        <div class="rules-item">🤝 <span>${t('betsRuleJoin')}</span></div>
                        <div class="rules-item">🏁 <span>${t('betsRuleResolve')}</span></div>
                        <div class="rules-item">⚠️ <span>${t('betsRuleWarning')}</span></div>
                    </div>
                </div>

            </div>`;
    }

    return { render };
})();
