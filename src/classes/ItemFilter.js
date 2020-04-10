import { isEnumerable } from "./Helpers.js";
import { Object } from "core-js";
const _emptyArray = Object.freeze([]);

// Workaround: As of the time writing this, Babel-ESLint doesn't work well with private methods.
/**
     * Filter the observed items.
     * @returns {{
     * addedItems: Array,
     * removedItems: Array
     * }} Returns an object that has added items and removed items from the previous filter result.
     */
function filterTheObserved(theFilters, itemToBeFiltered, filterType, previousFilterResult) {
    if (!itemToBeFiltered || Object.keys(itemToBeFiltered).length === 0) {
        // Not doing anything in case we don't observe anything yet.
        return {
            addedItems: _emptyArray,
            removedItems: _emptyArray
        };
    }

    const totalFilters = theFilters.length;

    if (totalFilters === 0) {
        // In case there are no filters added.
        // We will return all the items as filtered item.
        return {
            addedItems: (Object.isFrozen(itemToBeFiltered) ? itemToBeFiltered : Object.freeze(itemToBeFiltered)),
            removedItems: _emptyArray
        };
    } else {
        let addedItems = [],
            removedItems = [];

        // Begin filtering
        let filter;
        if (filterType === ItemFilter.FilterType.OR) {
            // In case we need to filter item that need to match ONE OF the filters
            filter = (sender, item) => {
                for (let i = 0; i < totalFilters; i++) {
                    if (theFilters[i].call(sender, item) == true) {
                        return true;
                    }
                }
                return false;
            };
        } else if (filterType === ItemFilter.FilterType.AND) {
            // In case we need to filter item that need to match ALL filters
            filter = (sender, item) => {
                for (let i = 0; i < totalFilters; i++) {
                    if (theFilters[i].call(sender, item) != true) {
                        return false;
                    }
                }
                return true;
            };
        }

        if (previousFilterResult && previousFilterResult.length !== 0) {
            for (const item of itemToBeFiltered) {
                if (filter(this, item)) {
                    if (previousFilterResult.includes(item)) {
                        // It's already in matched so we don't need to add it.
                    } else {
                        // New matched item found.
                        previousFilterResult.push(item);
                        addedItems.push(item);
                    }
                } else {
                    const itemIndex = previousFilterResult.indexOf(item);
                    if (itemIndex === -1) {
                        // It's already in unmatched so we don't need to add it.
                    } else {
                        // New unmatched item found.
                        previousFilterResult.splice(itemIndex, 1);
                        removedItems.push(item);
                    }
                }
            }
        } else {
            // In case the previous result is non-existed.
            for (const item of itemToBeFiltered) {
                if (filter(this, item)) {
                    previousFilterResult.push(item);
                    addedItems.push(item);
                } else {
                    removedItems.push(item);
                }
            }
        }

        // Return what we've got so far.
        return {
            addedItems,
            removedItems
        };

        /*
        The thing above is using "boxing" shortcut. Basically, it's box an things into one object.
        The full code of the shortcut is actually like below:
        return {
            addedItems: addedItems,
            removedItems: removedItems
        };
        Where the "addedItems" before the ":" is property name while the "addedItems" after ":" is the variable that is pointing to data.
        */
    }
};

class FilterItemChangedEvent extends CustomEvent {
    // Public static fields.
    // Publicly accessible through this class.
    static EventName = "filterItemChanged";

    /**
     * Create a new instance of FilterItemChangedEvent
     * @param {Array} addedItems An array of items that becomes matched to the current filter.
     * @param {Array} removedItems An array of items that becomes unmatched to the current filter.
     */
    constructor(addedItems, removedItems) {

        let _addedItems, _removedItems;

        if (addedItems && addedItems.length !== 0) {
            if (Object.isFrozen(addedItems)) {
                _addedItems = addedItems;
            } else {
                _addedItems = Object.freeze(addedItems);
            }
        } else {
            _addedItems = _emptyArray;
        }

        if (removedItems && removedItems.length !== 0) {
            if (Object.isFrozen(removedItems)) {
                _removedItems = removedItems;
            } else {
                _removedItems = Object.freeze(removedItems);
            }
        } else {
            _removedItems = _emptyArray;
        }

        // Access the static field "FilterItemChangedEvent.EventName".
        // We call "super()" function in order to call the parent's constructor (aka "Base class's constructor". "Base class" means the original class that this class inherited from.)
        super(FilterItemChangedEvent.EventName, {
            bubbles: false,
            composed: false,
            cancelable: false,
            detail: Object.freeze({
                /**
                 * Gets an array of items that becomes matched the current filter.
                 * @readonly
                 * @returns {Array} The array only contains new items that is added to the previous filtered items.
                 */
                addedItems: _addedItems,
                /**
                 * Gets an array of items that becomes unmatched to the current filter.
                 * @readonly
                 * @returns {Array} The array only contains items that is removed from the previous filtered items.
                 */
                removedItems: _removedItems
            })
        });
    }
}

