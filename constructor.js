function Modals ( params ) {
    //
    if ( !params ) { alert ('Конструктор не работает без параметров'); return; }
    this._type = params.type || 'fadow';
    this.callback = params.callback || function () {};
    var winElementType = ( params.type === 'alert' || params.type === 'fadow' ) ? 'section' : 'form';
    this.win = document.createElement ( winElementType );
    this.win.parentObject = this;
    //
    this.inputDataType = ( params.type === 'prompt' ) ? ( params.inputDataType || 'text' ) : null;
    
    this.text = params.text || '';
    this.iconURL = params.iconURL || this.defaultIconURL;
    this.headLineText = params.headLineText || this.defaultHeadLineText;
    //
    this.contentElement = this.buildContent ();
    this.win.appendChild ( this.contentElement );
    this.headerElement  = this.buildHeader ();
    this.win.appendChild ( this.headerElement );
    //
    document.body.appendChild ( this.win );
    this.win.className = "modalWin";
    //
    this.resizeWin = function () {
        //
        if ( !this.win ) return;
        var w = Math.round ( window.innerWidth * 0.6 ) -  40;
        var cw = Math.round ( this.contentElement.boundingRect.width ) + 40;
        this.contentElement.style.width  = Math.min ( w, cw ) + "px";
        var h = Math.round ( window.innerHeight * 0.8 ) - 100;
        var ch = Math.round ( this.contentElement.boundingRect.height ) + 20;
        this.contentElement.style.height = Math.min ( h, ch ) + "px";
        
        if ( this.navElement ) {
            this.navElement.style.top = this.contentElement.boundingRect.height + 50 + "px";
        }
        
        var rect = this.win.getBoundingClientRect ();
        var _top = Math.round ( ( window.innerHeight - rect.height ) / 2 );
        var _left = Math.round ( ( window.innerWidth - rect.width ) / 2 );
        this.win.style.top = _top + "px";
        this.win.style.left = _left + "px";
    };
    
    var funcResize = this.resizeWin.bind ( this );
    //
    window.addEventListener ( 'resize', funcResize );
    //
    switch ( this._type ) {
            case 'fadow':
                this.fadowWin ();
                break;
            case 'alert':
                this.alertWin ();
                break;
            case 'confirm':
                this.confirmWin ();
                break;
            case 'prompt':
                switch ( this.inputDataType ) {
                    case 'radio':
                        this.radioButtonsData = params.radioButtonsData;
                        this.radioButtonsWin ();
                        break;
                    case 'textarea':
                        this.textareaWin ();
                        break;
                    case 'checkbox':
                        this.checkboxData = params.checkboxData;
                        this.checkboxWin ();
                        break;
                    default:
                        this.promptWin ();
                        break;
                }
                break;
            default:
                break;
    }
}

Modals.prototype.defaultIconURL = "https://drive.google.com/uc?export=download&id=0BxaMB69y7fvSQjJCSm9vRndINkE";
Modals.prototype.defaultHeadLineText = "Филиппова Ірина Гаріївна";
//
// ================================================================== build Modal Header
Modals.prototype.buildHeader = function () {
//        
        var headLine = document.createElement ( 'div' );
        headLine.innerHTML = this.headLineText;
        headLine.className = "modal_header";
        //
        var ico = document.createElement ('img');
        ico.src = this.iconURL;
        ico.className = "modal_header_ico";
        
        headLine.appendChild (ico);
        
        return headLine;
        
};
// ================================================================== build Modal Content
Modals.prototype.buildContent = function () {
        //
        var content = document.createElement ( 'article' );
        content.innerHTML = this.text;
        content.className = 'modal_content';
        document.body.appendChild( content );
        content.boundingRect = content.getBoundingClientRect ();
        var w = Math.round ( window.innerWidth * 0.6 )  -  40;
        var cw = Math.round ( content.boundingRect.width )  + 40;
        content.style.width  = Math.min ( w, cw ) + "px";
        content.boundingRect =  content.getBoundingClientRect();
        console.log ('content.boundingRect: ', content.boundingRect);
        var h = Math.round ( window.innerHeight * 0.8 ) - 100;
        var ch = Math.round ( content.boundingRect.height );
        content.style.height = Math.min ( h, ch ) + "px";
        content.style.overflow = "auto";
        //
        return content;
};
//
// ================================================================== build Nav
Modals.prototype.buildNav = function ( buttons ) {
        //
        var nav = document.createElement ( 'nav' );
        for ( var i = 0; i < buttons.length; i++ ) { nav.appendChild ( buttons [i] ); }
        //
        return nav;
};
//
// ================================================================== alert
//
Modals.prototype.alertWin = function () {
        //
        var but = document.createElement('button');
        but.innerHTML ="Закрыть";
        but.onclick = function ( event ) {
            //
            // event.target == but; event.target.parentNode == this.nav; event.target.parentNode.parentNode == this.win
            //
            var win = event.target.parentNode.parentNode;
            win.parentNode.removeChild ( win );
        }
        this.navElement = this.buildNav ( [ but ] );
        this.win.appendChild ( this.navElement );
        
        this.resizeWin ();
        
};

