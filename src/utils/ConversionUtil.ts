import React from "react";


class ConversionUtil {

    /**
     * Converts the given value from kilometers to miles.
     *
     * @param kilometers - The distance in kilometers to convert to miles.
     * @returns The distance in miles, rounded to the nearest 2 decimals.
     */
    public static kilometersToMiles(kilometers: number): number {
        const miles = kilometers * 0.621371;
        return Math.round(miles * 100) / 100;
    }

    /**
     * Converts the given value from minutes to a human-readable string.
     *
     * @param minutes - The time in minutes to convert to a string.
     * @returns A string representing the time in days, hours, and minutes.
     */
    public static minutesToReadableTime(minutes: number): string {
        const days = Math.floor(minutes / 1440);
        const hours = Math.floor((minutes % 1440) / 60);
        const mins = Math.floor(minutes % 60);

        let result = '';
        if (days > 0) {
            result += `${days} day${days > 1 ? 's' : ''} `;
        }
        if (hours > 0) {
            result += `${hours} hour${hours > 1 ? 's' : ''} `;
        }
        if (mins > 0 || result === '') {
            result += `${mins} minute${mins > 1 ? 's' : ''}`;
        }

        return result.trim();
    }

    /**
     * Calculates the tax deduction based on the given miles.
     *
     * @param miles - The distance in miles to calculate the tax deduction for.
     * @returns The tax deduction amount in dollars, rounded to the nearest 2 decimals.
     */
    public static calculateTaxDeduction(miles: number, deductionPerMile: number): number {
        deductionPerMile = deductionPerMile*0.01;
        return Math.round(miles * deductionPerMile * 100) / 100;
    }

}

export default ConversionUtil;