class ItemFilter extends EventTarget {
    // Public static fields
    static FilterType = Object.freeze({
        AND: 0,
        OR: 1
    });

    // Private fields. This means the field can only be access within this class.
    // Use "#" to declare a private field, as documented here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Class_fields#Private_fields
    #filterCallbacks = [];
    #observingItems;
    #currentfilterType = ItemFilter.FilterType.AND;
    #previousFilterResult_matched = [];

    /**
     * Constructor method. Allow to "var variable = new ItemFilter();".
     * @returns {ItemFilter} Returns a new instance of ItemFilter class.
     */
    constructor() {
        super(); // Call the parent's constructor.

        this.reset();
    }

    //#region "Public Properties"
    /**
     * Gets the number of the added filters.
     * @readonly
     * @returns {Number} The number of added filters.
     */
    get filterCount() {
        return this.#filterCallbacks ? this.#filterCallbacks.length : 0;
    }

    /**
     * Gets or sets the current filtering method.
     * @returns {Number} Returns a number of filtering method according to [ItemFilter.FilterType].
     */
    get filterType() {
        return this.#currentfilterType;
    }

    /**
     * @param {Number} value The filtering method to use. The number must be according to [ItemFilter.FilterType].
     */
    set filterType(value) {
        if (
            value === ItemFilter.FilterType.AND ||
            value === ItemFilter.FilterType.OR
        ) {
            if (this.#currentfilterType !== value) {
                this.#currentfilterType = value;
                this.filterItems();
            }
        }
    }

    //#endregion
    //#region "Public Methods"

    /**
     * Observe an enumberable object and apply the current filters to the enumerable object. Filtered item changes will be in event <onFilterChanged>
     * @param {*} items An enumberable of items to filter.
     * @returns {Array | Boolean} Return a list of filtered items. Or False if failed.
     */
    observe(items) {
        if (isEnumerable(items)) {
            if (this.#observingItems !== items) {
                this.#observingItems = items;
                this.filterItems();
            }
        }
        return false;
    }

    /**
     * Add a filter function to the instance.
     * @param {Function} filter The filter function to filter an item.
     * @returns {Boolean} Returns true if the function is added successfully. Or false if the <filter> is not a function or the function is already added.
     */
    addFilter(filter) {
        if (typeof filter === "function") {
            if (!this.#filterCallbacks.includes(filter)) {
                this.#filterCallbacks.push(filter);
                this.filterItems();
                return true;
            }
        }
        return false;
    }

    /**
     * Remove a filter function to the instance.
     * @param {Function} filter The filter function to filter an item.
     * @returns {Boolean} Returns true if the function is removed successfully. Or false if the <filter> is not a function or the function is not existed in the instance.
     */
    removeFilter(filter) {
        if (typeof filter !== "function") {
            return false;
        }
        const index = this.#filterCallbacks.indexOf(filter);
        if (index !== -1) {
            this.#filterCallbacks.splice(index, 1);
            this.filterItems();
            return true;
        }
        return false;
    }

    /**
     * Remove a filter function to the instance.
     * @param {Function} filter The filter function that is going to be removed.
     * @param {Function} newFilter The filter function to filter that will replace the old one <filter>.
     * @returns {Boolean} Returns true if the function is replaced successfully. Or false if the <filter> is not a function or the function cannot be found to replace.
     */
    replaceFilter(filter, newFilter) {
        if (typeof filter !== "function") {
            return false;
        }
        const index = this.#filterCallbacks.indexOf(filter);
        if (index !== -1) {
            this.#filterCallbacks.splice(index, 1, newFilter);
            this.filterItems();
            return true;
        }
        return false;
    }

    /**
     * Reset to initial state. (Remove all added filters and unobserve the current enumerable)
     */
    reset() {
        this.#filterCallbacks = [];
        this.#observingItems = null;
        this.#previousFilterResult_matched = [];
    }

    /**
     * Short-hand method to raise [filterItemChanged] event.
     * @param {Array} addedItems An array of items that becomes matched to the current filter.
     * @param {Array} removedItems An array of items that becomes unmatched to the current filter.
     */
    filterItems() {
        if (!this.#observingItems) {
            // Not doing anything in case we don't observe anything yet.
            return;
        }
        // We will begin to cook the list of addedItems and removedItems by ourselves here.
        const { addedItems, removedItems } = filterTheObserved.call(this, this.#filterCallbacks, this.#observingItems, this.#currentfilterType, this.#previousFilterResult_matched);

        // Raise the event.
        this.dispatchEvent(new FilterItemChangedEvent(addedItems, removedItems));
    }
    //#endregion
}

export { FilterItemChangedEvent, ItemFilter };
