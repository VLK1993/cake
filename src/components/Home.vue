<template>
  <div class="pageContainerHome">
    <div class="discordFlex">
    <div class="discordIcon"><a href="https://discord.gg/HXHQE5K"  target="_blank">
      <div class="discordLabel"> <div>Join & Kick-Flight Together</div></div>
      <img src="img/icons/server.png" /></a>
    </div>
    
    <div class="discordQA">
           <div class="question">Q1: What is inside the Discord server?</div>
           <div class="answer">• A players community<br>• Non-official English news which is made, based on Japanese in-game announcements</div>
           <div class="question">Q2: Why does it have non-official English news?</div>
           <div class="answer">• The game <b>may not</b> update non-Japanese news in real time (late an hour, a day or even a month)</div>
           <div class="question">Q3: What is the difference between official & non-official English news?</div>
           <div class="answer">• Adding untranslated information. For example: Kicker Balance (version 1.2.0)</div>
          
    </div>
    </div>
    <div class="precaution">
      <h1><img src="img/icons/exclaimationSmall.png"/>Precautions</h1>
        <p>1) This <b>is not</b> an official website.</p>
        <p>2) Description regarding to Kickers & Discs written on this website <b>can be different</b> with in-game.</p>
        <p>3) Discord invitation posted here leads to a private server, associated with this website. In other words, it <b>is not</b> official server.</p>
    
    </div>

  </div>  
</template>
<style lang="scss" scoped>
  .pageContainerHome {
    background-color:#ffdc00;
    width:100%;
    padding-top:calc(20px + (40 - 20) * ((100vw - 300px)/(1600 - 300)));;
    padding-bottom:calc(40px + (0 - 40) * ((100vw - 300px)/(1600 - 300)));;
    min-height:100vh;
      b {
      color:#C00000;
    }
  }
  .discordFlex {
    display:flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom:30px;
    width:85%;
    margin-left:auto;
    margin-right:auto;
  }
  .discordQA {
    .question {

      font-weight: bold;
      padding-left:5px;
    }
    .answer {
      color:rgb(250,250,250);
      margin-bottom:10px;
      padding-left:20px;
    }
    background-color: #323232;
    color: #ffdc00;
    text-align: left;
    padding: 10px calc(10px + (20 - 10) * ((100vw - 300px)/(1600 - 300)));
    font-size: calc(16px + (18 - 16) * ((100vw - 300px)/(1600 - 300)));
    line-height: 1.75em;
    display: inline-block;
  }
  
  .discordIcon {
    position: relative;
    display:flex;
    flex-direction: column;
    margin-top:20px;
    margin-left:10px;
    margin-right:20px;
    max-width:300px;
    a {text-decoration: none;}
    .discordLabel { 
      font-family: Verdana;
        display:inline-block;
        left: -10%;
        bottom:-10%;
        letter-spacing: -0.25px;
        color:rgb(250,250,250);
        padding:10px 20px;
        background-color:rgb(50,50,50);
        transform:rotate(-5deg) skew(-0.06turn);
        z-index: 2;
        font-size:calc(16px + (18 - 16) * ((100vw - 300px)/(1600 - 300)));
        text-transform: uppercase;
        font-weight: bold;
        div {
          transform:skew(0.06turn);
        }
     }
    img {
      position:relative;
      border-radius:5px;
      transition:filter 0.075s ease-in-out;
      border:solid rgb(50,50,50) 1.5px;
    }
    
  }
  
  .precaution {
    background-color:rgb(250,250,250);
    /*border:solid 2px rgb(50,50,50);*/
    border: 16px solid #ffdc00;
    border-image: 16 repeating-linear-gradient(45deg, black 0, black, 1em, transparent 0, transparent 2em, black 0, black 3em, transparent 0, transparent 4em);
    width:calc(65vw + (90 - 65) * ((100vw - 300px)/(1600 - 300)));;;
    margin:0 auto;
    text-align:left;
    padding:20px;
    font-size:calc(16px + (18 - 16) * ((100vw - 300px)/(1600 - 300)));;
    line-height:1.75em;
    font-weight: bold;
    b { text-decoration: underline;}
    h1 {
      text-align:center;
      margin-top:0.2em;
      margin-bottom:calc(1em + (1.5 - 1) * ((100vw - 300px)/(1600 - 300)));
      font-size:calc(1.5em + (2 - 1.5) * ((100vw - 300px)/(1600 - 300)));
      display:flex;
      align-items: center;
      justify-content: center;
      img {
        height:50px;
        margin-right:0.4em;
      }
    }
  }
@media screen and (max-width:426px) {
    .discordFlex {
      flex-direction:column;
    }
    .discordIcon {
      margin-left:auto;
      margin-right:auto;
      margin-bottom:20px;
    }


  }
</style>
<script>
export default {
    


};
</script>
