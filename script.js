function calculateBreaks(shiftStartTime, shiftEndTime) {
    // Convert shift start and end time into minutes since midnight
    const shiftStart = new Date(shiftStartTime);
    const shiftEnd = new Date(shiftEndTime);
    const shiftDuration = (shiftEnd - shiftStart) / 60000; // in minutes
    
    let breaks = [];
    
    // Corrected if condition for 6-10 hour shifts (360 minutes to 600 minutes)
    if (shiftDuration > 360 && shiftDuration < 600) {
        // Total work time excluding breaks (subtract 30 minutes for meal break)
        let totalWorkTime = shiftDuration - 30; // Subtract 30 minutes for the meal break
        
        // Meal break placement: In the middle of the work period
        let eitherSideOfBreak = (shiftDuration - 30) / 2;
        let mealBreakStart = new Date(shiftStart.getTime()  + (eitherSideOfBreak) * 60000);
        let mealBreakEnd = new Date(shiftStart.getTime()  + (eitherSideOfBreak + 30) * 60000);
        
        // First 10-minute rest break: Halfway between start and meal break
        eitherSideOfBreak = (mealBreakStart.getTime() - shiftStart.getTime() - (10 * 60000)) / 60000 /* ms to mins */ / 2;
        let firstRestBreakStart = new Date(shiftStart.getTime() + (eitherSideOfBreak) * 60000);
        let firstRestBreakEnd = new Date(shiftStart.getTime() + (eitherSideOfBreak + 10) * 60000);
        
        // Second 10-minute rest break: Halfway between meal break and end of shift
        eitherSideOfBreak = (shiftEnd.getTime() - mealBreakEnd.getTime() - (10 * 60000)) / 60000 /* ms to mins */ / 2;
        let secondRestBreakStart = new Date(mealBreakEnd.getTime() + (eitherSideOfBreak) * 60000);
        let secondRestBreakEnd = new Date(mealBreakEnd.getTime() + (eitherSideOfBreak + 10) * 60000);
        
        // Push the breaks to the array in the correct order
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
