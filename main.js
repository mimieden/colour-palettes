/*global $*/

//変数：displayMode
var displayMode  = "showNames";   //初期値:showNames

//変数：国別情報(日本)
var titleJp        = "Japan";     //Title
var titleColJp     = "#007BBB";   //紺碧

//変数：国別情報(イギリス)
var titleUk        = "England";   //Title
var titleColUk     = "#B4CB5E";   //spring green

/**-----------------------------------------------------------------------------
   Jason Fileの読み込み->HTMLの追加
------------------------------------------------------------------------------*/ 
function showPage(jasonFile, title, titleCol) {
  /**初期処理 ----------------------------------------------------------------*/
  
  //グリッドを非表示
  //$(".hexOut").fadeOut();
  $(".hexOut").css("display","none"); 
  
  //Footerを非表示
  //$("footer").fadeOut();
  $("footer").css("display","none"); 
  
  //HTMLからColour Gridを削除
  $(".hexColour").remove();
  
  /**Jsonデータの読み込み~HTMLの追加------------------------------------------*/
  $.getJSON(jasonFile , function(data) {
                        
    /**レコード数だけ以下の処理を繰り返す-------------------------------------*/
    var len = data.length;
    for(var i = 0; i < len; i++) {
  
      /**Colour Gridの追加----------------------------------------------------*/
      /**グリッドのテンプレートを取得-----------------------------------------*/
      $div = $("#colourGridTemplate").clone()
                                     .removeAttr("id", "colourGridTemplate")
                                     .attr("class", "hexPosition hexColour");

      /**Show Names用設定-----------------------------------------------------*/
      //共通
      $div.find(".nameJa").html(data[i].nameJa)
      $div.find(".nameEn").html(data[i].nameEn)      
      $div.find(".colourCode").html(data[i].colourCode)
      //nameEnに</br>が入っている場合、2桁表示用のclassに変更
      if ( data[i].nameEn.match("/br")) {
          $div.find(".nameEn").removeClass("single").addClass("double");
        }  
      //日本の伝統色以外の場合は、nameJaをnameJaLongに変更
      if (title != "Japan") {
        $div.find(".nameJa").attr("class", "nameJaLong name");;
      }
    
      /**Show Codes用設定 確認様URL(http://rgb.to/hex/dc9fb4)-----------------*/
      /**Show Codes用設定 Hex-------------------------------------------------*/
      $div.find(".colourCodeHex").html("Hex "+data[i].colourCode);
    
      /**Show Codes用設定 Hex>RGB(2桁ずつ16進数から10進数に変換)--------------*/
      var r = parseInt(data[i].colourCode.substring(1,3), 16);
      var g = parseInt(data[i].colourCode.substring(3,5), 16);
      var b = parseInt(data[i].colourCode.substring(5,7), 16);
      $div.find(".colourCodeRGB").html("RGB "+r+", "+g+", "+b);
   
      /**Show Codes用設定 Hex>CYMK(http://blog.penlabo.net/archives/942)------*/
      var K = Math.min(1-r/256, 1-g/256, 1-b/256);
      var k = Math.round(K*100);
      var c = Math.round((1-r/256-K)/(1-K)*100);
      var m = Math.round((1-g/256-K)/(1-K)*100);
      var y = Math.round((1-b/256-K)/(1-K)*100);
      $div.find(".colourCodeCMYK").html("CMYK "+c+", "+m+", "+y+", "+k);
    
      /**Show Codes用設定 Hex>HSV(https://www.peko-step.com/tool/hsvrgb.html)-*/
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      //Hue
      if (r == g && r == b) {
        var h = 0;
      } else if (r == max) {
        var h = Math.round(60 * (g - b) / (max-min));
       } else if (g == max) {
         var h = Math.round(60 * (b - r) / (max-min) + 120);
      } else {
        var h = Math.round(60 * (r - g) / (max-min) + 240);
      } 
      if (h < 1) {
        h += 360
      } 
    
      //Satulation
      var s = Math.round((max-min)/max*100);
    
      //Value(Brightness)
      var v = Math.round(max/256 * 100);
      console.log("H:" + h + "  S:" + s + "  V:" + v);
      $div.find(".colourCodeHSV").html("HSV "+h+", "+s+", "+v);
  
      //グリッドの色
      $div.find(".hexOut").css("background-color", data[i].colourCode);
      
      //白に近い色(低彩度/高明度色)の対応
      //if (s < 5 && v > 95) {
      //}
  
      // 編集したグリッドをHTMLに追加
      $div.appendTo("#hexInGrid");
    }
    /**(End)レコード数だけ以下の処理を繰り返す--------------------------------*/
    
    /**Head Titleの更新-------------------------------------------------------*/
    $("title").html("Colour Palettes | Traditional Colours of " + title);
    
    /**Title Gridの表示-------------------------------------------------------*/
    $(".pageTitle4").html(title);
    $(".hexOutTitle").css("background-color", titleCol);
    //$(".hexOut").css("display","block");
    $(".hexOut").fadeIn();
    
    /**Footerの表示-----------------------------------------------------------*/
    $("footer").fadeIn();
    
    /**hoverで反転(もともとあるgridにしか効かない→getJason内に移動------------*/
    $(".hexColour").hover(
      function () {
        if  (displayMode == "showColours") {
          $(this).find(".hexInColour").css("display","block");
        } else {
          $(this).find(".hexInColour").css("display","none");          
        }
      },
      function () {
        if  (displayMode == "showColours") {
          $(this).find(".hexInColour").css("display","none");
        } else {
          $(this).find(".hexInColour").css("display","block");
        }
      }
    );
  });
}
  
