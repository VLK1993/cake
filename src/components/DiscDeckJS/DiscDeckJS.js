import Vue from "vue";
import axios from "axios";
import $ from "jquery";
export default Vue.extend({
    name:"DiscDeckJSCode",
    data(){
        return {
            discs: [],
            numberID:0,
            nameID:"",
            temptnumberID:0,
            clickedDeck: false,
            clickedDisc: true,
            swapDeck:false,
        }
    } ,
    async created() {
        try {
            const res = await axios.get("json/discs.json");
            this.discs = res.data.discs;
            console.log(res.data);
          } catch (e) {
            console.error(e);
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

        clickDisc() {
            
            //++ clickedDisc = .discWrapper
            var clickedDiscDOM = $(event.target).parents(".discWrapper");

            //HIGHLIGHT CLICKED DISC
            $(clickedDiscDOM).parent().children(".discWrapper").removeClass("active");
            $(clickedDiscDOM).addClass("active");

            //GET VALUE OF DISC
            var numberID = $(clickedDiscDOM).data("numberid");
            var nameID = $(clickedDiscDOM).data("numberid");
            var clickedDisc = true;
            var clickedDeck = false;

            this.numberID = numberID;
            this.nameID = nameID;
            this.clickedDisc = clickedDisc;
            this.clickedDeck = clickedDeck;

            return numberID & nameID & clickedDisc & clickedDeck;
        },
        clickDeck() {

            //++ clickedDeck = .deckSlot
            var clickdedDeckDOM;
            if( $(event.target).hasClass("deckSlot") ){ 
                clickdedDeckDOM = $(event.target)
            } 
            else { 
                //clicked on PIC inside DECKSLOT
                clickdedDeckDOM = $(event.target).parents("deckSlot");
            }

            //
            var clickedDeck = this.clickedDeck;
            var clickedDisc = this.clickedDisc; 

            //GET POSITION OF DECK SLOT
            //var position = $(clickdedDeck).data("position");
            
            
           //WRITE DISC TO DECK
            if (clickedDisc == true) {
                //write number id
                var numberID = this.numberID;
                $(clickdedDeckDOM).attr("data-numberid", numberID);
                $(clickdedDeckDOM).html(numberID);
                
                //end cycle
                this.clickedDeck = clickedDeck = false;
                this.clickedDisc = clickedDisc = false;
                return clickedDeck & clickedDisc;
            }
            //SWAP CYCLE
            else if ((clickedDisc == false)) {
                var deckNumberID = $(clickdedDeckDOM).data("numberid");;
                var temptnumberID;
                console.log("before if ", deckNumberID)
                if (clickedDeck == false) {
                   

                    temptnumberID = deckNumberID;
                    this.temptnumberID = temptnumberID;
                    this.clickedDeck = clickedDeck = true;
                    //start swap cycle
                    console.log("start swap");
                    console.log("deckNumberID", deckNumberID);
                    console.log("temptnumber", temptnumberID);
                    return temptnumberID & clickedDeck;
                    
                }
                else if (clickedDeck == true) {
                    
                    temptnumberID = this.temptnumberID;
                    console.log(temptnumberID);

                    $(clickdedDeckDOM).parent().find(`[data-numberid="${temptnumberID}"]`).html(deckNumberID );
                    $(clickdedDeckDOM).parent().find(`[data-numberid="${temptnumberID}"]`).attr("data-numberid",deckNumberID);
                    
                    
                    $(clickdedDeckDOM).html(temptnumberID);
                    $(clickdedDeckDOM).attr("data-numberid",temptnumberID);
                    
                    
                    
                    //end swap cycle
                    console.log("end swap");
                    this.temptnumberID = temptnumberID = 0;
                    this.clickedDeck = clickedDeck = false;
                    console.log("temptnumberID after swap ", temptnumberID)
                    return temptnumberID  & clickedDeck;
                }

            }
            


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

    }


});