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
            settingsDiv.style.display = 'block';
        } else {
            settingsDiv.style.display = 'none';
        }
    }

    function setClockSettings() {
        const backgroundColor = backgroundColorSelect.value;
        document.body.style.backgroundColor = backgroundColor;
        updateStyles(backgroundColor);
        saveSettings();
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
        time += period;

        dateDisplay.textContent = date;
        timeDisplay.textContent = time;
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
        return `${year}-${month}-${day}(${weekday})`;
    }

    function updateStyles(backgroundColor) {
        const isDark = isDarkColor(backgroundColor);

        if (isDark) {
            dateDisplay.classList.remove('white-bg');
            timeDisplay.classList.remove('white-bg');
        } else {
            dateDisplay.classList.add('white-bg');
            timeDisplay.classList.add('white-bg');
        }
    }

    function isDarkColor(color) {
        const rgb = hexToRgb(color);
        if (!rgb) return false;
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness < 128;
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function saveSettings() {
        const settings = {
            timeFormat: timeFormatSelect.value,
            showSeconds: showSecondsCheckbox.checked,
            backgroundColor: backgroundColorSelect.value
        };
        localStorage.setItem('clockSettings', JSON.stringify(settings));
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem('clockSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            timeFormatSelect.value = settings.timeFormat;
            showSecondsCheckbox.checked = settings.showSeconds;
            backgroundColorSelect.value = settings.backgroundColor;
            document.body.style.backgroundColor = settings.backgroundColor;
            updateStyles(settings.backgroundColor);
        }
    }

    updateClock();
    setInterval(updateClock, 1000);
});
