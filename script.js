document.addEventListener('DOMContentLoaded', function () {
    const timeFormatSelect = document.getElementById('time-format');
    const showSecondsCheckbox = document.getElementById('show-seconds');
    const backgroundColorSelect = document.getElementById('background-color');
    const setClockButton = document.getElementById('set-clock');
    const openSettingsButton = document.getElementById('open-settings');
    const settingsDiv = document.getElementById('settings');
    const dateDisplay = document.getElementById('date');
    const timeDisplay = document.getElementById('clock-time');
    const amPmDisplay = document.getElementById('am-pm');

    // 初期設定の読み込み
    loadSettings();

    openSettingsButton.addEventListener('click', toggleSettings);
    setClockButton.addEventListener('click', setClockSettings);

    function toggleSettings() {
        const isSettingsVisible = settingsDiv.style.display === 'block';
        settingsDiv.style.display = isSettingsVisible ? 'none' : 'block';

        if (!isSettingsVisible) {
            const buttonRect = openSettingsButton.getBoundingClientRect();
            settingsDiv.style.top = `${buttonRect.bottom + window.scrollY}px`;
            settingsDiv.style.left = `${buttonRect.left + window.scrollX}px`;
        }
    }

    function setClockSettings() {
        saveSettings();
        loadSettings();
        settingsDiv.style.display = 'none';
    }

    function loadSettings() {
        const backgroundColor = localStorage.getItem('backgroundColor') || '#6633FF';
        document.body.style.backgroundColor = backgroundColor;
        backgroundColorSelect.value = backgroundColor;
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
            period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
        }

        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');

        let time = `${hours}:${minutes}`;
        if (showSecondsCheckbox.checked) {
            time += `:${seconds}`;
        }

        amPmDisplay.textContent = period;
        amPmDisplay.style.display = period ? 'block' : 'none';
        timeDisplay.textContent = time;
        dateDisplay.textContent = date;

        const timeHeight = timeDisplay.clientHeight;
        amPmDisplay.style.height = `${timeHeight}px`;
        amPmDisplay.style.lineHeight = `${timeHeight / 2}px`;
    }

    function formatDate(date) {
        const options = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = date.toLocaleDateString('ja-JP', options);
        const [year, month, day, weekday] = formattedDate.split(/[-/年月日]/);
        return `${year}-${month}-${day}(${weekday})`;
    }

    function updateStyles(backgroundColor) {
        if (backgroundColor === '#FFFFFF') {
            document.body.style.color = 'black';
            dateDisplay.style.color = 'black';
            timeDisplay.style.color = 'black';
            dateDisplay.style.textShadow = 'none';
            timeDisplay.style.textShadow = 'none';
        } else {
            document.body.style.color = 'white';
            dateDisplay.style.color = 'white';
            timeDisplay.style.color = 'white';
            dateDisplay.style.textShadow = '1px 1px 2px black';
            timeDisplay.style.textShadow = '1px 1px 2px black';
        }
    }
});