// ================================================================== create modal window
Modals.prototype.createModal = function () {
        
        document.body.appendChild ( this.win );
        this.win.addEventListener( "answerIsReady", this.callback );
        
        this.win.onsubmit = function ( event ) { event.preventDefault(); }
        
        this.win.changeAnswer = function ( val ) {
            document.modalWinAnswer = val;
            var event = new CustomEvent ( "answerIsReady", { detail: val } );
            this.dispatchEvent ( event );
            this.removeEventListener( "answerIsReady", this.callback );
            
            try { this.parentNode.removeChild ( this ); }
            catch ( err ) {
                var win = document.querySelector("form.modalWin");
                win.parentNode.removeChild ( win );
            }
        };
};

// ================================================================== confirm

Modals.prototype.confirmWin = function () {
        
        this.createModal ();
        
        var submitButton = document.createElement('input');
        submitButton.type = "submit";
        submitButton.value ="OK";
        submitButton.onclick = function ( event ) {
            var win = event.target.parentNode.parentNode;
            win.changeAnswer ( true );
        };
        var cancelButton = document.createElement('input');
        cancelButton.type = 'button';
        cancelButton.value ="Отменить";
        cancelButton.onclick = function ( event ) {
            var win = event.target.parentNode.parentNode;
        this.resizeWin ();
};

            win.changeAnswer ( false );
        };
        this.navElement = this.buildNav ( [ submitButton, cancelButton ] );
        this.win.appendChild ( this.navElement );
        
// ================================================================== prompt

Modals.prototype.promptWin = function () {
        
        this.createModal ();
        this.inputData = document.createElement('input');
        this.inputData.type = this.inputDataType;
        this.inputData.value ="";
        this.inputData.enable = true;
        this.inputData.winWidth = this.win.getBoundingClientRect().width;
        this.inputData.oninput = function ( event ) {
            
            var obj = event.target.parentNode.parentNode;
            if ( obj.parentObject.inputDataType === 'date' || obj.parentObject.inputDataType === 'color' ) { return; }
            var chars = event.target.value.length;
            var len = 20 + chars * 5;
            
            if ( len < window.innerWidth * 0.8 - 80 ) {
                event.target.style.width = len + "px";
                if ( event.target.winWidth < len + 80 ) {
                    obj.style.width = len + 80 + "px";
                    obj.parentObject.resizeWin ();
                }
            } else {
                if ( event.target.enable ) {
                    var content = obj.parentObject.contentElement;
                    content.innerHTML += '<p style="color:red; text-align:right; width:90%;">Зачем так много букв? Нужно быть лаконичнее...</p>';
                    content.style.width = len + "px";
                    event.target.enable = false;
                }
            }
        }
        this.inputData.onchange = function ( event ) {
            
            var win = event.target.parentNode.parentNode;
            if ( win.parentObject.inputData.type == 'text' ) {
                win.parentObject.readyButton.onclick = "";
                win.changeAnswer ( event.target.value );
            }
        };
        this.readyButton = document.createElement('input');
        this.readyButton.type = 'submit';
        this.readyButton.value ="OK";
        this.readyButton.onclick = function ( event ) {
            var win = event.target.parentNode.parentNode;
            win.changeAnswer ( win.parentObject.inputData.value );
        };
        this.navElement = this.buildNav ( [ this.win.parentObject.inputData, this.win.parentObject.readyButton ] );
        this.win.appendChild ( this.navElement );
        
        this.resizeWin ();
};
// ===================================================================== building a set of radio buttons or checkboxes
Modals.prototype.buildRadioOrCheckButtons = function ( buttonsData, $type ) {
    
    var inputElements = [];
    var _type = ( $type == 'radio' || $type == 'checkbox') ? $type : 'checkbox';
    var maxChars = 0;
    
    for ( var i = 0; i < buttonsData.length; i++ ) {
        maxChars = Math.max ( maxChars, buttonsData [i].text.length );
    }
    var elemLength = Math.min ( window.innerWidth * 0.6 - 40, maxChars * 7 + 20 );
    
    for ( var i = 0; i < buttonsData.length; i++ ) {
        
        inputElements [i] = document.createElement('div');
        inputElements [i].style.width = elemLength + "px";
        
        inputElements [i].btn = document.createElement('input');
        inputElements [i].btn.id = _type + '_' + i;
        inputElements [i].btn.type = _type;
        inputElements [i].btn.value = buttonsData [i].val;
        inputElements [i].btn.name = 'modal_' + _type;
        inputElements [i].appendChild ( inputElements [i].btn );
        
        inputElements [i].label = document.createElement ('label');
        inputElements [i].label.for = _type + '_' + i;
        inputElements [i].label.innerHTML = buttonsData [i].text;
        inputElements [i].appendChild ( inputElements [i].label );
        
        if ( _type == 'radio' ) {
            inputElements [i].btn.onclick = function ( event ) {
                var obj = event.target.parentNode.parentNode.parentNode.parentObject;
                obj.answer = event.target.value;
            }
        } else {
            inputElements [i].btn.onclick = function ( event ) {
                var obj = event.target.parentNode.parentNode.parentNode.parentObject;
                if ( event.target.checked ) {
                    obj.answer.push ( event.target.value );
                } else {
                    var ind = obj.answer.indexOf ( event.target.value );
                    if ( ind >= 0 ) {
                        obj.answer.splice( ind, 1 );
                    }
                }
            }
        }
    }
    var readyButton = document.createElement('input');
    readyButton.type = 'submit';
    readyButton.value ="OK";
    if ( _type == 'radio' ) {
        readyButton.onclick = function ( event ) {
            var win = event.target.parentNode.parentNode;
            win.changeAnswer ( win.parentObject.answer.val );
        }
    } else {
        readyButton.onclick = function ( event ) {
            var win = event.target.parentNode.parentNode;
            win.changeAnswer ( win.parentObject.answer );
        }
    }
    inputElements.push ( readyButton );
    readyButton.style.marginTop = "20px";
    
    return inputElements;
}

