/**
 * Check if the object is enumberable.
 * @param {*} obj The object to check.
 * @returns {Boolean} Return True if the object is enumberable. Otherwise False. ({String} is enumerable.)
 */
export function isEnumerable(obj) {
    return (obj != null && typeof obj[Symbol.iterator] === "function");
}