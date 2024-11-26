function calculateBreaks(shiftStartTime, shiftEndTime) {
    // Convert shift start and end time into minutes since midnight
    const shiftStart = new Date(shiftStartTime);
    const shiftEnd = new Date(shiftEndTime);
    const shiftDuration = (shiftEnd - shiftStart) / 60000; // in minutes
    
    let breaks = [];
    
    if (shiftDuration >= 120 && shiftDuration <= 240) {
        // 2-4 hours worked: 1 x 10-minute paid rest break in the middle
        let middle = shiftStart.getTime() + shiftDuration * 30 * 60000; // middle of work period
        let restBreakStart = new Date(middle - 5 * 60000); // Start break 5 minutes before middle
        let restBreakEnd = new Date(restBreakStart.getTime() + 10 * 60000); // 10-minute break
        
        breaks.push({
            breakType: "Paid Rest Break",
            breakStart: restBreakStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            breakEnd: restBreakEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        
    } else if (shiftDuration > 360   && shiftDuration <= 600) {
        // More than 6 hours, but no more than 10 hours worked
        let mealBreakStart = new Date(shiftStart.getTime() + (shiftDuration - 30) * 30 * 60000); // Meal break at one-third of work time
        let mealBreakEnd = new Date(mealBreakStart.getTime() + 30 * 60000); // 30-minute meal break
        
        let firstRestBreakStart = new Date(shiftStart.getTime() + 115 * 60000); // First rest break halfway between start and meal break
        let firstRestBreakEnd = new Date(firstRestBreakStart.getTime() + 10 * 60000); // 10-minute break
        
        let secondRestBreakStart = new Date(mealBreakEnd.getTime() + 115 * 60000); // Second rest break halfway between meal break and end
        let secondRestBreakEnd = new Date(secondRestBreakStart.getTime() + 10 * 60000); // 10-minute break
        
        breaks.push({
            breakType: "Paid Rest Break",
            breakStart: firstRestBreakStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            breakEnd: firstRestBreakEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        
        breaks.push({
            breakType: "Unpaid Meal Break",
            breakStart: mealBreakStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            breakEnd: mealBreakEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        
        breaks.push({
            breakType: "Paid Rest Break",
            breakStart: secondRestBreakStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            breakEnd: secondRestBreakEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
    }
    
    return breaks;
}

// Example usage:
let breakTimes = calculateBreaks("2024-11-26T08:00:00", "2024-11-26T16:30:00");
breakTimes.forEach(breakInfo => {
    console.log(`${breakInfo.breakType} starts at ${breakInfo.breakStart} and ends at ${breakInfo.breakEnd}`);
});
