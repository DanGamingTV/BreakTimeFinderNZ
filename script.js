function calculateBreaks(shiftStartTime, shiftEndTime) {
    // Convert shift start and end time into minutes since midnight
    const shiftStart = new Date(shiftStartTime);
    const shiftEnd = new Date(shiftEndTime);
    const shiftDurationMins = (shiftEnd - shiftStart) / 60000; // in minutes
    const shiftDurationMs = (shiftEnd - shiftStart);
    const restBreakDurationMins = 10;
    const restBreakDurationMs = restBreakDurationMins * 60000;
    const mealBreakDurationMins = 30;
    const mealBreakDurationMs = mealBreakDurationMins * 60000;
    
    let breaks = [];

    console.log(`Calculating breaks for a shift that is ${shiftDurationMins} minutes long.`)
    
    // 2 hours or more, but not more than 4 hours worked
    if (shiftDurationMins >= 120 && shiftDurationMins <= 240) {
        console.log(`2 hours or more, but not more than 4 hours worked`)
        let eitherSideOfBreakMs = (shiftEnd.getTime() - shiftStart.getTime() - restBreakDurationMs) / 2;
        let firstRestBreakStartMs = new Date(shiftStart.getTime() + eitherSideOfBreakMs);
        let firstRestBreakEndMs = new Date(shiftStart.getTime() + eitherSideOfBreakMs + restBreakDurationMs);
        breaks.push({breakType: "Paid Rest Break", breakStart: firstRestBreakStartMs, breakEnd: firstRestBreakEndMs});
    }

    // More than 4 hours, but no more than 6 hours worked
    if (shiftDurationMins > 240 && shiftDurationMins <= 360) {
        console.log(`More than 4 hours, but no more than 6 hours worked`)
        let middleOfFirstRestBreak = (shiftDurationMs) * (1/3)
        let firstRestBreakStartMs = new Date(shiftStart.getTime() + middleOfFirstRestBreak - (restBreakDurationMs / 2));
        let firstRestBreakEndMs = new Date(shiftStart.getTime() + middleOfFirstRestBreak + (restBreakDurationMs / 2));
        let middleOfFirstMealBreak = (shiftDurationMs) * (2/3)
        let firstMealBreakStartMs = new Date(shiftStart.getTime() + middleOfFirstMealBreak - (mealBreakDurationMs / 2));
        let firstMealBreakEndMs = new Date(shiftStart.getTime() + middleOfFirstMealBreak + (mealBreakDurationMs / 2));
        
        breaks.push({breakType: "Paid Rest Break", breakStart: firstRestBreakStartMs, breakEnd: firstRestBreakEndMs});
        breaks.push({breakType: "Unpaid Meal Break", breakStart: firstMealBreakStartMs, breakEnd: firstMealBreakEndMs});
    }    

    // More than 6 hours, but less than 10 hours worked
    if (shiftDurationMins > 360 && shiftDurationMins < 600) {
        console.log(`More than 6 hours, but less than 10 hours worked`)
        // Meal break placement: In the middle of the work period
        let eitherSideOfBreakMs = (shiftDurationMs - mealBreakDurationMs) / 2;
        let mealBreakStartMs = new Date(shiftStart.getTime() + eitherSideOfBreakMs);
        let mealBreakEndMs = new Date(shiftStart.getTime() + eitherSideOfBreakMs + mealBreakDurationMs);
        
        // First 10-minute rest break: Halfway between start and meal break
        eitherSideOfBreakMs = (mealBreakStartMs.getTime() - shiftStart.getTime() - restBreakDurationMs) / 2;
        let firstRestBreakStartMs = new Date(shiftStart.getTime() + eitherSideOfBreakMs);
        let firstRestBreakEndMs = new Date(shiftStart.getTime() + eitherSideOfBreakMs + restBreakDurationMs);
        
        // Second 10-minute rest break: Halfway between meal break and end of shift
        eitherSideOfBreakMs = (shiftEnd.getTime() - mealBreakEndMs.getTime() - restBreakDurationMs) / 2;
        let secondRestBreakStartMs = new Date(mealBreakEndMs.getTime() + eitherSideOfBreakMs);
        let secondRestBreakEndMs = new Date(mealBreakEndMs.getTime() + eitherSideOfBreakMs + restBreakDurationMs);
        
        // Push the breaks to the array in the correct order
        breaks.push({breakType: "Paid Rest Break", breakStart: firstRestBreakStartMs, breakEnd: firstRestBreakEndMs});
        breaks.push({breakType: "Unpaid Meal Break", breakStart: mealBreakStartMs, breakEnd: mealBreakEndMs});
        breaks.push({breakType: "Paid Rest Break", breakStart: secondRestBreakStartMs, breakEnd: secondRestBreakEndMs});
    }

    // 10 hours or more, but no more than 12 hours worked
    if (shiftDurationMins >= 600 && shiftDurationMins <= 720) {
        console.log(`10 hours or more, but no more than 12 hours worked`)
        // Meal break placement: In the middle of the first 8 hours of work
        let mealBreakStartMs = new Date(shiftStart.getTime() + (8 * 60 * 60000) - (mealBreakDurationMs / 2));
        let mealBreakEndMs = new Date(shiftStart.getTime() + (8 * 60 * 60000) + (mealBreakDurationMs / 2));

        // First 10-minute rest break: Halfway between the start of work and the meal break
        let firstRestBreakStartMs = new Date(shiftStart.getTime() + ((mealBreakStartMs.getTime() - shiftStart.getTime()) / 2) - (restBreakDurationMs / 2));
        let firstRestBreakEndMs = new Date(shiftStart.getTime() + ((mealBreakStartMs.getTime() - shiftStart.getTime()) / 2) + (restBreakDurationMs / 2));

        // Second 10-minute rest break: Halfway between the meal break and the end of the first 8 hours of work
        let endOfFirst8HoursOfWorkMs = (shiftStart.getTime() + (8 * 60 * 60000))
        let secondRestBreakStartMs = new Date(((endOfFirst8HoursOfWorkMs - mealBreakEndMs) / 2) - (restBreakDurationMs / 2));
        let secondRestBreakEndMs = new Date(((endOfFirst8HoursOfWorkMs - mealBreakEndMs) / 2) + (restBreakDurationMs / 2));

        // Third 10-minute rest break: Halfway between the end of the first 8 hours of work and the end of the work period
        let halfwayPoint = (shiftEnd.getTime() - endOfFirst8HoursOfWorkMs) / 2
        let thirdRestBreakStartMs = new Date(halfwayPoint - (restBreakDurationMs / 2));
        let thirdRestBreakEndMs = new Date(halfwayPoint + (restBreakDurationMs / 2));

        // Push the breaks to the array in the correct order
        breaks.push({breakType: "Paid Rest Break", breakStart: firstRestBreakStartMs, breakEnd: firstRestBreakEndMs});
        breaks.push({breakType: "Unpaid Meal Break", breakStart: mealBreakStartMs, breakEnd: mealBreakEndMs});
        breaks.push({breakType: "Paid Rest Break", breakStart: secondRestBreakStartMs, breakEnd: secondRestBreakEndMs});
        breaks.push({breakType: "Paid Rest Break", breakStart: thirdRestBreakStartMs, breakEnd: thirdRestBreakEndMs});
    }

    // More than 12 hours, but no more than 14 hours worked
    if (shiftDurationMins > 720 && shiftDurationMins <= 840) {
        // First meal break placement: In the middle of the first 8 hours of work
        let firstMealBreakStartMs = new Date(shiftStart.getTime() + (8 * 60 * 60000) - (mealBreakDurationMs / 2));
        let firstMealBreakEndMs = new Date(shiftStart.getTime() + (8 * 60 * 60000) + (mealBreakDurationMs / 2));

        // First rest break: Halfway between the start of work and the first meal break
        let firstRestBreakStartMs = new Date(shiftStart.getTime() + ((firstMealBreakStartMs.getTime() - shiftStart.getTime()) / 2) - (restBreakDurationMs / 2));
        let firstRestBreakEndMs = new Date(shiftStart.getTime() + ((firstMealBreakStartMs.getTime() - shiftStart.getTime()) / 2) + (restBreakDurationMs / 2));
        
        // Second rest break: Halfway between the meal break and the end of the first 8 hours of work
        let endOfFirst8HoursOfWorkMs = (shiftStart.getTime() + (8 * 60 * 60000))
        let secondRestBreakStartMs = new Date(((endOfFirst8HoursOfWorkMs - firstMealBreakEndMs) / 2) - (restBreakDurationMs / 2));
        let secondRestBreakEndMs = new Date(((endOfFirst8HoursOfWorkMs - firstMealBreakEndMs) / 2) + (restBreakDurationMs / 2));

        // Third rest break: One-third of the way between the end of the first 8 hours of work and the end of the work period
        let oneThirdPointMs = (shiftEnd.getTime() - endOfFirst8HoursOfWorkMs) * (1/3)
        let thirdRestBreakStartMs = new Date(oneThirdPointMs - (restBreakDurationMs / 2))
        let thirdRestBreakEndMs = new Date(oneThirdPointMs + (restBreakDurationMs / 2))

        // Second meal break: Two-thirds of the way between the end of the first 8 hours of work and the end of the work period
        let twoThirdsPointMs = (shiftEnd.getTime() - endOfFirst8HoursOfWorkMs) * (2/3)
        let secondMealBreakStartMs = new Date(twoThirdsPointMs - (mealBreakDurationMs / 2))
        let secondMealBreakEndMs = new Date(twoThirdsPointMs + (mealBreakDurationMs / 2))

        // Push the breaks to the array in the correct order
        breaks.push({breakType: "Paid Rest Break", breakStart: firstRestBreakStartMs, breakEnd: firstRestBreakEndMs});
        breaks.push({breakType: "Unpaid Meal Break", breakStart: firstMealBreakStartMs, breakEnd: firstMealBreakEndMs});
        breaks.push({breakType: "Paid Rest Break", breakStart: secondRestBreakStartMs, breakEnd: secondRestBreakEndMs});
        breaks.push({breakType: "Paid Rest Break", breakStart: thirdRestBreakStartMs, breakEnd: thirdRestBreakEndMs});
        breaks.push({breakType: "Unpaid Meal Break", breakStart: secondMealBreakStartMs, breakEnd: secondMealBreakEndMs});
    }

    // More than 14 hours, but no more than 16 hours worked
    if (shiftDurationMins > 840 && shiftDurationMins <= 960) {
        // First meal break: In the middle of the first 8 hours of work
        let firstMealBreakStartMs = new Date(shiftStart.getTime() + (8 * 60 * 60000) - (mealBreakDurationMs / 2));
        let firstMealBreakEndMs = new Date(shiftStart.getTime() + (8 * 60 * 60000) + (mealBreakDurationMs / 2));

        // Second meal break: Halfway between the end of the first 8 hours and the end of work
        let endOfFirst8HoursOfWorkMs = (shiftStart.getTime() + (8 * 60 * 60000))
        let halfwayPoint = (shiftEnd.getTime() - endOfFirst8HoursOfWorkMs) / 2
        let secondMealBreakStartMs = new Date(halfwayPoint - (mealBreakDurationMs / 2));
        let secondMealBreakEndMs = new Date(halfwayPoint + (mealBreakDurationMs / 2));

        // First rest break: Halfway between the start of work and the first meal break
        let firstRestBreakStartMs = new Date(shiftStart.getTime() + ((firstMealBreakStartMs.getTime() - shiftStart.getTime()) / 2) - (restBreakDurationMs / 2));
        let firstRestBreakEndMs = new Date(shiftStart.getTime() + ((firstMealBreakStartMs.getTime() - shiftStart.getTime()) / 2) + (restBreakDurationMs / 2));

        // Second rest break: Halfway between the first meal break and the end of the first 8 hours of work
        let secondRestBreakStartMs = new Date(((endOfFirst8HoursOfWorkMs - firstMealBreakEndMs) / 2) - (restBreakDurationMs / 2));
        let secondRestBreakEndMs = new Date(((endOfFirst8HoursOfWorkMs - firstMealBreakEndMs) / 2) + (restBreakDurationMs / 2));

        // Third rest break: Halfway between the end of the first 8 hours and the second meal break
        let thirdRestBreakStartMs = new Date(((endOfFirst8HoursOfWorkMs - secondMealBreakEndMs) / 2) - (restBreakDurationMs / 2));
        let thirdRestBreakEndMs = new Date(((endOfFirst8HoursOfWorkMs - secondMealBreakEndMs) / 2) + (restBreakDurationMs / 2));

        // Fourth rest break: Halfway between the second meal break and the end of work
        let fourthRestBreakStartMs = new Date(((shiftEnd.getTime() - secondMealBreakEndMs) / 2) - (restBreakDurationMs / 2));
        let fourthRestBreakEndMs = new Date(((shiftEnd.getTime() - secondMealBreakEndMs) / 2) + (restBreakDurationMs / 2));

        // Push the breaks to the array in the correct order
        breaks.push({breakType: "Paid Rest Break", breakStart: firstRestBreakStartMs, breakEnd: firstRestBreakEndMs});
        breaks.push({breakType: "Unpaid Meal Break", breakStart: firstMealBreakStartMs, breakEnd: firstMealBreakEndMs});
        breaks.push({breakType: "Paid Rest Break", breakStart: secondRestBreakStartMs, breakEnd: secondRestBreakEndMs});
        breaks.push({breakType: "Paid Rest Break", breakStart: thirdRestBreakStartMs, breakEnd: thirdRestBreakEndMs});
        breaks.push({breakType: "Unpaid Meal Break", breakStart: secondMealBreakStartMs, breakEnd: secondMealBreakEndMs});
        breaks.push({breakType: "Paid Rest Break", breakStart: fourthRestBreakStartMs, breakEnd: fourthRestBreakEndMs});
    }
    
    return breaks;
}

// Example usage:
let breakTimes = calculateBreaks("2024-11-26T15:00:00", "2024-11-26T21:15:00");
breakTimes.forEach(breakInfo => {
    console.log(`${breakInfo.breakType} starts at ${breakInfo.breakStart} and ends at ${breakInfo.breakEnd}`);
});
