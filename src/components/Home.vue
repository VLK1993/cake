<template>
  <div class="pageContainerHome">

    <div class="precaution">
      <h1><img src="img/icons/exclaimationSmall.png"/>Precautions</h1>
        <p>1) This <b>is not</b> an official website.</p>
        <p>2) Description regarding to Kickers & Discs written on this website <b>can be different</b> with in-game.</p>
        <p>3) Discord invitation posted here leads to a private server, associated with this website. In other words, it <b>is not</b> official server.</p>
    
    </div>
    <div class="discordLink">
          <h2 class="discordLabel">Discord Server</h2>
           <div class="discordIcon"><a href="https://discord.gg/HXHQE5K"  target="_blank"><img src="img/icons/server.png" /></a></div>
           <div class="discordLinkText">
           <p>Q: What is inside the Discord server?</p>
           <p>• A players community<br>• English translated news which is made, based on Japanese in-game announcements</p>
           <p>※It is recommended one should play Kick-Flight with Japanese language, because the game <b>doesn't provide enough</b> news in other languages</p>
           </div>
         </div>
    </div>  
   
</template>
<style lang="scss" scoped>
  .pageContainerHome {
    background-color:#ffdc00;
    min-height:1000px;
    width:100%;
    padding-top:20px;
    padding-bottom:20px;
      b {
      color:#C00000;
    }
  }
  .discordLink {
    background-color:rgb(250,250,250);
    border:solid 2px rgb(50,50,50);
    width:75vw;
    padding:20px;
    margin:calc(1vw + 2vh) auto;
    display:grid;
    grid-gap:10px;
    grid-template-areas:
    "discordIcon discordLabel"
    "discordIcon discordLinkText"
    ;
  }
  .discordLabel {
    grid-area:discordLabel;
    margin-bottom:10px;
    margin-top:0;
  }
  .discordIcon {
    grid-area:discordIcon;
    align-self: center;
    img {
      border-radius:5px;
      filter:drop-shadow(10px 10px 0 #4444dd);
      transition:filter 0.075s ease-in-out;
      border:solid rgb(50,50,50) 1.5px;
    }
    &:hover {
      img {
        filter:drop-shadow(10px 10px 0 #dd4444);
      }
    }
  }
  .discordLinkText {
    text-align:left;
    padding:0 calc(10px + (20 - 10) * ((100vw - 300px)/(1600 - 300)));
    grid-area:discordLinkText;
    font-size:calc(16px + (18 - 16) * ((100vw - 300px)/(1600 - 300)));
    line-height:1.75em;
  }
  .precaution {
    background-color:rgb(250,250,250);
    border:solid 2px rgb(50,50,50);
    width:75vw;
    margin:0 auto;
    text-align:left;
    padding:20px;
    font-size:calc(16px + (18 - 16) * ((100vw - 300px)/(1600 - 300)));;
    line-height:1.75em;
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
  .discordLink {
    grid-template-areas:
    "discordLabel"
    "discordIcon"
    "discordLinkText"
    ;
  }


}
</style>
<script>
export default {};
</script>
