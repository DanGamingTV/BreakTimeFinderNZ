document.getElementById('breakForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get input values
    const startTime = document.getElementById('startTime').value;
    console.log(`Start time: ${startTime}`);
    const endTime = document.getElementById('endTime').value;
    console.log(`End time: ${endTime}`);

    if (!startTime || !endTime) {
        alert("Please provide both start and end times.");
        return;
    }

    // Convert input times to Date objects for calculation
    const startDate = new Date(`1970-01-01T${startTime}:00`);
    const endDate = new Date(`1970-01-01T${endTime}:00`);

    // Calculate the shift duration in minutes
    let shiftDuration = (endDate - startDate) / (1000 * 60); // in minutes

    // Handle overnight shifts
    if (shiftDuration < 0) {
        shiftDuration += 24 * 60; // Add 24 hours in minutes
    }

    // Determine the break times based on the shift duration
    const breakDetails = calculateBreaks(shiftDuration, startDate);

    // Display the break details
    displayResults(breakDetails, startDate);
});

// Helper function to convert minutes to HH:MM format
function toTimeFormat(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// Function to calculate breaks based on shift duration and start time
function calculateBreaks(shiftDuration, startDate) {
    const breaks = [];
    const breakTimes = [];


    // Helper function to add break times to the array
    function addBreak(time, breakLength, breakType) {
        breakTimes.push({ time, breakLength, breakType });
    }

    // Define the break structure based on shift duration
    let totalBreakTime = 0;
    let numRestBreaks = 0;
    let numMealBreaks = 0;

    // Determine the number of breaks based on shift duration
    if (shiftDuration >= 120 && shiftDuration <= 240) {
        numRestBreaks = 1; // 1 paid rest break
    } else if (shiftDuration > 240 && shiftDuration <= 360) {
        numRestBreaks = 1; // 1 paid rest break
        numMealBreaks = 1; // 1 meal break
    } else if (shiftDuration > 360 && shiftDuration < 600) {
        numRestBreaks = 2; // 2 paid rest breaks
        numMealBreaks = 1; // 1 meal break
    } else if (shiftDuration >= 600 && shiftDuration <= 720) {
        numRestBreaks = 3; // 3 paid rest breaks
        numMealBreaks = 1; // 1 meal break
    } else if (shiftDuration > 720 && shiftDuration <= 840) {
        numRestBreaks = 4; // 4 paid rest breaks
        numMealBreaks = 2; // 2 meal breaks
    } else if (shiftDuration > 840 && shiftDuration <= 960) {
        numRestBreaks = 5; // 5 paid rest breaks
        numMealBreaks = 2; // 2 meal breaks
    }

    // Total break time calculation (10 min for each rest break, 30 min for each meal break)
    totalBreakTime = (numRestBreaks * 10) + (numMealBreaks * 30);
    console.log(`Total break time calculation: ${totalBreakTime} minutes`)

    // Calculate the total working time
    const totalWorkTime = shiftDuration - totalBreakTime;
    console.log(`Total working time: ${totalWorkTime} minutes`)

    // Calculate the gap between each break
    const totalIntervals = numRestBreaks + numMealBreaks + 1; // n breaks means n+1 intervals
    console.log(`Total intervals during shift: ${totalIntervals}`)
    const timeBetweenBreaks = totalWorkTime / totalIntervals;
    console.log(`Time between breaks: ${timeBetweenBreaks} minutes`)

    // Add breaks to the array
    let currentTime = 0;

    // Add the rest breaks and meal breaks with calculated start times
    for (let i = 0; i < numRestBreaks; i++) {
        console.log(`Begin to add a 10-minute break. Current time is ${currentTime} minutes since start of shift.`)
        console.log(`Adding ${timeBetweenBreaks} minutes (ideal gap between breaks) to currentTime.`)
        currentTime += timeBetweenBreaks; // Work time before the break
        console.log(`Adding a 10-minute break. Break will start at ${currentTime} minutes since start of shift.`)
        addBreak(toTimeFormat(Math.round(currentTime)), 10, "Paid Rest Break");
        console.log(`Adding 10 minutes to current time to account for duration of 10-minute break.`)
        currentTime += 10; // Add 10 minutes for the rest break
    }

    for (let i = 0; i < numMealBreaks; i++) {
        console.log(`Begin to add a 30-minute break. Current time is ${currentTime} minutes since start of shift.`)
        console.log(`Adding ${timeBetweenBreaks} minutes (ideal gap between breaks) to currentTime.`)
        currentTime += timeBetweenBreaks; // Work time before the meal break
        console.log(`Adding a 30-minute break. Break will start at ${currentTime} minutes since start of shift.`)
        addBreak(toTimeFormat(Math.round(currentTime)), 30, "Unpaid Meal Break");
        console.log(`Adding 30 minutes to current time to account for duration of 30-minute break.`)
        currentTime += 30; // Add 30 minutes for the meal break
    }

    return breakTimes;
}

// Function to display the results
function displayResults(breakDetails, startDate) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (breakDetails.length === 0) {
        resultsDiv.innerHTML = "<p>No breaks are required for this shift.</p>";
    } else {
        breakDetails.forEach(breakItem => {
            const p = document.createElement('p');
            p.classList.add('result-item');
            p.textContent = `${breakItem.breakType} starts at ${toTimeFormat(convertMinutes(breakItem.time) + (startDate.getHours() * 60) + startDate.getMinutes())} and ends at ${toTimeFormat(convertMinutes(breakItem.time) + breakItem.breakLength + (startDate.getHours() * 60) + startDate.getMinutes())}`;
            resultsDiv.appendChild(p);
        });
    }
}

// Helper function to convert time back to minutes (for calculation purposes)
function convertMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}
