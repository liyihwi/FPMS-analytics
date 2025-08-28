"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.greet = greet;
exports.add = add;
const AnalyticService_1 = require("./AnalyticService");
/**
 * A simple function that greets a user.
 * @param name The name of the user to greet.
 * @returns A greeting string.
 */
function greet(name) {
    return `Hello, ${name}!`;
}
/**
 * Adds two numbers together.
 * @param a The first number.
 * @param b The second number.
 * @returns The sum of the two numbers.
 */
function add(a, b) {
    return a + b;
}
console.log(greet("John"));
console.log(add(1, 2));
const analyticsService = new AnalyticService_1.AnalyticsService({
    accessToken: "EAAP8O8jd678BPbeKslIqzU3qKsYZBYjEhTasA0vlhS1Y09fRf1PvYp9ahQkew3uzMY7N2wvZClmNAelf4ibISVc7rpiZADSDtKGMvL5zOreW6BDb7lNhAe73ECmYnmL2jQyAv1il6Y1ltO5LFeDq6ByV60mHUYODxz8yTj4Dq90SZAeZBeISUZBnTxiTK8RAZDZD",
    pixelId: "805212191839910",
});
analyticsService.track("AddToCart", {
    clientIpAddress: "1.2.3.4",
    clientUserAgent: "test user agent",
}, {
    value: 100,
    event_id: "1234567890",
    event_source_url: "https://www.google.com",
    currency: "USD",
});
