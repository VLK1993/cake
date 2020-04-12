import Vue from "vue";
import axios from "axios";
import $ from "jquery";

import { FilterItemChangedEvent, ItemFilter } from "@/classes/ItemFilter.js";

// toUpperCase() of "" (empty string) does actually nothing.
// This is actually to tell you that in case if it's not empty
// It should be all upper case or the filterText might not match.
const filterTextAll = "".toUpperCase();

// Export an object out.
// With this, the syntax "import <VariableName> from './path/to/this/js-file.js'" will make the "<VariableName>" got the exported object here.
// Check out the DiskDeck.vue's script for the living example.
// Also, "Vue.extend" because it's recommended way to make a Vue object. Don't juse export a plain object.
// Instead, export 'an object that is inherit from Vue class'. You can do that through "class inheritance declaration" or through "Vue.extend(myPlainObject)".
export default Vue.extend({
    name: "DiscDeck",
    data() {
        return {
            typeLists: [],
            elementLists: [],
            rarityLists: [],
            rarity: "",
            type: "",
            element: "",
            discs: [],
            activeDiscValue: {},
            deck: {},
            chooseDisc: true,
            deckURL: "",
            filterEngine: {},
            func_filter_rarity: Function,
            func_filter_element: Function,
            func_filter_type: Function
        };
    },
    async created() {
        /*
         *A. GET JSON FILE and form filter around it
         */
        try {
            const res = await axios.get("json/discs.json");

            // cook the list of elements on the fly
            const disc = res.data.discs,
                elementLists = this.elementLists,
                rarityLists = this.rarityLists,
                typeLists = this.typeLists;

            const function_dataCooker = function (discData, propertyName) {
                if (discData.hasOwnProperty(propertyName)) {
                    const data = discData[propertyName];
                    if (!this.includes(data)) {
                        this.push(data);
                    }
                }
            };

            for (const discData of disc) {
                function_dataCooker.call(elementLists, discData, "element");
                function_dataCooker.call(rarityLists, discData, "rarity");
                function_dataCooker.call(typeLists, discData, "type");
            }
            // Finished cooking.
            // This is to ensure that all the elements, rarities and types that fetched from the JSON data. Will be listed in the variables.
            // In the future, in case you add more elements or rarities or types, it will just appear in the variable without code changes.

            this.discs = disc;

            // We workaround the [Observer] object problem by setting the object instance directly here.
            this.filterEngine = new ItemFilter();
            // We register the event before anything.
            this.filterEngine.addEventListener(
                FilterItemChangedEvent.EventName,
                this.onFilterUpdated
            );

            // Begin to observe data for filtering
            this.filterEngine.observe(disc);
            // console.log(res.data);
        } catch (e) {
            console.error(e);
        }
        /*
         * B. FETCH URL, get Position and Value then put it back to Deck Slot
         * Update into DECK{}
         */
        // Using "window.location.href" is not prefered. We're having Vue on top.
        // So use VueRouter's instead.
        console.log(this.$route); // For you to see what's in the current object.

        // this.$route.path: get the current path of from the router's URL.
        // this.$route.query: get all the current queries data of from the router's URL.
        // There's more but you should read the Vue document.
        // Also, remind you of URL format: https://developer.mozilla.org/en-US/docs/Web/API/Location

        // It's "data". Hence, you will get an dictionary object from "this.$route.query".
        var queryData = Object.assign({}, this.$route.query); // We create another new object {} and copy all the things from "this.$route.query".
        // Check if it's not null and it's not empty.
        if (queryData) {

            // Let's use the dictionary object.
            // The dictionary has "propertyName" as the "key"
            // and "propertyValue" as "value"
            /* Example: If your query string is "?key=value&key2=value2". The dictionary will be:
            {
                "key": "value",
                "key2": "value2"
            }
            */

            var deck = {}; //Deck Information including Value and Position -> returns Object
            for (const key in queryData) {
                deck[key] = queryData[key];
            }



            var deckValue = Object.values(deck); //Deck Info Value = numberID - use to look up Disc from disc -> returns Array
            var deckPos = Object.keys(deck); //Deck Info Position - use to bind with disc info later -> returns Array

            var discs = this.discs;
            var filtered = discs.filter(function (item) {
                return deckValue.indexOf(item.numberID) !== -1;
            });
            var deckIndex = 0;
            for (deckIndex; deckIndex < deckPos.length; deckIndex++) {
                var value = deckValue[deckIndex];
                var position = deckPos[deckIndex];
                var nameID = filtered[deckIndex]["id"];

                $(".deckBuilder").find(`[data-position='${position}']`).attr('data-numberid', value);
                $(".deckBuilder").find(`[data-position='${position}']`).addClass("active");
                $(".deckBuilder").find(`[data-position='${position}']`).html(`
              <img src="img/disc/icon/${nameID}.png" />
            `);
            
            }
            
        }
    },
    computed: {
        // Define a field with getter and setter:
        // When you declare a field with this pattern, it will tell Vue to treat the declared field as:
        // - Invoke getter function when it is trying to get the field. Example:
        //   var myValue = myobject.filterting_type; // This will make JS engine invoke getter function of the "filterting_type" field.
        // - Invoke setter function when it is trying to set a value to the field. Example:
        //   myobject.filterting_type = something; // This will make JS engine invoke setter function of the "filterting_type" field. With the value data "something" as the first param of the setter function.
        // Note: Is is possible to declare a field with getter and setter through "class declaration" and "Object.defineProperty" method. Vue uses these internally so we can do this and Vue will take care of it.
        filterting_type: {
            get() {
                // Returns the current "type" filtering.
                return this.type;
            },
            set(value) {
                // Check if the current "type" filtering is different from the new value.
                // We only need to make changes on new value.
                if (this.type !== value) {
                    this.type = value;

                    // We only add new filter it's not equal to "All",
                    if (value.toUpperCase() === filterTextAll) {
                        // Only remove the filter if the filter function is defined
                        if (this.func_filter_type) {
                            this.filterEngine.removeFilter(this.func_filter_type);
                        }
                       } else {
                        // Create a new filter
                        const filter_func = function (itemToBeChecked) {
                            return itemToBeChecked.type == value;
                        };
                        // First we try to replace the filter.
                        // "replaceFilter" will immediately return false in case the given param is null or empty or undefined
                        if (
                            this.filterEngine.replaceFilter(this.func_filter_type, filter_func)
                        ) {
                            // This means the old filter has been found and replaced successfully.
                            // We do not need to do anything further.
                            // Except remember the new defined filter.
                            this.func_filter_type = filter_func;
                        } else {
                            // This means the old filter could not be found.
                            // Here, we need to add a the filter instead.
                            this.func_filter_type = filter_func;
                            this.filterEngine.addFilter(filter_func);
                        }
                    }
                }
            }
        },
        filterting_element: {
            get() {
                // Returns the current "element" filtering.
                return this.element;
            },
            set(value) {
                // Check if the current "element" filtering is different from the new value.
                // We only need to make changes on new value.
                if (this.element !== value) {
                    this.element = value;

                    // We only add new filter it's not equal to "All",
                    if (value.toUpperCase() === filterTextAll) {
                        // Only remove the filter if the filter function is defined
                        if (this.func_filter_element) {
                            this.filterEngine.removeFilter(this.func_filter_element);
                        }
                    } else {
                        // Create a new filter
                        const filter_func = function (itemToBeChecked) {
                            return itemToBeChecked.element == value;
                        };
                        // First we try to replace the filter.
                        // "replaceFilter" will immediately return false in case the given param is null or empty or undefined
                        if (
                            this.filterEngine.replaceFilter(this.func_filter_element, filter_func)
                        ) {
                            // This means the old filter has been found and replaced successfully.
                            // We do not need to do anything further.
                            // Except remember the new defined filter.
                            this.func_filter_element = filter_func;
                        } else {
                            // This means the old filter could not be found.
                            // Here, we need to add a the filter instead.
                            this.func_filter_element = filter_func;
                            this.filterEngine.addFilter(filter_func);
                        }
                    }
                }
            }
        },
        filterting_rarity: {
            get() {
                // Returns the current "rarity" filtering.
                return this.rarity;
            },
            set(value) {
                // Check if the current "rarity" filtering is different from the new value.
                // We only need to make changes on new value.
                if (this.rarity !== value) {
                    this.rarity = value;

                    // We only add new filter it's not equal to "All",
                    if (value.toUpperCase() === filterTextAll) {
                        // Only remove the filter if the filter function is defined
                        if (this.func_filter_rarity) {
                            this.filterEngine.removeFilter(this.func_filter_rarity);
                        }
                    } else {
                        // Create a new filter
                        const filter_func = function (itemToBeChecked) {
                            return itemToBeChecked.rarity == value;
                        };
                        // First we try to replace the filter.
                        // "replaceFilter" will immediately return false in case the given param is null or empty or undefined
                        if (
                            this.filterEngine.replaceFilter(this.func_filter_rarity, filter_func)
                        ) {
                            // This means the old filter has been found and replaced successfully.
                            // We do not need to do anything further.
                            // Except remember the new defined filter.
                            this.func_filter_rarity = filter_func;
                        } else {
                            // This means the old filter could not be found.
                            // Here, we need to add a the filter instead.
                            this.func_filter_rarity = filter_func;
                            this.filterEngine.addFilter(filter_func);
                        }
                    }
                }
            }
        }
    },
    methods: {
        goTop() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        },
        /*
         * Function making Discs go YELLOW on CLICK
         */
        getDisc(event) {
            var activeDisc = $(event.target).parents(".discWrapper");
            $(activeDisc)
                .parent()
                .children(".discWrapper")
                .removeClass("active");
            $(activeDisc).addClass("active");

            var activeDiscNumberID = $(activeDisc).data("numberid");
            var activeDiscNameID = $(activeDisc).data("nameid");
            var chooseDisc = (this.chooseDisc = false);
            var activeDiscValue = (this.activeDiscValue = {
                activeDiscNameID: activeDiscNameID,
                activeDiscNumberID: activeDiscNumberID
            });

            return activeDiscValue && chooseDisc;
        },
        /*
         * 1. RECORD ACTIVE DISC TO DECK
         * 2. UPDATE DECK {}
         * 3. SPAWN URL BASED ON DECK {}
         */
        assignDisc(event) {
            var activeDiscValue = this.activeDiscValue;
            var chooseDisc = this.chooseDisc;

            /*
             * chooseDisc = fault -> after clicking on Disc Area
             * chooseDisc = true  -> after clicking on Deck Area
             */
            if (chooseDisc == false) {
                var deckSlot = event.target;
                var deckSlotPosition = deckSlot.dataset.position;

                $(".discWrapper.active").addClass("inDeck");
                $(".discWrapper.active").removeClass("active");

                deckSlot.innerHTML = `
            <img src="img/disc/icon/${activeDiscValue.activeDiscNameID}.png" />
            `;
                var deck = this.deck; //get current deck object from data
                var updateDeck = {
                    [deckSlotPosition]: activeDiscValue.activeDiscNumberID
                }; //get current position and disc
                deck = this.deck = Object.assign(deck, updateDeck); //merge dem
                chooseDisc = this.chooseDisc = true;

                var deckURL = window.location.href.split("?")[0] + "?" + $.param(deck); // MAKE DECK URL BASED ON DECK
                this.deckURL = deckURL;

                console.log(deck);
                console.log(deckURL);
                return deck & chooseDisc & deckURL;
            }
        },
        clearDeck() {
            $(".discSlot").empty();
            var deck = (this.deck = {});
            var deckURL = (this.deckURL = "");
            $(".discWrapper.active").removeClass("active");
            $(".discWrapper.inDeck").removeClass("inDeck");
            var chooseDisc = (this.chooseDisc = true);

            console.log("deck URL Removed");
            return deck & deckURL & chooseDisc;
        },
        onFilterUpdated(event) {
            const detailObj = event.detail;
            if (Object.prototype.hasOwnProperty.call(detailObj, "addedItems") &&
                Object.prototype.hasOwnProperty.call(detailObj, "removedItems")) {
                const theDiv = document.querySelector(".discGridContainer .discGrid");
                if (theDiv) {
                    const theItemBecomeVisibleFromInvisible = detailObj.addedItems;
                    let loopTotal = theItemBecomeVisibleFromInvisible.length;

                    if (loopTotal !== 0) {
                        for (let i = 0; i < loopTotal; i++) {
                            const element = theDiv.querySelector(
                                '.discWrapper[data-nameid="' +
                                theItemBecomeVisibleFromInvisible[i].id +
                                '"]'
                            );
                            if (element) {
                                element.classList.remove("filterHidden");
                            }
                        }
                    }

                    const theOtherwise = detailObj.removedItems;
                    loopTotal = theOtherwise.length;
                    if (loopTotal !== 0) {
                        for (let i = 0; i < loopTotal; i++) {
                            const element = theDiv.querySelector(
                                '.discWrapper[data-nameid="' + theOtherwise[i].id + '"]'
                            );
                            if (element) {
                                element.classList.add("filterHidden");
                            }
                        }
                    }
                }
            }
        },
        fillDeck() {
            //WHY WONT YOU WORK
            var positions = ["p1", "p2", "p3", "p4"]
            var index = 0;

            for (index; index < 5; index++) {
                var position = positions[index];

                var value = $(".deckBuilder").find(`[data-position='${position}']`).data("numberid");
                $(`.discWrapper[data-numberid="${value}"]`).addClass("inDeck");

            };


        }
    },
    mounted() {
        //Go TOP BUTTON
        var buttonGoTop = document.getElementById("buttonGoTop");

        window.onscroll = function () {
            if (
                document.body.scrollTop > 20 ||
                document.documentElement.scrollTop > 20
            ) {
                buttonGoTop.style.display = "block";
            } else {
                buttonGoTop.style.display = "none";
            }
        };
        //SET TIMEOUT TO MAKE IT RUN AFTER DISC LIST LOADED
        setTimeout(() => {
            this.fillDeck();
        }, 0);

    }
});
