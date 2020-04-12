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
function filterTheObserved(
  theFilterDictionary,
  itemToBeFiltered,
  filterType,
  previousFilterResult_matched,
  previousFilterResult_unmatched
) {
  if (!itemToBeFiltered || (Array.isArray(itemToBeFiltered) && itemToBeFiltered.length === 0) || (Object.keys(itemToBeFiltered).length === 0)) {
    // Not doing anything in case we don't observe anything yet.
    return {
      addedItems: _emptyArray,
      removedItems: _emptyArray
    };
  }

  const theFilters = Object.values(theFilterDictionary),
    totalFilters = theFilters.length;

  if (totalFilters === 0) {
    // In case there are no filters added.
    // We will return all the items as filtered item.
    if (previousFilterResult_matched !== null) {
      previousFilterResult_matched.splice(0, previousFilterResult_matched.length, itemToBeFiltered);
    }
    if (previousFilterResult_unmatched !== null) {
      previousFilterResult_unmatched.splice(0, previousFilterResult_unmatched.length);
    }
    return {
      addedItems: Object.isFrozen(itemToBeFiltered)
        ? itemToBeFiltered
        : Object.freeze(itemToBeFiltered),
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

    const func = (cacheListToBeAdded, cacheListToBeRemoved, targetList, item) => {
      if (cacheListToBeAdded !== null) {
        if (cacheListToBeAdded.includes(item)) {
          // It's already in matched so we don't need to add it.
        } else {
          // New matched item found.
          cacheListToBeAdded.push(item);
          targetList.push(item);
        }
      } else {
        targetList.push(item);
      }
      if (cacheListToBeRemoved !== null) {
        const itemIndex = cacheListToBeRemoved.indexOf(item);
        if (itemIndex !== -1) {
          // Remove item from unmatched.
          cacheListToBeRemoved.splice(itemIndex, 1);
        }
      }
    };

    for (const item of itemToBeFiltered) {
      if (filter(this, item)) {
        func(previousFilterResult_matched, previousFilterResult_unmatched, addedItems, item);
      } else {
        func(previousFilterResult_unmatched, previousFilterResult_matched, removedItems, item);
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

    Object.defineProperties(this, {
      addedItems: {
        configurable: false,
        writable: false,
        enumerable: true,
        value: _addedItems
      },
      removedItems: {
        configurable: false,
        writable: false,
        enumerable: true,
        value: _removedItems
      }
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
  #filterCallbacks = {};
  #observingItems;
  #currentfilterType = ItemFilter.FilterType.AND;
  #previousFilterResult_matched = [];
  #previousFilterResult_unmatched = [];

  /**
   * Constructor method. Allow to "var variable = new ItemFilter();".
   * @returns {ItemFilter} Returns a new instance of ItemFilter class.
   * @constructor
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
    return this.#filterCallbacks ? Object.keys(this.#filterCallbacks).length : 0;
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
        this.flush();
        this.filterItems();
      }
    }
  }

  //#endregion
  //#region "Public Methods"

  /**
   * Observe an enumberable object or array and apply the current filters to the enumerable object. Filtered item changes will be in event <filterItemChanged>. An instance of ItemFilter can only observe one enumerable object.
   * @param {Enumerator | Array} items An enumberable of items to filter.
   * @returns {Boolean} Return true if the enumerable object is put to observing successfully. Otherwise False.
   */
  observe(items) {
    if (Array.isArray(items) || isEnumerable(items)) {
      if (this.#observingItems !== items) {
        this.#observingItems = items;
        this.flush();
        this.filterItems();
        return true;
      }
    }
    return false;
  }

  /**
   * Adds or replaces a filter function with the given function name.
   * @param {Function | String} nameOrFunction The filter which is a function name or named function.
   * @param {Function} filter The filter function to filter an item.
   * @throws {SyntaxError} When you specify 1 argument with anonymous function. Or when you specify 2 arguments that the first one is not a string and the second one is not a function. Or you specify more than 3 arguments.
   */
  setFilter(nameOrFunction, filter) {
    const argLen = arguments.length;
    if (argLen === 1) {
      if (typeof nameOrFunction === "function") {
        if (nameOrFunction.name) {
          this.#filterCallbacks[nameOrFunction.name] = nameOrFunction;
          this.filterItems();
        } else {
          throw new SyntaxError("The function is anonymous. Please use 'setFilter(functionName, anonymousFunction)' instead.");
        }
      }
    } else if (argLen === 2) {
      if (typeof nameOrFunction !== "string") {
        throw new SyntaxError("The 'nameOrFunction' argument should be a string.");
      }
      if (typeof filter !== "function") {
        throw new SyntaxError("The 'filter' argument should be a function.");
      }
      if (filter.name && filter.name !== nameOrFunction) {
        console.warn(`The 'filter' argument is a named function but you still specify another name (${nameOrFunction}) in 'nameOrFunction'. Is it intended?`); // This is just an alias for console.error();. But using "warn" should imply this is intended not an error.
      }
      this.#filterCallbacks[nameOrFunction] = filter;
      this.filterItems();
    } else if (argLen === 0) {
      throw new SyntaxError("setFilter does not accept 0 arguments.");
    } else {
      throw new SyntaxError("setFilter does not accept more than 3 arguments.");
    }
  }

  /**
   * Remove a filter function which matches the given name or the named function from the instance.
   * @param {Function | String} nameOrFunction The filter which is a function name or named function.
   * @returns {Boolean} Returns true if the function is removed successfully. Or false if the <filter> is not a function or the function is not existed in the instance.
   */
  removeFilter(nameOrFunction) {
    const argLen = arguments.length;
    if (argLen === 1) {
      const argType = typeof nameOrFunction;
      if (argType === "string") {
        if (this.#filterCallbacks.hasOwnProperty(nameOrFunction)) {
          delete this.#filterCallbacks[nameOrFunction];
          this.filterItems();
          return true;
        }
      } else if (argType === "function") {
        if (!nameOrFunction.name) {
          throw new SyntaxError("The 'nameOrFunction' argument should be a named function.");
        }
        if (this.#filterCallbacks.hasOwnProperty(nameOrFunction.name)) {
          delete this.#filterCallbacks[nameOrFunction.name];
          this.filterItems();
          return true;
        }
      } else {
        throw new SyntaxError("The 'nameOrFunction' argument should be a name or a named function.");
      }
    } else if (argLen === 0) {
      throw new SyntaxError("setFilter does not accept 0 arguments.");
    } else {
      throw new SyntaxError("setFilter does not accept more than 3 arguments.");
    }
    return false;
  }

  /**
   * Reset to initial state. (Remove all added filters and unobserve the current enumerable)
   */
  reset() {
    this.#filterCallbacks = {};
    this.#observingItems = null;
    this.flush();
  }

  /**
   * Flush the old cached results to the oblivion.
   */
  flush() {
    this.#previousFilterResult_matched = null;
    this.#previousFilterResult_unmatched = null;
  }

  /**
   * Force the ItemFilter instance to filter the observed items.
   */
  filterItems() {
    if (!this.#observingItems) {
      // Not doing anything in case we don't observe anything yet.
      return;
    }
    // We will begin to cook the list of addedItems and removedItems by ourselves here.
    const { addedItems, removedItems } = filterTheObserved.call(
      this,
      this.#filterCallbacks,
      this.#observingItems,
      this.#currentfilterType,
      this.#previousFilterResult_matched,
      this.#previousFilterResult_unmatched
    );

    if (this.#previousFilterResult_matched === null) {
      this.#previousFilterResult_matched = [...addedItems]; // ES6 way to copy an array.
    }
    if (this.#previousFilterResult_unmatched === null) {
      this.#previousFilterResult_unmatched = [...removedItems];
    }

    // Raise the event.
    this.dispatchEvent(new FilterItemChangedEvent(addedItems, removedItems));
  }
  //#endregion

  //#region "Public static methods"
  /**
   * Filter an enumerable object or array. Returning an awaitable Promise.
   * @static
   * @param {Enumerator | Array} items An enumberable of items to filter.
   * @param {Array | { ..., filterName: Function }} filters An enumberable of items to filter.
   * @param {Number} [filterType] The filter type. Must be according to [ItemFilter.FilterType].
   * @returns {Promise} Returns an awaitable Promise.
   * @throws {SyntaxError} The arguments are mismatched.
   */
  static filter(items, filters, filterType) {
    const argLen = arguments.length;
    if (argLen < 2) {
      throw new SyntaxError("The static 'filter' method cannot be used with less than 2 arguments.");
    } else if (argLen > 3) {
      throw new SyntaxError("The static 'filter' method cannot be used with more than 3 arguments.");
    }
    const myFilter = new ItemFilter();
    if (argLen === 3) {
      myFilter.filterType = filterType;
    }
    if (Array.isArray(filters)) {
      const length = filters.length;
      for (let i = 0; i < length; i++) {
        const currentItem = filters[i];
        if (typeof currentItem === "object") {
          if (Object.prototype.hasOwnProperty.call(currentItem, "name")) {
            myFilter.setFilter(currentItem.name, currentItem.filter);
          } else {
            myFilter.setFilter(currentItem.filter);
          }
        } else if (typeof currentItem === "function") {
          myFilter.setFilter(currentItem);
        }
      }
    } else {
      const typeOfFilters = typeof filters;
      if (typeOfFilters === "object") {
        for (const propertyName in filters) {
          if (Object.prototype.hasOwnProperty.call(filters, propertyName) && (typeof filters.propertyName === "function")) {
            myFilter.setFilter(propertyName, filters.propertyName);
          } else {
            throw new Error(`Value of the property '${propertyName}' of the given object is not a function.`)
          }
        }
      } else if (typeOfFilters === "function") {
        myFilter.setFilter(filters);
      }
    }

    const result = new Promise(function (resolve, reject) {
      try {
        myFilter.addEventListener(FilterItemChangedEvent.EventName, (event) => {
          resolve(event.detail);
        });
      } catch (error) {
        reject(error);
      }
    });
    myFilter.observe(items);
    return result;
  }
  //#endregion
}

export { FilterItemChangedEvent, ItemFilter };
