import Vue from "vue";
import axios from "axios";
//import $ from "jquery";
export default Vue.extend({
    name:"DiscDeckJSCode",
    data(){
        return {
            discs: [],
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