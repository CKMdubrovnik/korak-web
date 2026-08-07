<?php
// Obrada kontakt forme na korakdubrovnik.hr
// Šalje poruku na mail udruge i preusmjerava na stranicu zahvale.

$lang = (isset($_GET['lang']) && $_GET['lang'] === 'en') ? 'en' : 'hr';
$thanks = $lang === 'en' ? '/en/hvala.html' : '/hvala.html';
$back = $lang === 'en' ? '/en/index.html#kontakt' : '/index.html#kontakt';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . $back);
    exit;
}

// honeypot: botovi popune skriveno polje
if (!empty($_POST['bot-field'])) {
    header('Location: ' . $thanks);
    exit;
}

$ime    = trim(strip_tags($_POST['ime'] ?? ''));
$email  = trim($_POST['email'] ?? '');
$poruka = trim(strip_tags($_POST['poruka'] ?? ''));

if ($ime === '' || $poruka === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: ' . $back);
    exit;
}

// zaštita od header injectiona
$ime = str_replace(array("\r", "\n"), ' ', $ime);
$email = str_replace(array("\r", "\n"), '', $email);

$to = 'emilio.butigan@gmail.com';
$cc = 'marko.zmirak@ckmdubrovnik.hr';
$subject = '=?UTF-8?B?' . base64_encode('Poruka s korakdubrovnik.hr od: ' . $ime) . '?=';

$body = "Nova poruka s kontakt forme na korakdubrovnik.hr\n"
      . "Jezik stranice: " . strtoupper($lang) . "\n"
      . "Vrijeme: " . date('d.m.Y. H:i') . "\n\n"
      . "Ime i prezime: " . $ime . "\n"
      . "E-mail: " . $email . "\n\n"
      . "Poruka:\n" . $poruka . "\n";

$headers = "From: KORAK web <web@korakdubrovnik.hr>\r\n"
         . "Reply-To: " . $ime . " <" . $email . ">\r\n"
         . "Cc: " . $cc . "\r\n"
         . "MIME-Version: 1.0\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";

@mail($to, $subject, $body, $headers);

header('Location: ' . $thanks);
exit;
