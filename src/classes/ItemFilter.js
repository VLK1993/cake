import isEnumerable from "./Helpers.js";
const _emptyArray = Object.freeze([]);

class FilterItemChangedEvent extends CustomEvent {
    // Public static fields
    // Publicly accessible through this class.
    static EventName = "filterItemChanged";

    // Private fields
    // Use "#" to declare a private field, as documented here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Class_fields#Private_fields
    #_addedItems = [];
    #_removedItems = [];

    /**
     * Create a new instance of FilterItemChangedEvent
     * @param {Array} addedItems An array of items that becomes matched to the current filter.
     * @param {Array} removedItems An array of items that becomes unmatched to the current filter.
     */
    constructor(addedItems, removedItems) {
        // Access the static field "FilterItemChangedEvent.EventName".
        // We call "super()" function in order to call the parent's constructor (aka "Base class's constructor". "Base class" means the original class that this class inherited from.)
        super(FilterItemChangedEvent.EventName, {
            bubbles: false,
            composed: false,
            cancelable: false,
            detail: 0
        });

        if (addedItems && addedItems.length !== 0) {
            if (Object.isFrozen(addedItems)) {
                this.#_addedItems = addedItems;
            } else {
                this.#_addedItems = Object.freeze(addedItems);
            }
        } else {
            this.#_addedItems = _emptyArray;
        }

        if (removedItems && removedItems.length !== 0) {
            if (Object.isFrozen(removedItems)) {
                this.#_removedItems = removedItems;
            } else {
                this.#_removedItems = Object.freeze(removedItems);
            }
        } else {
            this.#_removedItems = _emptyArray;
        }
    }

    /**
     * Gets an array of items that becomes matched the current filter.
     * @readonly
     * @returns {Array} The array only contains new items that is added to the previous filtered items.
     */
    get addedItems() {
        return this.#_addedItems;
    }

    /**
     * Gets an array of items that becomes unmatched to the current filter.
     * @readonly
     * @returns {Array} The array only contains items that is removed from the previous filtered items.
     */
    get removedItems() {
        return this.#_removedItems;
    }
}

class ItemFilter extends EventTarget {
    // Public static fields
    static FilterType = Object.freeze({
        AND: 0,
        OR: 1
    });

    // Private fields. This means the field can only be access within this class.
    #filterCallbacks = [];
    #observingItems;
    #currentfilterType = ItemFilter.FilterType.AND;
    #previousFilterResult_matched = [];
    #previousFilterResult_unmatched = [];

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
        return (this.#filterCallbacks ? this.#filterCallbacks.length : 0);
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
        if (value === ItemFilter.FilterType.AND || value === ItemFilter.FilterType.OR) {
            if (this.#currentfilterType !== value) {
                this.#currentfilterType = value;
                this.#onFilterChanged();
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
                this.#onFilterChanged();
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
                this.#onFilterChanged();
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
        const index = this.#filterCallbacks.indexOf(filter);
        if (index !== -1) {
            this.#filterCallbacks.splice(index, 1);
            this.#onFilterChanged();
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
        const index = this.#filterCallbacks.indexOf(filter);
        if (index !== -1) {
            this.#filterCallbacks.splice(index, 1, newFilter);
            this.#onFilterChanged();
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
        this.#previousFilterResult_unmatched = [];
    }
    //#endregion

    //#region "Private Methods"

    /**
     * Short-hand method to raise [filterItemChanged] event.
     * @param {Array} addedItems An array of items that becomes matched to the current filter.
     * @param {Array} removedItems An array of items that becomes unmatched to the current filter.
     */
    #onFilterChanged(addedItems, removedItems) {
        if (!this.#observingItems) {
            // Not doing anything in case we don't observe anything yet.
            return;
        }

        if (!addedItems && !removedItems) {
            // In case we call this method without any params. Like "this.#onFilterChanged();"
            // We will begin to cook the list of addedItems and removedItems by ourselves here.

            const result = this.#filterTheObserved();
            addedItems = result.addedItems;
            removedItems = result.removedItems;
        }

        // Cached the results one in order to compare to the filtering next time.
        this.#previousFilterResult_matched = addedItems;
        this.#previousFilterResult_unmatched = removedItems;

        this.dispatchEvent(new FilterItemChangedEvent(addedItems, removedItems));
    }

    /**
     * Filter the observed items.
     * @returns {{ 
     * addedItems: Array,
     * removedItems: Array
     * }} Returns an object that has added items and removed items from the previous filter result.
     */
    #filterTheObserved() {
        if (!this.#observingItems) {
            // Not doing anything in case we don't observe anything yet.
            return {
                addedItems: _emptyArray,
                removedItems: _emptyArray
            };
        }

        const theFilters = this.#filterCallbacks,
            totalFilters = theFilter.length;

        let addedItems = [],
            removedItems = [];
        if (totalFilters === 0) {
            // In case there are no filters added.
            // We will return all the items as filtered item.
            return {
                addedItems: this.#observingItems,
                removedItems: _emptyArray
            };
        } else {
            // Begin filtering
            let filter;
            if (this.#currentfilterType === ItemFilter.FilterType.OR) {
                // In case we need to filter item that need to match ONE OF the filters
                filter = (sender, item) => {
                    for (let i = 0; i < totalFilters; i++) {
                        if (theFilters[i].call(sender, item) == true) {
                            return true;
                        }
                    }
                    return false;
                };
            } else if (this.#currentfilterType === ItemFilter.FilterType.AND) {
                // In case we need to filter item that need to match ALL filters
                filter = (sender, item) => {
                    for (let i = 0; i < totalFilters; i++) {
                        if (!theFilters[i].call(sender, item) == true) {
                            return false;
                        }
                    }
                    return true;
                };
            }


            for (const item in this.#observingItems) {
                if (filter(this, item)) {
                    if (this.#previousFilterResult_matched.includes(item)) {
                        // It's already in matched so we don't need to add it.
                    } else {
                        // New matched item found.
                        addedItems.push(item);
                    }
                } else {
                    if (this.#previousFilterResult_unmatched.includes(item)) {
                        // It's already in unmatched so we don't need to add it.
                    } else {
                        // New unmatched item found.
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
    }
    //#endregion
}

export default { FilterItemChangedEvent, ItemFilter }