// ================================================================== radio buttons
Modals.prototype.radioButtonsWin = function () {
    
    this.createModal ();
    this.answer = undefined;
    this.inputData = this.buildRadioOrCheckButtons ( this.radioButtonsData, 'radio' );
    
    this.navElement = this.buildNav ( this.inputData );
    this.win.appendChild ( this.navElement );
    this.navElement.style.textAlign = "left";
    var h = this.navElement.getBoundingClientRect().height;
    this.contentElement.style.marginBottom = h + 20 + "px";
    this.resizeWin ();
}
// ================================================================== check buttons
Modals.prototype.checkboxWin = function () {
    this.createModal ();
    this.answer = [];
    this.inputData = this.buildRadioOrCheckButtons ( this.checkboxData, 'checkbox' );
    
    this.navElement = this.buildNav ( this.inputData );
    this.win.appendChild ( this.navElement );
    this.navElement.style.textAlign = "left";
    var h = this.navElement.getBoundingClientRect().height;
    this.contentElement.style.marginBottom = h + 20 + "px";
    
    this.resizeWin ();
}
// ==================================================================== textarea
Modals.prototype.textareaWin = function () {
        
        this.createModal ();
        this.inputData = document.createElement('textarea');
        this.inputData.value ="";
        this.inputData.winWidth = this.win.getBoundingClientRect().width;
        this.inputData.winHeight = this.win.getBoundingClientRect().height;
        this.inputData.maxWinCols = Math.round ( ( window.innerWidth * 0.6 - 40 ) / 7 );
        this.inputData.maxWinRows = Math.round ( ( window.innerHeight * 0.8 - 100 ) / 15 );
        
        this.inputData.onkeydown = function ( event ) {
            
            var win = event.target.parentNode.parentNode;
            var key = event.which || event.keyCode || event.charCode;
            if ( key == 13 && event.target.rows < event.target.maxWinRows ) { event.target.rows++; }
        }
        this.inputData.oninput = function ( event ) {
            
            var _rows = 0;
            var _rows_content = [];
            _rows_content [0] = "";
            var maxRowChars = 1;
            
            for ( var i = 0; i < event.target.value.length; i++ ) {
                if ( event.target.value.charCodeAt (i) == 10 ) {
        	
                    maxRowChars = Math.max ( maxRowChars, _rows_content [_rows].length );
                    event.target.cols = Math.min ( maxRowChars, event.target.maxWinCols );
            
        	        _rows++;
                    _rows_content [ _rows ] = "";
             
                } else {
        	        _rows_content [_rows] += event.target.value.substr (i, 1);
                    event.target.cols = Math.min ( Math.max ( maxRowChars, _rows_content [_rows].length, event.target.cols ), event.target.maxWinCols );
                }
            }
        }
        
        this.inputData.onchange = function ( event ) {
            
            var win = event.target.parentNode.parentNode;
            win.parentObject.readyButton.onclick = "";
            win.changeAnswer ( event.target.value );
        };
        this.readyButton = document.createElement('input');
        this.readyButton.type = 'submit';
        this.readyButton.value ="OK";
        this.readyButton.onclick = function ( event ) {
            var win = event.target.parentNode.parentNode;
            win.changeAnswer ( win.parentObject.inputData.value );
        };
        this.navElement = this.buildNav ( [ this.win.parentObject.inputData, this.win.parentObject.readyButton ] );
        this.win.appendChild ( this.navElement );
        
        this.resizeWin ();
};
// ===================================================================== fadow

Modals.prototype.fadowWin = function () {
    
        var timeout = this.text.length * 130;
        var duration = Math.round ( this.text.length / 8 );
        // console.info ( 'timeout: ' + timeout + '; duration: ' + duration );
        document.body.appendChild ( this.win );
        this.win.className = "fadowWin";
        this.resizeWin ();
        var _win = document.querySelector("section.fadowWin");
        _win.style.animationDuration = duration + "s";
        
        setTimeout ( function () { document.body.removeChild( _win ); }, timeout );
        
}
