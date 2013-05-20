/*
 * INVENKTION.PageShowManager
 * author: Marco Uberti 
 * date:   April, 2013
 * 
 * 		Manager che gestisce gli eventi di cambiamento pagine
 * 
 */
(function($, exports){
	
	//Metodi e variabili private
	
	//Gestione visibilità pagina, per abilitare e disabilitare il suono in automatico
	//o tutte quelle cose che vanno stoppate, ad esempio il tempo
	var hidden, visibilityState, visibilityChange;
	var music = document.getElementById("music");
	if (typeof document.hidden !== "undefined") {
	        hidden = "hidden"; visibilityChange = "visibilitychange"; visibilityState = "visibilityState";
	}
	else if (typeof document.mozHidden !== "undefined") {
	        hidden = "mozHidden"; visibilityChange = "mozvisibilitychange"; visibilityState = "mozVisibilityState";
	}
	else if (typeof document.msHidden !== "undefined") {
	        hidden = "msHidden"; visibilityChange = "msvisibilitychange"; visibilityState = "msVisibilityState";
	}
	else if (typeof document.webkitHidden !== "undefined") {
	        hidden = "webkitHidden"; visibilityChange = "webkitvisibilitychange"; visibilityState = "webkitVisibilityState";
	}
	
	document.addEventListener(visibilityChange, function() {
	        console.log("hidden: " + document[hidden]);
	        console.log(document[visibilityState]);
	
	        switch (document[visibilityState]) {
	        case "visible":
	        	INVENKTION.SoundManager.playBackgroundMusic();
	        	//Faccio ripartire se e solo se non è aperto un POPUP
				if($('.MS_popUpContainer').css("display") != "block") {
					 INVENKTION.TimerManager.resume();
				}
	            break;
	        case "hidden":
	        	INVENKTION.SoundManager.stopBackgroundMusic();
	        	INVENKTION.TimerManager.pause();
	            break;
	        }
	});
	
	//Impedisco di scrollare la pagina
	document.addEventListener("touchstart", function(e){e.preventDefault();}, false);
	document.addEventListener("touchmove", function(e){e.preventDefault();}, false);
	document.addEventListener("touchend", function(e){e.preventDefault();}, false);
	document.addEventListener("touchcancel", function(e){e.preventDefault();}, false);
	
	//Modello che contiene i tag fino ad ora ricevuti (una sorta di cache per i miei controlli e matching)
	var currentPage;
	
	//Evento dopo che la pagina è stata lasciata
	$(document).bind('pagehide', function(event){
		currentPage = $(event.target).attr("id");
		if(currentPage == 'canvas') {
			console.log("fermo eventuale worker timer");
			INVENKTION.TimerManager.stop();
		}
	});
	
	//Con questo metodo riesco a intercettare quando una pagina sta per essere mostrata
	//e di conseguenza fare gli aggiornamenti alla UI del caso
	$(document).bind('pagebeforeshow', function(event){
		currentPage = $(event.target).attr("id");
	});

	//Il nostro oggetto da esporre
	var mod = {
			getCurrentPage: function(){
				return currentPage;
			},
			//Setto il PopUp
			popUpStart: function (msg) {
		    	//Variabili
		    	_W = window.innerWidth*0.6;
		    	_H = window.innerHeight*0.7;
		    	
		    	//Carico il contenuto
		    	$('.MS_popUpInn').html(msg);
		    	//Visualizzo il popUp con qualche effetto speciale
		    	$('.MS_popUpContainer').show(100, function() {
		    		// Animation complete.
		    		$('.MS_popUp').animate({
		    			left:(window.innerWidth/2)-(_W/2),
		    			top:(window.innerHeight/2)-(_H/2),
		    			width: _W,
		    			height: _H
		    		}, 100, function() {
		    			//Animation Complete
		    			$('.MS_popUpInn').show('fast');
		    		});
		    	});
		    },
		    popUpClose: function  () {
				$('.MS_popUpInn').hide(100);
				$('.MS_popUpContainer').hide(100);
			}
	};

	//Espongo nel global object
	exports.INVENKTION.PageShowManager = mod;
})(jQuery, window);
	
