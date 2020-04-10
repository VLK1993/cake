import Vue from "Vue";
import axios from "axios";
import _ from "lodash";
import $ from "jquery";
// We don't really need FilterItemChangedEvent
import { ItemFilter } from "@/classes/ItemFilter.js";

const filterTextAll = "ALL";

let func_filter_rarity, func_filter_element, func_filter_type;

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
            filterEngine = new ItemFilter()
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

            // Begin to observe data for filtering
            filterEngine.observe(disc);
            console.log(res.data);
        } catch (e) {
            console.error(e);
        }
        /*
         * B. FETCH URL, get Position and Value then put it back to Deck Slot
         * Update into DECK{}
         */
        var deckURLString = new URL(window.location.href).toString();
        deckURLString = deckURLString.replace("#/", "");
        /*
         * Find "?" in URL to check if shared disc link or not
         */
        var checkURL = deckURLString.search("\\?"); //I dont know why ? is \\?
        if (checkURL != -1) {
            var deckURL = new URL(deckURLString);
            //Convert URL Param into OBJ
            var deckParams = new URLSearchParams(deckURL.search.slice(1));

            var deckInfo = {}; //Deck Information including Value and Position -> returns Object
            for (let pair of deckParams.entries()) {
                deckInfo[pair[0]] = pair[1]; //push keys/values to object
            }

            var deckInfoValue = Object.values(deckInfo); //Deck Info Value = numberID - use to look up Disc from disc -> returns Array
            var deckInfoPos = Object.keys(deckInfo); //Deck Info Position - use to bind with disc info later -> returns Array

            var discs = this.discs;
            var filtered = discs.filter(function (item) {
                return deckInfoValue.indexOf(item.numberID) !== -1;
            });

            var deckIndex = 0;
            for (deckIndex; deckIndex < deckInfoPos.length; deckIndex++) {
                var value = deckInfoValue[deckIndex];
                var nameID = filtered[deckIndex].id;
                var position = deckInfoPos[deckIndex];

                //WHY WONT YOU WORK
                $(`.discWrapper[data-numberid="${value}"]`).addClass("inDeck");
                console.log(`.discWrapper[data-numberid="${value}"]`);

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
                    if (value.toUpperCase() !== filterTextAll.toUpperCase()) {
                        // Only remove the filter if the filter function is defined
                        if (func_filter_rarity) {
                            this.filterEngine.removeFilter(func_filter_rarity);
                        }
                    } else {
                        // First we try to replace the filter.
                        if (this.filterEngine.replaceFilter()) {
                            // This means the old filter has been found and replaced successfully.
                            // We do not need to do anything further.
                        } else {
                            // This means the old filter could not be found.
                            // Here, we need to add a new filter instead.
                            this.filterEngine.addFilter();
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
                    // In case it equal to "All", we remove the filter instead.
                    if (value.toUpperCase() === filterTextAll.toUpperCase()) {
                        this.filterEngine.addFilter();
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
                    // In case it equal to "All", we remove the filter instead.
                    if (value.toUpperCase() === filterTextAll.toUpperCase()) {
                        this.filterEngine.addFilter();
                    }
                }
            }
        },
        filterdisc() {
            let vm = this;

            // Let's use an array of comparer. Why?
            // - This will make it that we only "check for the current filter's param is null or not" once, then add the comparer to the list.
            // Then the we will invoke all the comparers in the list in the filter function. With this, we eliminated the null-check per-filter's query.



            const comparisions = [];
            if (this.rarity) {
                comparisions.push(function () {
                    // "this" here is the item that is being tested to the filter.
                    return this.rarity === vm.rarity;
                });
            }
            if (this.type) {
                comparisions.push(function () {
                    // "this" here is the item that is being tested to the filter.
                    return this.type === vm.type;
                });
            }
            if (this.element) {
                comparisions.push(function () {
                    // "this" here is the item that is being tested to the filter.
                    return this.element === vm.element;
                });
            }
            const totalComparision = comparisions.length;
            if (totalComparision === 0) {
                return vm.discs;
            } else {
                return _.filter(vm.discs, function (query) {
                    for (let i = 0; i < totalComparision; i++) {
                        if (!comparisions[i].call(query)) {
                            return false;
                        }
                    }
                    return true;
                });
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
        getDisc: function (event) {
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
        assignDisc: function (event) {
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
        clearDeck: function () {
            $(".discSlot").empty();
            var deck = (this.deck = {});
            var deckURL = (this.deckURL = "");
            $(".discWrapper.active").removeClass("active");
            $(".discWrapper.inDeck").removeClass("inDeck");
            var chooseDisc = (this.chooseDisc = true);

            console.log("deck URL Removed");
            return deck & deckURL & chooseDisc;
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
    }
});