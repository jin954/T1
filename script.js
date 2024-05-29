document.addEventListener('DOMContentLoaded', function () {
    const timeFormatSelect = document.getElementById('time-format');
    const showSecondsCheckbox = document.getElementById('show-seconds');
    const backgroundColorSelect = document.getElementById('background-color');
    const setClockButton = document.getElementById('set-clock');
    const dateDisplay = document.getElementById('date');
    const timeDisplay = document.getElementById('time');
    
    setClockButton.addEventListener('click', setClockSettings);
    
    function setClockSettings() {
        const backgroundColor = backgroundColorSelect.value;
        document.body.style.backgroundColor = backgroundColor;
        updateStyles(backgroundColor);
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

        dateDisplay.textContent = date;
        timeDisplay.textContent = time;
    }

    function updateStyles(backgroundColor) {
        const isDark = isDarkColor(backgroundColor);

        if (isDark) {
            timeDisplay.classList.add('white-bg');
        } else {
            timeDisplay.classList.remove('white-bg');
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

    updateClock();
    setInterval(updateClock, 1000);
});
