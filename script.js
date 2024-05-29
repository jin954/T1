document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-pomodoro');
    const resetButton = document.getElementById('reset-pomodoro');
    const settingsButton = document.getElementById('open-settings');
    const setPomodoroButton = document.getElementById('set-pomodoro');
    const clockModeButton = document.getElementById('clock-mode');
    const pomodoroModeButton = document.getElementById('pomodoro-mode');
    const pomodoroMinutesInput = document.getElementById('pomodoro-minutes');
    const shortBreakMinutesInput = document.getElementById('short-break-minutes');
    const longBreakMinutesInput = document.getElementById('long-break-minutes');
    const backgroundColorSelect = document.getElementById('background-color');
    const timeFormatSelect = document.getElementById('time-format');
    const showSecondsCheckbox = document.getElementById('show-seconds');

    let interval;
    let timerRunning = false;
    let remainingTime = 0;

    // Load settings from localStorage
    loadSettings();

    startButton.addEventListener('click', startPomodoro);
    resetButton.addEventListener('click', resetPomodoro);
    settingsButton.addEventListener('click', toggleSettings);
    setPomodoroButton.addEventListener('click', setPomodoroSettings);
    clockModeButton.addEventListener('change', () => setMode('clock'));
    pomodoroModeButton.addEventListener('change', () => setMode('pomodoro'));

    function startPomodoro() {
        if (!timerRunning) {
            timerRunning = true;
            const currentMode = document.querySelector('.mode-switch input:checked').id;
            let minutes;

            if (currentMode === 'pomodoro-mode') {
                minutes = parseInt(pomodoroMinutesInput.value);
            } else if (currentMode === 'short-break-mode') {
                minutes = parseInt(shortBreakMinutesInput.value);
            } else if (currentMode === 'long-break-mode') {
                minutes = parseInt(longBreakMinutesInput.value);
            }

            remainingTime = minutes * 60;
            interval = setInterval(updateTimer, 1000);
        }
    }

    function resetPomodoro() {
        clearInterval(interval);
        timerRunning = false;
        remainingTime = 0;
        const currentMode = document.querySelector('.mode-switch input:checked').id;
        let minutes;

        if (currentMode === 'pomodoro-mode') {
            minutes = parseInt(pomodoroMinutesInput.value);
        } else if (currentMode === 'short-break-mode') {
            minutes = parseInt(shortBreakMinutesInput.value);
        } else if (currentMode === 'long-break-mode') {
            minutes = parseInt(longBreakMinutesInput.value);
        }

        document.getElementById('timer').textContent = `${minutes}:00`;
    }

    function toggleSettings() {
        const settings = document.getElementById('settings');
        settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
    }

    function setPomodoroSettings() {
        const pomodoroMinutes = pomodoroMinutesInput.value;
        const shortBreakMinutes = shortBreakMinutesInput.value;
        const longBreakMinutes = longBreakMinutesInput.value;
        const backgroundColor = backgroundColorSelect.value;
        const timeFormat = timeFormatSelect.value;
        const showSeconds = showSecondsCheckbox.checked;

        // Save settings to localStorage
        localStorage.setItem('pomodoroMinutes', pomodoroMinutes);
        localStorage.setItem('shortBreakMinutes', shortBreakMinutes);
        localStorage.setItem('longBreakMinutes', longBreakMinutes);
        localStorage.setItem('backgroundColor', backgroundColor);
        localStorage.setItem('timeFormat', timeFormat);
        localStorage.setItem('showSeconds', showSeconds);

        // Update the timer display with new settings
        document.getElementById('timer').textContent = `${pomodoroMinutes}:00`;

        // Update the background color
        document.body.style.backgroundColor = backgroundColor;

        // Update styles based on background color
        updateStyles(backgroundColor);

        toggleSettings();
    }

    function loadSettings() {
        const pomodoroMinutes = localStorage.getItem('pomodoroMinutes') || 25;
        const shortBreakMinutes = localStorage.getItem('shortBreakMinutes') || 5;
        const longBreakMinutes = localStorage.getItem('longBreakMinutes') || 15;
        const backgroundColor = localStorage.getItem('backgroundColor') || '#1a1a2e';
        const timeFormat = localStorage.getItem('timeFormat') || '24';
        const showSeconds = localStorage.getItem('showSeconds') === 'true';

        pomodoroMinutesInput.value = pomodoroMinutes;
        shortBreakMinutesInput.value = shortBreakMinutes;
        longBreakMinutesInput.value = longBreakMinutes;
        backgroundColorSelect.value = backgroundColor;
        timeFormatSelect.value = timeFormat;
        showSecondsCheckbox.checked = showSeconds;

        // Set the timer display to the loaded pomodoro time
        document.getElementById('timer').textContent = `${pomodoroMinutes}:00`;

        // Set the background color
        document.body.style.backgroundColor = backgroundColor;

        // Update styles based on background color
        updateStyles(backgroundColor);

        // Initialize clock
        updateClock();
        setInterval(updateClock, 1000);
    }

    function setMode(mode) {
        // Remove active class from all buttons
        document.querySelectorAll('.mode-switch input').forEach(input => input.nextElementSibling.classList.remove('active'));

        // Hide or show the timer and clock based on mode
        if (mode === 'clock') {
            document.getElementById('clock').style.display = 'block';
            document.getElementById('timer').style.display = 'none';
            document.getElementById('start-pomodoro').style.display = 'none';
            document.getElementById('reset-pomodoro').style.display = 'none';
        } else {
            document.getElementById('clock').style.display = 'none';
            document.getElementById('timer').style.display = 'block';
            document.getElementById('start-pomodoro').style.display = 'inline-block';
            document.getElementById('reset-pomodoro').style.display = 'inline-block';
        }

        // Update styles based on background color
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
            // タイマー終了時の処理をここに追加できます
        }
    }

    function updateClock() {
        const now = new Date();
        const timeFormat = localStorage.getItem('timeFormat') || '24';
        const showSeconds = localStorage.getItem('showSeconds') === 'true';
        const date = now.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let ampm = '';

        if (timeFormat === '12') {
            ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // 0 should be 12
        }

        document.getElementById('date').textContent = date;
        document.getElementById('time').textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}${showSeconds ? `:${seconds.toString().padStart(2, '0')}` : ''} ${ampm}`;

        // Update styles based on background color
        updateStyles(document.body.style.backgroundColor);
    }

    function updateStyles(backgroundColor) {
        const timer = document.getElementById('timer');
        const clock = document.getElementById('clock');

        if (backgroundColor === '#FFFFFF') {
            timer.classList.add('white-bg');
            clock.classList.add('white-bg');
        } else {
            timer.classList.remove('white-bg');
            clock.classList.remove('white-bg');
        }
    }
});