/**-----------------------------------------------------------------------------
   DOM読み込み完了時の処理
------------------------------------------------------------------------------*/
$(function() {
  
  /**初期処理(#の初期値設定+ページ表示)---------------------------------------*/
  //window.onloadに移動
  //if (window.location.hash == "") {
  //  window.location.hash = "JP" ;
  //}
  
  /**タブメニューの設定-------------------------------------------------------*/
  $('#showNames').click(function(){
     if (displayMode == "showNames") {
       return false;
     } else {
       displayMode = "showNames"
       $(".hexInColour").css("display","block");
       $(".name").css("display","block");
       $(".code").css("display","none");

       $("#showColours").parent().removeAttr("id", "active");
       $("#showCodes").parent().removeAttr("id", "active");
       $("#showNames").parent().attr("id", "active");
       displayMode = "showNames";
     }
  });
  
  $('#showColours').click(function(){
     if (displayMode == "showColours") {
       return false;
     } else {
       displayMode = "showColours"
       $(".hexInColour").css("display","none");
       $("#showNames").parent().removeAttr("id", "active");
       $("#showCodes").parent().removeAttr("id", "active");
       $("#showColours").parent().attr("id", "active");
     }
  });

  $('#showCodes').click(function(){
     if (displayMode == "showCodes") {
       return false;
     } else {
       displayMode = "showCodes"
       $(".hexInColour").css("display","block");
       $(".name").css("display","none");
       $(".code").css("display","block");
       $("#showColours").parent().removeAttr("id", "active");
       $("#showNames").parent().removeAttr("id", "active");
       $("#showCodes").parent().attr("id", "active");
     }
  });  

  //グリッドの色の設定
  $(".hexOutTitle").css({
    "background-color": colTitleGrid,
  });
});

/**-----------------------------------------------------------------------------
    イベント: URLの#以降が変化したら
------------------------------------------------------------------------------*/
window.onhashchange = function() {
  /**日本の伝統色の編集&表示--------------------------------------------------*/
  if (window.location.hash == "#JP") {
    //TitleGrid/Colour Gridの編集&表示
    showPage("colour/japan.json", titleJp, titleColJp);
  /**イギリスの伝統色の編集&表示----------------------------------------------*/  
  } else if (window.location.hash == "#UK") {
    //TitleGrid/Colour Gridの編集&表示
    showPage("colour/uk.json", titleUk, titleColUk);
  /**その他の場合→日本の伝統色の表示に飛ばす----------------------------------*/
  } else {
    window.location.hash = "JP" ;
  }
};

window.onload = function() {
  /**日本の伝統色の編集&表示--------------------------------------------------*/
  if (window.location.hash == "#JP") {
    //TitleGrid/Colour Gridの編集&表示
    showPage("colour/japan.json", titleJp, titleColJp);
  /**イギリスの伝統色の編集&表示----------------------------------------------*/  
  } else if (window.location.hash == "#UK") {
    //TitleGrid/Colour Gridの編集&表示
    showPage("colour/uk.json", titleUk, titleColUk);
  /**その他の場合→日本の伝統色の表示に飛ばす----------------------------------*/
  } else {
    window.location.hash = "JP" ;
  }
}