<?php

    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $cpf = $_POST['cpf'];
    $rg = $_POST['rg']; 
    
    $con = mysqli_connect("localhost:3306","root","","test") or die('Unable to Connect');

    $sql = "INSERT INTO user (nome, email, cpf, rg) VALUES('$nome','$email','$cpf','$rg')";
    if (mysqli_query($con, $sql)) {
        print "true";
    } else {
        print 'false';
    }

    mysqli_close($con);

 