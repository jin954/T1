document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-pomodoro');
    const resetButton = document.getElementById('reset-pomodoro');
    const settingsButton = document.getElementById('open-settings');
    const setPomodoroButton = document.getElementById('set-pomodoro');
    const pomodoroModeButton = document.getElementById('pomodoro-mode');
    const shortBreakModeButton = document.getElementById('short-break-mode');
    const longBreakModeButton = document.getElementById('long-break-mode');
    const pomodoroMinutesInput = document.getElementById('pomodoro-minutes');
    const shortBreakMinutesInput = document.getElementById('short-break-minutes');
    const longBreakMinutesInput = document.getElementById('long-break-minutes');
    const backgroundColorSelect = document.getElementById('background-color');
    const timeFormatSelect = document.getElementById('time-format');
    const showSecondsCheckbox = document.getElementById('show-seconds');
    const modePomodoroRadio = document.getElementById('mode-pomodoro');
    const modeClockRadio = document.getElementById('mode-clock');
    const clockDisplay = document.getElementById('clock');
    const settingsDisplay = document.getElementById('settings');

    let interval;
    let timerRunning = false;
    let remainingTime = 0;
    let pomodoroMinutes = 25;
    let shortBreakMinutes = 5;
    let longBreakMinutes = 15;

    loadSettings();

    startButton.addEventListener('click', startPomodoro);
    resetButton.addEventListener('click', resetPomodoro);
    settingsButton.addEventListener('click', toggleSettings);
    setPomodoroButton.addEventListener('click', setPomodoroSettings);
    pomodoroModeButton.addEventListener('click', () => setMode('pomodoro'));
    shortBreakModeButton.addEventListener('click', () => setMode('short-break'));
    longBreakModeButton.addEventListener('click', () => setMode('long-break'));
    modePomodoroRadio.addEventListener('change', switchMode);
    modeClockRadio.addEventListener('change', switchMode);

    function startPomodoro() {
        if (!timerRunning) {
            timerRunning = true;
            const currentMode = document.querySelector('.buttons button.active').id;
            let minutes;

            if (currentMode === 'pomodoro-mode') {
                minutes = pomodoroMinutes;
            } else if (currentMode === 'short-break-mode') {
                minutes = shortBreakMinutes;
            } else if (currentMode === 'long-break-mode') {
                minutes = longBreakMinutes;
            }

            remainingTime = minutes * 60;
            interval = setInterval(updateTimer, 1000);
        }
    }

    function resetPomodoro() {
        clearInterval(interval);
        timerRunning = false;
        remainingTime = 0;
        const currentMode = document.querySelector('.buttons button.active').id;
        let minutes;

        if (currentMode === 'pomodoro-mode') {
            minutes = pomodoroMinutes;
        } else if (currentMode === 'short-break-mode') {
            minutes = shortBreakMinutes;
        } else if (currentMode === 'long-break-mode') {
            minutes = longBreakMinutes;
        }

        document.getElementById('timer').textContent = `${minutes}:00`;
    }

    function toggleSettings() {
        const settings = document.getElementById('settings');
        settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
    }

    function setPomodoroSettings() {
        pomodoroMinutes = pomodoroMinutesInput.value;
        shortBreakMinutes = shortBreakMinutesInput.value;
        longBreakMinutes = longBreakMinutesInput.value;
        const backgroundColor = backgroundColorSelect.value;
        const timeFormat = timeFormatSelect.value;
        const showSeconds = showSecondsCheckbox.checked;

        localStorage.setItem('pomodoroMinutes', pomodoroMinutes);
        localStorage.setItem('shortBreakMinutes', shortBreakMinutes);
        localStorage.setItem('longBreakMinutes', longBreakMinutes);
        localStorage.setItem('backgroundColor', backgroundColor);
        localStorage.setItem('timeFormat', timeFormat);
        localStorage.setItem('showSeconds', showSeconds);

        document.getElementById('timer').textContent = `${pomodoroMinutes}:00`;
        document.body.style.backgroundColor = backgroundColor;
        updateStyles(backgroundColor);
        toggleSettings();
    }

    function loadSettings() {
        pomodoroMinutes = localStorage.getItem('pomodoroMinutes') || 25;
        shortBreakMinutes = localStorage.getItem('shortBreakMinutes') || 5;
        longBreakMinutes = localStorage.getItem('longBreakMinutes') || 15;
        const backgroundColor = localStorage.getItem('backgroundColor') || '#1a1a2e';
        const timeFormat = localStorage.getItem('timeFormat') || '24';
        const showSeconds = localStorage.getItem('showSeconds') === 'true';

        pomodoroMinutesInput.value = pomodoroMinutes;
        shortBreakMinutesInput.value = shortBreakMinutes;
        longBreakMinutesInput.value = longBreakMinutes;
        backgroundColorSelect.value = backgroundColor;
        timeFormatSelect.value = timeFormat;
        showSecondsCheckbox.checked = showSeconds;

        document.getElementById('timer').textContent = `${pomodoroMinutes}:00`;
        document.body.style.backgroundColor = backgroundColor;
        updateStyles(backgroundColor);
        updateClock();
        setInterval(updateClock, 1000);
    }

    function setMode(mode) {
        document.querySelectorAll('.buttons button').forEach(button => button.classList.remove('active'));

        if (mode === 'pomodoro') {
            pomodoroModeButton.classList.add('active');
            document.getElementById('timer').textContent = `${pomodoroMinutes}:00`;
        } else if (mode === 'short-break') {
            shortBreakModeButton.classList.add('active');
            document.getElementById('timer').textContent = `${shortBreakMinutes}:00`;
        } else if (mode === 'long-break') {
            longBreakModeButton.classList.add('active');
            document.getElementById('timer').textContent = `${longBreakMinutes}:00`;
        }

        updateStyles(document.body.style.backgroundColor);
    }

    function updateTimer() {
        remainingTime--;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (remainingTime <= 0) {
            clearInterval(interval);
            timerRunning = false;
        }
    }

    function updateClock() {
        const now = new Date();
        const date = now.toLocaleDateString('ja-JP', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
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
        clockDisplay.textContent = `${date} ${time}`;
    }

    function switchMode() {
        if (modePomodoroRadio.checked) {
            clockDisplay.style.display = 'none';
            pomodoroModeButton.style.display = 'block';
            shortBreakModeButton.style.display = 'block';
            longBreakModeButton.style.display = 'block';
        } else {
            clockDisplay.style.display = 'block';
            pomodoroModeButton.style.display = 'none';
            shortBreakModeButton.style.display = 'none';
            longBreakModeButton.style.display = 'none';
        }
    }

    function updateStyles(backgroundColor) {
        const textColor = getTextColor(backgroundColor);
        document.body.style.color = textColor;
    }

    function getTextColor(bgColor) {
        const rgb = hexToRgb(bgColor);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 125 ? '#000' : '#fff';
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }
});
