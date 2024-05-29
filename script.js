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
            settingsDiv.style.top = `${buttonRect.bottom + window.scrollY}px`;
            settingsDiv.style.left = `${buttonRect.left + window.scrollX}px`;
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
            period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
        }

        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');

        let time = `${hours}:${minutes}`;
        if (showSecondsCheckbox.checked) {
            time += `:${seconds}`;
        }

        timeDisplay.innerHTML = `<span class="am-pm">${period}</span>${time}`;
        dateDisplay.textContent = date;

        const amPmDisplay = document.querySelector('.am-pm');
        const amPmHeight = timeDisplay.clientHeight / 2;
        amPmDisplay.style.height = `${amPmHeight}px`;
        amPmDisplay.style.lineHeight = `${amPmHeight}px`;
        amPmDisplay.style.top = period === 'AM' ? `0` : `${amPmHeight}px`;
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
            dateDisplay.classList.add('white-bg');
            timeDisplay.classList.add('white-bg');
        } else {
            document.body.style.color = 'white';
            dateDisplay.classList.remove('white-bg');
            timeDisplay.classList.remove('white-bg');
        }
    }
});
