<!-- <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notifikacija za događaj</title>
</head>
<body>
    <h2>Obaveštenje za događaj</h2>

    <p>Poštovani,</p>

    <p><strong>Naslov događaja: </strong>{{ $notifikacija->naslov }}</p>
    <p><strong>Vreme događaja:</strong> {{ $notifikacija->datumVremeOd }}</p>
    <p><strong>Poruka:</strong> {{ $notifikacija->poruka }}</p>

    <p>Hvala vam,</p>
    <p>Vaš interaktivni kalendar</p>
</body>
</html> -->
<!-- resources/views/emails/notifikacija.blade.php -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Obaveštenje za događaj</title>
</head>
<body>
     
    <p>Poštovani,</p>
    
    <p>Ovo je podsetnik za događaj koji se približava:</p>
    
    <p><strong>Naslov događaja:</strong> {{ $dogadjaj->naslov }}</p>
    <p><strong>Vreme događaja:</strong> {{ $dogadjaj->datumVremeOd }}</p>
    <p><strong>Poruka:</strong> {{ $notifikacija->poruka }}</p>
    
    <p>Hvala Vam,</p>
    <p>Vaš interaktivni kalendar!</p>
</body>
</html>
