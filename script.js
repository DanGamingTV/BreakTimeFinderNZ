document.getElementById('breakForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get input values
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    if (!startTime || !endTime) {
        alert("Please provide both start and end times.");
        return;
    }

    // Convert input times to Date objects for calculation
    const startDate = new Date(`1970-01-01T${startTime}:00`);
    const endDate = new Date(`1970-01-01T${endTime}:00`);

    // Calculate the shift duration in minutes
    let shiftDuration = (endDate - startDate) / (1000 * 60); // in minutes

    // Handle overnight shifts (if the end time is past midnight)
    if (shiftDuration < 0) {
        shiftDuration += 24 * 60; // Add 24 hours in minutes
    }

    // Calculate the breaks and their timings based on shift duration
    const breakDetails = calculateBreaks(shiftDuration, startDate);

    // Display results
    displayResults(breakDetails);
});

// Function to calculate breaks based on shift duration and start time
function calculateBreaks(shiftDuration, startDate) {
    const breakDetails = [];

    // Helper function to convert minutes to HH:MM format
    function toTimeFormat(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }

    // Helper function to convert minutes from the start time to actual time
    function getActualTime(startTime, minutesFromStart) {
        const resultDate = new Date(startTime.getTime());
        resultDate.setMinutes(resultDate.getMinutes() + minutesFromStart);
        return resultDate;
    }

    // Handle different shift lengths based on the given rules
    if (shiftDuration >= 120 && shiftDuration <= 240) {
        // 2–4 hours: 1 x 10-minute paid rest break in the middle
        console.log(`Shift between 2-4 hours. They get 1 x 10 minute rest break.`)
        console.log(`shiftDuration is ${shiftDuration} minutes. This break will be in the exact middle of the shift duration.`)
        const middle = shiftDuration / 2;
        console.log(`So the 10-minute break will start at ${middle - 5} minutes into the shift.`)
        addBreak(middle - 5, 10, "Paid Rest Break");
    } 
    else if (shiftDuration > 240 && shiftDuration <= 360) {
        // 4–6 hours: 1 x 10-minute paid rest break (1/3 of the way) + 30-minute meal break (2/3 of the way)
        const oneThird = shiftDuration / 3;
        const twoThirds = shiftDuration * 2 / 3;
        addBreak(oneThird - 5, 10, "Paid Rest Break");
        addBreak(twoThirds - 15, 30, "Unpaid Meal Break");
    }
    else if (shiftDuration > 360 && shiftDuration < 600) {
        // 6–10 hours: 1 x 10-minute paid rest break halfway between the start of work and the meal break
        const mealBreakTime = shiftDuration / 2; // Middle of the work period
        addBreak(mealBreakTime - 15, 10, "Paid Rest Break");
        addBreak(mealBreakTime - 30, 30, "Unpaid Meal Break");
        addBreak(mealBreakTime + 30, 10, "Paid Rest Break");
    }
    else if (shiftDuration >= 600 && shiftDuration <= 720) {
        // 10–12 hours: 3 x 10-minute paid rest breaks + 1 x 30-minute meal break
        const firstHalf = shiftDuration / 2;
        const mealBreakTime = shiftDuration / 3;
        const secondHalf = firstHalf + shiftDuration / 4;
        addBreak(firstHalf - 5, 10, "Paid Rest Break");
        addBreak(mealBreakTime - 15, 30, "Unpaid Meal Break");
        addBreak(secondHalf - 5, 10, "Paid Rest Break");
        addBreak(secondHalf + 5, 10, "Paid Rest Break");
    }
    else if (shiftDuration > 720 && shiftDuration <= 840) {
        // 12–14 hours: 4 x 10-minute paid rest breaks + 2 x 30-minute meal breaks
        const firstThird = shiftDuration / 3;
        const secondThird = shiftDuration * 2 / 3;
        const firstMealBreak = firstThird + 60;
        const secondMealBreak = secondThird + 60;
        addBreak(firstThird - 5, 10, "Paid Rest Break");
        addBreak(firstMealBreak - 15, 30, "Unpaid Meal Break");
        addBreak(secondThird - 5, 10, "Paid Rest Break");
        addBreak(firstMealBreak + 35, 30, "Unpaid Meal Break");
    }
    else if (shiftDuration > 840 && shiftDuration <= 960) {
        // 14–16 hours: 5 x 10-minute paid rest breaks + 2 x 30-minute meal breaks
        const firstQuarter = shiftDuration / 4;
        const secondQuarter = firstQuarter * 2;
        const thirdQuarter = firstQuarter * 3;
        addBreak(firstQuarter - 5, 10, "Paid Rest Break");
        addBreak(secondQuarter - 5, 10, "Paid Rest Break");
        addBreak(thirdQuarter - 5, 10, "Paid Rest Break");
        addBreak(secondQuarter + 10, 30, "Unpaid Meal Break");
        addBreak(thirdQuarter + 15, 30, "Unpaid Meal Break");
    }

    // Function to add a break with its duration and type
    function addBreak(startTime, breakLength, breakType) {
        const breakEndTime = startTime + breakLength;
        const breakStartActual = getActualTime(startDate, startTime);
        const breakEndActual = getActualTime(startDate, breakEndTime);
        breakDetails.push({
            start: toTimeFormat(breakStartActual.getHours() * 60 + breakStartActual.getMinutes()),
            end: toTimeFormat(breakEndActual.getHours() * 60 + breakEndActual.getMinutes()),
            type: breakType
        });
    }

    return breakDetails;
}

// Function to display the results
function displayResults(breakDetails) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (breakDetails.length === 0) {
        resultsDiv.innerHTML = "<p>No breaks are required for this shift.</p>";
    } else {
        breakDetails.forEach(breakItem => {
            const p = document.createElement('p');
            p.classList.add('result-item');
            p.textContent = `${breakItem.type} starts at ${breakItem.start} and ends at ${breakItem.end}`;
            resultsDiv.appendChild(p);
        });
    }
}
