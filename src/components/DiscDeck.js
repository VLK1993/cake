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
      filterEngine: {}
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
      console.log(this.filterEngine);

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
          if (value.toUpperCase() == filterTextAll) {
            // Only remove the filter if the filter function is defined
            this.filterEngine.removeFilter("filter_by_type");
          } else {
            try {
              // Directly set the anonymous arrow function as filter function, given it a name.
              this.filterEngine.setFilter("filter_by_type", (itemToBeChecked) => (itemToBeChecked.type == value));
            } catch (error) {
              // There is no way error would happen here as we use the syntax correctly.
              // But I still do it for the sake of example.
              console.error(error);
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
          if (value.toUpperCase() == filterTextAll) {
            // Only remove the filter if the filter function is defined
            this.filterEngine.removeFilter("filter_by_element");
          } else {
            try {
              // Directly set the anonymous arrow function as filter function, given it a name.
              this.filterEngine.setFilter("filter_by_element", (itemToBeChecked) => (itemToBeChecked.element == value));
            } catch (error) {
              // There is no way error would happen here as we use the syntax correctly.
              // But I still do it for the sake of example.
              console.error(error);
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
          if (value.toUpperCase() == filterTextAll) {
            // Only remove the filter if the filter function is defined
            this.filterEngine.removeFilter("filter_by_rarity");
          } else {
            try {
              // Directly set the anonymous arrow function as filter function, given it a name.
              this.filterEngine.setFilter("filter_by_rarity", (itemToBeChecked) => (itemToBeChecked.rarity == value));
            } catch (error) {
              // There is no way error would happen here as we use the syntax correctly.
              // But I still do it for the sake of example.
              console.error(error);
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
      if (
        Object.prototype.hasOwnProperty.call(detailObj, "addedItems") &&
        Object.prototype.hasOwnProperty.call(detailObj, "removedItems")
      ) {
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
      var positions = ["p1", "p2", "p3", "p4"];
      var index = 0;

      for (index; index < 5; index++) {
        var position = positions[index];

        var value = $(".deckBuilder")
          .find(`[data-position='${position}']`)
          .data("numberid");

        $(`.discWrapper[data-numberid="${value}"]`).addClass("inDeck");
      }
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
