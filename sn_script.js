/************************************************************

                        SN_ZVON.js ver 3
                    The dialog and feedback 
                    latest update 18.12.2015

************************************************************/
jQuery(document).ready(function(){
// рабочие переменные
    var f      = 'fd'; // стандартное пустое окно
    var sn_url = '/catalog/view/theme/theme169/template/common/sn_form/';    //путь до скрипта
// ---------------ajax section---------------------//

//функция проверяет заполение поля по id
function prov_inp(id){if(jQuery(id).val()==""){return true;}else{return false;}}
function prov_mail(id){var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i; if(pattern.test(jQuery(id).val())){return false;}else{return true;}}
function prov_html(id){if(jQuery(id).html()==""){return true;}else{return false;}}
function prov_num(id){if (id.value.match(/[^0-9]/g)){return true;}else{return false;}}
    
// function sn_red(id,im){//выделение пустых элементов
//     if(im == "inp") {jQuery(id).addClass("sn_red");} else {jQuery(id).removeClass("sn_red");}
// }

function times(){
    var time = new Date(); var minutes = time.getMinutes(); var seconds = time.getSeconds(); var miliseconds = time.getMilliseconds();
    return '     _____' + minutes + '-' + seconds + '--' + miliseconds + '\n\n';
}

// Функция, которая позиционирует всплывающее окно по центру
function positionCenter(elem) {elem.css({marginTop: '-' + elem.height() / 2 + 'px',marginLeft: '-' + elem.width() / 2 + 'px'});}

//positionCenter(jQuery('.sn_form > form'));


function sn_sbor(sb1){
    //console.log(sb1);
    var sn_data_rt;
    //# ошибки 
    if(sb1['o'] == 'sn_error-not_data'){console.log('error #not_data'); sn_data_rt=false;}
    if(sb1['o'] == 'sn_error-not_form'){console.log('error #not_form, форма не найдена');sn_data_rt=false;}
    if(sb1['o'] == 'sn_error-spam'){console.log('error #sn_error-spam');sn_data_rt=false;}
    if(sb1['o'] == 'sn_error-mail_not_data'){console.log('error #sn_error-mail_not_data');sn_data_rt=false;}
    
    //# роутинг
    if(sb1['o'] == 'sn_false_mail_send'){sn_data_rt = false;}
    if(sb1['o'] == 'sn_true_mail_send'){sn_data_rt = true;}

    if(sn_data_rt == true){//если ответ удачный значит открываем ответ в форме
        if(sb1['p'].length){
            sn_form('.'+sb1['p'],'zv');
        }
    }
}


//parametry, id_okna, json_parametry
function jaxs(j1,j2){
    j = 'p=' + j1 + '&' + j2;//добавляем еще переменную
    jQuery.ajax({
        type:"POST",
        data: j,
        url: sn_url + "sn_json.php", // указываем URL
        dataType: "json",
        beforeSend: function(){ // Функция вызывается перед отправкой запроса
            //console.log('___beforeSend запрос отправлен' + times());
        },
        error: function(req, text, error){ // отслеживание ошибок во время выполнения ajax-запроса
            console.log('___error-ajax: ' + text + ' | ' + error + times());
        },
        complete: function(){ // функция вызывается по окончании запроса
            //console.log('___complete: запрос окончен'  + times());
        },
        success: function(data){//вызываем сборщик ответа 
            sn_sbor(data); //console.log(data);
        }
    });
}


//функция определяет тип поля и проверяет его на валидность
function sn_op(id){
    //определяем input или textarea
    if(jQuery(id).attr('type')){//-------------------
        //проверяем текстовое поле
        if(jQuery(id).attr('type') == 'text') {
            if(jQuery(id).val()==""){//
                jQuery(id).addClass('sn_red');
                return false;
            }else{
                jQuery(id).removeClass('sn_red');
                return true;
            }
        }
        
        //проверяем поле почты
        if(jQuery(id).attr('type') == 'email') {
            if(jQuery(id).val()==""){//
                jQuery(id).addClass('sn_red');
            }else{
                if(prov_mail(jQuery(id)) == true){//почта не валидна
                    jQuery(id).addClass('sn_red');
                    return false;
                }else{//почта валидна
                    jQuery(id).removeClass('sn_red');
                    return true;
                } 
            }
        }

    }else{//-----------------------------------------------
            if(jQuery(id).val()==""){//
                jQuery(id).addClass('sn_red');
                return false;
            }else{
                jQuery(id).removeClass('sn_red');
                return true;
            }
    }
}


function sn_vibor_attr(id){//автопроверка по типу поля
    var sva; var vi = jQuery(id).attr('class');
    //находим родительский элемент
    var rod = jQuery(id).parents('form').attr('class');
    var sum = '.' + rod + ' ' + '.' + vi;

    if(sum.indexOf('snv') + 1){
        sva = '.' + rod + ' ' + sum.split(' ')[1];
       // console.log('.' + rod + ' ' + sum.split(' ')[1]);
    }else{//не обязательное поле
        sva = false;
    }
    return sva;
}


function sn_prov(id){
    //console.log(id);
    sn_ops = new Array(); var sn_ar;

    var ds =  jQuery(id).children('.sn_norm').find('input.snv');
    var ds2 = jQuery(id).children('.sn_norm').find('textarea.snv');
    var ds3 = jQuery(id).children('.sn_norm').find('select.snv');

    //если есть другие елементы то добавляем в общий массив 
    if(ds2.length){jQuery.merge(ds, ds2); jQuery.merge(ds,ds3);}

    //получаем массив обязательных элементов для заполнения
    for (var i = 0; i < ds.length; i++) {
        //получаем обязательные поля
        var sva = sn_vibor_attr(ds[i]);
        //console.log('sva ' + sva);
        //проверяем на валидность
        sn_ops[i] = sn_op(sva);
        //console.log(i + ' ' + sva + ' ' + sn_ops[i]);
    }

    for (var i = 0; i < ds.length; i++){
        if(sn_ops[i] == false){sn_ar = 1;}
    } 
    //console.log(sn_ar);
    //финальная проверка 
    if (sn_ar == '1'){return false;}else{ return true;}
}


//--------------------------------------START_SCRIPT--------------------------------------

    /* ---------------------SN_MODAL------------------------ */
        //включаем слой подложки и внутреннего блока
        function sn_form(id,o1){          

                    //отображаем внутренний и выбранный блок
                    if(o1=='v'){//открываем форму, открываем фон
                        jQuery(id).fadeIn(300).css({'display':'block'});
                        jQuery('.sn_overlay').fadeIn(300);
                    }
                    if(o1=='vz'){//открываем форму, добавляем кнопку закрыть, открываем фон
                        jQuery(id).fadeIn(800).css({'display':'block'});
                        if(jQuery(id).find('.sn_close').length){}else{jQuery(id).prepend('<div class="sn_close"></div>');}//добавляем закрывашку
                        jQuery('.sn_overlay').fadeIn(300).css({'display':'block'});
                    }
                    if(o1=='vz_o'){//открываем форму, добавляем кнопку закрыть, открываем фон
                        jQuery(id).fadeIn(800).css({'display':'block'});
                        if(jQuery(id).find('.sn_close').length){}else{jQuery(id).prepend('<div class="sn_close"></div>');}//добавляем закрывашку
                    }
                    if(o1=="z"){//закрываем форму, закрываем фон
                        jQuery(id).fadeOut(100);
                        jQuery('.sn_overlay').fadeOut(800);
                    }
                    if(o1=="zv"){//закрываем форму, получаем ответ
                        jQuery(id).children('.sn_norm').fadeOut(100);
                        jQuery(id).children('.sn_success').fadeIn(300).css({'display':'block'});
                    }
                    if(o1=="zz"){//получаем форму, закрываем ответ
                        jQuery(id).children('.sn_norm').fadeIn(300).css({'display':'block'});
                        jQuery(id).children('.sn_success').fadeOut(100);
                    }
                    if(o1=="zt"){//получаем форму, закрываем ответ
                        jQuery(id).children('.sn_norm').toggle();
                        jQuery(id).children('.sn_success').toggle();
                    }

                    if(o1=="zi"){jQuery(id).fadeIn(300).css({'display':'block'}); }//открываем форму
                    if(o1=="zo"){jQuery(id).fadeOut(300); }//закрываем форму
            return id;
        }

        // управление открытием и закрытием форм
        jQuery('.sn_overlay').click(function(){
            sn_form(jQuery(this).parent('.sn_form').children('form'),'zz');
            sn_form(jQuery(this).parent('.sn_form').children('form'),'z');
        });

        jQuery(document).on('click','.sn_close', function(){
            sn_form(jQuery(this).parent('form'),'zz');
            sn_form(jQuery(this).parent('form'),'z');
        });









        //проверяем из какого окна посылается сообщение
        jQuery('.sn_submit').click(function(){
            //если обязательные поля заполнены и валидны то отправляем на сервер
            if(sn_prov(jQuery(this).parents('form')) == true){
                jaxs(//посылаем запрос на сервер
                    jQuery(this).parents('form').attr('class'), 
                    jQuery(this).parents('form').serialize()
                );
            }
        });


    /* ---------------------SN_MODAL------------------------ */

    

    jQuery('.niz_zak, .call-btn').click(function(e){e.preventDefault(); sn_form('.f1','vz');});
    

    jQuery('li.grid .bz, .related-info .bz').click(function(){//если нет элемента то добавляем, если есть то не добавляем
        //получаем url продукта 
        var sn_hidden_url = jQuery(this).parents('li').find('.name a').attr('href');
        //добавляем урл в скрытую форму
        jQuery('.sn_form .f2 .sn_hidden_url').val(sn_hidden_url);

        var kor1 = jQuery(this).offset();

        var kor1 = jQuery(this).offset();
        kor1.left = kor1.left + 10;
        kor1.top = kor1.top + 20;

        jQuery('.sn_form .f2').css({'display':'block'}).css({top:0, left:0}).offset(kor1).css({'display':'block'});
    });


    jQuery('.cart-top .bz').click(function(){//если нет элемента то добавляем, если есть то не добавляем
        //получаем url продукта 
        var sn_hidden_url = jQuery(this).parents('li').find('.name a').attr('href');
        //добавляем урл в скрытую форму
        jQuery('.sn_form .f2 .sn_hidden_url').val(location.href);

        var kor1 = jQuery(this).offset();

        var kor1 = jQuery(this).offset();
        kor1.left = kor1.left -48;
        kor1.top = kor1.top + 20;

        jQuery('.sn_form .f2').css({'display':'block'}).css({top:0, left:0}).offset(kor1).css({'display':'block'});

        
    });
    




    // поключаем инпутмаск
    jQuery('.sn_phone, .sn_phones').inputmask("+7 (999)999-99-99");
    jQuery('.top-menu a[href="'+(window.location)+'"]').addClass('activess');
    jQuery('.kost_menus a[href="'+(window.location)+'"]').addClass('activess');
    



        $(window).scroll(function() {
            if($(this).scrollTop() != 0) {
                $('#toTop').fadeIn();   
            } else {
                $('#toTop').fadeOut();
            }
        });
     
        $('#toTop').click(function() {
            $('body,html').animate({scrollTop:0},800);
        }); 

        if($('.filter-option').length){
            $('.filter-option .option-name').append('<div class="kk krest"></div>');
        }


        $('.filter-option .option-name').click(function(){//скрываем фильтры
            $(this).siblings('.option-values').toggle();
            $(this).children('.kk').toggleClass("krest2");
        });

        // if($('.prod-stock-2').length){
        //    // $('.cvcvv').append('<div class="nalich">Наличие<span></span></div>');
        // }

      // $('.slider8').bxSlider({
      //   mode: 'vertical',
      //   slideWidth: 300,
      //   minSlides: 2,
      //   slideMargin: 10
      // });

    $('.pock').click(function(){
        $(this).parent('ul').children('li').show();
    });

    

    
 


}); 