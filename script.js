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

    let interval;
    let timerRunning = false;
    let remainingTime = 0;

    // Load settings from localStorage
    loadSettings();

    startButton.addEventListener('click', startPomodoro);
    resetButton.addEventListener('click', resetPomodoro);
    settingsButton.addEventListener('click', toggleSettings);
    setPomodoroButton.addEventListener('click', saveSettings);
    pomodoroModeButton.addEventListener('click', () => setMode('pomodoro'));
    shortBreakModeButton.addEventListener('click', () => setMode('shortBreak'));
    longBreakModeButton.addEventListener('click', () => setMode('longBreak'));
    modePomodoroRadio.addEventListener('change', toggleMode);
    modeClockRadio.addEventListener('change', toggleMode);

    function loadSettings() {
        const pomodoroMinutes = localStorage.getItem('pomodoroMinutes') || 25;
        const shortBreakMinutes = localStorage.getItem('shortBreakMinutes') || 5;
        const longBreakMinutes = localStorage.getItem('longBreakMinutes') || 15;
        const backgroundColor = localStorage.getItem('backgroundColor') || '#6633FF';
        const timeFormat = localStorage.getItem('timeFormat') || '24';
        const showSeconds = localStorage.getItem('showSeconds') === 'true';

        pomodoroMinutesInput.value = pomodoroMinutes;
        shortBreakMinutesInput.value = shortBreakMinutes;
        longBreakMinutesInput.value = longBreakMinutes;
        backgroundColorSelect.value = backgroundColor;
        timeFormatSelect.value = timeFormat;
        showSecondsCheckbox.checked = showSeconds;

        document.body.style.backgroundColor = backgroundColor;
    }

    function saveSettings() {
        localStorage.setItem('pomodoroMinutes', pomodoroMinutesInput.value);
        localStorage.setItem('shortBreakMinutes', shortBreakMinutesInput.value);
        localStorage.setItem('longBreakMinutes', longBreakMinutesInput.value);
        localStorage.setItem('backgroundColor', backgroundColorSelect.value);
        localStorage.setItem('timeFormat', timeFormatSelect.value);
        localStorage.setItem('showSeconds', showSecondsCheckbox.checked);

        document.body.style.backgroundColor = backgroundColorSelect.value;
        toggleSettings();
    }

    function toggleSettings() {
        const settings = document.getElementById('settings');
        settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
    }

    function startPomodoro() {
        if (timerRunning) {
            clearInterval(interval);
            timerRunning = false;
            startButton.textContent = 'Start';
        } else {
            const mode = document.querySelector('.buttons button.active').id;
            if (mode === 'pomodoro-mode') {
                remainingTime = pomodoroMinutesInput.value * 60;
            } else if (mode === 'short-break-mode') {
                remainingTime = shortBreakMinutesInput.value * 60;
            } else if (mode === 'long-break-mode') {
                remainingTime = longBreakMinutesInput.value * 60;
            }
            interval = setInterval(updateTimer, 1000);
            timerRunning = true;
            startButton.textContent = 'Stop';
        }
    }

    function resetPomodoro() {
        clearInterval(interval);
        timerRunning = false;
        startButton.textContent = 'Start';
        const mode = document.querySelector('.buttons button.active').id;
        if (mode === 'pomodoro-mode') {
            document.getElementById('timer').textContent = `${pomodoroMinutesInput.value}:00`;
        } else if (mode === 'short-break-mode') {
            document.getElementById('timer').textContent = `${shortBreakMinutesInput.value}:00`;
        } else if (mode === 'long-break-mode') {
            document.getElementById('timer').textContent = `${longBreakMinutesInput.value}:00`;
        }
    }

    function updateTimer() {
        remainingTime--;
        if (remainingTime <= 0) {
            clearInterval(interval);
            timerRunning = false;
            startButton.textContent = 'Start';
            alert('Time is up!');
        }
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function setMode(mode) {
        document.querySelectorAll('.buttons button').forEach(button => {
            button.classList.remove('active');
        });
        if (mode === 'pomodoro') {
            pomodoroModeButton.classList.add('active');
        } else if (mode === 'shortBreak') {
            shortBreakModeButton.classList.add('active');
        } else if (mode === 'longBreak') {
            longBreakModeButton.classList.add('active');
        }
        resetPomodoro();
    }

    function toggleMode() {
        const clock = document.getElementById('clock');
        const timer = document.getElementById('timer');
        if (modeClockRadio.checked) {
            clock.style.display = 'block';
            timer.style.display = 'none';
            startButton.style.display = 'none';
            resetButton.style.display = 'none';
        } else {
            clock.style.display = 'none';
            timer.style.display = 'block';
            startButton.style.display = 'inline-block';
            resetButton.style.display = 'inline-block';
        }
    }

    function updateClock() {
        const now = new Date();
        const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
        const dayName = dayNames[now.getDay()];
        const date = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${dayName}）`;
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

        const backgroundColor = backgroundColorSelect.value;
        const isDark = isDarkColor(backgroundColor);

        if (isDark) {
            dateDisplay.classList.remove('white-bg');
            timeDisplay.classList.remove('white-bg');
        } else {
            dateDisplay.classList.add('white-bg');
            timeDisplay.classList.add('white-bg');
        }

        document.getElementById('date').textContent = date;
        document.getElementById('time').textContent = time;
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

    updateClock();
    setInterval(updateClock, 1000);
});
