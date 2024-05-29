document.addEventListener('DOMContentLoaded', function () {
    const timeFormatSelect = document.getElementById('time-format');
    const showSecondsCheckbox = document.getElementById('show-seconds');
    const backgroundColorSelect = document.getElementById('background-color');
    const setClockButton = document.getElementById('set-clock');
    const openSettingsButton = document.getElementById('open-settings');
    const settingsDiv = document.getElementById('settings');
    const dateDisplay = document.getElementById('date');
    const timeDisplay = document.getElementById('time');

    // 初期設定の読み込み
    loadSettings();

    openSettingsButton.addEventListener('click', toggleSettings);
    setClockButton.addEventListener('click', setClockSettings);

    function toggleSettings() {
        if (settingsDiv.style.display === 'none' || settingsDiv.style.display === '') {
            const buttonRect = openSettingsButton.getBoundingClientRect();
            settingsDiv.style.top = `${buttonRect.bottom}px`;
            settingsDiv.style.left = `${buttonRect.left}px`;
            settingsDiv.style.display = 'block';
        } else {
            settingsDiv.style.display = 'none';
        }
    }

    function setClockSettings() {
        saveSettings();
        loadSettings();
        toggleSettings();
    }

    function loadSettings() {
        const backgroundColor = localStorage.getItem('backgroundColor') || '#6633FF';
        document.body.style.backgroundColor = backgroundColor;
        updateStyles(backgroundColor);
        updateClock();
        setInterval(updateClock, 1000);
    }

    function saveSettings() {
        const backgroundColor = backgroundColorSelect.value;
        localStorage.setItem('backgroundColor', backgroundColor);
    }

    function updateClock() {
        const now = new Date();
        const date = formatDate(now);
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let period = '';

        if (timeFormatSelect.value === '12') {
            period = hours >= 12 ? ' PM' : ' AM';
            hours = hours % 12 || 12;
        }

        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');

        let time = `${hours}:${minutes}`;
        if (showSecondsCheckbox.checked) {
            time += `:${seconds}`;
        }

        timeDisplay.textContent = time;
        dateDisplay.textContent = date;

        const amPmDisplay = document.createElement('div');
        amPmDisplay.textContent = period;
        amPmDisplay.className = 'am-pm';
        timeDisplay.appendChild(amPmDisplay);

        // AM/PM の位置を調整
        const amPmHeight = timeDisplay.clientHeight / 2;
        amPmDisplay.style.position = 'absolute';
        amPmDisplay.style.left = '0';
        amPmDisplay.style.top = period === ' AM' ? `0` : `${amPmHeight}px`;
    }

    function formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ja-JP', options);
    }

    function updateStyles(backgroundColor) {
        if (backgroundColor === '#FFFFFF') {
            document.body.style.color = 'black';
        } else {
            document.body.style.color = 'white';
        }
    }
});
