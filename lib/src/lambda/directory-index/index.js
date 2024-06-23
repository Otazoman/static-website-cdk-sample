"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const uri = request.uri;
    // Check whether the URI is missing a file name.
    if (uri.endsWith("/")) {
        request.uri += "index.html";
    }
    // Check whether the URI is missing a file extension.
    else if (!uri.includes(".")) {
        request.uri += "/index.html";
    }
    callback(null, request);
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFTyxNQUFNLE9BQU8sR0FBRyxDQUNyQixLQUE2QixFQUM3QixPQUFnQixFQUNoQixRQUFrQixFQUNsQixFQUFFO0lBQ0YsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQzVDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFFeEIsZ0RBQWdEO0lBQ2hELElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLElBQUksWUFBWSxDQUFDO0lBQzlCLENBQUM7SUFDRCxxREFBcUQ7U0FDaEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsR0FBRyxJQUFJLGFBQWEsQ0FBQztJQUMvQixDQUFDO0lBRUQsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMxQixDQUFDLENBQUM7QUFsQlcsUUFBQSxPQUFPLFdBa0JsQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhbGxiYWNrLCBDbG91ZEZyb250UmVxdWVzdEV2ZW50LCBDb250ZXh0IH0gZnJvbSBcImF3cy1sYW1iZGFcIjtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZXIgPSAoXG4gIGV2ZW50OiBDbG91ZEZyb250UmVxdWVzdEV2ZW50LFxuICBjb250ZXh0OiBDb250ZXh0LFxuICBjYWxsYmFjazogQ2FsbGJhY2tcbikgPT4ge1xuICBjb25zdCByZXF1ZXN0ID0gZXZlbnQuUmVjb3Jkc1swXS5jZi5yZXF1ZXN0O1xuICBjb25zdCB1cmkgPSByZXF1ZXN0LnVyaTtcblxuICAvLyBDaGVjayB3aGV0aGVyIHRoZSBVUkkgaXMgbWlzc2luZyBhIGZpbGUgbmFtZS5cbiAgaWYgKHVyaS5lbmRzV2l0aChcIi9cIikpIHtcbiAgICByZXF1ZXN0LnVyaSArPSBcImluZGV4Lmh0bWxcIjtcbiAgfVxuICAvLyBDaGVjayB3aGV0aGVyIHRoZSBVUkkgaXMgbWlzc2luZyBhIGZpbGUgZXh0ZW5zaW9uLlxuICBlbHNlIGlmICghdXJpLmluY2x1ZGVzKFwiLlwiKSkge1xuICAgIHJlcXVlc3QudXJpICs9IFwiL2luZGV4Lmh0bWxcIjtcbiAgfVxuXG4gIGNhbGxiYWNrKG51bGwsIHJlcXVlc3QpO1xufTtcbiJdfQ==