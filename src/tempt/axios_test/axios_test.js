import Vue from "vue";
import axios from "axios";
import $ from "jquery";
export default Vue.extend({
    name:"AxiosTest",
    data(){
        return {
            discs: [],

            //For Filter
            typeLists: [],
            elementLists: [],
            rarityLists: [],
            rarity: "",
            type: "",
            element: "",

            //Jsoncalled
            disc_called:{},

            //For Swap cycle
            numberID:0,
            nameID:"",
            temptnumberID:0,
            temptnameID:"",
            clickedDeck: false,
            clickedDisc: false,
            swapDeck:false,

            //For spawn UrL
            deck:{},
            deckURL:"",
        }
    } ,
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
            console.log(res.data);
          } catch (e) {
            console.error(e);
          } 
        
          
          /*
         * B. FETCH URL, get Position and Value then put it back to Deck Slot
         * Update into DECK{}
         */
        console.log(this.$route); // For you to see what's in the current object.

        // this.$route.path: get the current path of from the router's URL.
        // this.$route.query: get all the current queries data of from the router's URL.
        // There's more but you should read the Vue document.
        // Also, remind you of URL format: https://developer.mozilla.org/en-US/docs/Web/API/Location

        // It's "data". Hence, you will get an dictionary object from "this.$route.query".
        
        var queryData = Object.assign({}, this.$route.query); // We create another new object {} and copy all the things from "this.$route.query".
        
        // Check if it's not null and it's not empty.
        if (Object.keys(queryData).length !== 0  ) {
            
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
           console.log(deck);

           var deckValue = Object.values(deck); //Deck Info Value = numberID - use to look up Disc from disc -> returns Array
           var deckPos = Object.keys(deck); //Deck Info Position - use to bind with disc info later -> returns Array

           var discs = this.discs;
           var filtered = discs.filter(function (item) {
               return deckValue.indexOf(item.numberID) !== -1;
           });
          
           console.log(filtered);

           var deckIndex;
           for (deckIndex = 0; deckIndex < deckPos.length; deckIndex++) {
               var value = deckValue[deckIndex];
               var position = deckPos[deckIndex];
               $(".deckBuilder").find(`[data-position='${position}']`).attr('data-numberid', value);
           }
           for (deckIndex = 0; deckIndex < 4; deckIndex++) {
               var nameID = filtered[deckIndex]["id"];
               var matchingValue = filtered[deckIndex]["numberID"];
            
           $(".deckBuilder").find(`[data-numberid='${matchingValue}']`).html(`
               <img src="img/disc/icon/${nameID}.png" />
               
           `);
           $(".deckBuilder").find(`[data-numberid='${matchingValue}']`).attr("data-nameid",nameID);
           }
        }
        
    },
    methods: {
        goTop() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        },
        /**
         * End cycle = clicked deck = false, clicked disc = false
         * 
         * ===clicked on DISC
         * WRITE: clicked deck = false, clicked disc = true
         * 
         * ===clicked on DECK:
         * A. 
         *      clicked disc = true -> write number id 
         *      end cycle
         * B.
         *      clicked disc = false  -> does nothing
         *      B1. 
         *      clicked deck = false -> start cycle
         *       -> get numberid into tempt data
         *      B2.
         *      clicked deck = true  -> swap number ID -> end cycle
         */            

        clickDisc(event) {
            
            //++ clickedDisc = .discWrapper
            var clickedDiscDOM = $(event.target).parents(".discWrapper");

            //HIGHLIGHT CLICKED DISC
            $(clickedDiscDOM).parent().children(".discWrapper").removeClass("active");
            $(clickedDiscDOM).addClass("active");

            //GET VALUE OF DISC
            var numberID = $(clickedDiscDOM).attr("data-numberid");
            var nameID = $(clickedDiscDOM).attr("data-nameid");
            var clickedDisc = true;
            var clickedDeck = false;

            this.numberID = numberID;
            this.nameID = nameID;
            this.clickedDisc = clickedDisc;
            this.clickedDeck = clickedDeck;

            return numberID && nameID && clickedDisc && clickedDeck;
        },
        clickDeck(event) {

            //++ clickedDeck = .deckSlot
            var clickdedDeckDOM;
            if( $(event.target).hasClass("deckSlot") ){ 
                clickdedDeckDOM = $(event.target)
            } 
            else { 
                //clicked on PIC inside DECKSLOT
                clickdedDeckDOM = $(event.target).parent(".deckSlot");
            }
            //
            
            //
            var clickedDeck = this.clickedDeck;
            var clickedDisc = this.clickedDisc; 

            //GET POSITION OF DECK SLOT
            //var position = $(clickdedDeck).attr("data-position");
            
            
           //WRITE DISC TO DECK
            if (clickedDisc == true) {
                //write numberid and nameid from clicked Disc 
                var numberID = this.numberID;
                var nameID = this.nameID;
                
                //Get temptNumberID to look back to deck and remove Indeck Class. Not relate to tempt of swapcycle
                var clickednumberID = $(clickdedDeckDOM).attr("data-numberid");
                $(`.discWrapper[data-numberid="${clickednumberID}"]`).removeClass("inDeck");

                //Replace deck(numberid, nameid) with clicked Disc
                $(clickdedDeckDOM).attr("data-numberid", numberID);
                $(clickdedDeckDOM).attr("data-nameid", nameID);
                $(clickdedDeckDOM).html(`
                <img src="img/disc/icon/${nameID}.png" />
                `);

                $(`.discWrapper[data-numberid="${numberID}"]`).addClass("inDeck");
                $(`.discWrapper`).removeClass("active");
                
                //end cycle
                this.clickedDeck = clickedDeck = false;
                this.clickedDisc = clickedDisc = false;
                return clickedDeck && clickedDisc;
            }
            //SWAP CYCLE
            else if ((clickedDisc == false)) {

                //Get "clicked"
                var deckNumberID = $(clickdedDeckDOM).attr("data-numberid");
                var deckNameID = $(clickdedDeckDOM).attr("data-nameid");
                var temptnumberID;
                var temptnameID;
                
                if (clickedDeck == false) {
                   
                    this.temptnameID = temptnameID = deckNameID;
                    this.temptnumberID = temptnumberID = deckNumberID; 
                    this.clickedDeck = clickedDeck = true;

                    //start swap cycle
                    //Record the click data and write into "tempt"
                    console.log("start swap");
                    
                    return temptnumberID && temptnameID && clickedDeck;
                    
                }
                else if (clickedDeck == true) {
                    
                    //Get data from tempt
                    //Find "tempt" and overwrite with click
                    //Find "clicked" and overwrite with tempt
                    

                    temptnumberID = this.temptnumberID;
                    temptnameID = this.temptnameID;

                    $(clickdedDeckDOM).parent().find(`[data-numberid="${temptnumberID}"]`).html(
                        `<img src="img/disc/icon/${deckNameID}.png" />`
                     );
                    $(clickdedDeckDOM).parent().find(`[data-numberid="${temptnumberID}"]`).attr("data-numberid",deckNumberID);
                    
                    
                    $(clickdedDeckDOM).html(
                        `<img src="img/disc/icon/${temptnameID}.png" />`
                    );
                    $(clickdedDeckDOM).attr("data-numberid",temptnumberID);
                    
                    
                    
                    //end swap cycle
                    console.log("end swap");
                    this.temptnumberID = temptnumberID = 0;
                    this.temptnameID = temptnameID = "";
                    this.clickedDeck = clickedDeck = false;
                    
                    return temptnumberID && temptnameID && clickedDeck;
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
        },
        clearDeck() {
            $(".deckSlot").empty();
            $(".deckSlot").attr("data-numberid",0);
            $(".deckSlot").attr("data-nameid","");
            var deck = (this.deck = {});
            var deckURL = (this.deckURL = "");
            $(".discWrapper.active").removeClass("active");
            $(".discWrapper.inDeck").removeClass("inDeck");
            var chooseDisc = (this.chooseDisc = true);
      
            console.log("deck URL Removed");
            return deck & deckURL & chooseDisc;
          },
        
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
        setTimeout(this.fillDeck.bind(this), 100);

    }


});