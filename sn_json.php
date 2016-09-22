<?php 
  	header('Access-Control-Allow-Origin: *');
	header('Content-Type: text/html; charset=utf-8');

	
	//переводим глобальные ссылки в локальные
	if (isset($_POST['p'])) {$p=trim(htmlspecialchars($_POST['p']));} else {$dan = array("p" => $p, "o" => "sn_error-not_data");}
	if (isset($_POST['sn_hidden'])) {$sn['sn_hidden']=trim(htmlspecialchars($_POST['sn_hidden']));} else {$sn['sn_hidden']='';}
	if (isset($_POST['sn_hidden_text'])) {$sn['sn_hidden_text']=trim(htmlspecialchars($_POST['sn_hidden_text']));} else {$sn['sn_hidden_text']='';}

	//рабочие переменные
	if (isset($_POST['sn_name']) && ($_POST['sn_name']!='')) {$sn['sn_name']=trim(htmlspecialchars($_POST['sn_name']));}
	if (isset($_POST['sn_mail']) && ($_POST['sn_mail']!='')) {$sn['sn_mail']=trim(htmlspecialchars($_POST['sn_mail']));} 
	if (isset($_POST['sn_phone']) && ($_POST['sn_phone']!='')) {$sn['sn_phone']=trim(htmlspecialchars($_POST['sn_phone']));}
	if (isset($_POST['sn_text']) && ($_POST['sn_text']!='')) {$sn['sn_text']=trim(htmlspecialchars($_POST['sn_text']));} 
	if (isset($_POST['sn_textarea']) && ($_POST['sn_textarea']!='')) {$sn['sn_textarea']=trim(htmlspecialchars($_POST['sn_textarea']));}
	if (isset($_POST['sn_button']) && ($_POST['sn_button']!='')) {$sn['sn_button']=trim(htmlspecialchars($_POST['sn_button']));}
	if (isset($_POST['sn_submit']) && ($_POST['sn_submit']!='')) {$sn['sn_submit']=trim(htmlspecialchars($_POST['sn_submit']));}
	if (isset($_POST['sn_select_time_1']) && ($_POST['sn_select_time_1']!='')) {$sn['sn_select_time_1']=trim(htmlspecialchars($_POST['sn_select_time_1']));}
	if (isset($_POST['sn_select_time_2']) && ($_POST['sn_select_time_2']!='')) {$sn['sn_select_time_2']=trim(htmlspecialchars($_POST['sn_select_time_2']));}
	if (isset($_POST['sn_hidden_url']) && ($_POST['sn_hidden_url']!='')) {$sn['sn_hidden_url']=trim(htmlspecialchars($_POST['sn_hidden_url']));}
	// if (isset($_POST[''])) {$=trim(htmlspecialchars($_POST['']));} else {$='';}

	// функции выработки------------------------------------------------------------------------------------------------------------------
	function sn_mail_send($sms1,$sms2,$sms3){// функция отсылает ообщение пользователю
		return  mail($sms1,$sms2,$sms3,'Content-type: text/plain; charset=utf-8');
	}

	function sn_for($sn){//функция проверяет есть ли данные в строках
		foreach ($sn as $key => $value){//циклом пробегаем по массиву смотрим где есть какие данные
			if(isset($value[$key]) && $value[$key]!='') {$sn_m_true .= $key."->".$value."<br/>";} else {$sn_m_true  .='';}
		}
		return $sn_m_true;
	}

	//пользовательские параметры
	$sn_email ='san4pro+sn_f@gmail.com';
	$sn_request = $_SERVER['REQUEST_URI'];
	$sn_ip = $_SERVER['REMOTE_ADDR'];
	$sn_datas = date("d.m.y в H:i");



	if (isset($p)){ 
		if($sn['sn_hidden'] == ''){// проверка на спам скрытым полем 
			//получаем все поля в массив
			sn_for($sn);

			//тело письма
			if(isset($sn['sn_hidden_text'])){$sn_mail_form.="\n".$sn['sn_hidden_text'];} 
			if(isset($sn_datas)){$sn_mail_form.="\nДата: ".$sn_datas;} 
			if(isset($sn['sn_name'])){$sn_mail_form.="\nИмя: ".$sn['sn_name'];} 
			if(isset($sn['sn_mail'])){$sn_mail_form.="\nE-mail: ".$sn['sn_mail'];} 
			if(isset($sn['sn_phone'])){$sn_mail_form.="\nТелефон: ".$sn['sn_phone'];} 
			if(isset($sn['sn_text'])){$sn_mail_form.="\nТекст: ".$sn['sn_text'];} 
			if(isset($sn['sn_hidden_url'])){$sn_mail_form.="\nУРЛ страницы: ".$sn['sn_hidden_url'];} 
			if(isset($sn['sn_select_time_1'])){
				$sn_mail_form.="\nПерезвонить в промежуток с : ".$sn['sn_select_time_1']." по ".$sn['sn_select_time_2'];
			}

			if(isset($sn['sn_textarea'])){$sn_mail_form.="\nКомментарий: ".$sn['sn_textarea'];} 
			if(isset($sn_ip)){$sn_mail_form.="\n\nIP адресс: ".$sn_ip;} 

			if($sn_mail_form!='' && isset($sn_email)){//если есть тело письма то отсылаем его
				//посылаем письмо //если письмо отправлено удачно возвращаем true в фронтенд
				if(sn_mail_send($sn_email,'Письмо с сайта',$sn_mail_form)){
					$dan = array("p" => $p, "o" => "sn_true_mail_send");
				}else{//если ошибка отправки
					$dan = array("p" => $p, "o" => "sn_false_mail_send");
				}
			}else{
				$dan = array("p" => $p, "o" => "sn_error-mail_not_data");//если нет данных то посылаем ошибку
			}
		}else{$dan = array("p" => $p, "o" => "sn_error-spam");} 
	}else{		$dan = array("p" => $p, "o" => "sn_error-not_form");}










print json_encode($dan);